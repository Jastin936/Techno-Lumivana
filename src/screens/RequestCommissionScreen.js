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
  Platform,
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

const RequestCommissionScreen = ({ navigation, route }) => {
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
    if (status !== 'granted') { Alert.alert('Permission required', 'Please grant access to your gallery.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) { setReferencePhotos(prev => [...prev, result.assets[0].uri]); }
  };

  const takeReferencePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission required', 'Please grant camera permissions.'); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) { setReferencePhotos(prev => [...prev, result.assets[0].uri]); }
  };

  const showPhotoOptions = () => {
    Alert.alert('Add Reference Photo', 'Choose an option', [
      { text: 'Choose from Gallery', onPress: pickReferencePhoto },
      { text: 'Take Photo', onPress: takeReferencePhoto },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const deleteReferencePhoto = (index) => {
    Alert.alert('Delete Photo', 'Remove this reference photo?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
          setReferencePhotos(prev => prev.filter((_, i) => i !== index));
          if (selectedPhotoIndex === index) { setShowPhotoModal(false); setSelectedPhotoIndex(null); }
      }},
    ]);
  };

  const openPhotoModal = (index) => { setSelectedPhotoIndex(index); setShowPhotoModal(true); };
  const closePhotoModal = () => { setShowPhotoModal(false); setSelectedPhotoIndex(null); };

  const handleCalendarPress = () => { setShowCalendar(true); };
  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') setShowCalendar(false);
    if (date) {
      setSelectedDate(date);
      const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
      setDateRequested(formattedDate);
    }
  };
  const confirmIOSDate = () => {
    setShowCalendar(false);
    const date = selectedDate;
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
    setDateRequested(formattedDate);
  };
  const formatDateForDisplay = (dateString) => dateString || '';

  const handleConfirm = async () => {
    if (!commissionName.trim()) { Alert.alert('Missing Information', 'Please enter a commission name.'); return; }
    if (!description.trim()) { Alert.alert('Missing Information', 'Please enter a description.'); return; }
    if (!dateRequested.trim()) { Alert.alert('Missing Information', 'Please select a date.'); return; }
    if (!contactInfo.trim()) { Alert.alert('Missing Information', 'Please enter your contact information.'); return; }

    // ✅ FIXED: Fetch actual user name immediately from storage
    let realName = 'Student'; 
    try {
        const savedUserData = await AsyncStorage.getItem('userProfileData');
        if (savedUserData) {
            const parsedData = JSON.parse(savedUserData);
            if (parsedData.name && parsedData.name.trim() !== '') {
                realName = parsedData.name;
            }
        }
    } catch (e) {
        console.log("Error loading name", e);
    }

    const newCommission = {
      id: Date.now().toString(),
      title: commissionName,
      description: description,
      date: dateRequested,
      category: category || 'Custom Commission',
      artist: realName, // ✅ Uses the fetched name directly
      contact: contactInfo,
      email: contactInfo,
      referencePhotos: referencePhotos,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    Alert.alert(
      'Commission Request Sent!',
      'Your commission request has been submitted successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Home', { 
              activeTab: 'Requests',
              newCommission: newCommission 
            });
          }
        }
      ]
    );
  };

  const handleDecline = () => {
    Alert.alert('Cancel', 'Are you sure you want to cancel? Information will be lost.', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <LinearGradient colors={isDarkMode ? gradients.background : gradients.main} locations={isDarkMode ? [0, 1] : [0, 0.58, 0.84]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={[styles.backButtonText, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontFamily: 'Milonga', color: isDarkMode ? colors.text : '#FFFFFF' }]}>Request Commission</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.detailsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Commission Name</Text>
              <TextInput style={[styles.textInput, { borderColor: colors.inputBorder, color: colors.inputText, backgroundColor: colors.inputBackground }]} value={commissionName} onChangeText={setCommissionName} placeholder="Enter Commission Name" placeholderTextColor={colors.inputPlaceholder} />
            </View>
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Description</Text>
              <TextInput style={[styles.textInput, { borderColor: colors.inputBorder, color: colors.inputText, backgroundColor: colors.inputBackground }]} value={description} onChangeText={setDescription} placeholder="Describe details..." placeholderTextColor={colors.inputPlaceholder} multiline numberOfLines={3} textAlignVertical="top" />
            </View>
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Date Requested</Text>
              <View style={[styles.dateInputContainer, { borderColor: colors.inputBorder }]}>
                <TextInput style={[styles.dateTextInput, { color: colors.inputText, backgroundColor: colors.inputBackground }]} value={formatDateForDisplay(dateRequested)} placeholder="MM/DD/YYYY" placeholderTextColor={colors.inputPlaceholder} editable={false} />
                <TouchableOpacity style={[styles.calendarButton, { borderLeftColor: colors.inputBorder }]} onPress={handleCalendarPress}>
                  <Ionicons name="calendar-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Category</Text>
              <TextInput style={[styles.textInput, { borderColor: colors.inputBorder, color: colors.inputText, backgroundColor: colors.inputBackground }]} value={category} onChangeText={setCategory} placeholder="Custom Commission" placeholderTextColor={colors.inputPlaceholder} />
            </View>
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Reference Photos ({referencePhotos.length})</Text>
              <View style={styles.photoGrid}>
                {referencePhotos.length === 0 ? (
                  <Text style={[styles.noPhotosText, { color: colors.textSecondary }]}>No reference photos yet.</Text>
                ) : (
                  referencePhotos.map((uri, index) => (
                    <TouchableOpacity key={index} style={styles.photoItem} onPress={() => openPhotoModal(index)} onLongPress={() => deleteReferencePhoto(index)}>
                      <Image source={{ uri }} style={[styles.gridPhoto, { borderColor: colors.border }]} resizeMode="cover" />
                      <View style={styles.deleteOverlay}><Ionicons name="trash-outline" size={18} color={colors.text} /></View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
              <TouchableOpacity style={[styles.addPhotoButton, { backgroundColor: colors.primary }]} onPress={showPhotoOptions}>
                <Ionicons name="add-circle-outline" size={28} color={isDarkMode ? "#000" : "#000"} />
                <Text style={[styles.addPhotoText, { color: isDarkMode ? "#000" : "#000" }]}>Add Photo</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Contact Information</Text>
              <TextInput style={[styles.textInput, { borderColor: colors.inputBorder, color: colors.inputText, backgroundColor: colors.inputBackground }]} value={contactInfo} onChangeText={setContactInfo} placeholder="Enter email" placeholderTextColor={colors.inputPlaceholder} keyboardType="email-address" />
            </View>
            <View style={styles.detailSection}>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.buttonInput, styles.primaryButton, { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={handleConfirm}>
                  <Text style={[styles.primaryButtonText, { color: isDarkMode ? "#000" : "#000" }]}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonInput, styles.secondaryButton, { borderColor: colors.border }]} onPress={handleDecline}>
                  <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <Modal visible={showPhotoModal} transparent={true} animationType="fade" onRequestClose={closePhotoModal}>
          <View style={styles.fullScreenModalOverlay}>
            <TouchableOpacity style={styles.fullScreenCloseButton} onPress={closePhotoModal}>
              <Ionicons name="close" size={30} color={colors.text} />
            </TouchableOpacity>
            {selectedPhotoIndex !== null && referencePhotos[selectedPhotoIndex] && (
              <Image source={{ uri: referencePhotos[selectedPhotoIndex] }} style={styles.fullScreenPhoto} resizeMode="contain" />
            )}
          </View>
        </Modal>

        {showCalendar && (
          Platform.OS === 'ios' ? (
            <Modal transparent={true} animationType="fade" visible={showCalendar} onRequestClose={() => setShowCalendar(false)}>
              <View style={styles.iosModalOverlay}>
                <View style={[styles.iosModalContent, { backgroundColor: isDarkMode ? '#30204D' : 'white' }]}>
                  <DateTimePicker value={selectedDate} mode="date" display="spinner" onChange={handleDateChange} textColor={isDarkMode ? '#FFFFFF' : '#000000'} themeVariant={isDarkMode ? "dark" : "light"} />
                  <TouchableOpacity onPress={confirmIOSDate} style={[styles.iosDoneButton, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.iosDoneText, { color: isDarkMode ? '#000' : '#fff' }]}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker value={selectedDate} mode="date" display="default" onChange={handleDateChange} textColor={isDarkMode ? "#FFFFFF" : "#0B005F"} />
          )
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 24, paddingBottom: 16, backgroundColor: 'transparent' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { fontSize: 28, fontWeight: '300' },
  screenTitle: { fontSize: 24, textAlign: 'center', flex: 1 },
  placeholder: { width: 40 },
  content: { flex: 1, paddingHorizontal: 24 },
  detailsCard: { borderRadius: 15, padding: 20, marginBottom: 30, borderWidth: 1 },
  detailSection: { marginBottom: 25 },
  detailLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  textInput: { fontSize: 16, borderWidth: 1, borderRadius: 8, padding: 12, textAlignVertical: 'top' },
  dateInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8 },
  dateTextInput: { fontSize: 16, padding: 12, flex: 1 },
  calendarButton: { padding: 12, borderLeftWidth: 1 },
  buttonInput: { borderWidth: 1, borderRadius: 8, padding: 12, alignItems: 'center', justifyContent: 'center', minHeight: 50 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  photoItem: { width: '48%', aspectRatio: 1, marginBottom: 10, position: 'relative' },
  gridPhoto: { width: '100%', height: '100%', borderRadius: 8, borderWidth: 1 },
  noPhotosText: { textAlign: 'center', width: '100%', paddingVertical: 20 },
  addPhotoButton: { marginTop: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 15 },
  addPhotoText: { fontSize: 14, fontWeight: '600', marginLeft: 5 },
  deleteOverlay: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 3 },
  fullScreenModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
  fullScreenCloseButton: { position: 'absolute', top: 60, right: 20, zIndex: 10 },
  fullScreenPhoto: { width: width * 0.9, height: width * 0.9, borderRadius: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  primaryButton: { flex: 1 },
  secondaryButton: { backgroundColor: 'transparent', flex: 1 },
  primaryButtonText: { fontSize: 16, fontWeight: '600' },
  secondaryButtonText: { fontSize: 16, fontWeight: '600' },
  iosModalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 20 },
  iosModalContent: { width: '100%', borderRadius: 15, padding: 20, alignItems: 'center' },
  iosDoneButton: { marginTop: 15, paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10 },
  iosDoneText: { fontSize: 16, fontWeight: 'bold' }
});

export default RequestCommissionScreen;