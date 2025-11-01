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
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

const RequestCommissionScreen = ({ navigation }) => {
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
      'Add Reference Photo',
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
      'Are you sure you want to remove this reference photo?',
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
          {/* Back Button on Left Side */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          {/* Screen Title in Header */}
          <Text style={[styles.screenTitle, { fontFamily: 'Milonga' }]}>
            Request Commission
          </Text>

          {/* Empty View for balance */}
          <View style={styles.placeholder} />
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Commission Details Card */}
          <View style={styles.detailsCard}>
            {/* Commission Name */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Commission Name</Text>
              <TextInput
                style={styles.textInput}
                value={commissionName}
                onChangeText={setCommissionName}
                placeholder="Enter Commission Name"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
              />
            </View>

            {/* Description */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Description</Text>
              <TextInput
                style={styles.textInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the commission details here..."
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Date Requested */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Date Requested</Text>
              <View style={styles.dateInputContainer}>
                <TextInput
                  style={styles.dateTextInput}
                  value={formatDateForDisplay(dateRequested)}
                  onChangeText={setDateRequested}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  editable={false} // Make it read-only since we're using calendar
                />
                <TouchableOpacity style={styles.calendarButton} onPress={handleCalendarPress}>
                  <Ionicons name="calendar-outline" size={24} color="#FFD700" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Category */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Category</Text>
              <TextInput
                style={styles.textInput}
                value={category}
                onChangeText={setCategory}
                placeholder="Custom Commission"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
              />
            </View>

            {/* Reference Photo - Same as portfolio */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Reference Photos ({referencePhotos.length})</Text>
              <View style={styles.photoGrid}>
                {referencePhotos.length === 0 ? (
                  <Text style={styles.noPhotosText}>
                    No reference photos yet. Add one below!
                  </Text>
                ) : (
                  referencePhotos.map((uri, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.photoItem}
                      onPress={() => openPhotoModal(index)}
                      onLongPress={() => deleteReferencePhoto(index)}
                    >
                      <Image source={{ uri }} style={styles.gridPhoto} resizeMode="cover" />
                      <View style={styles.deleteOverlay}>
                        <Ionicons name="trash-outline" size={18} color="#fff" />
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>

              <TouchableOpacity style={styles.addPhotoButton} onPress={showPhotoOptions}>
                <Ionicons name="add-circle-outline" size={28} color="#000" />
                <Text style={styles.addPhotoText}>Add Reference Photo</Text>
              </TouchableOpacity>

              {referencePhotos.length > 0 && (
                <Text style={styles.deleteHintText}>
                  Long press a photo to delete it
                </Text>
              )}
            </View>

            {/* Contact Information */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Contact Information</Text>
              <TextInput
                style={styles.textInput}
                value={contactInfo}
                onChangeText={setContactInfo}
                placeholder="Enter your email"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                keyboardType="email-address"
              />
            </View>

            {/* Action Buttons - Styled like input placeholders */}
            <View style={styles.detailSection}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.buttonInput, styles.primaryButton]}
                  onPress={() => {
                    // Handle accept action
                    console.log('Commission accepted');
                  }}
                >
                  <Text style={styles.primaryButtonText}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.buttonInput, styles.secondaryButton]}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.secondaryButtonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Reference Photo Full Screen Modal */}
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
              <Ionicons name="close" size={30} color="#fff" />
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

        {/* DateTimePicker - No custom modal wrapper */}
        {showCalendar && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            style={styles.calendarPicker}
            textColor="#FFFFFF"
            themeVariant="dark"
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
    color: '#fff',
    fontWeight: '300',
  },
  screenTitle: {
    fontSize: 24,
    color: '#fff',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    width: width * 1.0,
    alignSelf: 'center',
  },
  detailSection: {
    marginBottom: 25,
  },
  detailLabel: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
  },
  // Date Input with Calendar Icon INSIDE the input
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  dateTextInput: {
    fontSize: 16,
    color: '#fff',
    padding: 12,
    flex: 1,
    textAlignVertical: 'top',
  },
  calendarButton: {
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#FFD700',
  },
  buttonInput: {
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  calendarPicker: {
    backgroundColor: '#30204D',
  },
  // Photo Grid Styles - Same as portfolio
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
    borderColor: 'rgba(255, 215, 0, 0.3)' 
  },
  noPhotosText: { 
    color: '#FFD700', 
    textAlign: 'center', 
    opacity: 0.7,
    width: '100%',
    paddingVertical: 20,
  },
  addPhotoButton: {
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
  addPhotoText: { 
    color: '#000', 
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
    color: '#FFD700', 
    fontSize: 12, 
    textAlign: 'center', 
    marginTop: 5, 
    opacity: 0.6 
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
    backgroundColor: '#FFD700',
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  primaryButtonText: { 
    color: '#000', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  secondaryButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RequestCommissionScreen;