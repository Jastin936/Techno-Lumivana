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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const RecommendedUsersInfoScreen = ({ navigation, route }) => {
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [isModalVisible, setModalVisible] = useState(false);
  const [moreModal, setMoreModal] = useState({ visible: false, request: null });
  const [imageModal, setImageModal] = useState({ visible: false, imageUri: null });
  const [blockedRequests, setBlockedRequests] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const slideAnim = useState(new Animated.Value(300))[0];

  // Get user data from navigation parameters
  const userData = route.params?.requestData || {
    title: 'Student Information',
    artist: 'Kreideprinz',
    email: 'erinko@gmail.com',
    skills: 'Logo Design, Brand Identity, Vector Illustration, Typography, Digital Art',
    joinedDate: 'January 15, 2023',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    referencePhotos: []
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

  const openMoreModal = () => {
    setMoreModal({ visible: true, request: userData });
    slideUp();
  };

  const handleBlockRequest = () => {
    setBlockedRequests((prev) => [...prev, userData.id]);
    setMoreModal({ visible: false, request: null });
    navigation.goBack();
  };

  const handleReportRequest = () => {
    console.log('Report request:', userData.title);
    setMoreModal({ visible: false, request: null });
  };

  const handleNotInterested = () => {
    console.log('Not interested in:', userData.title);
    setMoreModal({ visible: false, request: null });
    navigation.goBack();
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  // Handle image click to open modal
  const handleImagePress = (imageUri) => {
    setImageModal({ visible: true, imageUri });
  };

  // Handle closing image modal
  const closeImageModal = () => {
    setImageModal({ visible: false, imageUri: null });
  };

  // Handle social media icon press
  const handleSocialMediaPress = (platform) => {
    console.log(`Pressed ${platform} icon`);
    // You can add navigation or linking logic here
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
            onPress={() => userData.referencePhotos && userData.referencePhotos.length > 0 && 
              handleImagePress(userData.referencePhotos[0])}
          >
            {userData.referencePhotos && userData.referencePhotos.length > 0 ? (
              <Image 
                source={{ uri: userData.referencePhotos[0] }} 
                style={styles.mainImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="image-outline" size={60} color="#666" />
            )}
          </TouchableOpacity>

          {/* Info Section (below image) */}
          <View style={styles.infoSection}>
            {/* Title Row with Profile Icon on the right */}
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                <Text style={styles.requestTitle}>{userData.title}</Text>
                
                {/* Social Media Icons - Below the title */}
                <View style={styles.socialMediaContainer}>
                  <TouchableOpacity 
                    style={styles.socialIcon}
                    onPress={() => handleSocialMediaPress('Facebook')}
                  >
                    <Image 
                      source={require('../../assets/facebook.png')} 
                      style={styles.socialIconImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.socialIcon}
                    onPress={() => handleSocialMediaPress('Gmail')}
                  >
                    <Image 
                      source={require('../../assets/gmail.png')} 
                      style={styles.socialIconImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.socialIcon}
                    onPress={() => handleSocialMediaPress('Telegram')}
                  >
                    <Image 
                      source={require('../../assets/telegram.png')} 
                      style={styles.socialIconImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Profile Icon moved to the right side - Made bigger */}
              <View style={styles.profileIconContainer}>
                <View style={styles.profileCircle}>
                  <Ionicons name="person-circle-outline" size={80} color="#FFD700" />
                </View>
              </View>
            </View>

            {/* Artist Name and Actions Row */}
            <View style={styles.artistRow}>
              <Text style={styles.artistName}>{userData.artist}</Text>
              
              {/* Right Side Actions: Follow + Menu */}
              <View style={styles.rightSideActions}>
                <TouchableOpacity 
                  style={[
                    styles.followButton,
                    isFollowing && styles.followingBtn
                  ]}
                  onPress={toggleFollow}
                >
                  <Text style={[
                    styles.followButtonText,
                    isFollowing && styles.followingText
                  ]}>
                    {isFollowing ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>

                {/* Menu Button */}
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={openMoreModal}
                >
                  <Ionicons name="ellipsis-vertical" size={24} color="#FFD700" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Contact Information Section */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Contact Information</Text>
              <Text style={styles.detailValue}>{userData.email}</Text>
            </View>

          {/* Skills Section */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Skills & Specializations</Text>
              <Text style={styles.detailValue}>{userData.skills}</Text>
            </View>

          {/* Joined Date Section */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Joined Date</Text>
              <Text style={styles.detailValue}>{userData.joinedDate}</Text>
            </View>

          {/* Bio Section */}
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>{userData.bio}</Text>
            </View>

          {/* Image Grid Section - Show all reference photos */}
          <View style={styles.imageGrid}>
            {userData.referencePhotos && userData.referencePhotos.length > 0 ? (
              userData.referencePhotos.map((photoUri, index) => (
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

      {/* MORE OPERATIONS MODAL */}
      <Modal transparent visible={moreModal.visible} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.bottomSheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.bottomSheetModalTitle}>More Operations</Text>
            <View style={styles.iconRow}>
              <Ionicons name="logo-facebook" size={28} color="#1877F2" />
              <Ionicons name="mail-outline" size={28} color="#EA4335" />
              <Ionicons name="send-outline" size={28} color="#1DA1F2" />
              <Ionicons name="logo-twitter" size={28} color="#fff" />
            </View>
            <View style={styles.optionRow}>
              <Ionicons name="heart-dislike-outline" size={22} color="red" />
              <Text style={styles.optionText}>Not interested</Text>
            </View>
            <View style={styles.optionRow}>
              <Ionicons name="flag-outline" size={22} color="red" />
              <Text style={styles.optionText}>Report Post</Text>
            </View>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={handleBlockRequest}
            >
              <Ionicons name="close-circle-outline" size={22} color="red" />
              <Text style={styles.optionText}>Block user</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setMoreModal({ visible: false, request: null })}
            >
              <Ionicons name="close" size={24} color="#FFD700" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

// ... (styles remain the same as your original RecommendedUsersInfoScreen)
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    fontFamily: 'Milonga',
    marginBottom: 12,
  },
  profileIconContainer: {
    marginLeft: 12,
    marginRight: 20,
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  artistName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  rightSideActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
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
  followingBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  followingText: {
    color: '#FFD700',
  },
  menuButton: {
    padding: 5,
  },
  detailItem: { marginBottom: 16 },
  detailLabel: { fontSize: 14, color: '#aaa', marginBottom: 6 },
  detailValue: {
    fontSize: 15,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    lineHeight: 20,
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 16,
  },
  socialIcon: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  socialIconImage: {
    width: 40,
    height: 40,
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

export default RecommendedUsersInfoScreen;