import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
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

const OTPScreen = ({ navigation }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [visibleDigits, setVisibleDigits] = useState([false, false, false, false]);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const newVisible = [...visibleDigits];
    newVisible[index] = true;
    setVisibleDigits(newVisible);

    setTimeout(() => {
      const hideVisible = [...newVisible];
      hideVisible[index] = false;
      setVisibleDigits(hideVisible);
    }, 500);

    if (value && index < 3) inputs.current[index + 1].focus();
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.every(digit => digit !== '')) {
      alert('Please complete the 4-digit OTP.');
      return;
    }
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // FIX: Changed from replace to navigate to fix navigation issue
      navigation.navigate('ResetPassword');
    } catch {
      alert('OTP verification failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={isDarkMode ? gradients.background : gradients.main}
      locations={isDarkMode ? [0, 1] : [0, 0.58, 0.84]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "light-content"} translucent backgroundColor="transparent" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
                <Text style={[styles.backButtonText, { color: isDarkMode ? colors.primary : '#FFFFFF' }]}>←</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={[styles.title, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>OTP Code</Text>
              <Text style={[styles.subtitle, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>We've sent a 4-digit code to your email</Text>

              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => (inputs.current[index] = ref)}
                    style={[styles.otpInput, {
                      borderColor: colors.primary,
                      color: isDarkMode ? colors.text : '#FFFFFF',
                      backgroundColor: isDarkMode ? colors.inputBackground : 'rgba(255,255,255,0.1)'
                    }]}
                    value={digit}
                    onChangeText={value => handleOtpChange(value, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    secureTextEntry={!visibleDigits[index]}
                    maxLength={1}
                    textAlign="center"
                    editable={!isLoading}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[styles.verifyButton, { backgroundColor: colors.primary }]}
                onPress={handleVerifyOTP}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={isDarkMode ? colors.text : colors.buttonText} />
                ) : (
                  <Text style={[styles.verifyButtonText, { color: isDarkMode ? colors.text : colors.buttonText }]}>Verify OTP</Text>
                )}
              </TouchableOpacity>

              <View style={styles.resendContainer}>
                {timer > 0 ? (
                  <Text style={[styles.resendText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>
                    Wait for 00:{timer < 10 ? `0${timer}` : timer}
                  </Text>
                ) : (
                  <TouchableOpacity onPress={() => setTimer(60)}>
                    <Text style={[styles.resendLink, { color: colors.primary }]}>Resend Code</Text>
                  </TouchableOpacity>
                )}
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
  scrollContent: { flexGrow: 1 },
  header: { paddingHorizontal: 24, paddingTop: 50, paddingBottom: 20 },
  backButtonText: { fontSize: 28, fontWeight: '300' },
  content: { flex: 1, paddingHorizontal: 24, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 32 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginBottom: 40 },
  otpInput: {
    width: 55,
    height: 55,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '600',
  },
  verifyButton: { borderRadius: 50, paddingVertical: 16, alignItems: 'center', width: '100%', marginTop: 10 },
  verifyButtonText: { fontSize: 16, fontWeight: '600' },
  resendContainer: { marginTop: 20 },
  resendText: { fontSize: 14 },
  resendLink: { fontSize: 14, fontWeight: '600' },
});

export default OTPScreen;
