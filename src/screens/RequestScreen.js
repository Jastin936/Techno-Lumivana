import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const RequestScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [requestAmount, setRequestAmount] = useState('');
  const [offerAmount, setOfferAmount] = useState('');

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={['#CFAD01', '#30204D', '#0B005F']}
      locations={[0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/lumivana.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.logoText, { fontFamily: 'Milonga' }]}>
              Lumivana
            </Text>
          </View>

          {/* Back Button on Upper Right */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Center Logo */}
          <View style={styles.centerLogoContainer}>
            <Image
              source={require('../../assets/lumivana.png')}
              style={styles.centerLogo}
              resizeMode="contain"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('RequestCommission')}
            >
              <Text style={styles.actionButtonText}>Request</Text>
            </TouchableOpacity>

            {/* OR with lines */}
            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => navigation.navigate('OfferCommission')}
            >
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Offer</Text>
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
    color: '#fff',
    fontWeight: '300',
  },
  logo: { width: 50, height: 50, marginRight: 12 },
  logoText: { fontSize: 32, color: '#fff' },
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
    backgroundColor: '#FFD700',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFD700',
    marginTop: 20,
  },
  actionButtonText: { 
    color: '#000', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  secondaryButtonText: {
    color: '#FFD700',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFD700',
    marginHorizontal: 10,
  },
  orText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
});

export default RequestScreen;