import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Modal,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import MoreOptionsModal from "../components/MoreOptionsModal";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProductInfoScreen = ({ navigation, route }) => {
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [isModalVisible, setModalVisible] = useState(false);
  const [moreModal, setMoreModal] = useState({ visible: false, request: null });
  const [imageModal, setImageModal] = useState({ visible: false, imageUri: null });
  const [blockedRequests, setBlockedRequests] = useState([]);

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

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
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
    // Show the Accept button modal directly
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

  const handleReportRequest = () => {
    console.log('Report request:', requestData.title);
    setMoreModal({ visible: false, request: null });
  };

  const handleNotInterested = () => {
    console.log('Not interested in:', requestData.title);
    setMoreModal({ visible: false, request: null });
    navigation.goBack(); // Go back to previous screen
  };

    const handleBlockPost = () => {
      if (moreModal.post) {
        setBlockedPosts((prev) => [...prev, moreModal.post.id]);
        setMoreModal({ visible: false, post: null });
        Alert.alert("Success", "Post has been blocked");
      }
    };

      const handleReportPost = () => {
        if (moreModal.post) {
          console.log('Report post:', moreModal.post.title);
          setMoreModal({ visible: false, post: null });
          Alert.alert("Report Submitted", "Thank you for reporting this post");
        }
      };

  // Handle image click to open modal
  const handleImagePress = (imageUri) => {
    setImageModal({ visible: true, imageUri });
  };

  // Handle closing image modal
  const closeImageModal = () => {
    setImageModal({ visible: false, imageUri: null });
  };

  // Helper function to get icon based on category
  const getIconForCategory = (category) => {
    const categoryMap = {
      'Graphic Design': 'color-palette-outline',
      'Illustration': 'brush-outline',
      'Crafting': 'hammer-outline',
      'Writing': 'document-text-outline',
      'Photography': 'camera-outline',
      'Tutoring': 'school-outline',
      'Custom Commission': 'create-outline'
    };
    return categoryMap[category] || 'create-outline';
  };

  return (
    <LinearGradient colors={['#0E0E0E', '#1A1A1A']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Top Image Placeholder - Show first reference photo if available */}
          <TouchableOpacity 
            style={styles.topImagePlaceholder}
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
              <Ionicons name="image-outline" size={60} color="#666" />
            )}
          </TouchableOpacity>

          {/* Info Section (below image) */}
          <View style={styles.infoSection}>
            <Text style={styles.requestTitle}>{requestData.title}</Text>
            <Text style={styles.requestType}>{requestData.category || requestData.type}</Text>

            {/* Artist Row */}
            <View style={styles.artistRow}>
              <View style={styles.leftSide}>
                <View style={styles.profileCircle}>
                  <Ionicons name="person-circle-outline" size={40} color="#FFD700" />
                </View>
                <Text style={styles.artistName}>{requestData.artist}</Text>
              </View>

              {/* Right Side Actions: Follow + Menu */}
              <View style={styles.rightSideActions}>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followButtonText}>Follow</Text>
                </TouchableOpacity>

                {/* Menu Button - Same as Recommended screen */}
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={openMoreModal}
                >
                  <Ionicons name="ellipsis-vertical" size={24} color="#FFD700" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Commission Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Commission Details</Text>
              <TouchableOpacity style={styles.connectButton} onPress={handleConnectPress}>
                <Ionicons name="call-outline" size={18} color="#4CAF50" />
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>

            {/* Description */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{requestData.description}</Text>
            </View>

            {/* Contact Information */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Contact Information</Text>
              <Text style={styles.detailValue}>{requestData.email}</Text>
            </View>
          </View>

          {/* Image Grid Section - Show all reference photos */}
          <View style={styles.imageGrid}>
            {requestData.referencePhotos && requestData.referencePhotos.length > 0 ? (
              requestData.referencePhotos.map((photoUri, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.gridImage}
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
                <View key={index} style={styles.gridImage}>
                  <Ionicons name="image-outline" size={40} color="#666" />
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={24} color="#FFD700" />
            <Text style={[styles.footerText, styles.activeFooterText]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.plusSquareButton} onPress={() => navigation.navigate('Request')}>
            <View style={styles.plusSquareContainer}>
              <Ionicons name="add" size={30} color="#FFD700" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem}>
            <Ionicons name="briefcase-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Commissions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('FAQs')}>
            <Ionicons name="help-circle-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>FAQs</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ACCEPT BUTTON MODAL - Shows when Connect button is clicked */}
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

      {/* IMAGE MODAL */}
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
              
              {/* Close Button */}
              <TouchableOpacity 
                style={styles.imageModalCloseButton}
                onPress={closeImageModal}
              >
                <Ionicons name="close" size={28} color="#FFD700" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

              {/* More Options Modal */}  
            <MoreOptionsModal
              visible={moreModal.visible}
              onClose={() => setMoreModal({ visible: false, post: null })}
              onBlock={handleBlockPost}
              onReport={handleReportPost}
              onNotInterested={handleNotInterested}
            />
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
  backButtonText: { fontSize: 28, color: '#FFD700', fontWeight: 'bold' },

  content: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },

  topImagePlaceholder: {
    width: SCREEN_WIDTH - 48,
    height: 180,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.2)',
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
    color: '#FFD700',
    fontFamily: 'Milonga',
  },
  requestType: {
    fontSize: 16,
    color: '#fff',
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
    color: '#fff',
    fontWeight: 'bold',
  },

  // Follow button (Transparent with blue border)
  followButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#3949AB',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 8,
  },
  followButtonText: {
    color: '#3949AB',
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
    color: '#FFD700',
  },
  // Connect button styles
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 6,
  },
  connectButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 12,
  },
  detailItem: { marginBottom: 16 },
  detailLabel: { fontSize: 14, color: '#aaa', marginBottom: 6 },
  detailValue: {
    fontSize: 15,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
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
    backgroundColor: 'rgba(255,255,255,0.1)',
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
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  footerItem: { alignItems: 'center', flex: 1 },
  footerText: { color: '#aaa', fontSize: 12, marginTop: 2, textAlign: 'center' },
  activeFooterText: { color: '#FFD700', fontWeight: 'bold' },
  plusSquareButton: { alignItems: 'center', marginHorizontal: 10 },
  plusSquareContainer: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ACCEPT BUTTON MODAL STYLES
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#F0F0F0',
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
    color: '#333',
    marginBottom: 5,
  },
  modalTitleUnderline: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 15,
    color: '#555',
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
    borderColor: '#FF4136',
  },
  textHoldOff: {
    color: '#FF4136',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonProceed: {
    backgroundColor: 'transparent', 
    borderWidth: 1.5,
    borderColor: '#90EE90',
  },
  textProceed: {
    color: '#90EE90',
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

  // --- BOTTOM SHEET STYLES (EXACT COPY FROM RECOMMENDED SCREEN) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#2A2A2A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: "#FFD700",
    padding: 20,
  },
  bottomSheetModalTitle: {
    color: "#FFD700",
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
    color: "#fff", 
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