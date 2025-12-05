import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const EditProfileScreen = ({ navigation, route }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
  });

  const [portfolioImages, setPortfolioImages] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);

  // Load existing data when component mounts
  React.useEffect(() => {
    if (route.params?.currentData) {
      const { currentData } = route.params;
      setFormData(prev => ({
        ...prev,
        name: currentData.name || '',
        email: currentData.email || '',
        skills: currentData.skills ? currentData.skills.join(', ') : '',
      }));
    }
    loadPortfolioImages();
    loadProfileImage();
  }, [route.params?.currentData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailInvalid = formData.email && !emailRegex.test(formData.email);

  // Load portfolio images
  const loadPortfolioImages = async () => {
    try {
      const saved = await AsyncStorage.getItem('portfolioImages');
      if (saved) setPortfolioImages(JSON.parse(saved));
    } catch (error) {
      console.log('Error loading portfolio images:', error);
    }
  };

  // Load profile image
  const loadProfileImage = async () => {
    try {
      const saved = await AsyncStorage.getItem('profileImage');
      if (saved) setProfileImage(saved);
    } catch (error) {
      console.log('Error loading profile image:', error);
    }
  };

  // Save profile image
  const saveProfileImage = async (uri) => {
    try {
      await AsyncStorage.setItem('profileImage', uri);
    } catch (error) {
      console.log('Error saving profile image:', error);
    }
  };

  // Delete profile image
  const deleteProfileImage = async () => {
    try {
      await AsyncStorage.removeItem('profileImage');
      setProfileImage(null);
      Alert.alert('Success', 'Profile picture deleted successfully!');
    } catch (error) {
      console.log('Error deleting profile image:', error);
    }
  };

  // Save portfolio images
  useEffect(() => {
    AsyncStorage.setItem('portfolioImages', JSON.stringify(portfolioImages));
  }, [portfolioImages]);

  // Open image picker modal
  const openImagePickerModal = () => {
    setShowImagePickerModal(true);
  };

  // Close image picker modal
  const closeImagePickerModal = () => {
    setShowImagePickerModal(false);
  };

  // Show profile picture in full screen
  const showProfilePicture = () => {
    closeImagePickerModal();
    if (profileImage) {
      setShowProfileImageModal(true);
    } else {
      Alert.alert('No Profile Picture', 'You haven\'t set a profile picture yet.');
    }
  };

  // Close profile picture modal
  const closeProfilePictureModal = () => {
    setShowProfileImageModal(false);
  };

  // Take photo with camera
  const takePhotoWithCamera = async () => {
    closeImagePickerModal();
    
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant access to your camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      saveProfileImage(result.assets[0].uri);
      Alert.alert('Success', 'Profile picture updated successfully!');
    }
  };

  // Delete profile picture with confirmation
  const handleDeleteProfilePicture = () => {
    closeImagePickerModal();
    
    if (!profileImage) {
      Alert.alert('No Profile Picture', 'You don\'t have a profile picture to delete.');
      return;
    }

    Alert.alert(
      'Delete Profile Picture',
      'Are you sure you want to delete your profile picture?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: deleteProfileImage,
        },
      ],
      { cancelable: true }
    );
  };

  // Pick image from gallery
  const pickImageFromGallery = async () => {
    closeImagePickerModal();
    
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
      setProfileImage(result.assets[0].uri);
      saveProfileImage(result.assets[0].uri);
      Alert.alert('Success', 'Profile picture updated successfully!');
    }
  };

  // Add portfolio image
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
      setPortfolioImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  // Delete image
  const deleteImage = (index) => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPortfolioImages((prev) => prev.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };

  const handleUpdateProfile = () => {
    // Check for required fields
    if (!formData.name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!formData.email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (isEmailInvalid) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (!formData.skills) {
      Alert.alert('Error', 'Please enter your skills');
      return;
    }

    Alert.alert(
      'Update Profile',
      'Are you sure you want to update your profile?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            // FIX: Split by comma OR semicolon, and remove empty strings
            const skillsArray = formData.skills
              .split(/[,;]+/) 
              .map(skill => skill.trim())
              .filter(skill => skill.length > 0);

            const updatedData = {
              name: formData.name,
              email: formData.email,
              skills: skillsArray,
              profileImage: profileImage,
              portfolioImages: portfolioImages
            };

            // Save the updated data to AsyncStorage
            try {
              await AsyncStorage.setItem('userProfileData', JSON.stringify(updatedData));
              await AsyncStorage.setItem('portfolioImages', JSON.stringify(portfolioImages));
            }   catch (error) {
              console.log('Error saving data:', error);
            }
            
            if (route.params?.onGoBack) {
              route.params.onGoBack(updatedData);
            }
            
            Alert.alert('Success', 'Profile updated successfully', [
              { 
                text: 'OK', 
                onPress: () => navigation.navigate('Profile') 
              },
            ]);
          },
        },
        { text: 'No', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  // Handle cancel button with alert
  const handleCancel = () => {
    Alert.alert(
      'Cancel Update',
      'Are you sure you want to cancel? All data will be cleared.',
      [
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            // Call the onCancel callback to clear data in MyAccountScreen
            if (route.params?.onCancel) {
              route.params.onCancel();
            }
            
            // Navigate back
            navigation.goBack();
          },
        },
        { text: 'No', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={isDarkMode ? gradients.background : gradients.main}
      locations={isDarkMode ? [0, 1] : [0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "light-content"} backgroundColor="transparent" translucent />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={[styles.backButtonText, { color: isDarkMode ? colors.primary : '#FFFFFF' }]}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { fontFamily: 'Milonga', color: isDarkMode ? colors.text : '#FFFFFF' }]}>Edit Profile</Text>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              {/* Profile Icon with Edit Button */}
              <View style={styles.profileIconContainer}>
                <View style={styles.profileImageContainer}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={[styles.profileImage, { borderColor: colors.primary }]} />
                  ) : (
                    <Ionicons name="person-circle-outline" size={120} color={colors.primary} />
                  )}
                 <TouchableOpacity 
                  style={[styles.editIconContainer, { backgroundColor: colors.primary }]} 
                  onPress={openImagePickerModal}
                  >
                  <Ionicons name="camera" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                </View>
              </View>

              <View style={styles.form}>
                {/* Name */}
                <Text style={[styles.infoLabel, { color: colors.primary }]}>Name:</Text>
                <TextInput
                  style={[styles.input, {
                    borderColor: colors.inputBorder,
                    color: colors.inputText,
                    backgroundColor: colors.inputBackground
                  }]}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={formData.name}
                  onChangeText={text => handleInputChange('name', text)}
                />

                {/* Email */}
                <Text style={[styles.infoLabel, { color: colors.primary }]}>Email:</Text>
                <TextInput
                  style={[styles.input, {
                    borderColor: colors.inputBorder,
                    color: colors.inputText,
                    backgroundColor: colors.inputBackground
                  }]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={formData.email}
                  onChangeText={text => handleInputChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {isEmailInvalid && (
                  <Text style={[styles.errorText, { color: colors.error }]}>Please enter a valid email address</Text>
                )}

                {/* Skills */}
                <Text style={[styles.infoLabel, { color: colors.primary }]}>Skills:</Text>
                <TextInput
                  style={[styles.input, {
                    borderColor: colors.inputBorder,
                    color: colors.inputText,
                    backgroundColor: colors.inputBackground
                  }]}
                  placeholder="Enter skills separated by commas"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={formData.skills}
                  onChangeText={text => handleInputChange('skills', text)}
                />

                {/* Add Images Section */}
                <View style={styles.addImagesSection}>
                  <Text style={[styles.addImagesTitle, { color: colors.primary }]}>Add Images:</Text>
                  
                  <View style={styles.imageGrid}>
                    {portfolioImages.length === 0 ? (
                      <Text style={[styles.noImagesText, { color: colors.primary }]}>
                        No images yet. Add one below!
                      </Text>
                    ) : (
                      portfolioImages.map((uri, index) => (
                        <TouchableOpacity
                          key={`image-${index}-${uri}`}
                          style={styles.imageItem}
                          onLongPress={() => deleteImage(index)}
                        >
                          <Image source={{ uri }} style={[styles.gridImage, { borderColor: colors.primary }]} resizeMode="cover" />
                          <View style={styles.deleteOverlay}>
                            <Ionicons name="trash-outline" size={18} color={colors.text} />
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>

                  <TouchableOpacity style={[styles.addImageButton]} onPress={pickImage}>
                    <Ionicons name="add-circle-outline" size={28} color={isDarkMode ? colors.primary : colors.primary} />
                  </TouchableOpacity>

                  {portfolioImages.length > 0 && (
                    <Text style={[styles.deleteHintText, { color: colors.primary }]}>
                      Long press an image to delete it
                    </Text>
                  )}
                </View>

                {/* Buttons */}
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity style={[styles.updateButton, { backgroundColor: colors.primary }]} onPress={handleUpdateProfile}>
                    <Text style={[styles.updateButtonText, { color: isDarkMode ? colors.background : colors.buttonText }]}>Update Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.cancelButton, { borderColor: colors.primary }]}
                    onPress={handleCancel}
                  >
                    <Text style={[styles.cancelButtonText, { color: colors.primary }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Image Picker Modal */}
        <Modal
          visible={showImagePickerModal}
          transparent={true}
          animationType="slide"
          onRequestClose={closeImagePickerModal}
        >
          <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay || 'rgba(0, 0, 0, 0.7)' }]}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.primary }]}>Profile Picture Options</Text>
              
              <TouchableOpacity 
                style={styles.modalOption} 
                onPress={takePhotoWithCamera}
              >
                <Ionicons name="camera" size={24} color={colors.primary} />
                <Text style={[styles.modalOptionText, { color: colors.text }]}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalOption} 
                onPress={showProfilePicture}
              >
                <Ionicons name="eye" size={24} color={colors.primary} />
                <Text style={[styles.modalOptionText, { color: colors.text }]}>See Profile Picture</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalOption} 
                onPress={pickImageFromGallery}
              >
                <Ionicons name="images" size={24} color={colors.primary} />
                <Text style={[styles.modalOptionText, { color: colors.text }]}>Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalOption, !profileImage && styles.disabledOption]} 
                onPress={handleDeleteProfilePicture}
                disabled={!profileImage}
              >
                <Ionicons name="trash-outline" size={24} color={profileImage ? colors.error : colors.textMuted} />
                <Text style={[styles.modalOptionText, { color: colors.text }, !profileImage && { color: colors.textMuted }]}>
                  Delete Profile Picture
                </Text>
              </TouchableOpacity>

              {/* Fixed Cancel Button with proper text color */}
              <TouchableOpacity 
                style={[styles.modalCancelButton, { borderColor: colors.border }]} 
                onPress={closeImagePickerModal}
              >
                <Text style={[styles.modalCancelText, { color: colors.primary }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Profile Picture Full Screen Modal */}
        <Modal
          visible={showProfileImageModal}
          transparent={true}
          animationType="fade"
          onRequestClose={closeProfilePictureModal}
        >
          <View style={styles.fullScreenModalOverlay}>
            {/* Fixed Close Button with primary color */}
            <TouchableOpacity 
              style={styles.fullScreenCloseButton}
              onPress={closeProfilePictureModal}
            >
              <Ionicons name="close" size={30} color={colors.primary} />
            </TouchableOpacity>
            
            {profileImage && (
              <Image 
                source={{ uri: profileImage }} 
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
  keyboardAvoid: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  content: { flex: 1, paddingHorizontal: 20 },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: { position: 'absolute', left: 24, top: 50, zIndex: 10 },
  backButtonText: { fontSize: 28, fontWeight: '300' },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 28 },
  
  profileIconContainer: { 
    alignItems: 'center', 
    marginBottom: 20, 
    marginTop: 20 
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  
  form: { width: '100%' },
  subtitle: { 
    fontSize: 14, 
    textAlign: 'center', 
    marginBottom: 32 
  },
  
  infoLabel: { 
    fontSize: 14, 
    marginBottom: 6, 
  },
  input: { 
    borderWidth: 1, 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    fontSize: 16,
    marginBottom: 16,
  },
  errorText: { 
    fontSize: 12, 
    marginTop: 4,
    marginBottom: 16,
  },
  
  // Add Images Section Styles
  addImagesSection: {
    marginBottom: 20,
  },
  addImagesTitle: { 
    fontSize: 14,  
    marginBottom: 15, 
    textAlign: 'left'
  },
  imageGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  imageItem: { 
    width: '48%', 
    aspectRatio: 1, 
    marginBottom: 10 
  },
  gridImage: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 8, 
    borderWidth: 1
  },
  noImagesText: { 
    textAlign: 'center', 
    opacity: 0.7,
    width: '100%',
    paddingVertical: 20,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  addImageText: { 
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
    fontSize: 12, 
    textAlign: 'center', 
    marginTop: 8, 
    opacity: 0.6 
  },
  
  buttonsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 12, 
    marginTop: 10 
  },
  updateButton: { 
    flex: 1, 
    borderRadius: 50, 
    paddingVertical: 16, 
    alignItems: 'center' 
  },
  updateButtonText: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  cancelButton: { 
    flex: 1, 
    borderWidth: 1, 
    borderRadius: 50, 
    paddingVertical: 16, 
    alignItems: 'center' 
  },
  cancelButtonText: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  modalCancelButton: {
    marginTop: 10,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabledOption: {
    opacity: 0.5,
  },
  
  // Full Screen Image Modal Styles
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

export default EditProfileScreen;