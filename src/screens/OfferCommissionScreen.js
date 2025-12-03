import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const OfferCommissionScreen = ({ navigation }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [commissionName, setCommissionName] = useState('');
  const [description, setDescription] = useState('');
  const [dateRequested, setDateRequested] = useState('');
  const [category, setCategory] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [referencePhotos, setReferencePhotos] = useState([]);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (!fontsLoaded) return null;

  const pickReferencePhoto = async () => {
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
      const updatedPhotos = [...referencePhotos, result.assets[0].uri];
      setReferencePhotos(updatedPhotos);
    }
  };

  const takeReferencePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const updatedPhotos = [...referencePhotos, result.assets[0].uri];
      setReferencePhotos(updatedPhotos);
    }
  };

  const showPhotoOptions = () => {
    Alert.alert(
      'Add Product Photo',
      'Choose an option',
      [
        {
          text: 'Choose from Gallery',
          onPress: pickReferencePhoto,
        },
        {
          text: 'Take Photo',
          onPress: takeReferencePhoto,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const deleteReferencePhoto = (index) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to remove this product photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedPhotos = referencePhotos.filter((_, i) => i !== index);
            setReferencePhotos(updatedPhotos);
            
            if (selectedPhotoIndex === index) {
              setShowPhotoModal(false);
              setSelectedPhotoIndex(null);
            }
          },
        },
      ]
    );
  };

  const openPhotoModal = (index) => {
    setSelectedPhotoIndex(index);
    setShowPhotoModal(true);
  };

  const closePhotoModal = () => {
    setShowPhotoModal(false);
    setSelectedPhotoIndex(null);
  };

  const handleCalendarPress = () => {
    setShowCalendar(true);
  };

  const handleDateChange = (event, date) => {
    setShowCalendar(false);
    if (date) {
      setSelectedDate(date);
      // Format date as MM/DD/YYYY
      const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
      setDateRequested(formattedDate);
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    return dateString;
  };

  const handleConfirm = async () => {
    // Validate required fields
    if (!commissionName.trim()) {
      Alert.alert('Missing Information', 'Please enter a commission name.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please enter a description.');
      return;
    }

    if (!dateRequested.trim()) {
      Alert.alert('Missing Information', 'Please select a date.');
      return;
    }

    if (!contactInfo.trim()) {
      Alert.alert('Missing Information', 'Please enter your contact information.');
      return;
    }

    let userName = 'New User';
    let profileImage = null;
    try {
      const savedUserData = await AsyncStorage.getItem('userProfileData');
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        userName = parsedData.name || 'New User';
        profileImage = parsedData.profileImage || null;
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }

    const newPost = {
      id: `post-${Date.now()}`,
      user: userName,
      profileImage: profileImage,
      role: 'Artist', // Placeholder
      title: commissionName,
      description: description,
      likes: 0,
      type: 'home',
      category: category || 'Custom Commission',
      image: referencePhotos.length > 0 ? referencePhotos[0] : null,
    };

    // Show success alert
    Alert.alert(
      'Commission Offer Sent!',
      'Your commission offer has been submitted successfully. You will be notified when someone accepts your offer.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to HomeScreen with Home tab active
            navigation.navigate('Home', {
              activeTab: 'Home',
              newPost: newPost,
            });
          },
        },
      ]
    );
  };

  const handleDecline = () => {
    Alert.alert(
      'Cancel Commission Offer',
      'Are you sure you want to cancel this commission offer? All entered information will be lost.',
      [
        {
          text: 'No, Keep Editing',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            // Navigate back to previous screen
            navigation.goBack();
          },
        },
      ]
    );
  };

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
          {/* Back Button on Left Side */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backButtonText, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>←</Text>
          </TouchableOpacity>

          {/* Screen Title in Header */}
          <Text style={[styles.screenTitle, { fontFamily: 'Milonga', color: isDarkMode ? colors.text : '#FFFFFF' }]}>
            Offer Commission
          </Text>

          {/* Empty View for balance */}
          <View style={styles.placeholder} />
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Commission Details Card */}
          <View style={[styles.detailsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            {/* Commission Name */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Commission Name</Text>
              <TextInput
                style={[styles.textInput, { 
                  borderColor: colors.inputBorder,
                  color: colors.inputText,
                  backgroundColor: colors.inputBackground
                }]}
                value={commissionName}
                onChangeText={setCommissionName}
                placeholder="Enter Commission Name"
                placeholderTextColor={colors.inputPlaceholder}
              />
            </View>

            {/* Description */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Description</Text>
              <TextInput
                style={[styles.textInput, { 
                  borderColor: colors.inputBorder,
                  color: colors.inputText,
                  backgroundColor: colors.inputBackground
                }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the commission details here..."
                placeholderTextColor={colors.inputPlaceholder}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Date Requested */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Date Offered</Text>
              <View style={[styles.dateInputContainer, { borderColor: colors.inputBorder }]}>
                <TextInput
                  style={[styles.dateTextInput, { 
                    color: colors.inputText,
                    backgroundColor: colors.inputBackground
                  }]}
                  value={formatDateForDisplay(dateRequested)}
                  onChangeText={setDateRequested}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor={colors.inputPlaceholder}
                  editable={false} // Make it read-only since we're using calendar
                />
                <TouchableOpacity style={[styles.calendarButton, { borderLeftColor: colors.inputBorder }]} onPress={handleCalendarPress}>
                  <Ionicons name="calendar-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Category */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Category</Text>
              <TextInput
                style={[styles.textInput, { 
                  borderColor: colors.inputBorder,
                  color: colors.inputText,
                  backgroundColor: colors.inputBackground
                }]}
                value={category}
                onChangeText={setCategory}
                placeholder="Custom Commission"
                placeholderTextColor={colors.inputPlaceholder}
              />
            </View>

            {/* Photo of the Product - Same design as RequestCommissionScreen */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Product Photos ({referencePhotos.length})</Text>
              <View style={styles.photoGrid}>
                {referencePhotos.length === 0 ? (
                  <Text style={[styles.noPhotosText, { color: colors.textSecondary }]}>
                    No product photos yet. Add one below!
                  </Text>
                ) : (
                  referencePhotos.map((uri, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.photoItem}
                      onPress={() => openPhotoModal(index)}
                      onLongPress={() => deleteReferencePhoto(index)}
                    >
                      <Image source={{ uri }} style={[styles.gridPhoto, { borderColor: colors.border }]} resizeMode="cover" />
                      <View style={styles.deleteOverlay}>
                        <Ionicons name="trash-outline" size={18} color={colors.text} />
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>

              <TouchableOpacity style={[styles.addPhotoButton, { backgroundColor: colors.primary }]} onPress={showPhotoOptions}>
                <Ionicons name="add-circle-outline" size={28} color={isDarkMode ? "#000" : "#000"} />
                <Text style={[styles.addPhotoText, { color: isDarkMode ? "#000" : "#000" }]}>Add Product Photo</Text>
              </TouchableOpacity>

              {referencePhotos.length > 0 && (
                <Text style={[styles.deleteHintText, { color: colors.textMuted }]}>
                  Long press a photo to delete it
                </Text>
              )}
            </View>

            {/* Contact Information */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Contact Information</Text>
              <TextInput
                style={[styles.textInput, { 
                  borderColor: colors.inputBorder,
                  color: colors.inputText,
                  backgroundColor: colors.inputBackground
                }]}
                value={contactInfo}
                onChangeText={setContactInfo}
                placeholder="Enter your email"
                placeholderTextColor={colors.inputPlaceholder}
                keyboardType="email-address"
              />
            </View>

            {/* Confirm Section */}
            <View style={styles.detailSection}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.buttonInput, styles.primaryButton, { backgroundColor: colors.primary, borderColor: colors.primary }]}
                  onPress={handleConfirm}
                >
                  <Text style={[styles.primaryButtonText, { color: isDarkMode ? "#000" : "#000" }]}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.buttonInput, styles.secondaryButton, { borderColor: colors.border }]}
                  onPress={handleDecline}
                >
                  <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Product Photo Full Screen Modal */}
        <Modal
          visible={showPhotoModal}
          transparent={true}
          animationType="fade"
          onRequestClose={closePhotoModal}
        >
          <View style={styles.fullScreenModalOverlay}>
            <TouchableOpacity 
              style={styles.fullScreenCloseButton}
              onPress={closePhotoModal}
            >
              <Ionicons name="close" size={30} color={colors.text} />
            </TouchableOpacity>
            
            {selectedPhotoIndex !== null && referencePhotos[selectedPhotoIndex] && (
              <Image 
                source={{ uri: referencePhotos[selectedPhotoIndex] }} 
                style={styles.fullScreenPhoto} 
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>

        {/* DateTimePicker */}
        {showCalendar && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            style={styles.calendarPicker}
            textColor={isDarkMode ? "#FFFFFF" : "#0B005F"}
            themeVariant={isDarkMode ? "dark" : "light"}
          />
        )}
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
  screenTitle: {
    fontSize: 24,
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 40, // Same as backButton for balance
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 24,
  },
  detailsCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    width: width * 1.0,
    alignSelf: 'center',
    borderWidth: 1,
  },
  detailSection: {
    marginBottom: 25,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
  },
  // Date Input with Calendar Icon INSIDE the input
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  dateTextInput: {
    fontSize: 16,
    padding: 12,
    flex: 1,
    textAlignVertical: 'top',
  },
  calendarButton: {
    padding: 12,
    borderLeftWidth: 1,
  },
  buttonInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  calendarPicker: {
    backgroundColor: '#30204D',
  },
  // Photo Grid Styles - Exact same as RequestCommissionScreen
  photoGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  photoItem: { 
    width: '48%', 
    aspectRatio: 1, 
    marginBottom: 10,
    position: 'relative',
  },
  gridPhoto: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 8, 
    borderWidth: 1,
  },
  noPhotosText: { 
    textAlign: 'center', 
    width: '100%',
    paddingVertical: 20,
  },
  addPhotoButton: {
    marginTop: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  addPhotoText: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginLeft: 5 
  },
  deleteOverlay: { 
    position: 'absolute', 
    top: 6, 
    right: 6, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    borderRadius: 12, 
    padding: 3 
  },
  deleteHintText: { 
    fontSize: 12, 
    textAlign: 'center', 
    marginTop: 5,
  },
  // Full Screen Photo Modal Styles
  fullScreenModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenCloseButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
  fullScreenPhoto: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  primaryButtonText: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OfferCommissionScreen;