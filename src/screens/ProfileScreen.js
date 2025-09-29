import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [userData, setUserData] = useState({
    name: 'Lumivana Vivistera'
  });

  // Load saved data when component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  // Load user data from AsyncStorage
  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userProfileData');
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        if (parsedData.name) {
          setUserData(prevData => ({
            ...prevData,
            name: parsedData.name
          }));
        }
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  // Set up focus listener to refresh data when screen comes into focus
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
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Profile Icon */}
          <View style={styles.imageContainer}>
            <Ionicons
              name="person-circle-outline"
              size={200}
              color="#FFD700"
            />
          </View>

          {/* Name */}
          <View style={styles.textContainer}>
            <Text style={styles.nameText}>{userData.name}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('MyAccount')}
            >
              <Text style={styles.actionButtonText}>My Account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
              <Text style={styles.actionButtonText}>Log Out</Text>
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
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  imageContainer: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  textContainer: { alignItems: 'center', paddingBottom: 100 },
  nameText: { 
    fontSize: 36, 
    color: '#fff', 
    fontFamily: 'Milonga', 
    textAlign: 'center',
    lineHeight: 42 
  },
  buttonsContainer: { width: '100%', paddingBottom: 100},
  actionButton: {
    backgroundColor: '#FFD700',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  actionButtonText: { color: '#000', fontSize: 16, fontWeight: '600' },
});

export default ProfileScreen;