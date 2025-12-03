import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
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

const ForgotPasswordEmailScreen = ({ navigation }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (input) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(input);
  };

  const isEmailInvalid = email && !validateEmail(email);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    if (isEmailInvalid) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert('Success', 'OTP has been sent to your email.', [
        { text: 'OK', onPress: () => navigation.navigate('OTP') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
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
        <StatusBar barStyle={isDarkMode ? "light-content" : "light-content"} backgroundColor="transparent" translucent />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                disabled={isLoading}
              >
                <Text style={[styles.backButtonText, { color: isDarkMode ? colors.primary : '#FFFFFF' }]}>←</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={[styles.title, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Forgot Password</Text>
              <Text style={[styles.subtitle, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>
                Enter your email address to send the OTP code
              </Text>

              {/* Form */}
              <View style={styles.form}>
                <Text style={[styles.label, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Email:</Text>
                <TextInput
                  style={[styles.input, {
                    borderColor: colors.primary,
                    color: isDarkMode ? colors.text : '#FFFFFF',
                    backgroundColor: isDarkMode ? colors.inputBackground : 'transparent'
                  }]}
                  placeholder="Enter your email"
                  placeholderTextColor={isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)'}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!isLoading}
                />
                {isEmailInvalid && (
                  <Text style={[styles.errorText, { color: colors.error }]}>Please enter a valid email address</Text>
                )}

                {/* Send OTP Button */}
                <TouchableOpacity
                  style={[styles.sendButton, { backgroundColor: colors.primary }]}
                  onPress={handleSendOTP}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={isDarkMode ? colors.text : colors.buttonText} size="small" />
                  ) : (
                    <Text style={[styles.sendButtonText, { color: isDarkMode ? colors.text : colors.buttonText }]}>Submit</Text>
                  )}
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
  scrollContent: { flexGrow: 1, paddingBottom: 20 },

  header: { paddingHorizontal: 24, paddingTop: 50, paddingBottom: 20 },
  backButtonText: { fontSize: 28, fontWeight: '300' },

  content: { flex: 1, paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 32, lineHeight: 20 },

  form: { width: '100%' },
  label: { fontSize: 14, marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: { fontSize: 14, marginBottom: 16 },

  sendButton: {
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  sendButtonText: { fontSize: 16, fontWeight: '600' },
});

export default ForgotPasswordEmailScreen;