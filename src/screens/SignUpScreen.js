import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SignUpScreen = ({ navigation }) => {
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
      await new Promise(resolve => setTimeout(resolve, 2000));
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
      colors={['#CFAD01', '#30204D', '#0B005F']}
      locations={[0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Please complete all information to create {'\n'} your account on Lumivana
              </Text>

              {/* Form */}
              <View style={styles.form}>
                {/* Name */}
                <Text style={styles.label}>Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="#aaa"
                  value={fullName}
                  onChangeText={setFullName}
                  editable={!isLoading}
                />

                {/* Email */}
                <Text style={styles.label}>Email:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#aaa"
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
                <Text style={styles.label}>Password:</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.inputPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#aaa"
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
                      color="#FFD700"
                    />
                  </TouchableOpacity>
                </View>
                {isPasswordInvalid && (
                  <Text style={styles.errorText}>Password must be at least 6 characters</Text>
                )}

                {/* Confirm Password */}
                <Text style={styles.label}>Confirm Password:</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.inputPassword}
                    placeholder="Re-enter your password"
                    placeholderTextColor="#aaa"
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
                      color="#FFD700"
                    />
                  </TouchableOpacity>
                </View>
                {isConfirmPasswordInvalid && (
                  <Text style={styles.errorText}>Passwords do not match</Text>
                )}

                {/* COR Photos Section - Same as EditProfileScreen's Add Images */}
                <View style={styles.addImagesSection}>
                  <Text style={styles.addImagesTitle}>Photo of COR:</Text>
                 
                  
                  <View style={styles.imageGrid}>
                    {corPhotos.length === 0 ? (
                      <Text style={styles.noImagesText}>
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
                    <Ionicons name="add-circle-outline" size={28} color="#FFD700" />
                  </TouchableOpacity>

                  {corPhotos.length > 0 && (
                    <Text style={styles.deleteHintText}>
                      Long press an image to delete it
                    </Text>
                  )}
                </View>

                {/* Create Account Button */}
                <TouchableOpacity
                  style={[styles.createAccountButton, isLoading && styles.buttonDisabled]}
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
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#ccc', textAlign: 'center', marginBottom: 32 },

  form: { width: '100%' },
  label: { color: '#fff', fontSize: 14, marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputPassword: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#fff' },

  errorText: { color: '#ff6b6b', fontSize: 14, marginBottom: 10 },

  // COR Photos Section - Same as EditProfileScreen's Add Images
  addImagesSection: {
    marginBottom: 20,
  },
  addImagesTitle: { 
    fontSize: 14, 
    color: '#fff',  
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
    color: '#FFD700', 
    textAlign: 'center', 
    opacity: 0.7,
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
    color: '#FFD700', 
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