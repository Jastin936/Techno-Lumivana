import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,SafeAreaView,StatusBar,KeyboardAvoidingView,Platform,Image,Alert,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
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

    Alert.alert('Success', 'You have successfully signed in!', [
      { text: 'OK', onPress: () => navigation.navigate('Home') },
    ]);
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailInvalid = email && !emailRegex.test(email);
  const isPasswordInvalid = password && password.length < 6;

  return (
    <LinearGradient
      colors={['#CFAD01', '#30204D', '#0B005F']}
      locations={[0, 0.58, 0.84]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../../assets/lumivana.png')}
                style={styles.logoCircle}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Welcome back! Please enter your details</Text>

            <View style={styles.form}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {isEmailInvalid && <Text style={styles.errorText}>Please enter a valid email address</Text>}

              <Text style={styles.label}>Password:</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#aaa"
                  value={password}
                  onChangeText={setPassword}
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
              {isPasswordInvalid && <Text style={styles.errorText}>Password must be at least 6 characters</Text>}

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => navigation.navigate('ForgotPasswordEmail')}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
    
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.bottomText}>
                <Text style={styles.bottomNormal}>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={styles.bottomLink}>Sign up</Text>
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
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 20 },
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
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#ccc', textAlign: 'center', marginBottom: 32 },
  form: { width: '100%' },
  label: { color: '#fff', fontSize: 14, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 8,
    color: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  inputPassword: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#fff' },
  errorText: { color: '#ff3b30', fontSize: 12, marginBottom: 8 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotPasswordText: { color: '#FFD700', fontSize: 13 },
  signInButton: { backgroundColor: '#FFD700', borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginBottom: 24 },
  signInButtonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#777' },
  dividerText: { marginHorizontal: 10, color: '#fff', fontSize: 14 },
  googleButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#FFD700', borderRadius: 50, paddingVertical: 12, justifyContent: 'center', marginBottom: 30 },
  googleIcon: { width: 20, height: 20, marginRight: 8 },
  googleButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  bottomText: { flexDirection: 'row', justifyContent: 'center' },
  bottomNormal: { color: '#ccc', fontSize: 14 },
  bottomLink: { color: '#FFD700', fontSize: 14, fontWeight: '600' },
});

export default SignInScreen;
