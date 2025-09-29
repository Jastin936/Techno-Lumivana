import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const OTPScreen = ({ navigation }) => {
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

    // Show digit briefly
    const newVisible = [...visibleDigits];
    newVisible[index] = true;
    setVisibleDigits(newVisible);

    setTimeout(() => {
      const hideVisible = [...newVisible];
      hideVisible[index] = false;
      setVisibleDigits(hideVisible);
    }, 500); // hide after 500ms

    // Focus next input
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigation.navigate('ResetPassword');
    } catch {
      alert('OTP verification failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <LinearGradient
      colors={['#CFAD01', '#30204D', '#0B005F']}
      locations={[0, 0.58, 0.84]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>OTP Code</Text>
            <Text style={styles.subtitle}>We've sent a 4-digit code to your email</Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputs.current[index] = ref)}
                  style={styles.otpInput}
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
              style={styles.verifyButton}
              onPress={handleVerifyOTP}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.verifyButtonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              {timer > 0 ? (
                <Text style={styles.resendText}>
                  Wait for 00:{timer < 10 ? `0${timer}` : timer}
                </Text>
              ) : (
                <TouchableOpacity onPress={() => setTimer(60)}>
                  <Text style={styles.resendLink}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardAvoid: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 50, paddingBottom: 20 },
  backButtonText: { fontSize: 28, color: '#fff', fontWeight: '300' },
  content: { flex: 1, paddingHorizontal: 24, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#ccc', textAlign: 'center', marginBottom: 32 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginBottom: 40 },
  otpInput: {
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  verifyButton: { backgroundColor: '#FFD700', borderRadius: 50, paddingVertical: 16, alignItems: 'center', width: '100%', marginTop: 10 },
  verifyButtonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  resendContainer: { marginTop: 20 },
  resendText: { color: '#ccc', fontSize: 14 },
  resendLink: { color: '#FFD700', fontSize: 14, fontWeight: '600' },
});

export default OTPScreen;
