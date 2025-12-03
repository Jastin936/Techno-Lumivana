import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
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

// Improved hash function for password (reduces collisions by using salt and better algorithm)
const hashPassword = (password) => {
  // Add a simple salt based on password length to reduce collisions
  const salt = password.length.toString();
  let hash = 0;
  const combined = password + salt;
  
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Add password length and first/last chars to hash to further reduce collisions
  const firstChar = password.length > 0 ? password.charCodeAt(0) : 0;
  const lastChar = password.length > 0 ? password.charCodeAt(password.length - 1) : 0;
  hash = ((hash << 3) - hash) + firstChar + lastChar;
  
  return Math.abs(hash).toString(16) + password.length.toString(16);
};

const SignUpScreen = ({ navigation }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [corPhotos, setCorPhotos] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailInvalid = email && !emailRegex.test(email);
  const isPasswordInvalid = password && password.length < 6;
  const isConfirmPasswordInvalid = confirmPassword && password !== confirmPassword;

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }
    if (corPhotos.length === 0) {
      Alert.alert('Error', 'Please upload at least one COR photo');
      return false;
    }
    return true;
  };

  // Pick COR photo from gallery
  const pickCorPhoto = async () => {
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
      setCorPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  // Delete COR photo
  const deleteCorPhoto = (index) => {
    Alert.alert(
      'Delete COR Photo',
      'Are you sure you want to remove this COR photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCorPhotos((prev) => prev.filter((_, i) => i !== index));
            
            // Close modal if the deleted image was currently selected
            if (selectedImageIndex === index) {
              setShowImageModal(false);
              setSelectedImageIndex(null);
            }
          },
        },
      ]
    );
  };

  // View COR photo in full screen
  const viewCorPhoto = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  // Close image modal
  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImageIndex(null);
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    if (isEmailInvalid || isPasswordInvalid || isConfirmPasswordInvalid) return;

    setIsLoading(true);
    try {
      // Check if email already exists
      const existingData = await AsyncStorage.getItem('userProfileData');
      if (existingData) {
        const parsed = JSON.parse(existingData);
        if (parsed.email && parsed.email.toLowerCase() === email.trim().toLowerCase()) {
          Alert.alert('Account Exists', 'An account with this email already exists. Please sign in instead.');
          setIsLoading(false);
          return;
        }
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      // Persist user profile data so MyAccountScreen can load it
      try {
        const userProfile = {
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password: hashPassword(password), // Hash password before storing
          skills: [],
          joinedDate: new Date().toISOString(),
          description: '',
        };

        await AsyncStorage.setItem('userProfileData', JSON.stringify(userProfile));

        // Save first COR photo as profileImage and all COR photos as portfolio
        if (corPhotos && corPhotos.length > 0) {
          await AsyncStorage.setItem('profileImage', corPhotos[0]);
          await AsyncStorage.setItem('portfolioImages', JSON.stringify(corPhotos));
        }
      } catch (storageError) {
        console.log('Error saving signup data to storage:', storageError);
      }

      Alert.alert('Success!', 'Your account has been created successfully.', [
        { text: 'OK', onPress: () => navigation.navigate('SignIn') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={isDarkMode ? gradients.background : gradients.main}
      locations={isDarkMode ? [0, 1] : [0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                disabled={isLoading}
              >
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={[styles.title, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Create Account</Text>
              <Text style={[styles.subtitle, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.9)' }]}>
                Please complete all information to create {'\n'} your account on Lumivana
              </Text>

              {/* Form */}
              <View style={styles.form}>
                {/* Name */}
                <Text style={[styles.label, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Name:</Text>
                <TextInput
                  style={[styles.input, { 
                    borderColor: colors.inputBorder || colors.primary, 
                    color: colors.inputText || colors.text,
                    backgroundColor: colors.inputBackground || colors.surface 
                  }]}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.inputPlaceholder || colors.textMuted}
                  value={fullName}
                  onChangeText={setFullName}
                  editable={!isLoading}
                />

                {/* Email */}
                <Text style={[styles.label, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Email:</Text>
                <TextInput
                  style={[styles.input, { 
                    borderColor: colors.inputBorder || colors.primary, 
                    color: colors.inputText || colors.text,
                    backgroundColor: colors.inputBackground || colors.surface 
                  }]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.inputPlaceholder || colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                  autoComplete="email"
                />
                {isEmailInvalid && (
                  <Text style={styles.errorText}>Please enter a valid email address</Text>
                )}

                {/* Password */}
                <Text style={[styles.label, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Password:</Text>
                <View style={[styles.passwordContainer, { 
                  borderColor: colors.inputBorder || colors.primary,
                  backgroundColor: colors.inputBackground || colors.surface 
                }]}>
                  <TextInput
                    style={[styles.inputPassword, { color: colors.inputText || colors.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.inputPlaceholder || colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={22}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                {isPasswordInvalid && (
                  <Text style={styles.errorText}>Password must be at least 6 characters</Text>
                )}

                {/* Confirm Password */}
                <Text style={[styles.label, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Confirm Password:</Text>
                <View style={[styles.passwordContainer, { 
                  borderColor: colors.inputBorder || colors.primary,
                  backgroundColor: colors.inputBackground || colors.surface 
                }]}>
                  <TextInput
                    style={[styles.inputPassword, { color: colors.inputText || colors.text }]}
                    placeholder="Re-enter your password"
                    placeholderTextColor={colors.inputPlaceholder || colors.textMuted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    editable={!isLoading}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons
                      name={showConfirmPassword ? 'eye' : 'eye-off'}
                      size={22}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                {isConfirmPasswordInvalid && (
                  <Text style={styles.errorText}>Passwords do not match</Text>
                )}

                {/* COR Photos Section - Same as EditProfileScreen's Add Images */}
                <View style={styles.addImagesSection}>
                  <Text style={[styles.addImagesTitle, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Photo of COR:</Text>
                 
                  
                  <View style={styles.imageGrid}>
                    {corPhotos.length === 0 ? (
                      <Text style={[styles.noImagesText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.8)' }]}>
                        No COR photos yet. Add one below!
                      </Text>
                    ) : (
                      corPhotos.map((uri, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.imageItem}
                          onPress={() => viewCorPhoto(index)}
                          onLongPress={() => deleteCorPhoto(index)}
                        >
                          <Image source={{ uri }} style={styles.gridImage} resizeMode="cover" />
                          <View style={styles.deleteOverlay}>
                            <Ionicons name="trash-outline" size={18} color="#fff" />
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>

                  <TouchableOpacity style={styles.addImageButton} onPress={pickCorPhoto}>
                    <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
                  </TouchableOpacity>

                  {corPhotos.length > 0 && (
                    <Text style={[styles.deleteHintText, { color: isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)' }]}>
                      Long press an image to delete it
                    </Text>
                  )}
                </View>

                {/* Create Account Button */}
                <TouchableOpacity
                  style={[
                    styles.createAccountButton, 
                    { backgroundColor: colors.primary },
                    isLoading && styles.buttonDisabled
                  ]}
                  onPress={handleSignUp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#000" size="small" />
                  ) : (
                    <Text style={styles.createAccountButtonText}>Create Account</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* COR Photo Full Screen Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View style={styles.fullScreenModalOverlay}>
          <TouchableOpacity 
            style={styles.fullScreenCloseButton}
            onPress={closeImageModal}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          
          {selectedImageIndex !== null && corPhotos[selectedImageIndex] && (
            <Image 
              source={{ uri: corPhotos[selectedImageIndex] }} 
              style={styles.fullScreenImage} 
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardAvoid: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  header: { paddingHorizontal: 24, paddingTop: 50, paddingBottom: 20 },
  backButtonText: { fontSize: 28, color: '#fff', fontWeight: '300' },

  content: { flex: 1, paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 32 },

  form: { width: '100%' },
  label: { fontSize: 14, marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  inputPassword: { flex: 1, paddingVertical: 14, fontSize: 16 },

  errorText: { color: '#ff6b6b', fontSize: 14, marginBottom: 10 },

  // COR Photos Section - Same as EditProfileScreen's Add Images
  addImagesSection: {
    marginBottom: 20,
  },
  addImagesTitle: { 
    fontSize: 14,  
    marginBottom: 8, 
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
    textAlign: 'center', 
    width: '100%',
    paddingVertical: 20,
  },
  // Add Image Button - Same as EditProfileScreen
  addImageButton: {
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
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

  createAccountButton: {
    backgroundColor: '#FFD700',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: 'rgba(255, 215, 0, 0.5)' },
  createAccountButtonText: { color: '#000', fontSize: 16, fontWeight: '600' },

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

export default SignUpScreen;