import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';

// Gradient background
import { LinearGradient } from 'expo-linear-gradient';

// Import Google Font hook
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

const GetStartedScreen = ({ navigation }) => {
  // Load font
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

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
              <Image
                source={require('../../assets/lumivana.png')}
                style={styles.illustrationImage}
                resizeMode="contain"
              />
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
