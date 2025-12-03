import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ Added Import
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Linking // ✅ Added Linking import if it was missing or needed for social icons
  ,

  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const RecommendedUsersInfoScreen = ({ navigation, route }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [isModalVisible, setModalVisible] = useState(false);
  const [moreModal, setMoreModal] = useState({ visible: false, request: null });
  const [imageModal, setImageModal] = useState({ visible: false, imageUri: null });
  const [blockedRequests, setBlockedRequests] = useState([]);
  
  // ✅ Changed initial state to false, will load true state from storage
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

  // ✅ LOAD FOLLOWING STATE ON MOUNT
  useEffect(() => {
    loadFollowingStatus();
  }, []);

  const loadFollowingStatus = async () => {
    try {
      const savedFollowing = await AsyncStorage.getItem('followingState');
      if (savedFollowing) {
        const followingData = JSON.parse(savedFollowing);
        // Check if this specific artist is being followed
        if (followingData[userData.artist] === true) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      }
    } catch (error) {
      console.log('Error loading following status:', error);
    }
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

  // ✅ UPDATED TOGGLE FOLLOW FUNCTION TO SAVE TO ASYNCSTORAGE
  const toggleFollow = async () => {
    const newStatus = !isFollowing;
    setIsFollowing(newStatus);
    
    try {
      const savedFollowing = await AsyncStorage.getItem('followingState');
      let followingData = savedFollowing ? JSON.parse(savedFollowing) : {};
      
      // Update the status for this specific artist
      followingData[userData.artist] = newStatus;
      
      await AsyncStorage.setItem('followingState', JSON.stringify(followingData));
    } catch (error) {
      console.log('Error saving following status:', error);
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

  // Handle social media icon press
  const handleSocialMediaPress = (platform) => {
    console.log(`Pressed ${platform} icon`);
    // You can add navigation or linking logic here
  };

  return (
    <LinearGradient 
      colors={isDarkMode ? gradients.background : gradients.main} 
      locations={isDarkMode ? [0, 1] : [0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* FIX: Set status bar to dark-content in light mode for visibility on yellow */}
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              {/* FIX: Force Black color for Back Arrow in Light Mode */}
              <Text style={[styles.backButtonText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>←</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Top Image Placeholder - Show first reference photo if available */}
          <TouchableOpacity 
            style={[styles.topImagePlaceholder, { 
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight,
              borderColor: isDarkMode ? 'rgba(255, 215, 0, 0.2)' : colors.cardBorder
            }]}
            onPress={() => userData.referencePhotos?.length > 0 && 
              handleImagePress(userData.referencePhotos[0])}
          >
            {/* FIX: Use optional chaining to prevent crash if referencePhotos is missing */}
            {userData.referencePhotos?.length > 0 ? (
              <Image 
                source={{ uri: userData.referencePhotos[0] }} 
                style={styles.mainImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="image-outline" size={60} color={colors.textMuted} />
            )}
          </TouchableOpacity>

          {/* Info Section (below image) */}
          <View style={styles.infoSection}>
            {/* Title Row with Profile Icon on the right */}
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                {/* FIX: Use White in Dark Mode, Black in Light Mode */}
                <Text style={[styles.requestTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{userData.title}</Text>
                
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
                   {/* FIX: Profile Icon Color White/Black */}
                  <Ionicons name="person-circle-outline" size={80} color={isDarkMode ? '#FFFFFF' : '#000000'} />
                </View>
              </View>
            </View>

            {/* Artist Name and Actions Row */}
            <View style={styles.artistRow}>
               {/* FIX: Artist Name Color White/Black */}
              <Text style={[styles.artistName, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{userData.artist}</Text>
              
              {/* Right Side Actions: Follow + Menu */}
              <View style={styles.rightSideActions}>
                <TouchableOpacity 
                  style={[
                    styles.followButton,
                    { borderColor: isDarkMode ? '#FFFFFF' : '#000000' },
                    isFollowing && { backgroundColor: colors.surface }
                  ]}
                  onPress={toggleFollow}
                >
                  <Text style={[
                    styles.followButtonText,
                    { color: isDarkMode ? '#FFFFFF' : '#000000' }
                  ]}>
                    {isFollowing ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>

                {/* Menu Button */}
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={openMoreModal}
                >
                   {/* FIX: Menu Icon Color White/Black */}
                  <Ionicons name="ellipsis-vertical" size={24} color={isDarkMode ? '#FFFFFF' : '#000000'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Contact Information Section */}
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Contact Information</Text>
              <Text style={[styles.detailValue, { 
                color: isDarkMode ? '#FFFFFF' : '#000000', 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight 
              }]}>{userData.email}</Text>
            </View>

          {/* Skills Section */}
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Skills & Specializations</Text>
              <Text style={[styles.detailValue, { 
                color: isDarkMode ? '#FFFFFF' : '#000000', 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight 
              }]}>{userData.skills}</Text>
            </View>

          {/* Joined Date Section */}
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Joined Date</Text>
              <Text style={[styles.detailValue, { 
                color: isDarkMode ? '#FFFFFF' : '#000000', 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight 
              }]}>{userData.joinedDate}</Text>
            </View>

          {/* Bio Section */}
            <View style={styles.detailItem}>
              <Text style={[styles.detailValue, { 
                color: isDarkMode ? '#FFFFFF' : '#000000', 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight 
              }]}>{userData.bio}</Text>
            </View>

          {/* Image Grid Section - Show all reference photos */}
          <View style={styles.imageGrid}>
            {/* FIX: Use optional chaining to prevent crash */}
            {userData.referencePhotos?.length > 0 ? (
              userData.referencePhotos.map((photoUri, index) => (
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
              // Show placeholder images if no reference photos
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

        {/* FOOTER */}
        <View style={[styles.footer, { backgroundColor: isDarkMode ? colors.surface : 'rgba(255, 255, 255, 0.15)' }]}>
          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>Home</Text>
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
                <Ionicons name="close" size={28} color={colors.primary} />
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
  detailItem: { marginBottom: 16 },
  detailLabel: { fontSize: 14, marginBottom: 6 },
  detailValue: {
    fontSize: 15,
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

export default RecommendedUsersInfoScreen;