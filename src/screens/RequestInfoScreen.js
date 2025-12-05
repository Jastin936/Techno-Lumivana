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
  
  const [isOwner, setIsOwner] = useState(false);

  const slideAnim = useState(new Animated.Value(300))[0];

  const requestData = route.params?.requestData || {
    title: 'Poster/Banner Design',
    type: 'Creative',
    artist: 'Kreideprinz',
    description: 'Unique logos for student organizations, or small businesses.',
    email: 'erinko@gmail.com',
    referencePhotos: [],
    category: 'Graphic Design'
  };

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem('userProfileData');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
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

  const handleAcceptPress = () => {
    setModalVisible(true);
  };

  const handleHoldOff = () => {
    setModalVisible(false);
  };

  const handleProceed = () => {
    setModalVisible(false);
    // Navigate to the Agreement Form screen with the request data
    navigation.navigate('AgreementForm', { 
      requestData: requestData 
    });
  };

  const openMoreModal = () => {
    setMoreModal({ visible: true, request: requestData });
    slideUp();
  };

  const handleBlockRequest = () => {
    setBlockedRequests((prev) => [...prev, requestData.id]);
    setMoreModal({ visible: false, request: null });
    navigation.goBack();
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

          <View style={styles.infoSection}>
            <Text style={[styles.requestTitle, { color: '#FFFFFF' }]}>{requestData.title}</Text>
            <Text style={[styles.requestType, { color: '#FFFFFF' }]}>{requestData.category || requestData.type}</Text>

            <View style={styles.artistRow}>
              <View style={styles.leftSide}>
                <View style={styles.profileCircle}>
                  <Ionicons name="person-circle-outline" size={40} color="#FFFFFF" />
                </View>
                <Text style={[styles.artistName, { color: '#FFFFFF' }]}>{requestData.artist}</Text>
              </View>

              <View style={styles.rightSideActions}>
                {isOwner ? (
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, marginRight: 8 }}>You</Text>
                ) : (
                  <TouchableOpacity style={[styles.followButton, { borderColor: '#FFFFFF' }]}>
                    <Text style={[styles.followButtonText, { color: '#FFFFFF' }]}>Follow</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.menuButton} onPress={openMoreModal}>
                  <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>Commission Details</Text>
                
                {/* Accept Button Logic */}
                {!isOwner && (
                    <TouchableOpacity 
                        style={styles.acceptButton} 
                        onPress={handleAcceptPress}
                    >
                        <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: '#FFFFFF' }]}>Description</Text>
              <Text style={[styles.detailValue, { color: '#000000', backgroundColor: '#FFFFFF' }]}>{requestData.description}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: '#FFFFFF' }]}>Contact Information</Text>
              <Text style={[styles.detailValue, { color: '#000000', backgroundColor: '#FFFFFF' }]}>{requestData.email}</Text>
            </View>
          </View>

          <View style={styles.imageGrid}>
            {requestData.referencePhotos?.length > 0 ? (
              requestData.referencePhotos.map((photoUri, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.gridImage, { backgroundColor: colors.surfaceLight }]}
                  onPress={() => handleImagePress(photoUri)}
                >
                  <Image source={{ uri: photoUri }} style={styles.gridImageContent} resizeMode="cover" />
                </TouchableOpacity>
              ))
            ) : (
              [1, 2, 3, 4].map((_, index) => (
                <View key={index} style={[styles.gridImage, { backgroundColor: colors.surfaceLight }]}>
                  <Ionicons name="image-outline" size={40} color={colors.textMuted} />
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Footer */}
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

      {/* Confirmation Modal */}
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
              <TouchableOpacity style={[styles.modalButton, styles.buttonHoldOff]} onPress={handleHoldOff}>
                <Text style={styles.textHoldOff}>Hold off</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.buttonProceed]} onPress={handleProceed}>
                <Text style={styles.textProceed}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Other Modals... (Image, More Options) */}
      <Modal visible={imageModal.visible} transparent={true}>
        <View style={styles.imageModalOverlay}>
            <TouchableOpacity style={styles.imageModalCloseButton} onPress={closeImageModal}>
                <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <Image source={{ uri: imageModal.imageUri }} style={styles.fullSizeImage} resizeMode="contain" />
        </View>
      </Modal>

      <Modal transparent visible={moreModal.visible} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }], backgroundColor: colors.card, borderColor: colors.primary }]}>
            <Text style={[styles.bottomSheetModalTitle, { color: colors.primary }]}>More Operations</Text>
            <View style={styles.iconRow}>
                <Ionicons name="logo-facebook" size={28} color="#1877F2" />
                <Ionicons name="mail-outline" size={28} color="#EA4335" />
                <Ionicons name="send-outline" size={28} color="#1DA1F2" />
                <Ionicons name="logo-twitter" size={28} color={colors.text} />
            </View>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingHorizontal: 24, paddingBottom: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 12, padding: 4 },
  backButtonText: { fontSize: 28, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },
  topImagePlaceholder: { width: SCREEN_WIDTH - 48, height: 180, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1.5, borderStyle: 'dashed', overflow: 'hidden' },
  mainImage: { width: '100%', height: '100%' },
  infoSection: { marginBottom: 20 },
  requestTitle: { fontSize: 26, fontWeight: 'bold', fontFamily: 'Milonga' },
  requestType: { fontSize: 16, marginBottom: 12 },
  artistRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftSide: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rightSideActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  profileCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  artistName: { fontSize: 18, fontWeight: 'bold' },
  followButton: { backgroundColor: 'transparent', borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 8 },
  followButtonText: { fontWeight: 'bold', fontSize: 16 },
  menuButton: { padding: 5 },
  section: { marginBottom: 20 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  acceptButton: { backgroundColor: '#FF4136', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 8 },
  acceptButtonText: { color: '#FFF', fontWeight: 'bold' },
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
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  modalView: { margin: 20, borderRadius: 15, padding: 25, alignItems: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, width: '85%', backgroundColor: '#FFF' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  modalTitleUnderline: { width: '100%', height: 1, marginBottom: 15, backgroundColor: '#ccc' },
  modalDescription: { fontSize: 15, textAlign: 'left', marginBottom: 25, lineHeight: 22 },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 15 },
  modalButton: { flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  buttonHoldOff: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#ccc' },
  textHoldOff: { fontWeight: 'bold', fontSize: 16 },
  buttonProceed: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#000' },
  textProceed: { fontWeight: 'bold', fontSize: 16 },
  imageModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
  imageModalCloseButton: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  fullSizeImage: { width: '100%', height: '80%' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  bottomSheet: { position: "absolute", bottom: 0, width: "100%", borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, padding: 20 },
  bottomSheetModalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  iconRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  optionRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  optionText: { marginLeft: 8, fontSize: 15 },
  closeBtn: { position: "absolute", top: 10, right: 15 },
});

export default RequestInfoScreen;