import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// Import font hook
import { Milonga_400Regular, useFonts } from '@expo-google-fonts/milonga';

// ✅ IMPORT THEME PROVIDER
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Import Screens
import AcceptedCommissionInfoScreen from './src/screens/AcceptedCommissionInfoScreen';
import AgreementFormScreen from './src/screens/AgreementFormScreen';
import CancelFormScreen from './src/screens/CancelFormScreen';
import CommissionsScreen from './src/screens/CommissionsScreen';
import ConfirmPaymentScreen from './src/screens/ConfirmPaymentScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import FAQsScreen from './src/screens/FAQsScreen';
import ForgotPasswordEmailScreen from './src/screens/ForgotPasswordEmailScreen';
import GetStartedScreen from './src/screens/GetStartedScreen';
import HomeScreen from './src/screens/HomeScreen';
import MyAccountScreen from './src/screens/MyAccountScreen';
import OfferCommissionScreen from './src/screens/OfferCommissionScreen';
import OTPScreen from './src/screens/OTPScreen';
import ProductInfoScreen from './src/screens/ProductInfo';
import ProfileScreen from './src/screens/ProfileScreen';
import RecommendedScreen from "./src/screens/RecommendedScreen";
import RecommendedUsersInfoScreen from "./src/screens/RecommendedUsersInfoScreen";
import RecommendedUsersScreen from "./src/screens/RecommendedUsersScreen";
import RequestCommissionScreen from './src/screens/RequestCommissionScreen';
import RequestInfoScreen from './src/screens/RequestInfoScreen';
import RequestScreen from './src/screens/RequestScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import SearchScreen from './src/screens/SearchScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="GetStarted"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RecommendedScreen" component={RecommendedScreen} />
        <Stack.Screen name="RecommendedUsersScreen" component={RecommendedUsersScreen} />
        
        {/* FIX: Changed name to "RecommendedUsersInfoScreen" to match your navigation call */}
        <Stack.Screen name="RecommendedUsersInfoScreen" component={RecommendedUsersInfoScreen} />
        
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
        
        {/* Action Screens */}
        <Stack.Screen name="RequestInfo" component={RequestInfoScreen} />
        <Stack.Screen name="AgreementForm" component={AgreementFormScreen} />
        <Stack.Screen name="ConfirmPayment" component={ConfirmPaymentScreen} />
        <Stack.Screen name="CancelForm" component={CancelFormScreen} />
        <Stack.Screen name="ProductInfo" component={ProductInfoScreen} />
        <Stack.Screen name="AcceptedCommissionInfo" component={AcceptedCommissionInfoScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const App = () => {
  // Load Google Font
  const [fontsLoaded] = useFonts({
    Milonga: Milonga_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    // ✅ CRITICAL FIX: ThemeProvider MUST wrap everything here
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
};

export default App;