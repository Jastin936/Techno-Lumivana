import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    Alert,
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
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AcceptedCommissionInfoScreen = ({ navigation, route }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [isModalVisible, setModalVisible] = useState(false);
  const [isStopProcessModalVisible, setStopProcessModalVisible] = useState(false);
  const [moreModal, setMoreModal] = useState({ visible: false, request: null });
  const [commissionStatus, setCommissionStatus] = useState('ongoing');
  const [imageModal, setImageModal] = useState({ visible: false, imageUri: null });
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');

  const slideAnim = useState(new Animated.Value(300))[0];

  const [requestData, setRequestData] = useState(
    route.params?.requestData || {}
  );

  const getDisplayArtistName = () => {
    if (requestData.artist && requestData.artist !== 'Pending Artist') {
        return requestData.artist;
    }
    if (requestData.user) return requestData.user;
    return 'Unknown Artist';
  };

  const displayArtistName = getDisplayArtistName();

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem('userProfileData');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          if (profile.name) {
            setCurrentUserName(profile.name);
          }
        }

        const savedFollowing = await AsyncStorage.getItem('followingState');
        if (savedFollowing) {
          const followingData = JSON.parse(savedFollowing);
          if (followingData[displayArtistName] === true) {
            setIsFollowing(true);
          } else {
            setIsFollowing(false);
          }
        }
      } catch (error) {
        console.log('Error loading data:', error);
      }
    };
    loadData();
  }, [displayArtistName]);

  useEffect(() => {
    if (route.params?.requestData) {
      setRequestData(route.params.requestData);
      setCommissionStatus(route.params.requestData.status?.toLowerCase() || 'ongoing');
    }
  }, [route.params?.requestData]);

  if (!fontsLoaded) return null;

  const slideUp = () => {
    slideAnim.setValue(300);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const openMoreModal = () => {
    setMoreModal({ visible: true, request: requestData });
    slideUp();
  };

  const toggleFollow = async () => {
    const newStatus = !isFollowing;
    setIsFollowing(newStatus);
    
    try {
      const savedFollowing = await AsyncStorage.getItem('followingState');
      let followingData = savedFollowing ? JSON.parse(savedFollowing) : {};
      followingData[displayArtistName] = newStatus;
      await AsyncStorage.setItem('followingState', JSON.stringify(followingData));
    } catch (error) {
      console.log('Error saving follow status:', error);
    }
  };

  // ✅ FIXED: Removes item and passes the ID to the previous screen for instant UI update
  const removeCommissionFromStorage = async () => {
    try {
      const savedCommissions = await AsyncStorage.getItem('savedCommissions');
      if (savedCommissions) {
        let commissions = JSON.parse(savedCommissions);
        // Filter out this specific commission
        const updatedCommissions = commissions.filter(c => c.id !== requestData.id);
        
        await AsyncStorage.setItem('savedCommissions', JSON.stringify(updatedCommissions));
        
        // Pass the ID back to CommissionsScreen
        navigation.navigate('Commissions', { removedCommissionId: requestData.id });
      }
    } catch (error) {
      console.log("Error removing commission:", error);
    }
  };

  const handleNotInterested = async () => {
    setMoreModal({ visible: false, request: null });
    Alert.alert(
        "Removed", 
        "This commission has been removed from your list.", 
        [
          { 
            text: "OK", 
            onPress: () => removeCommissionFromStorage() // Trigger removal
          }
        ]
    );
  };

  const handleBlockRequest = () => {
    setMoreModal({ visible: false, request: null });
    Alert.alert(
        "Blocked", 
        "User has been blocked and commission removed.", 
        [
            { 
              text: "OK", 
              onPress: () => removeCommissionFromStorage() // Trigger removal
            }
        ]
    );
  };

  const handleReportRequest = () => {
    setMoreModal({ visible: false, request: null });
    Alert.alert("Reported", "Thank you. We will review this request.");
  };

  const openSocialLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.error('An error occurred', err);
      Alert.alert("Error", "Could not open link.");
    }
  };

  const handleStatusChange = (status) => {
    const current = requestData.status?.toLowerCase();
    if (current === 'cancelled' || current === 'complete') {
      Alert.alert('Status Locked', 'This commission is finalized and cannot be changed.');
      return;
    }

    if (status === 'ongoing') {
      setModalVisible(true);
    } else if (status === 'unclaimed') {
      navigation.navigate('ConfirmPayment', { requestData: requestData });
    }
  };

  const handleStopProcess = () => {
    setModalVisible(false);
    setStopProcessModalVisible(true);
  };

  const handleConfirmStop = () => {
    setStopProcessModalVisible(false);
    navigation.navigate('CancelForm', { requestData: requestData });
  };

  const handleImagePress = (uri) => {
    setImageModal({ visible: true, imageUri: uri });
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
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={[styles.backButtonText, { color: '#FFFFFF' }]}>←</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainerWithBadges}>
            <TouchableOpacity 
              style={[styles.topImagePlaceholder, { 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight,
                borderColor: colors.cardBorder
              }]}
              onPress={() => requestData.referencePhotos?.length > 0 && handleImagePress(requestData.referencePhotos[0])}
            >
              {requestData.referencePhotos?.length > 0 ? (
                <Image source={{ uri: requestData.referencePhotos[0] }} style={styles.mainImage} resizeMode="cover" />
              ) : (
                <Ionicons name="image-outline" size={60} color={colors.textMuted} />
              )}
            </TouchableOpacity>
            
            <View style={styles.imageBadgeContainer}>
              <View style={styles.horizontalBadgeWrapper}>
                {requestData.status === 'Complete' ? (
                  <View style={[styles.smallBadgeButton]}>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#50FA7B" />
                    <Text style={[styles.smallBadgeText, { color: '#50FA7B' }]}>Complete</Text>
                  </View>
                ) : requestData.status === 'Canceled' ? (
                  <View style={[styles.smallBadgeButton]}>
                    <Ionicons name="close-circle-outline" size={18} color="#FF6B6B" />
                    <Text style={[styles.smallBadgeText, { color: '#FF6B6B' }]}>Cancelled</Text>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.smallBadgeButton} onPress={() => handleStatusChange('ongoing')}>
                    <Ionicons name="settings-outline" size={18} color="#50FA7B" />
                    <Text style={[styles.smallBadgeText, { color: '#50FA7B' }]}>On Going</Text>
                  </TouchableOpacity>
                )}
                
                <View style={styles.verticalDivider} />
                
                {requestData.status === 'Complete' ? (
                  <View style={styles.smallBadgeButton}>
                    <Ionicons name="checkmark-done-outline" size={18} color="#FFB86C" />
                    <Text style={[styles.smallBadgeText, { color: '#FFB86C' }]}>Claimed</Text>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.smallBadgeButton} onPress={() => handleStatusChange('unclaimed')}>
                    <Ionicons name="hand-right-outline" size={18} color="#FFB86C" />
                    <Text style={[styles.smallBadgeText, { color: '#FFB86C' }]}>Unclaimed</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={[styles.requestTitle, { color: '#FFFFFF' }]}>{requestData.title}</Text>
            <Text style={[styles.requestType, { color: '#FFFFFF' }]}>{requestData.category}</Text>

            <View style={styles.artistRow}>
              <View style={styles.leftSide}>
                <Ionicons name="person-circle-outline" size={40} color="#FFFFFF" />
                <Text style={[styles.artistName, { color: '#FFFFFF' }]}>{displayArtistName}</Text>
              </View>
              <View style={styles.rightSideActions}>
                <TouchableOpacity 
                  style={[
                    styles.followButton, 
                    { 
                      borderColor: '#FFFFFF',
                      backgroundColor: isFollowing ? 'rgba(255,255,255,0.2)' : 'transparent' 
                    }
                  ]}
                  onPress={toggleFollow}
                >
                  <Text style={[styles.followButtonText, { color: '#FFFFFF' }]}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.menuButton} onPress={openMoreModal}>
                  <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Commission Details</Text>

            {requestData.agreedPrice && (
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: '#FFFFFF' }]}>Agreed Price</Text>
                <Text style={[styles.detailValue, { color: '#000', backgroundColor: '#FFF' }]}>
                  ${requestData.agreedPrice}
                </Text>
              </View>
            )}

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: '#FFFFFF' }]}>Description</Text>
              <Text style={[styles.detailValue, { color: '#000', backgroundColor: '#FFF' }]}>{requestData.description}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: '#FFFFFF' }]}>Contact Information</Text>
              <Text style={[styles.detailValue, { color: '#000', backgroundColor: '#FFF' }]}>{requestData.email}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: '#FFFFFF' }]}>Date</Text>
              <Text style={[styles.detailValue, { color: '#000', backgroundColor: '#FFF' }]}>{requestData.date}</Text>
            </View>

            {requestData.proofPhotos && requestData.proofPhotos.length > 0 && (
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: '#FFFFFF' }]}>Proof of Payment</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', marginTop: 5 }}>
                  {requestData.proofPhotos.map((uri, index) => (
                    <TouchableOpacity key={index} onPress={() => handleImagePress(uri)}>
                      <Image source={{ uri }} style={{ width: 100, height: 100, borderRadius: 8, marginRight: 10 }} resizeMode="cover" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </ScrollView>

        <Modal transparent visible={moreModal.visible} animationType="none">
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }], backgroundColor: colors.card, borderColor: colors.primary }]}>
              <Text style={[styles.bottomSheetModalTitle, { color: colors.primary }]}>More Operations</Text>
              
              <View style={styles.iconRow}>
                <TouchableOpacity onPress={() => openSocialLink('https://www.facebook.com')}><Ionicons name="logo-facebook" size={28} color="#1877F2" /></TouchableOpacity>
                <TouchableOpacity onPress={() => openSocialLink('https://mail.google.com')}><Ionicons name="mail-outline" size={28} color="#EA4335" /></TouchableOpacity>
                <TouchableOpacity onPress={() => openSocialLink('https://telegram.org')}><Ionicons name="send-outline" size={28} color="#1DA1F2" /></TouchableOpacity>
                <TouchableOpacity onPress={() => openSocialLink('https://twitter.com')}><Ionicons name="logo-twitter" size={28} color={colors.text} /></TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.optionRow} onPress={handleNotInterested}>
                <Ionicons name="heart-dislike-outline" size={22} color="red" />
                <Text style={[styles.optionText, { color: colors.text }]}>Not interested</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionRow} onPress={handleReportRequest}>
                <Ionicons name="flag-outline" size={22} color="red" />
                <Text style={[styles.optionText, { color: colors.text }]}>Report Post</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionRow} onPress={handleBlockRequest}>
                <Ionicons name="close-circle-outline" size={22} color="red" />
                <Text style={[styles.optionText, { color: colors.text }]}>Block user</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeBtn} onPress={() => setMoreModal({ visible: false, request: null })}>
                <Ionicons name="close" size={24} color={colors.primary} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        <Modal transparent visible={isModalVisible} animationType="fade">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Status</Text>
              <View style={styles.line} />
              <Text style={styles.modalText}>Ongoing</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalBtnCancel} onPress={handleStopProcess}><Text style={styles.textRed}>Stop Process</Text></TouchableOpacity>
                <TouchableOpacity style={styles.modalBtnOk} onPress={() => setModalVisible(false)}><Text style={styles.textGreen}>Ok</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal transparent visible={isStopProcessModalVisible} animationType="fade">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={[styles.modalTitle, { color: 'red' }]}>WARNING!</Text>
              <View style={styles.line} />
              <Text style={styles.modalText}>Once canceled, this work cannot be recovered. Are you sure?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalBtnCancel} onPress={handleConfirmStop}><Text style={styles.textRed}>Yes, Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={styles.modalBtnOk} onPress={() => setStopProcessModalVisible(false)}><Text style={styles.textGreen}>No, Keep it</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={imageModal.visible} transparent={true}>
          <View style={styles.imageViewerOverlay}>
            <TouchableOpacity style={styles.closeImageBtn} onPress={() => setImageModal({ visible: false, imageUri: null })}>
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
            {imageModal.imageUri && <Image source={{ uri: imageModal.imageUri }} style={styles.fullImage} resizeMode="contain" />}
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingHorizontal: 24, paddingBottom: 10 },
  backButton: { width: 40 },
  backButtonText: { fontSize: 28, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },
  topImagePlaceholder: { width: SCREEN_WIDTH - 48, height: 180, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1.5, borderStyle: 'dashed', overflow: 'hidden' },
  mainImage: { width: '100%', height: '100%' },
  infoSection: { marginBottom: 20 },
  requestTitle: { fontSize: 26, fontWeight: 'bold', fontFamily: 'Milonga' },
  requestType: { fontSize: 16, marginBottom: 12 },
  artistRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftSide: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  artistName: { fontSize: 18, fontWeight: 'bold' },
  rightSideActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  followButton: { backgroundColor: 'transparent', borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 8 },
  followButtonText: { fontWeight: 'bold', fontSize: 16 },
  menuButton: { padding: 5 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  detailItem: { marginBottom: 16 },
  detailLabel: { fontSize: 14, marginBottom: 6 },
  detailValue: { fontSize: 15, padding: 12, borderRadius: 8 },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 30 },
  gridImage: { width: (SCREEN_WIDTH - 72) / 2, height: 120, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12, overflow: 'hidden' },
  gridImageContent: { width: '100%', height: '100%' },
  footer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, paddingBottom: 40, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  footerItem: { alignItems: 'center', flex: 1 },
  footerText: { fontSize: 12, marginTop: 2, textAlign: 'center' },
  activeFooterText: { fontWeight: 'bold' },
  plusSquareButton: { alignItems: 'center', marginHorizontal: 10 },
  plusSquareContainer: { width: 45, height: 45, borderWidth: 2, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  imageContainerWithBadges: { position: 'relative', marginBottom: 20, height: 200, width: '100%' },
  imageBadgeContainer: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 8, padding: 5 },
  horizontalBadgeWrapper: { flexDirection: 'row', alignItems: 'center' },
  smallBadgeButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 },
  smallBadgeText: { fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  verticalDivider: { width: 1, height: 15, backgroundColor: '#666', marginHorizontal: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  bottomSheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, padding: 20 },
  bottomSheetModalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  iconRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  optionRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  optionText: { marginLeft: 8, fontSize: 15 },
  closeBtn: { position: "absolute", top: 10, right: 15 },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  modalView: { margin: 20, borderRadius: 15, padding: 25, alignItems: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, width: '85%', backgroundColor: '#FFF' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  line: { width: '100%', height: 1, backgroundColor: '#ccc', marginBottom: 15 },
  modalText: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 15 },
  modalBtnCancel: { padding: 10, borderWidth: 1, borderColor: 'red', borderRadius: 8, flex: 1, alignItems: 'center' },
  modalBtnOk: { padding: 10, borderWidth: 1, borderColor: 'green', borderRadius: 8, flex: 1, alignItems: 'center' },
  textRed: { color: 'red', fontWeight: 'bold' },
  textGreen: { color: 'green', fontWeight: 'bold' },
  imageViewerOverlay: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  fullImage: { width: '100%', height: '100%' },
  closeImageBtn: { position: 'absolute', top: 40, right: 20, zIndex: 10 },
});

export default AcceptedCommissionInfoScreen;