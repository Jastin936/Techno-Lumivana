import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MyAccountScreen = ({ navigation, route }) => {
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [userData, setUserData] = useState({
    name: 'Kreideprinz',
    email: 'alberlin@gnail.com',
    skills: [],
    joinedDate: '',
    description: 'Custom teams do not award consecutive additional title, and/or advanced format, including at followout advice in some aligas.',
    profileImage: null,
  });

  const [portfolioImages, setPortfolioImages] = useState([]);
  const [editDescriptionModal, setEditDescriptionModal] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [showPortfolioImageModal, setShowPortfolioImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key to force updates

  // Format date to readable string
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Load all data
  const loadAllData = async () => {
    await loadUserData();
    await loadPortfolioImages();
  };

  // Load user profile and portfolio on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Enhanced focus listener - reload everything when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('MyAccountScreen focused - reloading data');
      loadAllData();
    });

    return unsubscribe;
  }, [navigation]);

  // Enhanced update listener for route params
  useEffect(() => {
    if (route.params?.updatedData) {
      console.log('Received updated data from EditProfile:', route.params.updatedData);
      handleUpdatedData(route.params.updatedData);
    }
  }, [route.params?.updatedData]);

  const handleUpdatedData = async (updatedData) => {
    const { name, email, skills, profileImage, portfolioImages: updatedPortfolio } = updatedData;

    const newUserData = {
      ...userData,
      name: name || userData.name,
      email: email || userData.email,
      skills: skills || userData.skills,
      profileImage: profileImage !== undefined ? profileImage : userData.profileImage,
    };

    setUserData(newUserData);
    await saveUserData(newUserData);
    
    // If profileImage is explicitly set to null, remove it from storage
    if (profileImage === null) {
      await AsyncStorage.removeItem('profileImage');
    }

    // Force refresh of portfolio images
    await loadPortfolioImages();
    
    // Clear the route params to prevent infinite loops
    navigation.setParams({ updatedData: null });
    
    // Force a re-render
    setRefreshKey(prev => prev + 1);
  };

  // Load user data
  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userProfileData');
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        
        setUserData(prev => ({
          ...prev,
          ...parsedData,
          skills: Array.isArray(parsedData.skills) ? parsedData.skills : []
        }));
      }

      // Also load profile image from AsyncStorage
      const savedProfileImage = await AsyncStorage.getItem('profileImage');
      if (savedProfileImage) {
        setUserData(prev => ({
          ...prev,
          profileImage: savedProfileImage
        }));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  // Save user data
  const saveUserData = async (data) => {
    try {
      await AsyncStorage.setItem('userProfileData', JSON.stringify(data));
    } catch (error) {
      console.log('Error saving user data:', error);
    }
  };

  // Enhanced portfolio images loading
  const loadPortfolioImages = async () => {
    try {
      console.log('Loading portfolio images...');
      const saved = await AsyncStorage.getItem('portfolioImages');
      console.log('Portfolio data from storage:', saved);
      
      if (saved) {
        const parsedImages = JSON.parse(saved);
        const imagesArray = Array.isArray(parsedImages) ? parsedImages : [];
        console.log('Setting portfolio images:', imagesArray);
        setPortfolioImages(imagesArray);
      } else {
        console.log('No portfolio images found in storage');
        setPortfolioImages([]);
      }
    } catch (error) {
      console.log('Error loading portfolio images:', error);
      setPortfolioImages([]);
    }
  };

  // Update joined date when profile is edited
  const updateJoinedDate = async () => {
    try {
      const currentDate = new Date().toISOString();
      const updatedData = {
        ...userData,
        joinedDate: currentDate
      };
      
      await AsyncStorage.setItem('userProfileData', JSON.stringify(updatedData));
      setUserData(updatedData);
      return updatedData;
    } catch (error) {
      console.log('Error updating joined date:', error);
      return null;
    }
  };

  // Add image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant access to your gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const updatedImages = [...portfolioImages, result.assets[0].uri];
      setPortfolioImages(updatedImages);
      await AsyncStorage.setItem('portfolioImages', JSON.stringify(updatedImages));
      Alert.alert('Success', 'Image added to portfolio!');
    }
  };

  // Delete image
  const deleteImage = async (index) => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedImages = portfolioImages.filter((_, i) => i !== index);
            setPortfolioImages(updatedImages);
            await AsyncStorage.setItem('portfolioImages', JSON.stringify(updatedImages));
            
            // Close modal if the deleted image was currently selected
            if (selectedImageIndex === index) {
              setShowPortfolioImageModal(false);
              setSelectedImageIndex(null);
            }
            
            Alert.alert('Success', 'Image removed from portfolio!');
          },
        },
      ]
    );
  };

  // Open portfolio image modal
  const openPortfolioImageModal = (index) => {
    setSelectedImageIndex(index);
    setShowPortfolioImageModal(true);
  };

  // Close portfolio image modal
  const closePortfolioImageModal = () => {
    setShowPortfolioImageModal(false);
    setSelectedImageIndex(null);
  };

  // Enhanced handleEditProfile with better synchronization
  const handleEditProfile = () => {
    navigation.navigate('EditProfile', {
      currentData: {
        ...userData,
        profileImage: userData.profileImage,
        portfolioImages: portfolioImages // Pass current portfolio images
      },
      onGoBack: async (updatedData) => {
        console.log('Returned from EditProfile with data:', updatedData);
        if (updatedData) {
          // Update joined date to current time when profile is edited
          const newDataWithDate = await updateJoinedDate();
          
          const newUserData = {
            ...userData,
            name: updatedData.name || userData.name,
            email: updatedData.email || userData.email,
            skills: updatedData.skills || userData.skills,
            profileImage: updatedData.profileImage !== undefined ? updatedData.profileImage : userData.profileImage,
            joinedDate: newDataWithDate?.joinedDate || userData.joinedDate,
          };
          
          setUserData(newUserData);
          await saveUserData(newUserData);

          // If profileImage is explicitly set to null, remove it from storage
          if (updatedData.profileImage === null) {
            await AsyncStorage.removeItem('profileImage');
          }
        }
        
        // Force reload of portfolio images from storage
        await loadPortfolioImages();
        setRefreshKey(prev => prev + 1); // Force re-render
      },
      onCancel: async () => {
        // Clear all user data when cancel is confirmed
        const emptyUserData = {
          name: '',
          email: '',
          skills: [],
          joinedDate: '',
          description: 'Custom teams do not award consecutive additional title, and/or advanced format, including at followout advice in some aligas.',
          profileImage: null,
        };
        setUserData(emptyUserData);
        await saveUserData(emptyUserData);
        
        // Clear portfolio images
        setPortfolioImages([]);
        await AsyncStorage.removeItem('portfolioImages');
        
        // Clear profile image
        await AsyncStorage.removeItem('profileImage');
        
        setRefreshKey(prev => prev + 1); // Force re-render
      },
    });
  };

  // Handle edit description
  const handleEditDescription = () => {
    setNewDescription(userData.description);
    setEditDescriptionModal(true);
  };

  // Handle logout - clears stored user data and resets UI
  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out? This will clear saved account data on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userProfileData');
              await AsyncStorage.removeItem('profileImage');
              await AsyncStorage.removeItem('portfolioImages');

              // Reset local state to defaults
              const emptyUserData = {
                name: 'Kreideprinz',
                email: 'alberlin@gnail.com',
                skills: [],
                joinedDate: '',
                description: 'Custom teams do not award consecutive additional title, and/or advanced format, including at followout advice in some aligas.',
                profileImage: null,
              };

              setUserData(emptyUserData);
              setPortfolioImages([]);
              setRefreshKey(prev => prev + 1);

              // Navigate back to SignIn
              navigation.navigate('SignIn');
            } catch (error) {
              console.log('Error clearing storage on logout:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Save description
  const handleSaveDescription = async () => {
    if (newDescription.trim() === '') {
      Alert.alert('Error', 'Description cannot be empty');
      return;
    }

    const updatedUserData = {
      ...userData,
      description: newDescription.trim()
    };

    setUserData(updatedUserData);
    await saveUserData(updatedUserData);
    setEditDescriptionModal(false);
    
    Alert.alert('Success', 'Description updated successfully!');
  };

  // Cancel editing description
  const handleCancelDescription = () => {
    setEditDescriptionModal(false);
    setNewDescription('');
  };

  // Social Media Handlers
  const handleFacebookPress = () => {
    // No navigation - just display the icon
  };

  const handleGmailPress = () => {
    // No navigation - just display the icon
  };

  const handleTelegramPress = () => {
    // No navigation - just display the icon
  };

  // Format contact information for display
  const formatContactInfo = () => {
    if (!userData.email || userData.email.trim() === '') {
     return 'No contact information added yet';
    }
    return userData.email;
  };

  // Format skills for display
  const formatSkills = () => {
    if (!userData.skills || userData.skills.length === 0) {
      return 'No skills added yet';
    }
    return userData.skills.join(', ');
  };

  // Format joined date for display
  const displayJoinedDate = () => {
    if (!userData.joinedDate) {
      return 'Not set yet';
    }
    
    try {
      const joinedDate = new Date(userData.joinedDate);
      return formatDate(joinedDate);
    } catch (error) {
      return 'Not set yet';
    }
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={['#CFAD01', '#30204D', '#0B005F']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { fontFamily: 'Milonga' }]}>My Account</Text>
          </View>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          key={refreshKey} // Add key to force refresh when data changes
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            {userData.profileImage ? (
              <Image 
                source={{ uri: userData.profileImage }} 
                style={styles.profileImage} 
              />
            ) : (
              <Ionicons name="person-circle-outline" size={120} color="#FFD700" />
            )}
            <Text style={styles.nameText}>{userData.name}</Text>
          </View>

          {/* Student Information */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Student Information</Text>
            
            {/* Contact Information */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Contact Information</Text>
              <Text style={styles.infoValue}>{formatContactInfo()}</Text>
            </View>
            
            {/* Skills */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Skills</Text>
              <Text style={styles.infoValue}>{formatSkills()}</Text>
            </View>
            
            {/* Joined Date - Updates after edit profile */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Profile Last Updated</Text>
              <Text style={styles.infoValue}>{displayJoinedDate()}</Text>
            </View>
            
            {/* Social Media Icons */}
            <View style={styles.socialMediaContainer}>
              <View style={styles.socialIconsContainer}>
                <TouchableOpacity style={styles.socialIcon} onPress={handleFacebookPress}>
                  <Image 
                    source={require('../../assets/facebook.png')} 
                    style={styles.socialIconImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.socialIcon} onPress={handleGmailPress}>
                  <Image 
                    source={require('../../assets/gmail.png')} 
                    style={styles.socialIconImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.socialIcon} onPress={handleTelegramPress}>
                  <Image 
                    source={require('../../assets/telegram.png')} 
                    style={styles.socialIconImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Edit Profile Button */}
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Description with Edit Icon */}
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>{userData.description}</Text>
            <TouchableOpacity 
              style={styles.editDescriptionIcon}
              onPress={handleEditDescription}
            >
              <Ionicons name="pencil-outline" size={20} color="#FFD700" />
            </TouchableOpacity>
          </View>

          {/* Portfolio Grid */}
          <View style={styles.imageCard}>
            <Text style={styles.imageGridTitle}>Portfolio ({portfolioImages.length} images)</Text>
            <View style={styles.imageGrid}>
              {portfolioImages.length === 0 ? (
                <Text style={styles.noImagesText}>
                  No images yet. Add one below!
                </Text>
              ) : (
                portfolioImages.map((uri, index) => (
                  <TouchableOpacity
                    key={`${index}-${uri}`} // Add unique key with uri to force re-render
                    style={styles.imageItem}
                    onPress={() => openPortfolioImageModal(index)}
                    onLongPress={() => deleteImage(index)}
                  >
                    <Image source={{ uri }} style={styles.gridImage} resizeMode="cover" />
                    <View style={styles.deleteOverlay}>
                      <Ionicons name="trash-outline" size={18} color="#fff" />
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>

            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <Ionicons name="add-circle-outline" size={28} color="#000" />
              <Text style={styles.addImageText}>Add Image</Text>
            </TouchableOpacity>

            {portfolioImages.length > 0 && (
              <Text style={styles.deleteHintText}>
                Long press an image to delete it
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Edit Description Modal */}
        <Modal
          visible={editDescriptionModal}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCancelDescription}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Description</Text>
              
              <TextInput
                style={styles.descriptionInput}
                multiline={true}
                numberOfLines={6}
                value={newDescription}
                onChangeText={setNewDescription}
                placeholder="Enter your description..."
                placeholderTextColor="#999"
                textAlignVertical="top"
              />
              
              <Text style={styles.charCount}>
                {newDescription.length}/500 characters
              </Text>

              <View style={styles.modalButtons}>
                 <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]} 
                  onPress={handleSaveDescription}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={handleCancelDescription}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Portfolio Image Full Screen Modal */}
        <Modal
          visible={showPortfolioImageModal}
          transparent={true}
          animationType="fade"
          onRequestClose={closePortfolioImageModal}
        >
          <View style={styles.fullScreenModalOverlay}>
            <TouchableOpacity 
              style={styles.fullScreenCloseButton}
              onPress={closePortfolioImageModal}
            >
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
            
            {selectedImageIndex !== null && portfolioImages[selectedImageIndex] && (
              <Image 
                source={{ uri: portfolioImages[selectedImageIndex] }} 
                style={styles.fullScreenImage} 
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>
      </SafeAreaView>
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
    paddingBottom: 16,
  },
  backButton: { position: 'absolute', left: 24, top: 50, zIndex: 10 },
  backButtonText: { fontSize: 28, color: '#FFD700', fontWeight: '300' },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 28, color: '#fff' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  profileSection: { alignItems: 'center', marginVertical: 30 },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  nameText: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginTop: 10 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  cardTitle: { 
    fontSize: 18, 
    color: '#FFD700', 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  infoRow: { 
    marginBottom: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(255, 255, 255, 0.2)', 
    paddingBottom: 10 
  },
  infoLabel: { 
    fontSize: 16, 
    color: '#FFD700', 
    fontWeight: '600', 
    marginBottom: 5 
  },
  infoValue: { 
    fontSize: 14, 
    color: '#fff',
    lineHeight: 20,
  },
  // Social Media Styles - Now above Edit Profile button
  socialMediaContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  socialIcon: {
    marginRight: 25,
    backgroundColor: 'transparent',
    borderRadius: 25,
    padding: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIconImage: {
    width: 50,
    height: 50,
  },
  editButton: { 
    backgroundColor: '#FFD700', 
    borderRadius: 20, 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    alignSelf: 'flex-start', 
    marginTop: 10,
  },
  editButtonText: { 
    color: '#000', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  logoutButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 12, 
    padding: 20, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 215, 0, 0.3)',
    position: 'relative',
  },
  descriptionText: { 
    fontSize: 14, 
    color: '#fff', 
    textAlign: 'center', 
    lineHeight: 20, 
    opacity: 0.8,
    paddingRight: 30,
  },
  // Pencil Icon Styles
  editDescriptionIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: 15,
    padding: 6,
  },
  imageCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 12, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 215, 0, 0.3)' 
  },
  imageGridTitle: { 
    fontSize: 18, 
    color: '#FFD700', 
    fontWeight: 'bold', 
    marginBottom: 15, 
    textAlign: 'center' 
  },
  imageGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  imageItem: { 
    width: '48%', 
    aspectRatio: 1, 
    marginBottom: 10,
    position: 'relative',
  },
  gridImage: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 215, 0, 0.3)' 
  },
  noImagesText: { 
    color: '#FFD700', 
    textAlign: 'center', 
    opacity: 0.7,
    width: '100%',
    paddingVertical: 20,
  },
  addImageButton: {
    marginTop: 15,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  addImageText: { 
    color: '#000', 
    fontSize: 14, 
    fontWeight: '600', 
    marginLeft: 5 
  },
  deleteOverlay: { 
    position: 'absolute', 
    top: 6, 
    right: 6, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    borderRadius: 12, 
    padding: 3 
  },
  deleteHintText: { 
    color: '#FFD700', 
    fontSize: 12, 
    textAlign: 'center', 
    marginTop: 5, 
    opacity: 0.6 
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#30204D',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Milonga',
  },
  descriptionInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    color: '#FFD700',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
    opacity: 0.7,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  saveButton: {
    backgroundColor: '#FFD700',
  },
  cancelButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  // Full Screen Image Modal Styles - Same as EditProfileScreen
  fullScreenModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenCloseButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
  fullScreenImage: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.9,
    borderRadius: 10,
  },
});

export default MyAccountScreen;