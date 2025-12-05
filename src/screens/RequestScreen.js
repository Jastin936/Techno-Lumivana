import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
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
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

// MOVE rotateValue OUTSIDE THE COMPONENT
const rotateValue = new Animated.Value(0);

const RequestScreen = ({ navigation }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [requestAmount, setRequestAmount] = useState('');
  const [offerAmount, setOfferAmount] = useState('');

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

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={isDarkMode ? gradients.background : gradients.main}
      locations={isDarkMode ? [0, 1] : [0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
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
            <Text style={[styles.logoText, { fontFamily: 'Milonga', color: isDarkMode ? colors.text : '#FFFFFF' }]}>
              Lumivana
            </Text>
          </View>

          {/* Back Button on Upper Right */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={[styles.backButtonText, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Center Logo */}
          <View style={styles.centerLogoContainer}>
            <Animated.Image
              source={require('../../assets/lumivana.png')}
              style={[styles.centerLogo, animatedLogoStyle]}
              resizeMode="contain"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('RequestCommission')}
            >
              <Text style={[styles.actionButtonText, { color: isDarkMode ? colors.text : "#FFFFFF" }]}>Request</Text>
            </TouchableOpacity>

            {/* OR with lines */}
            <View style={styles.orContainer}>
              <View style={[styles.line, { backgroundColor: colors.primary }]} />
              <Text style={[styles.orText, { color: isDarkMode ? colors.primary : '#FFFFFF' }]}>or</Text>
              <View style={[styles.line, { backgroundColor: colors.primary }]} />
            </View>

            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton, { borderColor: colors.primary }]}
              onPress={() => navigation.navigate('OfferCommission')}
            >
              <Text style={[styles.actionButtonText, styles.secondaryButtonText, { color: isDarkMode ? colors.primary : '#FFFFFF' }]}>Offer</Text>
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
  content: { 
    flex: 1, 
    paddingHorizontal: 24, 
    justifyContent: 'space-between',
  },
  centerLogoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLogo: {
    width: 150,
    height: 150,
  },
  buttonsContainer: { 
    width: '100%',
    paddingBottom: 200,
  },
  actionButton: {
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    marginTop: 20,
  },
  actionButtonText: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  secondaryButtonText: {
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    marginHorizontal: 10,
  },
  orText: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
});

export default RequestScreen;