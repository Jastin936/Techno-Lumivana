import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
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

const ResetPasswordScreen = ({ navigation }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordInvalid = password.length > 0 && password.length < 6;
  const isConfirmPasswordInvalid =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleResetPassword = () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both password fields.');
      return;
    }
    if (isPasswordInvalid) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
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
            // FIX: Navigate to Login Screen
            navigation.navigate('SignIn');
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <LinearGradient
      colors={isDarkMode ? gradients.background : gradients.main}
      locations={isDarkMode ? [0, 1] : [0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "light-content"} translucent backgroundColor="transparent" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={[styles.backButtonText, { color: isDarkMode ? colors.primary : '#FFFFFF' }]}>←</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={[styles.title, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Reset Password</Text>
              <Text style={[styles.subtitle, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>Create a new password for your account</Text>

              <View style={styles.form}>
                {/* New Password */}
                <Text style={[styles.label, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>New Password:</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, {
                      borderColor: colors.primary,
                      color: isDarkMode ? colors.text : '#FFFFFF',
                      backgroundColor: isDarkMode ? colors.inputBackground : 'transparent'
                    }]}
                    placeholder="Enter new password"
                    placeholderTextColor={isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                {isPasswordInvalid && (
                  <Text style={[styles.errorText, { color: colors.error }]}>Password must be at least 6 characters</Text>
                )}

                {/* Confirm Password */}
                <Text style={[styles.label, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Confirm Password:</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, {
                      borderColor: colors.primary,
                      color: isDarkMode ? colors.text : '#FFFFFF',
                      backgroundColor: isDarkMode ? colors.inputBackground : 'transparent'
                    }]}
                    placeholder="Confirm new password"
                    placeholderTextColor={isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)'}
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
                    <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={24} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                {isConfirmPasswordInvalid && (
                  <Text style={[styles.errorText, { color: colors.error }]}>Passwords do not match</Text>
                )}

                <TouchableOpacity
                  style={[styles.sendButton, { backgroundColor: colors.primary }]}
                  onPress={handleResetPassword}
                >
                  <Text style={[styles.sendButtonText, { color: isDarkMode ? colors.text : colors.buttonText }]}>Reset Password</Text>
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
  backButtonText: { fontSize: 28, fontWeight: '300' },
  content: { flex: 1, paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 32 },
  form: { width: '100%' },
  label: { fontSize: 14, marginBottom: 6 },
  inputContainer: { position: 'relative', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    paddingRight: 45,
  },
  eyeIcon: { position: 'absolute', right: 12, top: 12 },
  errorText: { fontSize: 12, marginBottom: 8 },
  sendButton: {
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  sendButtonText: { fontSize: 16, fontWeight: '600' },
});

export default ResetPasswordScreen;