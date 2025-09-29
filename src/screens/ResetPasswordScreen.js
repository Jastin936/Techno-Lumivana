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

const ResetPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordInvalid = password.length > 0 && password.length < 6;
  const isConfirmPasswordInvalid =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleResetPassword = () => {
    // Alert if fields are empty
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both password fields.');
      return;
    }
    // Alert if password is invalid
    if (isPasswordInvalid) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    // Alert if passwords do not match
    if (isConfirmPasswordInvalid) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    Alert.alert(
      'Success',
      'Your password has been reset successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            setPassword('');
            setConfirmPassword('');
            navigation.navigate('SignIn');
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <LinearGradient
      colors={['#CFAD01', '#30204D', '#0B005F']}
      locations={[0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>Create a new password for your account</Text>

              <View style={styles.form}>
                {/* New Password */}
                <Text style={styles.label}>New Password:</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter new password"
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#FFD700" />
                  </TouchableOpacity>
                </View>
                {isPasswordInvalid && (
                  <Text style={styles.errorText}>Password must be at least 6 characters</Text>
                )}

                {/* Confirm Password */}
                <Text style={styles.label}>Confirm Password:</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm new password"
                    placeholderTextColor="#aaa"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={24} color="#FFD700" />
                  </TouchableOpacity>
                </View>
                {isConfirmPasswordInvalid && (
                  <Text style={styles.errorText}>Passwords do not match</Text>
                )}

                {/* Reset Button */}
                <TouchableOpacity
                  style={styles.sendButton} // always gold
                  onPress={handleResetPassword} // keeps Alert
                >
                  <Text style={styles.sendButtonText}>Reset Password</Text>
                </TouchableOpacity>
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
  safeArea: { flex: 1 },
  keyboardAvoid: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 20, paddingTop: 50 },

  header: { paddingHorizontal: 24, paddingBottom: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { fontSize: 28, color: '#fff', fontWeight: '300' },

  content: { flex: 1, paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#ccc', textAlign: 'center', marginBottom: 32 },

  form: { width: '100%' },
  label: { color: '#fff', fontSize: 14, marginBottom: 6 },

  inputContainer: { position: 'relative', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
    paddingRight: 45,
  },
  eyeIcon: { position: 'absolute', right: 12, top: 12 },

  errorText: { color: '#ff3b30', fontSize: 12, marginBottom: 8 },

  sendButton: {
    backgroundColor: '#FFD700', // always gold
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  sendButtonText: { color: '#000', fontSize: 16, fontWeight: '600' },
});

export default ResetPasswordScreen;
