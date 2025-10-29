import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const MyAccountScreen = ({ navigation, route }) => {
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [userData, setUserData] = useState({
    name: 'Kreideprinz',
    email: 'alberlin@gnail.com',
    skills: 'Proefneater, Witter, Esther',
    joinedDate: 'August 25, 2025',
    description:
      'Custom teams do not award consecutive additional title, and/or advanced format, including at followout advice in some aligas.',
  });

  const [portfolioImages, setPortfolioImages] = useState([]);

  // Load user profile and portfolio
  useEffect(() => {
    loadUserData();
    loadPortfolioImages();
  }, []);

  // Update data from EditProfile
  useEffect(() => {
    if (route.params?.updatedData) {
      const { name, email } = route.params.updatedData;

      const newUserData = {
        ...userData,
        name: name || userData.name,
        email: email || userData.email,
      };

      setUserData(newUserData);
      saveUserData(newUserData);
      navigation.setParams({ updatedData: null });
    }
  }, [route.params?.updatedData]);

  // Load user data
  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userProfileData');
      if (savedUserData) setUserData(JSON.parse(savedUserData));
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  // Save user data
  const saveUserData = async (data) => {
    try {
      await AsyncStorage.setItem('userProfileData', JSON.stringify(data));
    } catch (error) {
      console.log('Error saving user data:', error);
    }
  };

  // Load portfolio images
  const loadPortfolioImages = async () => {
    try {
      const saved = await AsyncStorage.getItem('portfolioImages');
      if (saved) setPortfolioImages(JSON.parse(saved));
    } catch (error) {
      console.log('Error loading portfolio images:', error);
    }
  };

  // Save portfolio images
  useEffect(() => {
    AsyncStorage.setItem('portfolioImages', JSON.stringify(portfolioImages));
  }, [portfolioImages]);

  // Add image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant access to your gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPortfolioImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  // Delete image
  const deleteImage = (index) => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPortfolioImages((prev) => prev.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };

  // Navigate to EditProfile
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
          setUserData(newUserData);
          saveUserData(newUserData);
        }
      },
    });
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={['#CFAD01', '#30204D', '#0B005F']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { fontFamily: 'Milonga' }]}>My Account</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Ionicons name="person-circle-outline" size={120} color="#FFD700" />
            <Text style={styles.nameText}>{userData.name}</Text>
          </View>

          {/* Student Information */}
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
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>{userData.description}</Text>
          </View>

          {/* Portfolio Grid */}
          <View style={styles.imageCard}>
            <Text style={styles.imageGridTitle}>Portfolio</Text>
            <View style={styles.imageGrid}>
              {portfolioImages.length === 0 ? (
                <Text style={{ color: '#FFD700', textAlign: 'center', opacity: 0.7 }}>
                  No images yet. Add one below!
                </Text>
              ) : (
                portfolioImages.map((uri, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.imageItem}
                    onLongPress={() => deleteImage(index)}
                  >
                    <Image source={{ uri }} style={styles.gridImage} resizeMode="cover" />
                    <View style={styles.deleteOverlay}>
                      <Ionicons name="trash-outline" size={18} color="#fff" />
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>

            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <Ionicons name="add-circle-outline" size={28} color="#000" />
              <Text style={styles.addImageText}>Add Image</Text>
            </TouchableOpacity>

            {portfolioImages.length > 0 && (
              <Text style={{ color: '#FFD700', fontSize: 12, textAlign: 'center', marginTop: 5, opacity: 0.6 }}>
                Long press an image to delete it
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: { position: 'absolute', left: 24, top: 50, zIndex: 10 },
  backButtonText: { fontSize: 28, color: '#FFD700', fontWeight: '300' },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 28, color: '#fff' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  profileSection: { alignItems: 'center', marginVertical: 30 },
  nameText: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginTop: 10 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  cardTitle: { fontSize: 18, color: '#FFD700', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  infoRow: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.2)', paddingBottom: 10 },
  infoLabel: { fontSize: 16, color: '#FFD700', fontWeight: '600', marginBottom: 5 },
  infoValue: { fontSize: 14, color: '#fff' },
  editButton: { backgroundColor: '#FFD700', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, alignSelf: 'flex-start', marginTop: 10 },
  editButtonText: { color: '#000', fontSize: 14, fontWeight: '600' },
  descriptionCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255, 215, 0, 0.3)' },
  descriptionText: { fontSize: 14, color: '#fff', textAlign: 'center', lineHeight: 20, opacity: 0.8 },
  imageCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 215, 0, 0.3)' },
  imageGridTitle: { fontSize: 18, color: '#FFD700', fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  imageItem: { width: '48%', aspectRatio: 1, marginBottom: 10 },
  gridImage: { width: '100%', height: '100%', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255, 215, 0, 0.3)' },
  addImageButton: {
    marginTop: 15,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  addImageText: { color: '#000', fontSize: 14, fontWeight: '600', marginLeft: 5 },
  deleteOverlay: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 3 },
});

export default MyAccountScreen;
