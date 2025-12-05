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
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const OTPScreen = ({ navigation }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [displayOtp, setDisplayOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [showDigits, setShowDigits] = useState(false);
  const inputs = useRef([]);

  const generateRandomOTP = () => {
    const newOTP = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOTP(newOTP);
    return newOTP;
  };

  useEffect(() => {
    if (inputs.current[0]) {
      inputs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const toggleShowOTP = () => {
    setShowDigits(true);
    setTimeout(() => {
      setShowDigits(false);
    }, 1000);
  };

  const showOTPForInput = () => {
    const newOTP = generateRandomOTP();
    Alert.alert(
      'Your OTP Code',
      `Your OTP is: **${newOTP}**\n\nEnter this 4-digit code manually in the fields below.`,
      [
        {
          text: 'OK, I\'ll enter it',
          onPress: () => {}
        }
      ]
    );
  };

  const showSMSOTP = () => {
    const newOTP = generateRandomOTP();
    Alert.alert(
      '📱 SMS OTP Received',
      `SMS Message:\n\n"Your verification code is ${newOTP}. Valid for 10 minutes."\n\nEnter this code in the OTP fields.`,
      [
        { text: 'Copy to Clipboard', onPress: () => {} },
        { text: 'Enter Manually', style: 'default' }
      ]
    );
  };

  const showOTPInNotification = () => {
    const newOTP = generateRandomOTP();
    Alert.alert(
      '🔐 OTP Available',
      `Code: ${newOTP}\n\nLook for this code in your email or messages, then enter it below.`,
      [{ text: 'Got it' }]
    );
  };

  const handlePaste = (text) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, 4);
    const newOtp = [...otp];
    const newDisplayOtp = [...displayOtp];
    
    digits.split('').forEach((digit, index) => {
      if (index < 4) {
        newOtp[index] = digit;
        newDisplayOtp[index] = '•';
      }
    });
    
    setOtp(newOtp);
    setDisplayOtp(newDisplayOtp);
    
    const nextIndex = digits.length < 4 ? digits.length : 3;
    if (inputs.current[nextIndex]) {
      inputs.current[nextIndex].focus();
    }
    
    if (digits.length === 4) {
      setTimeout(() => {
        handleVerifyOTP();
      }, 300);
    }
  };

  const handleOtpChange = (value, index) => {
    if (value.length === 4) {
      handlePaste(value);
      return;
    }
    
    const digit = value.replace(/[^0-9]/g, '');
    if (digit === '') {
      const newOtp = [...otp];
      const newDisplayOtp = [...displayOtp];
      newOtp[index] = '';
      newDisplayOtp[index] = '';
      setOtp(newOtp);
      setDisplayOtp(newDisplayOtp);
      return;
    }
    
    const actualDigit = digit.charAt(digit.length - 1);
    const newOtp = [...otp];
    const newDisplayOtp = [...displayOtp];
    newOtp[index] = actualDigit;
    newDisplayOtp[index] = '•';
    setOtp(newOtp);
    setDisplayOtp(newDisplayOtp);
    
    const tempDisplay = [...newDisplayOtp];
    tempDisplay[index] = actualDigit;
    setDisplayOtp(tempDisplay);
    
    setTimeout(() => {
      const hideDisplay = [...tempDisplay];
      hideDisplay[index] = '•';
      setDisplayOtp(hideDisplay);
    }, 300);
    
    if (digit && index < 3) {
      inputs.current[index + 1].focus();
    }
    
    const isComplete = newOtp.every(d => d !== '');
    if (isComplete) {
      setTimeout(() => {
        handleVerifyOTP();
      }, 300);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        const newDisplayOtp = [...displayOtp];
        newOtp[index - 1] = '';
        newDisplayOtp[index - 1] = '';
        setOtp(newOtp);
        setDisplayOtp(newDisplayOtp);
        inputs.current[index - 1].focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        const newDisplayOtp = [...displayOtp];
        newOtp[index] = '';
        newDisplayOtp[index] = '';
        setOtp(newOtp);
        setDisplayOtp(newDisplayOtp);
      }
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.every(digit => digit !== '')) {
      alert('Please complete the 4-digit OTP.');
      return;
    }
    
    const enteredOTP = otp.join('');
    
    if (generatedOTP && enteredOTP !== generatedOTP) {
      Alert.alert(
        'Incorrect OTP',
        'The OTP you entered is incorrect. Please check and try again.',
        [{ text: 'Try Again' }]
      );
      return;
    }
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert(
        '✅ Success!',
        'OTP verified successfully.',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('ResetPassword')
          }
        ]
      );
    } catch {
      Alert.alert('Error', 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearOTP = () => {
    setOtp(['', '', '', '']);
    setDisplayOtp(['', '', '', '']);
    inputs.current[0].focus();
  };

  const getOTPHint = () => {
    if (!generatedOTP) return '';
    return `Hint: Your OTP starts with ${generatedOTP[0]} and ends with ${generatedOTP[3]}`;
  };

  const getDisplayValue = (index) => {
    if (showDigits) {
      return otp[index] || '';
    }
    return displayOtp[index] || '';
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
              <Text style={[styles.title, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>OTP Verification</Text>
              <Text style={[styles.subtitle, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>
                We've sent a 4-digit code to your email/mobile
              </Text>

              <View style={styles.otpOptionsContainer}>
                <TouchableOpacity
                  style={[styles.otpOptionButton, { 
                    backgroundColor: colors.primary + '20',
                    borderColor: colors.primary 
                  }]}
                  onPress={showOTPForInput}
                  disabled={isLoading}
                >
                  <Text style={[styles.otpOptionText, { color: colors.primary }]}>
                    Show My OTP
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.otpOptionButton, { 
                    backgroundColor: colors.secondary + '20',
                    borderColor: colors.secondary 
                  }]}
                  onPress={showSMSOTP}
                  disabled={isLoading}
                >
                  <Text style={[styles.otpOptionText, { color: colors.secondary }]}>
                    Show SMS OTP
                  </Text>
                </TouchableOpacity>
              </View>

              {generatedOTP && (
                <View style={styles.hintContainer}>
                  <Text style={[styles.hintText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>
                    {getOTPHint()}
                  </Text>
                </View>
              )}

              {otp.some(d => d !== '') && (
                <TouchableOpacity 
                  style={styles.showHideButton}
                  onPress={toggleShowOTP}
                  disabled={isLoading}
                >
                  <Text style={[styles.showHideText, { color: colors.primary }]}>
                    👁️ {showDigits ? 'Hiding...' : 'Show OTP briefly'}
                  </Text>
                </TouchableOpacity>
              )}

              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <View key={index} style={styles.otpBox}>
                    <TextInput
                      ref={ref => (inputs.current[index] = ref)}
                      style={[styles.otpInput, {
                        borderColor: digit ? colors.primary : isDarkMode ? colors.border : 'rgba(255,255,255,0.3)',
                        color: isDarkMode ? colors.text : '#FFFFFF',
                        backgroundColor: isDarkMode ? colors.inputBackground : 'rgba(255,255,255,0.1)'
                      }]}
                      value={getDisplayValue(index)}
                      onChangeText={value => handleOtpChange(value, index)}
                      onKeyPress={e => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textContentType="oneTimeCode"
                      autoComplete="sms-otp"
                      textAlign="center"
                      editable={!isLoading}
                      caretHidden={true}
                      secureTextEntry={false}
                      placeholder={index === 0 && !digit ? '0' : ''}
                      placeholderTextColor={isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.3)'}
                    />
                    {digit && (
                      <View style={[styles.dotIndicator, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                ))}
              </View>

              <View style={styles.otpStatusContainer}>
                <Text style={[styles.otpStatusText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>
                  {generatedOTP ? 
                    `Your OTP is generated. Check the alert above.` : 
                    `Click "Show My OTP" to get your verification code.`
                  }
                </Text>
              </View>

              {otp.some(d => d !== '') && (
                <View style={styles.enteredOtpContainer}>
                  <Text style={[styles.enteredOtpLabel, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>
                    You entered:
                  </Text>
                  <Text style={[styles.enteredOtpValue, { color: colors.primary }]}>
                    {showDigits ? otp.join('') : '••••'}
                  </Text>
                </View>
              )}

              <TouchableOpacity 
                onPress={clearOTP} 
                disabled={isLoading || !otp.some(d => d !== '')}
                style={styles.clearButton}
              >
                <Text style={[styles.clearText, { 
                  color: colors.primary,
                  opacity: otp.some(d => d !== '') ? 1 : 0.5
                }]}>
                  Clear All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.verifyButton, { 
                  backgroundColor: colors.primary,
                  opacity: otp.every(d => d !== '') ? 1 : 0.7
                }]}
                onPress={handleVerifyOTP}
                disabled={isLoading || !otp.every(d => d !== '')}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={isDarkMode ? colors.text : colors.buttonText} />
                ) : (
                  <Text style={[styles.verifyButtonText, { color: isDarkMode ? colors.text : colors.buttonText }]}>
                    Verify OTP
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.resendContainer}>
                {timer > 0 ? (
                  <Text style={[styles.resendText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>
                    Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}
                  </Text>
                ) : (
                  <TouchableOpacity onPress={() => {
                    setTimer(60);
                    generateRandomOTP();
                    showOTPInNotification();
                  }}>
                    <Text style={[styles.resendLink, { color: colors.primary }]}>
                      Resend New OTP
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {__DEV__ && generatedOTP && (
                <View style={styles.debugContainer}>
                  <Text style={[styles.debugText, { color: '#666' }]}>
                    [DEV] OTP: {generatedOTP}
                  </Text>
                </View>
              )}
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
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 30 },
  otpOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    gap: 10,
  },
  otpOptionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  hintContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
  },
  hintText: {
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  showHideButton: {
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  showHideText: {
    fontSize: 12,
    fontWeight: '500',
  },
  otpContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '80%', 
    marginBottom: 15,
  },
  otpBox: {
    position: 'relative',
    alignItems: 'center',
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '700',
  },
  dotIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  otpStatusContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  otpStatusText: {
    fontSize: 13,
    textAlign: 'center',
  },
  enteredOtpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  enteredOtpLabel: {
    fontSize: 14,
  },
  enteredOtpValue: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  clearButton: {
    marginBottom: 20,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '500',
  },
  verifyButton: { 
    borderRadius: 50, 
    paddingVertical: 16, 
    alignItems: 'center', 
    width: '100%', 
    marginTop: 10 
  },
  verifyButtonText: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  resendContainer: { 
    marginTop: 20,
    marginBottom: 10,
  },
  resendText: { 
    fontSize: 14 
  },
  resendLink: { 
    fontSize: 14, 
    fontWeight: '600' 
  },
  debugContainer: {
    marginTop: 20,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

export default OTPScreen;
