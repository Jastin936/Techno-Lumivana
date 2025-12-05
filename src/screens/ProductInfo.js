import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProductInfoScreen = ({ navigation, route }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [isModalVisible, setModalVisible] = useState(false);
  const [moreModal, setMoreModal] = useState({ visible: false, request: null });
  const [imageModal, setImageModal] = useState({ visible: false, imageUri: null });
  const [blockedRequests, setBlockedRequests] = useState([]);
  const [notInterestedRequests, setNotInterestedRequests] = useState([]);
  const [reportedRequests, setReportedRequests] = useState([]);
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const slideAnim = useState(new Animated.Value(300))[0];

  const requestData = route.params?.requestData || {
    title: 'Poster/Banner Design',
    type: 'Creative',
    artist: 'Kreideprinz',
    description: 'Unique logos for student organizations.',
    email: 'email@example.com',
    referencePhotos: [  `https://picsum.photos/seed/Kreideprinz1/600/600`,
  `https://picsum.photos/seed/Kreideprinz2/600/600`,
  `https://picsum.photos/seed/Kreideprinz3/600/600`,],
    category: 'Graphic Design',
    id: 'default-id',
  };

  // ADDED: Function to prepare commission data for AgreementFormScreen
  const prepareCommissionData = () => {
    return {
      title: requestData.title,
      description: requestData.description,
      category: requestData.category || requestData.type,
      contact: requestData.email,
      referencePhotos: requestData.referencePhotos || [],
    };
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem('userProfileData');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          const profileName = profile.name || '';
          const artistName = requestData.artist || '';
          
          if (profileName.trim().toLowerCase() === artistName.trim().toLowerCase()) {
            setIsOwner(true);
          }
        }

        const savedFollowing = await AsyncStorage.getItem('followingState');
        if (savedFollowing) {
          const followingData = JSON.parse(savedFollowing);
          if (followingData[requestData.artist] === true) {
            setIsFollowing(true);
          }
        }

        const savedNotInterested = await AsyncStorage.getItem('notInterestedRequests');
        if (savedNotInterested) {
          setNotInterestedRequests(JSON.parse(savedNotInterested));
        }

        const savedReported = await AsyncStorage.getItem('reportedRequests');
        if (savedReported) {
          setReportedRequests(JSON.parse(savedReported));
        }

      } catch (error) {
        console.log('Error loading data:', error);
      }
    };
    loadData();
  }, [requestData.artist]);

  const toggleFollow = async () => {
    const newStatus = !isFollowing;
    setIsFollowing(newStatus);
    
    try {
      const savedFollowing = await AsyncStorage.getItem('followingState');
      let followingData = savedFollowing ? JSON.parse(savedFollowing) : {};
      followingData[requestData.artist] = newStatus;
      await AsyncStorage.setItem('followingState', JSON.stringify(followingData));
    } catch (error) {
      console.log('Error saving following status:', error);
    }
  };

  const handleNotInterested = async () => {
    if (moreModal.request) {
      try {
        const updatedNotInterested = [...notInterestedRequests, moreModal.request.id];
        setNotInterestedRequests(updatedNotInterested);
        
        await AsyncStorage.setItem('notInterestedRequests', JSON.stringify(updatedNotInterested));
        
        setMoreModal({ visible: false, request: null });
        
        Alert.alert("Noted", "We'll show fewer requests like this in your feed.");
        
        console.log('Marked request as not interested:', moreModal.request.id);
        
        navigation.goBack();
        
      } catch (error) {
        console.log('Error saving not interested request:', error);
        Alert.alert("Error", "Failed to save your preference. Please try again.");
      }
    }
  };

  const handleReportPost = async () => {
    if (moreModal.request) {
      Alert.alert(
        "Report Request",
        "Are you sure you want to report this request?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Report",
            style: "destructive",
            onPress: async () => {
              try {
                const updatedReported = [...reportedRequests, moreModal.request.id];
                setReportedRequests(updatedReported);
                
                await AsyncStorage.setItem('reportedRequests', JSON.stringify(updatedReported));
                
                setBlockedRequests((prev) => [...prev, moreModal.request.id]);
                
                setMoreModal({ visible: false, request: null });
                
                Alert.alert("Report Submitted", "Thank you for reporting this request. Our team will review it.");
                
                console.log('Reported request:', {
                  id: moreModal.request.id,
                  title: moreModal.request.title,
                  artist: moreModal.request.artist,
                  timestamp: new Date().toISOString()
                });
                
                navigation.goBack();
                
              } catch (error) {
                console.log('Error saving reported request:', error);
                Alert.alert("Error", "Failed to submit report. Please try again.");
              }
            }
          }
        ]
      );
    }
  };

  const handleBlockRequest = () => {
    setBlockedRequests((prev) => [...prev, requestData.id]);
    setMoreModal({ visible: false, request: null });
    navigation.goBack();
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? colors.background : colors.background }]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  const slideUp = () => {
    slideAnim.setValue(300);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleConnectPress = () => {
    setModalVisible(true);
  };

  const handleHoldOff = () => {
    setModalVisible(false);
  };

  // UPDATED: Handle Proceed to pass commission data
  const handleProceed = () => {
    setModalVisible(false);
    
    // Prepare the commission data from ProductInfoScreen
    const commissionData = prepareCommissionData();
    
    // Navigate to AgreementFormScreen with the commission data
    navigation.navigate('AgreementForm', { 
      commissionData: commissionData 
    });
  };

  const openMoreModal = () => {
    setMoreModal({ visible: true, request: requestData });
    slideUp();
  };

  const handleImagePress = (imageUri) => {
    setImageModal({ visible: true, imageUri });
  };

  const closeImageModal = () => {
    setImageModal({ visible: false, imageUri: null });
  };

  return (
    <LinearGradient 
      colors={isDarkMode ? gradients.background : gradients.main} 
      locations={isDarkMode ? [0, 1] : [0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={[styles.backButtonText, { color: '#FFFFFF' }]}>←</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.topImagePlaceholder, { 
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight,
              borderColor: isDarkMode ? 'rgba(255, 215, 0, 0.2)' : colors.cardBorder
            }]}
            onPress={() => requestData.referencePhotos && requestData.referencePhotos.length > 0 && 
              handleImagePress(requestData.referencePhotos[0])}
          >
            {requestData.referencePhotos && requestData.referencePhotos.length > 0 ? (
              <Image 
                source={{ uri: requestData.referencePhotos[0] }} 
                style={styles.mainImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="image-outline" size={60} color={colors.textMuted} />
            )}
          </TouchableOpacity>

          <View style={styles.infoSection}>
            <Text style={[styles.requestTitle, { color: '#FFFFFF' }]}>{requestData.title}</Text>
            <Text style={[styles.requestType, { color: '#FFFFFF' }]}>{requestData.category || requestData.type}</Text>

            <View style={styles.artistRow}>
              <View style={styles.leftSide}>
                <View style={styles.profileCircle}>
                  <Ionicons name="person-circle-outline" size={40} color={colors.primary} />
                </View>
                <Text style={[styles.artistName, { color: '#FFFFFF' }]}>{requestData.artist}</Text>
              </View>

              <View style={styles.rightSideActions}>
                {isOwner ? (
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, marginRight: 8 }}>You</Text>
                ) : (
                  <TouchableOpacity 
                    style={[
                      styles.followButton, 
                      { 
                        borderColor: colors.primary,
                        backgroundColor: isFollowing ? 'rgba(255,255,255,0.2)' : 'transparent' 
                      }
                    ]}
                    onPress={toggleFollow}
                  >
                    <Text style={[
                      styles.followButtonText, 
                      { color: colors.primary }
                    ]}>
                      {isFollowing ? "Following" : "Follow"}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={openMoreModal}
                >
                  <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={[styles.section, { 
            backgroundColor: 'transparent',
            borderWidth: 0,
            padding: 0 
          }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Commission Details</Text>
              
              {!isOwner && (
                <TouchableOpacity style={[styles.connectButton, { backgroundColor: colors.primary }]} onPress={handleConnectPress}>
                  <Ionicons name="call-outline" size={18} color="#000000" />
                  <Text style={[styles.connectButtonText, { color: '#000000' }]}>Connect</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: '#FFFFFF' }]}>Description</Text>
              <Text style={[styles.detailValue, { 
                color: '#000000',
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                padding: 12,
                overflow: 'hidden'
              }]}>{requestData.description}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: '#FFFFFF' }]}>Contact Information</Text>
              <Text style={[styles.detailValue, { 
                color: '#000000',
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                padding: 12,
                overflow: 'hidden'
              }]}>{requestData.email}</Text>
            </View>
          </View>

          <View style={styles.imageGrid}>
            {requestData.referencePhotos && requestData.referencePhotos.length > 0 ? (
              requestData.referencePhotos.map((photoUri, index) => (
                <TouchableOpacity 
                  key={`photo-${index}-${photoUri}`} 
                  style={[styles.gridImage, { 
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight 
                  }]}
                  onPress={() => handleImagePress(photoUri)}
                >
                  <Image 
                    source={{ uri: photoUri }} 
                    style={styles.gridImageContent}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))
            ) : (
              [1, 2, 3, 4].map((_, index) => (
                <View key={`placeholder-${index}`} style={[styles.gridImage, { 
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight 
                }]}>
                  <Ionicons name="image-outline" size={40} color={colors.textMuted} />
                </View>
              ))
            )}
          </View>
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: isDarkMode ? colors.surface : 'rgba(255, 255, 255, 0.15)' }]}>
          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={24} color={colors.primary} />
            <Text style={[styles.footerText, styles.activeFooterText, { color: colors.primary }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.plusSquareButton} onPress={() => navigation.navigate('Request')}>
            <View style={[styles.plusSquareContainer, { borderColor: colors.primary }]}>
              <Ionicons name="add" size={30} color={colors.primary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem}>
            <Ionicons name="briefcase-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>Commissions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('FAQs')}>
            <Ionicons name="help-circle-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>FAQs</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.centeredView, { backgroundColor: colors.modalOverlay || 'rgba(0, 0, 0, 0.6)' }]}>
          <View style={[styles.modalView, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>Send an inquiry</Text>
            <View style={[styles.modalTitleUnderline, { backgroundColor: colors.primary }]} />
            <Text style={[styles.modalDescription, { color: colors.text }]}>
              Let's coordinate and start the agreement process together.
              {"\n\n"}The commission information will be automatically filled in the agreement form.
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonHoldOff, { borderColor: colors.border }]}
                onPress={handleHoldOff}
              >
                <Text style={[styles.textHoldOff, { color: colors.text }]}>Hold off</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonProceed, { backgroundColor: colors.primary }]}
                onPress={handleProceed}
              >
                <Text style={[styles.textProceed, { color: isDarkMode ? colors.text : colors.buttonText }]}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={imageModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity 
            style={styles.imageModalBackground} 
            onPress={closeImageModal}
            activeOpacity={1}
          >
            <View style={styles.imageModalContainer}>
              {imageModal.imageUri && (
                <Image 
                  source={{ uri: imageModal.imageUri }} 
                  style={styles.fullSizeImage}
                  resizeMode="contain"
                />
              )}
              <TouchableOpacity 
                style={styles.imageModalCloseButton}
                onPress={closeImageModal}
              >
                <Ionicons name="close" size={28} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal transparent visible={moreModal.visible} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.bottomSheet,
              { 
                transform: [{ translateY: slideAnim }],
                backgroundColor: colors.card,
                borderColor: colors.primary
              },
            ]}
          >
            <Text style={[styles.bottomSheetModalTitle, { color: colors.primary }]}>More Operations</Text>
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com')}>
                <Ionicons name="logo-facebook" size={28} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('mailto:support@lumivana.com')}>
                <Ionicons name="mail-outline" size={28} color="#EA4335" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://t.me/lumivana')}>
                <Ionicons name="send-outline" size={28} color="#1DA1F2" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/lumivana')}>
                <Ionicons name="logo-twitter" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.optionRow}
              onPress={handleNotInterested}
            >
              <Ionicons name="heart-dislike-outline" size={22} color="red" />
              <Text style={[styles.optionText, { color: colors.text }]}>Not interested</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.optionRow}
              onPress={handleReportPost}
            >
              <Ionicons name="flag-outline" size={22} color="red" />
              <Text style={[styles.optionText, { color: colors.text }]}>Report Post</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.optionRow}
              onPress={handleBlockRequest}
            >
              <Ionicons name="close-circle-outline" size={22} color="red" />
              <Text style={[styles.optionText, { color: colors.text }]}>Block user</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setMoreModal({ visible: false, request: null })}
            >
              <Ionicons name="close" size={24} color={colors.primary} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 12, padding: 4 },
  backButtonText: { fontSize: 28, fontWeight: 'bold' },

  content: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },

  topImagePlaceholder: {
    width: SCREEN_WIDTH - 48,
    height: 180,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },

  infoSection: {
    marginBottom: 20,
  },
  requestTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'Milonga',
  },
  requestType: {
    fontSize: 16,
    marginBottom: 12,
  },
  artistRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rightSideActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  followButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 8,
  },
  followButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  menuButton: {
    padding: 5,
  },

  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 6,
  },
  connectButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  detailItem: { marginBottom: 16 },
  detailLabel: { fontSize: 14, marginBottom: 6 },
  detailValue: {
    fontSize: 15,
    padding: 12,
    borderRadius: 8,
  },

  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  gridImage: {
    width: (SCREEN_WIDTH - 72) / 2,
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  gridImageContent: {
    width: '100%',
    height: '100%',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerItem: { alignItems: 'center', flex: 1 },
  footerText: { fontSize: 12, marginTop: 2, textAlign: 'center' },
  activeFooterText: { fontWeight: 'bold' },
  plusSquareButton: { alignItems: 'center', marginHorizontal: 10 },
  plusSquareContainer: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    borderRadius: 15,
    padding: 25,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalTitleUnderline: {
    width: '100%',
    height: 1,
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15,
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonHoldOff: {
    backgroundColor: 'transparent', 
    borderWidth: 1.5,
  },
  textHoldOff: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonProceed: {
    backgroundColor: 'transparent', 
    borderWidth: 1.5,
  },
  textProceed: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalContainer: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fullSizeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imageModalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  bottomSheetModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  optionRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 12 
  },
  optionText: { 
    marginLeft: 8, 
    fontSize: 15 
  },
  closeBtn: { 
    position: "absolute", 
    top: 10, 
    right: 15 
  },
});

export default ProductInfoScreen;