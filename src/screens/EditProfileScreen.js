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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const EditProfileScreen = ({ navigation, route }) => {
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailInvalid = formData.email && !emailRegex.test(formData.email);
  const isPasswordInvalid = formData.password && formData.password.length < 6;
  const isConfirmPasswordInvalid =
    formData.password && formData.password !== formData.confirmPassword;

  const handleUpdateProfile = () => {
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

    // Inline errors will show for password & confirm password
    if (isPasswordInvalid || isConfirmPasswordInvalid) return;

    Alert.alert(
      'Update Profile',
      'Are you sure you want to update your profile?',
      [
        {
          text: 'Update',
          onPress: () => {
            const updatedData = {
              name: formData.name,
              email: formData.email,
            };
            if (route.params?.onGoBack) {
              route.params.onGoBack(updatedData);
            }
            Alert.alert('Success', 'Profile updated successfully', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={['#CFAD01', '#30204D', '#0B005F']}
      locations={[0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              {/* Profile Icon */}
              <View style={styles.profileIconContainer}>
                <Ionicons name="person-circle-outline" size={120} color="#FFD700" />
              </View>

              <Text style={styles.title}>Edit Profile</Text>
              <Text style={styles.subtitle}>Update your personal information</Text>

              <View style={styles.form}>
                {/* Name */}
                <Text style={styles.label}>Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="#aaa"
                  value={formData.name}
                  onChangeText={text => handleInputChange('name', text)}
                />

                {/* Email */}
                <Text style={styles.label}>Email:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#aaa"
                  value={formData.email}
                  onChangeText={text => handleInputChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
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
                    value={formData.password}
                    onChangeText={text => handleInputChange('password', text)}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={22}
                      color="#FFD700"
                    />
                  </TouchableOpacity>
                </View>
                {formData.password.length > 0 && isPasswordInvalid && (
                  <Text style={styles.errorText}>Password must be at least 6 characters</Text>
                )}

                {/* Confirm Password */}
                <Text style={styles.label}>Confirm Password:</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.inputPassword}
                    placeholder="Re-enter your password"
                    placeholderTextColor="#aaa"
                    value={formData.confirmPassword}
                    onChangeText={text => handleInputChange('confirmPassword', text)}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons
                      name={showConfirmPassword ? 'eye' : 'eye-off'}
                      size={22}
                      color="#FFD700"
                    />
                  </TouchableOpacity>
                </View>
                {formData.confirmPassword.length > 0 && isConfirmPasswordInvalid && (
                  <Text style={styles.errorText}>Passwords do not match</Text>
                )}

                {/* Buttons */}
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
                    <Text style={styles.updateButtonText}>Update Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardAvoid: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingTop: 60 },
  content: { flex: 1, paddingHorizontal: 24 },
  profileIconContainer: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 4, fontFamily: 'Milonga' },
  subtitle: { fontSize: 14, color: '#ccc', textAlign: 'center', marginBottom: 32 },
  form: { width: '100%' },
  label: { color: '#fff', fontSize: 14, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#FFD700', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, marginBottom: 8, color: '#fff' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#FFD700', borderRadius: 12, marginBottom: 8, paddingHorizontal: 16 },
  inputPassword: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#fff' },
  errorText: { color: '#ff3b30', fontSize: 12, marginBottom: 8 },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 20 },
  updateButton: { flex: 1, backgroundColor: '#FFD700', borderRadius: 50, paddingVertical: 16, alignItems: 'center' },
  updateButtonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  cancelButton: { flex: 1, borderWidth: 1, borderColor: '#FFD700', borderRadius: 50, paddingVertical: 16, alignItems: 'center' },
  cancelButtonText: { color: '#FFD700', fontSize: 16, fontWeight: '600' },
});

export default EditProfileScreen;
