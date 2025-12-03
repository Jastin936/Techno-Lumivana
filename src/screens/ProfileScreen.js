import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const rotateValue = new Animated.Value(0);

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const { isDarkMode, colors, gradients, toggleTheme } = useTheme();
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [userData, setUserData] = useState({
    name: '',
    profileImage: null
  });

  // Continuous rotation loop
  useEffect(() => {
    const startRotation = () => {
      rotateValue.setValue(0);
      Animated.timing(rotateValue, {
        toValue: 10,
        duration: 30000,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          startRotation();
        }, 30000);
      });
    };
    startRotation();
    return () => {
      rotateValue.stopAnimation();
    };
  }, []);

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedLogoStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userProfileData');
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        setUserData(prevData => ({
          ...prevData,
          name: parsedData.name || '',
          profileImage: parsedData.profileImage || null
        }));
      }
      const savedProfileImage = await AsyncStorage.getItem('profileImage');
      if (savedProfileImage) {
        setUserData(prevData => ({
          ...prevData,
          profileImage: savedProfileImage
        }));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });
    return unsubscribe;
  }, [navigation]);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Yes',
          onPress: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'GetStarted' }],
            }),
        },
        { text: 'No', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={isDarkMode ? gradients.background : gradients.main}
      locations={[0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content" // Force dark content for yellow background
          backgroundColor="transparent"
          translucent
        />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Animated.Image
              source={require('../../assets/lumivana.png')}
              style={[styles.logo, animatedLogoStyle]}
              resizeMode="contain"
            />
            {/* FIX: Logo Text to Black for visibility on Yellow */}
            <Text style={[styles.logoText, { fontFamily: 'Milonga', color: '#FFFFFF' }]}>
              Lumivana
            </Text>
          </View>

          {/* Theme Toggle and Back Button */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.themeToggle}
              onPress={toggleTheme}
            >
              {/* FIX: Icon to Black */}
              <Ionicons
                name={isDarkMode ? 'sunny' : 'moon'}
                size={24}
                color={'#ffff'}
              />
            </TouchableOpacity>
            {/* FIX: Back Button to Black */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={[styles.backButtonText, { color: '#FFFFFF' }]}>←</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Profile Icon */}
          <View style={styles.imageContainer}>
            {userData.profileImage ? (
              <Image 
                source={{ uri: userData.profileImage }} 
                style={styles.profileImage} 
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={200}
                color={colors.primary}
              />
            )}
          </View>

          {/* Name */}
          <View style={styles.textContainer}>
            {/* FIX: Name Text to White for visibility on Dark Blue bottom */}
            <Text style={[styles.nameText, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>{userData.name}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('MyAccount')}
            >
              <Text style={[styles.actionButtonText, { color: isDarkMode ? '#000' : '#fff' }]}>My Account</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.primary }]} 
              onPress={handleLogout}
            >
              <Text style={[styles.actionButtonText, { color: isDarkMode ? '#000' : '#fff' }]}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  headerLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeToggle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)', // Slight dark tint for visibility
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: '300',
  },
  logo: { width: 50, height: 50, marginRight: 12 },
  logoText: { fontSize: 32 },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  imageContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    flex: 1 
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  textContainer: { alignItems: 'center', paddingBottom: 100 },
  nameText: { 
    fontSize: 36, 
    fontFamily: 'Milonga', 
    textAlign: 'center',
    lineHeight: 42,
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Added shadow for better readability
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonsContainer: { width: '100%', paddingBottom: 100},
  actionButton: {
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  actionButtonText: { fontSize: 16, fontWeight: '600' },
});

export default ProfileScreen;