import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import font hook
import { useFonts, Milonga_400Regular } from '@expo-google-fonts/milonga';

// Screens
import GetStartedScreen from './src/screens/GetStartedScreen';
import SignInScreen from './src/screens/SignInScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import RequestScreen from './src/screens/RequestScreen';
import RequestCommissionScreen from './src/screens/RequestCommissionScreen';
import OfferCommissionScreen from './src/screens/OfferCommissionScreen';
import CommissionsScreen from './src/screens/CommissionsScreen';
import FAQsScreen from './src/screens/FAQsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MyAccountScreen from './src/screens/MyAccountScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotPasswordEmailScreen from './src/screens/ForgotPasswordEmailScreen';
import OTPScreen from './src/screens/OTPScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';

const Stack = createStackNavigator();

const App = () => {
  // Load Google Font
  const [fontsLoaded] = useFonts({
    Milonga: Milonga_400Regular, // 👈 assign a custom key
  });

  if (!fontsLoaded) {
    // Show a spinner while font loads
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="GetStarted"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#ffffff' },
        }}
      >
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Request" component={RequestScreen} />
        <Stack.Screen name="RequestCommission" component={RequestCommissionScreen} />
        <Stack.Screen name="OfferCommission" component={OfferCommissionScreen} />
        <Stack.Screen name="Commissions" component={CommissionsScreen} />
        <Stack.Screen name="FAQs" component={FAQsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="MyAccount" component={MyAccountScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPasswordEmail" component={ForgotPasswordEmailScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
