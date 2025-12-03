import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const rotateValue = new Animated.Value(0);

// Improved hash function for password (must match SignUpScreen)
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

const SignInScreen = ({ navigation }) => {
  const { isDarkMode, colors, gradients, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Continuous rotation loop (30s rotate, 30s rest)
  useEffect(() => {
    const startRotation = () => {
      // Reset rotation value
      rotateValue.setValue(0);
      
      // Rotate for 30 seconds
      Animated.timing(rotateValue, {
        toValue: 10,
        duration: 30000,
        useNativeDriver: true,
      }).start(() => {
        // After rotation completes, wait 30 seconds then restart
        setTimeout(() => {
          startRotation();
        }, 30000);
      });
    };

    // Start the loop
    startRotation();
    
    // Cleanup function
    return () => {
      rotateValue.stopAnimation();
    };
  }, []);

  // Interpolate rotation value
  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Animated style for logo
  const animatedLogoStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      const saved = await AsyncStorage.getItem('userProfileData');
      if (!saved) {
        Alert.alert('Account not found', 'No account found. Please sign up first.');
        return;
      }

      const parsed = JSON.parse(saved);
      const savedEmail = parsed?.email || '';
      const savedPassword = parsed?.password || '';

      if (savedEmail.toLowerCase() !== email.trim().toLowerCase()) {
        Alert.alert('Account not found', 'No account matches this email. Please sign up first.');
        return;
      }

      // Validate password by comparing hashes
      // Also check plain text for backward compatibility with old accounts
      const hashedPassword = hashPassword(password);
      const isPasswordValid = savedPassword && (
        savedPassword === hashedPassword || 
        savedPassword === password // Backward compatibility for old accounts
      );
      
      if (!isPasswordValid) {
        Alert.alert('Invalid Password', 'The password you entered is incorrect.');
        return;
      }
      
      // If password was stored in plain text, update it to hashed for security
      if (savedPassword === password) {
        try {
          const updatedProfile = { ...parsed, password: hashedPassword };
          await AsyncStorage.setItem('userProfileData', JSON.stringify(updatedProfile));
        } catch (updateError) {
          console.log('Error updating password hash:', updateError);
        }
      }

      // At this stage, an account exists for the provided email. Proceed to Home.
      Alert.alert('Success', 'You have successfully signed in!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (err) {
      console.log('Sign-in storage error:', err);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailInvalid = email && !emailRegex.test(email);
  const isPasswordInvalid = password && password.length < 6;

  return (
    <LinearGradient
      colors={isDarkMode ? gradients.background : gradients.main}
      locations={isDarkMode ? [0, 1] : [0, 0.58, 0.84]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <View style={styles.header}>
            {/* Dark Mode Toggle - Top Right */}
            <TouchableOpacity
              style={[styles.themeToggle, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]}
              onPress={toggleTheme}
            >
              <Ionicons
                name={isDarkMode ? 'sunny' : 'moon'}
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
            <View style={styles.logoCircle}>
              <Animated.Image
                source={require('../../assets/lumivana.png')}
                style={[styles.logoCircle, animatedLogoStyle]}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.content}>
            <Text style={[styles.title, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.9)' }]}>Welcome back! Please enter your details</Text>

            <View style={styles.form}>
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
              />
              {isEmailInvalid && <Text style={styles.errorText}>Please enter a valid email address</Text>}

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
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={22}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
              {isPasswordInvalid && <Text style={styles.errorText}>Password must be at least 6 characters</Text>}

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => navigation.navigate('ForgotPasswordEmail')}
              >
                <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.signInButton, { backgroundColor: colors.primary }]} 
                onPress={handleSignIn}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: isDarkMode ? '#777' : 'rgba(255, 255, 255, 0.3)' }]} />
    
                <View style={[styles.dividerLine, { backgroundColor: isDarkMode ? '#777' : 'rgba(255, 255, 255, 0.3)' }]} />
              </View>

              <View style={styles.bottomText}>
                <Text style={[styles.bottomNormal, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.9)' }]}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={[styles.bottomLink, { color: colors.primary }]}>Sign up</Text>
                </TouchableOpacity>
              </View>
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
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 20, position: 'relative' },
  themeToggle: {
    position: 'absolute',
    top: 60,
    right: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    zIndex: 10,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { flex: 1, paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 32 },
  form: { width: '100%' },
  label: { fontSize: 14, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  inputPassword: { flex: 1, paddingVertical: 14, fontSize: 16 },
  errorText: { color: '#ff3b30', fontSize: 12, marginBottom: 8 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotPasswordText: { fontSize: 13 },
  signInButton: { borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginBottom: 24 },
  signInButtonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 10, fontSize: 14 },
  googleButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 50, paddingVertical: 12, justifyContent: 'center', marginBottom: 30 },
  googleIcon: { width: 20, height: 20, marginRight: 8 },
  googleButtonText: { fontSize: 16, fontWeight: '500' },
  bottomText: { flexDirection: 'row', justifyContent: 'center' },
  bottomNormal: { fontSize: 14 },
  bottomLink: { fontSize: 14, fontWeight: '600' },
});

export default SignInScreen;