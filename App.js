import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/config/firebaseConfig";

// Fonts
import { useFonts, Milonga_400Regular } from '@expo-google-fonts/milonga';

// Auth Screens
import GetStartedScreen from './src/screens/GetStartedScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotPasswordEmailScreen from './src/screens/ForgotPasswordEmailScreen';
import OTPScreen from './src/screens/OTPScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import AgreementFormScreen from './src/screens/AgreementFormScreen';

// Main App Screens
import HomeScreen from './src/screens/HomeScreen';
import ProductInfoScreen from './src/screens/ProductInfo';
import RequestInfoScreen from './src/screens/RequestInfoScreen';
import RecommendedUsersScreen from "./src/screens/RecommendedUsersScreen";
import RecommendedUsersInfoScreen from './src/screens/RecommendedUsersInfoScreen';
import SearchScreen from './src/screens/SearchScreen';
import RequestScreen from './src/screens/RequestScreen';
import RequestCommissionScreen from './src/screens/RequestCommissionScreen';
import OfferCommissionScreen from './src/screens/OfferCommissionScreen';
import CommissionsScreen from './src/screens/CommissionsScreen';
import AcceptedCommissionInfoScreen from './src/screens/AcceptedCommissionInfoScreen';
import ConfirmPaymentScreen from './src/screens/ConfirmPaymentScreen';
import CancelFormScreen from './src/screens/CancelFormScreen';
import FAQsScreen from './src/screens/FAQsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MyAccountScreen from './src/screens/MyAccountScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);

  // Load fonts
  const [fontsLoaded] = useFonts({
    Milonga: Milonga_400Regular,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsub;
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        // LOGGED IN NAVIGATION
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ProductInfo" component={ProductInfoScreen} />
          <Stack.Screen name="RequestInfo" component={RequestInfoScreen} />
          <Stack.Screen name="RecommendedUsersScreen" component={RecommendedUsersScreen} />
          <Stack.Screen name="RecommendedUsersInfo" component={RecommendedUsersInfoScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Request" component={RequestScreen} />
          <Stack.Screen name="RequestCommission" component={RequestCommissionScreen} />
          <Stack.Screen name="OfferCommission" component={OfferCommissionScreen} />
          <Stack.Screen name="Commissions" component={CommissionsScreen} />
          <Stack.Screen name="AcceptedCommissionInfo" component={AcceptedCommissionInfoScreen} />
          <Stack.Screen name="ConfirmPayment" component={ConfirmPaymentScreen} />
          <Stack.Screen name="CancelForm" component={CancelFormScreen} />
          <Stack.Screen name="FAQs" component={FAQsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="MyAccount" component={MyAccountScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </Stack.Navigator>
      ) : (
        // NOT LOGGED IN NAVIGATION
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ForgotPasswordEmail" component={ForgotPasswordEmailScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="AgreementForm" component={AgreementFormScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
