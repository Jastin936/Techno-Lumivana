import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Gradient background
import { LinearGradient } from 'expo-linear-gradient';

// Import Google Font hook
import { useFonts } from 'expo-font';
import { useTheme } from '../context/ThemeContext';

const rotateValue = new Animated.Value(0);

const { width, height } = Dimensions.get('window');

const GetStartedScreen = ({ navigation }) => {
  const { isDarkMode, colors, gradients, toggleTheme } = useTheme();
  // Load font
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  // Rotate animation function
  const rotateLogo = () => {
    // Reset rotation value
    rotateValue.setValue(0);
    
    // Create rotation animation
    Animated.timing(rotateValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  // Continuous rotation loop (30s rotate, 30s rest)
  const startContinuousRotation = () => {
    const startRotation = () => {
      // Reset rotation value
      rotateValue.setValue(0);
      
      // Rotate for 30 seconds (30000ms)
      Animated.timing(rotateValue, {
        toValue: 10,
        duration: 30000, // 30 seconds
        useNativeDriver: true,
      }).start(() => {
        // After rotation completes, wait 30 seconds then restart
        setTimeout(() => {
          startRotation();
        }, 30000); // 30 seconds rest
      });
    };

    // Start the loop
    startRotation();
  };

  // Interpolate rotation value
  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Animated style for logo
  const animatedLogoStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  // Start continuous rotation when component mounts
  useEffect(() => {
    startContinuousRotation();
    
    // Cleanup function to stop animations when component unmounts
    return () => {
      rotateValue.stopAnimation();
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={isDarkMode ? gradients.background : gradients.main}
      locations={isDarkMode ? [0, 1] : [0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "light-content"} backgroundColor="transparent" translucent />

        {/* Dark Mode Toggle - Top Right */}
        <View style={styles.header}>
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
        </View>

        {/* Main Content */}
        <View style={styles.content}>

          {/* Illustration/Image Section */}
          <View style={styles.imageContainer}>
            <View style={styles.illustration}>
              <TouchableOpacity onPress={rotateLogo} style={styles.logoButton}>
                <Animated.Image
                  source={require('../../assets/lumivana.png')}
                  style={[styles.illustrationImage, animatedLogoStyle]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Lumivana</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.getStartedButton, { borderColor: colors.primary }]}
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={[styles.getStartedButtonText, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.8)' }]}>
            By continuing, you agree to our{' '}
            <Text style={[styles.link, { color: colors.primary }]}>Terms of Service</Text> and{' '}
            <Text style={[styles.link, { color: colors.primary }]}>Privacy Policy</Text>
          </Text>
        </View>
      </SafeAreaView>
      </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    alignItems: 'flex-end',
  },
  themeToggle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    maxHeight: height * 0.3,
  },
  illustration: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 200,
  },
  illustrationImage: {
    width: 200,
    height: 200,
  },
  textContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 64,
    textAlign: 'center',
    fontFamily: 'Milonga',
  },
  buttonsContainer: {
    paddingBottom: 30,
  },
  getStartedButton: {
    backgroundColor: 'transparent',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  getStartedButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 20,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  link: {
    fontWeight: '500',
  },
});

export default GetStartedScreen;