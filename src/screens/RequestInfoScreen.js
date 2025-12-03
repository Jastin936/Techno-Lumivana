import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ Added Import
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react'; // ✅ Added useEffect
import {
  Animated,
  Dimensions,
  Easing,
  Image,
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

const RequestInfoScreen = ({ navigation, route }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [isModalVisible, setModalVisible] = useState(false);
  const [moreModal, setMoreModal] = useState({ visible: false, request: null });
  const [imageModal, setImageModal] = useState({ visible: false, imageUri: null });
  const [blockedRequests, setBlockedRequests] = useState([]);
  
  // ✅ State to track if the current user is the owner of the request
  const [isOwner, setIsOwner] = useState(false);

  const slideAnim = useState(new Animated.Value(300))[0];

  // Get request data from navigation parameters or use default data
  const requestData = route.params?.requestData || {
    title: 'Poster/Banner Design',
    type: 'Creative',
    artist: 'Kreideprinz',
    description: 'Unique logos for student organizations, or small businesses.',
    email: 'erinko@gmail.com',
    referencePhotos: [],
    category: 'Graphic Design'
  };

  // ✅ CHECK OWNER ON LOAD
  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem('userProfileData');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          // Compare the request artist name with the logged-in user's name
          if (profile.name === requestData.artist) {
            setIsOwner(true);
          }
        }
      } catch (error) {
        console.log('Error checking ownership:', error);
      }
    };
    checkOwnership();
  }, [requestData]);

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

  const handleAcceptPress = () => {
    setModalVisible(true);
  };

  const handleHoldOff = () => {
    setModalVisible(false);
    console.log('Hold off pressed');
  };

  const handleProceed = () => {
    setModalVisible(false);
    // Navigate to the Agreement Form screen with the request data
    navigation.navigate('AgreementForm', { 
      requestData: requestData 
    });
    console.log('Proceed pressed, navigating to AgreementForm');
  };

  const openMoreModal = () => {
    setMoreModal({ visible: true, request: requestData });
    slideUp();
  };

  const handleBlockRequest = () => {
    setBlockedRequests((prev) => [...prev, requestData.id]);
    setMoreModal({ visible: false, request: null });
    navigation.goBack(); // Go back to previous screen after blocking
  };

  // Handle image click to open modal
  const handleImagePress = (imageUri) => {
    setImageModal({ visible: true, imageUri });
  };

  // Handle closing image modal
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
        {/* FIX: Use light-content so status bar text is WHITE */}
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              {/* FIX: Force WHITE color for Back Arrow */}
              <Text style={[styles.backButtonText, { color: '#FFFFFF' }]}>←</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Top Image Placeholder */}
          <TouchableOpacity 
            style={[styles.topImagePlaceholder, { 
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight,
              borderColor: isDarkMode ? 'rgba(255, 215, 0, 0.2)' : colors.border
            }]}
            onPress={() => requestData.referencePhotos?.length > 0 && 
              handleImagePress(requestData.referencePhotos[0])}
          >
            {requestData.referencePhotos?.length > 0 ? (
              <Image 
                source={{ uri: requestData.referencePhotos[0] }} 
                style={styles.mainImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="image-outline" size={60} color={colors.textMuted} />
            )}
          </TouchableOpacity>

          {/* Info Section */}
          <View style={styles.infoSection}>
            {/* FIX: Force WHITE color for Title */}
            <Text style={[styles.requestTitle, { color: '#FFFFFF' }]}>{requestData.title}</Text>
            {/* FIX: Force WHITE color for Type */}
            <Text style={[styles.requestType, { color: '#FFFFFF' }]}>{requestData.category || requestData.type}</Text>

            {/* Artist Row */}
            <View style={styles.artistRow}>
              <View style={styles.leftSide}>
                <View style={styles.profileCircle}>
                  {/* FIX: Force WHITE color for Icon */}
                  <Ionicons name="person-circle-outline" size={40} color="#FFFFFF" />
                </View>
                {/* FIX: Force WHITE color for Artist Name */}
                <Text style={[styles.artistName, { color: '#FFFFFF' }]}>{requestData.artist}</Text>
              </View>

              {/* Right Side Actions */}
              <View style={styles.rightSideActions}>
                
                {/* ✅ HIDE FOLLOW BUTTON IF OWNER, SHOW "YOU" */}
                {isOwner ? (
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, marginRight: 8 }}>You</Text>
                ) : (
                  <TouchableOpacity style={[styles.followButton, { borderColor: '#FFFFFF' }]}>
                    <Text style={[styles.followButtonText, { color: '#FFFFFF' }]}>Follow</Text>
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

          {/* Commission Details Section */}
          <View style={styles.section}>
            {/* FIX: Force WHITE color for Section Title to be readable */}
            <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>Commission Details</Text>

            {/* Description */}
            <View style={styles.detailItem}>
              {/* FIX: Force WHITE color for Labels */}
              <Text style={[styles.detailLabel, { color: '#FFFFFF' }]}>Description</Text>
              
              <Text style={[styles.detailValue, { 
                color: '#000000', 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.9)' : colors.surfaceLight 
              }]}>{requestData.description}</Text>
            </View>

            {/* Contact Information */}
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: '#FFFFFF' }]}>Contact Information</Text>
              
              <Text style={[styles.detailValue, { 
                color: '#000000', 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.9)' : colors.surfaceLight 
              }]}>{requestData.email}</Text>
            </View>

            {/* Accept Button - Only show if NOT owner */}
            {!isOwner && (
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity style={[styles.acceptButton, { borderColor: '#FF4136' }]} onPress={handleAcceptPress}>
                  <Text style={[styles.acceptButtonText, { color: '#FF4136' }]}>Accept</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Image Grid Section */}
          <View style={styles.imageGrid}>
            {requestData.referencePhotos?.length > 0 ? (
              requestData.referencePhotos.map((photoUri, index) => (
                <TouchableOpacity 
                  key={index} 
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
              // Show placeholder images if no reference photos
              [1, 2, 3, 4].map((_, index) => (
                <View key={index} style={[styles.gridImage, { 
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight 
                }]}>
                  <Ionicons name="image-outline" size={40} color={colors.textMuted} />
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* FOOTER */}
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

      {/* MODALS */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Send an inquiry</Text>
            <View style={styles.modalTitleUnderline} />
            <Text style={styles.modalDescription}>
              Let's coordinate and start the agreement process together.
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonHoldOff]}
                onPress={handleHoldOff}
              >
                <Text style={styles.textHoldOff}>Hold off</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonProceed]}
                onPress={handleProceed}
              >
                <Text style={styles.textProceed}>Proceed</Text>
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
              <Ionicons name="logo-facebook" size={28} color="#1877F2" />
              <Ionicons name="mail-outline" size={28} color="#EA4335" />
              <Ionicons name="send-outline" size={28} color="#1DA1F2" />
              <Ionicons name="logo-twitter" size={28} color={colors.text} />
            </View>
            <View style={styles.optionRow}>
              <Ionicons name="heart-dislike-outline" size={22} color="red" />
              <Text style={[styles.optionText, { color: colors.text }]}>Not interested</Text>
            </View>
            <View style={styles.optionRow}>
              <Ionicons name="flag-outline" size={22} color="red" />
              <Text style={[styles.optionText, { color: colors.text }]}>Report Post</Text>
            </View>
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

  // Follow button (Transparent with blue border)
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

  // Accept button (RED BORDER AND TEXT, TRANSPARENT BACKGROUND)
  acceptButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF4136',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#FF4136',
    fontWeight: 'bold',
    fontSize: 16,
  },

  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
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

  // --- MODAL STYLES ---
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

  // IMAGE MODAL STYLES
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

  // --- BOTTOM SHEET STYLES ---
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

export default RequestInfoScreen;