import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const MyAccountScreen = ({ navigation, route }) => {
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  // Initial state
  const [userData, setUserData] = useState({
    name: 'Kreideprinz',
    email: 'alberlin@gnail.com',
    skills: 'Proefneater, Witter, Esther',
    joinedDate: 'August 25,2025',
    description: 'Custom teams do not award consecutive additional title, and/or advanced format, including at followout advice in some aligas. Of online ad minimization, user hosting orientation/ultimate finger-in full display or co-commode contract.'
  });

  // Load saved data when component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  // Handle updated data from EditProfile screen
  useEffect(() => {
    if (route.params?.updatedData) {
      const { name, email } = route.params.updatedData;
      
      setUserData(prevData => ({
        ...prevData,
        name: name || prevData.name,
        email: email || prevData.email,
      }));

      // Clear the params to avoid updating again on back navigation
      navigation.setParams({ updatedData: null });
    }
  }, [route.params?.updatedData, navigation]);

  // Load user data from AsyncStorage
  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userProfileData');
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        setUserData(prevData => ({
          ...prevData,
          ...parsedData
        }));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  // Save user data to AsyncStorage
  const saveUserData = async (data) => {
    try {
      await AsyncStorage.setItem('userProfileData', JSON.stringify(data));
    } catch (error) {
      console.log('Error saving user data:', error);
    }
  };

  // Handle edit profile navigation
  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { 
      currentData: userData,
      onGoBack: (updatedData) => {
        if (updatedData) {
          const newUserData = {
            ...userData,
            name: updatedData.name || userData.name,
            email: updatedData.email || userData.email,
          };
          
          // Update state
          setUserData(newUserData);
          
          // Save to persistent storage
          saveUserData(newUserData);
        }
      }
    });
  };

  // Update saveUserData whenever userData changes
  useEffect(() => {
    if (userData.name !== 'Kreideprinz' || userData.email !== 'alberlin@gnail.com') {
      saveUserData(userData);
    }
  }, [userData]);

  if (!fontsLoaded) return null;

  // Sample images data - you can replace with your actual images
  const images = [
    { id: 1, uri: 'https://via.placeholder.com/150x150/FFD700/000000?text=1' },
    { id: 2, uri: 'https://via.placeholder.com/150x150/30204D/FFFFFF?text=2' },
    { id: 3, uri: 'https://via.placeholder.com/150x150/0B005F/FFFFFF?text=3' },
    { id: 4, uri: 'https://via.placeholder.com/150x150/FFD700/000000?text=4' },
    { id: 5, uri: 'https://via.placeholder.com/150x150/30204D/FFFFFF?text=5' },
    { id: 6, uri: 'https://via.placeholder.com/150x150/0B005F/FFFFFF?text=6' },
    { id: 7, uri: 'https://via.placeholder.com/150x150/FFD700/000000?text=7' },
    { id: 8, uri: 'https://via.placeholder.com/150x150/30204D/FFFFFF?text=8' },
  ];

  return (
    <LinearGradient
      colors={['#CFAD01', '#30204D', '#0B005F']}
      locations={[0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Header */}
        <View style={styles.header}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          {/* Centered Title */}
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { fontFamily: 'Milonga' }]}>
              My Account
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            {/* Profile Icon */}
            <View style={styles.profileIconContainer}>
              <Ionicons
                name="person-circle-outline"
                size={120}
                color="#FFD700"
              />
            </View>
            
            {/* Name */}
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{userData.name}</Text>
            </View>
          </View>

          {/* Student Information Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Student Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Contact Information</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Skills</Text>
              <Text style={styles.infoValue}>{userData.skills}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Joined Date</Text>
              <Text style={styles.infoValue}>{userData.joinedDate}</Text>
            </View>

            {/* Edit Profile Button */}
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={handleEditProfile}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Description Container */}
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>
              {userData.description}
            </Text>
          </View>

          {/* Image Grid Container */}
          <View style={styles.imageCard}>
            <Text style={styles.imageGridTitle}>Portfolio</Text>
            <View style={styles.imageGrid}>
              {images.map((image) => (
                <View key={image.id} style={styles.imageItem}>
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.gridImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 50,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 28,
    color: '#FFD700',
    fontWeight: '300',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  profileIconContainer: {
    marginBottom: 15,
  },
  nameContainer: {
    alignItems: 'center',
  },
  nameText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  cardTitle: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoLabel: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  editButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  descriptionText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.8,
  },
  imageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  imageGridTitle: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageItem: {
    width: '48%', // 2 columns with some spacing
    aspectRatio: 1, // Square images
    marginBottom: 10, // 4 rows with spacing
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
});

export default MyAccountScreen;