import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
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

const ConfirmPaymentScreen = ({ navigation, route }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [commissionName, setCommissionName] = useState('');
  const [description, setDescription] = useState('');
  const [dateRequested, setDateRequested] = useState('');
  const [category, setCategory] = useState('');
  const [agreedPrice, setAgreedPrice] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [referencePhotos, setReferencePhotos] = useState([]);
  
  // Proof of Payment State
  const [proofPhotos, setProofPhotos] = useState([]);
  
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isViewingProof, setIsViewingProof] = useState(false);

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const requestData = route.params?.requestData || {};

  // Pre-fill form
  React.useEffect(() => {
    if (requestData) {
      setCommissionName(requestData.title || '');
      setDescription(requestData.description || '');
      setCategory(requestData.category || requestData.type || '');
      setAgreedPrice(requestData.agreedPrice || '');
      setContactInfo(requestData.email || requestData.contact || '');
      setReferencePhotos(requestData.referencePhotos || []);
      
      if (requestData.date) {
        setDateRequested(requestData.date);
      }
    }
  }, [requestData]);

  if (!fontsLoaded) return null;

  // --- Image Picker Logic ---
  const handlePickImage = async (isProof) => {
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
      const newUri = result.assets[0].uri;
      if (isProof) {
        setProofPhotos(prev => [...prev, newUri]);
      } else {
        setReferencePhotos(prev => [...prev, newUri]);
      }
    }
  };

  const handleTakeImage = async (isProof) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant camera permissions.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newUri = result.assets[0].uri;
      if (isProof) {
        setProofPhotos(prev => [...prev, newUri]);
      } else {
        setReferencePhotos(prev => [...prev, newUri]);
      }
    }
  };

  const showPhotoOptions = (isProof = false) => {
    Alert.alert(
      // ✅ FIXED: Changed 'Reference Photo' to 'Product Photo'
      isProof ? 'Add Proof of Payment' : 'Add Product Photo',
      'Choose an option',
      [
        { text: 'Choose from Gallery', onPress: () => handlePickImage(isProof) },
        { text: 'Take Photo', onPress: () => handleTakeImage(isProof) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const deletePhoto = (index, isProof) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (isProof) {
              setProofPhotos(prev => prev.filter((_, i) => i !== index));
            } else {
              setReferencePhotos(prev => prev.filter((_, i) => i !== index));
            }
            if (showPhotoModal && selectedPhotoIndex === index && isViewingProof === isProof) {
              setShowPhotoModal(false);
            }
          },
        },
      ]
    );
  };

  const openPhotoModal = (index, isProof) => {
    setSelectedPhotoIndex(index);
    setIsViewingProof(isProof);
    setShowPhotoModal(true);
  };

  const closePhotoModal = () => {
    setShowPhotoModal(false);
    setSelectedPhotoIndex(null);
  };

  // --- Date Picker Logic ---
  const handleCalendarPress = () => setShowCalendar(true);

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

  // --- Submission Logic ---
  const handleConfirm = () => {
    if (proofPhotos.length === 0) {
      Alert.alert(
        'Missing Proof', 
        'You cannot proceed without uploading a Proof of Payment image.'
      );
      return; 
    }

    if (!commissionName.trim() || !description.trim() || !dateRequested.trim() || !category.trim() || !agreedPrice.trim() || !contactInfo.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    const completedCommission = {
      ...requestData,
      id: requestData.id || Date.now().toString(),
      title: commissionName,
      description: description,
      date: dateRequested,
      category: category,
      agreedPrice: agreedPrice,
      contact: contactInfo,
      referencePhotos: referencePhotos,
      proofPhotos: proofPhotos,
      status: 'Complete',
      completedAt: new Date().toISOString(),
      artist: requestData.artist || 'Unknown Artist',
      email: requestData.email || contactInfo,
    };

    Alert.alert(
      'Payment Confirmed!',
      'Your commission has been marked as complete.',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Commissions', { 
              completedCommission: completedCommission
            });
          }
        }
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
        <StatusBar barStyle={isDarkMode ? "light-content" : "light-content"} backgroundColor="transparent" translucent />

        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={[styles.backButtonText, { color: isDarkMode ? colors.primary : '#FFFFFF' }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontFamily: 'Milonga', color: isDarkMode ? colors.text : '#FFFFFF' }]}>Confirm Payment</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.detailsCard, { 
            backgroundColor: isDarkMode ? colors.card : 'rgba(255, 255, 255, 0.15)',
            borderColor: isDarkMode ? colors.border : colors.cardBorder
          }]}>
            
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Commission Name **\***</Text>
              <TextInput
                style={[styles.textInput, { borderColor: colors.primary, color: isDarkMode ? colors.text : '#FFFFFF' }]}
                value={commissionName}
                onChangeText={setCommissionName}
                placeholderTextColor={isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)'}
              />
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Description **\***</Text>
              <TextInput
                style={[styles.textInput, { borderColor: colors.primary, color: isDarkMode ? colors.text : '#FFFFFF' }]}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                placeholderTextColor={isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)'}
              />
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Date Accepted **\***</Text>
              <View style={[styles.dateInputContainer, { borderColor: colors.primary }]}>
                <TextInput
                  style={[styles.dateTextInput, { color: isDarkMode ? colors.text : '#FFFFFF' }]}
                  value={dateRequested}
                  editable={false}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor={isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)'}
                />
                <TouchableOpacity style={[styles.calendarButton, { borderLeftColor: colors.primary }]} onPress={handleCalendarPress}>
                  <Ionicons name="calendar-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Category **\***</Text>
              <TextInput
                style={[styles.textInput, { borderColor: colors.primary, color: isDarkMode ? colors.text : '#FFFFFF' }]}
                value={category}
                onChangeText={setCategory}
                placeholderTextColor={isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)'}
              />
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Agreed Price **\***</Text>
              <View style={[styles.priceInputContainer, { borderColor: colors.primary }]}>
                <Text style={[styles.currencySymbol, { color: colors.primary, borderRightColor: colors.primary }]}>₱</Text>
                <TextInput
                  style={[styles.priceTextInput, { color: isDarkMode ? colors.text : '#FFFFFF' }]}
                  value={agreedPrice}
                  onChangeText={setAgreedPrice}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)'}
                />
              </View>
            </View>

            <View style={styles.detailSection}>
              {/* ✅ FIXED: Changed 'Reference Photos' to 'Product Photos' */}
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Product Photos</Text>
              <View style={styles.photoGrid}>
                {referencePhotos.map((uri, index) => (
                  <TouchableOpacity
                    key={`ref-${index}`}
                    style={styles.photoItem}
                    onPress={() => openPhotoModal(index, false)}
                    onLongPress={() => deletePhoto(index, false)}
                  >
                    <Image source={{ uri }} style={[styles.gridPhoto, { borderColor: colors.primary }]} />
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={[styles.addPhotoButton, { borderColor: colors.primary }]} onPress={() => showPhotoOptions(false)}>
                  <Ionicons name="add" size={30} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Proof of Payment Section */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Proof of Payment (Required) **\***</Text>
              <View style={styles.photoGrid}>
                {proofPhotos.length === 0 ? (
                  <Text style={[styles.noPhotosText, { color: isDarkMode ? colors.textSecondary : 'rgba(255,255,255,0.7)' }]}>
                    Please upload proof of payment
                  </Text>
                ) : (
                  proofPhotos.map((uri, index) => (
                    <TouchableOpacity
                      key={`proof-${index}`}
                      style={styles.photoItem}
                      onPress={() => openPhotoModal(index, true)}
                      onLongPress={() => deletePhoto(index, true)}
                    >
                      <Image source={{ uri }} style={[styles.gridPhoto, { borderColor: colors.primary }]} />
                      <View style={styles.deleteOverlay}><Ionicons name="trash" size={14} color="#fff" /></View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
              <TouchableOpacity style={[styles.addPhotoButton, { backgroundColor: colors.primary, marginTop: 10, alignSelf: 'flex-start', width: 'auto', paddingHorizontal: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center' }]} onPress={() => showPhotoOptions(true)}>
                <Ionicons name="cloud-upload-outline" size={20} color={isDarkMode ? colors.text : '#fff'} />
                <Text style={{ marginLeft: 8, fontWeight: '600', color: isDarkMode ? colors.text : '#fff' }}>Upload Proof</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Contact Information **\***</Text>
              <TextInput
                style={[styles.textInput, { borderColor: colors.primary, color: isDarkMode ? colors.text : '#FFFFFF' }]}
                value={contactInfo}
                onChangeText={setContactInfo}
                keyboardType="email-address"
                placeholderTextColor={isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)'}
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.buttonInput, { backgroundColor: colors.primary, borderColor: colors.primary, flex: 1 }]} onPress={handleConfirm}>
                <Text style={{ fontWeight: 'bold', color: isDarkMode ? colors.text : '#fff' }}>Confirm Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonInput, { borderColor: colors.border, flex: 1, backgroundColor: 'transparent' }]} onPress={() => navigation.goBack()}>
                <Text style={{ fontWeight: 'bold', color: colors.primary }}>Cancel</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>

        {/* Full Screen Modal */}
        <Modal visible={showPhotoModal} transparent={true} animationType="fade" onRequestClose={closePhotoModal}>
          <View style={styles.fullScreenModalOverlay}>
            <TouchableOpacity style={styles.fullScreenCloseButton} onPress={closePhotoModal}>
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
            {selectedPhotoIndex !== null && (
              <Image 
                source={{ uri: isViewingProof ? proofPhotos[selectedPhotoIndex] : referencePhotos[selectedPhotoIndex] }} 
                style={styles.fullScreenPhoto} 
                resizeMode="contain" 
              />
            )}
          </View>
        </Modal>

        {/* Date Picker Modal (iOS) */}
        {showCalendar && Platform.OS === 'ios' && (
          <Modal transparent={true} animationType="fade" visible={showCalendar} onRequestClose={() => setShowCalendar(false)}>
            <View style={styles.iosModalOverlay}>
              <View style={[styles.iosModalContent, { backgroundColor: isDarkMode ? '#333' : 'white' }]}>
                <DateTimePicker value={selectedDate} mode="date" display="spinner" onChange={handleDateChange} themeVariant={isDarkMode ? 'dark' : 'light'} />
                <TouchableOpacity onPress={confirmIOSDate} style={[styles.iosDoneButton, { backgroundColor: colors.primary }]}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
        {showCalendar && Platform.OS !== 'ios' && (
          <DateTimePicker value={selectedDate} mode="date" display="default" onChange={handleDateChange} />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 24, paddingBottom: 16 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { fontSize: 28, fontWeight: '300' },
  screenTitle: { fontSize: 24, flex: 1, textAlign: 'center' },
  placeholder: { width: 40 },
  content: { flex: 1, paddingHorizontal: 24 },
  detailsCard: { borderRadius: 15, padding: 20, marginBottom: 30, borderWidth: 1 },
  detailSection: { marginBottom: 20 },
  detailLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  textInput: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  dateInputContainer: { flexDirection: 'row', borderWidth: 1, borderRadius: 8, alignItems: 'center' },
  dateTextInput: { flex: 1, padding: 12, fontSize: 16 },
  calendarButton: { padding: 12, borderLeftWidth: 1 },
  priceInputContainer: { flexDirection: 'row', borderWidth: 1, borderRadius: 8, alignItems: 'center' },
  currencySymbol: { padding: 12, borderRightWidth: 1, fontWeight: 'bold', fontSize: 16 },
  priceTextInput: { flex: 1, padding: 12, fontSize: 16 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoItem: { width: 70, height: 70, position: 'relative' },
  gridPhoto: { width: '100%', height: '100%', borderRadius: 8, borderWidth: 1 },
  addPhotoButton: { width: 70, height: 70, borderRadius: 8, borderWidth: 1, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  noPhotosText: { fontSize: 14, fontStyle: 'italic', marginBottom: 10 },
  deleteOverlay: { position: 'absolute', top: 2, right: 2, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10, padding: 2 },
  buttonRow: { flexDirection: 'row', gap: 15, marginTop: 20 },
  buttonInput: { padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
  fullScreenModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  fullScreenCloseButton: { position: 'absolute', top: 50, right: 20, padding: 10 },
  fullScreenPhoto: { width: '90%', height: '80%' },
  iosModalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  iosModalContent: { width: '80%', borderRadius: 15, padding: 20 },
  iosDoneButton: { marginTop: 10, padding: 10, borderRadius: 8, alignItems: 'center' },
});

export default ConfirmPaymentScreen;