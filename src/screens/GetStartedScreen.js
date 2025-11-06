import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Animated,
} from 'react-native';

// Gradient background
import { LinearGradient } from 'expo-linear-gradient';

// Import Google Font hook
import { useFonts } from 'expo-font';

const rotateValue = new Animated.Value(0);

const { width, height } = Dimensions.get('window');

const GetStartedScreen = ({ navigation }) => {
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
      colors={['#CFAD01', '#30204D', '#0B005F']}
      locations={[0, 0.58, 0.84]} // match your Figma stops
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

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
            <Text style={styles.title}>Lumivana</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.getStartedButton}
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
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
    color: '#fff', // white text looks better on dark bg
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

   // border
    borderWidth: 2,
    borderColor: '#CFAD01',         // yellow border like your gradient
  },
  getStartedButtonText: {
    color: '#fff',
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
    color: '#eee',
    textAlign: 'center',
    lineHeight: 16,
  },
  link: {
    color: '#FFD700',
    fontWeight: '500',
  },
});

export default GetStartedScreen;