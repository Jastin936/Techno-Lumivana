import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
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

// Category options for dropdown with icons
const CATEGORY_OPTIONS = [
  { name: 'Graphic Design', icon: 'color-palette-outline' },
  { name: 'Illustration', icon: 'brush-outline' },
  { name: 'Crafting', icon: 'construct-outline' },
  { name: 'Writing', icon: 'document-text-outline' },
  { name: 'Photography', icon: 'camera-outline' },
  { name: 'Tutoring', icon: 'school-outline' },
  { name: 'Accessories', icon: 'diamond-outline' }
];

const AgreementFormScreen = ({ navigation, route }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  // Get commission data from navigation parameters
  const commissionData = route.params?.commissionData || {};

  // Initialize form fields with commission data if available
  const [commissionName, setCommissionName] = useState(commissionData.title || '');
  const [description, setDescription] = useState(commissionData.description || '');
  const [dateRequested, setDateRequested] = useState('');
  const [category, setCategory] = useState(commissionData.category || '');
  const [agreedPrice, setAgreedPrice] = useState('');
  const [contactInfo, setContactInfo] = useState(commissionData.contact || '');
  const [referencePhotos, setReferencePhotos] = useState(commissionData.referencePhotos || []);
  
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // State for dropdown
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Set form data from commissionData on component mount
  useEffect(() => {
    if (commissionData.agreedPrice) {
      setAgreedPrice(commissionData.agreedPrice.toString());
    }
    if (commissionData.date) {
      setDateRequested(commissionData.date);
      // Also set the selectedDate for the date picker
      if (commissionData.date) {
        const dateParts = commissionData.date.split('/');
        if (dateParts.length === 3) {
          const [month, day, year] = dateParts;
          const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          if (!isNaN(parsedDate.getTime())) {
            setSelectedDate(parsedDate);
          }
        }
      }
    }
  }, [commissionData]);

  if (!fontsLoaded) return null;

  // Image Picker Functions
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

  // Date Picker Functions
  const handleCalendarPress = () => {
    setShowCalendar(true);
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowCalendar(false);
    }
    
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

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    return dateString;
  };

  // Format price input with peso sign
  const handlePriceChange = (text) => {
    const cleanedText = text.replace(/[^0-9.]/g, '');
    
    const parts = cleanedText.split('.');
    if (parts.length > 2) {
      return;
    }
    
    setAgreedPrice(cleanedText);
  };

  // Handle category selection from dropdown
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setShowCategoryDropdown(false);
  };

  // Get icon for selected category
  const getSelectedCategoryIcon = () => {
    const selectedOption = CATEGORY_OPTIONS.find(option => option.name === category);
    return selectedOption ? selectedOption.icon : 'grid-outline';
  };

  // Save commission to AsyncStorage and navigate to CommissionScreen
  const saveCommissionToStorage = async (commission) => {
    try {
      // Get existing commissions from AsyncStorage
      const existingCommissions = await AsyncStorage.getItem('userCommissions');
      let commissionsArray = [];
      
      if (existingCommissions) {
        commissionsArray = JSON.parse(existingCommissions);
      }
      
      // Check if we're editing an existing commission
      if (commissionData.id) {
        // Update existing commission
        const index = commissionsArray.findIndex(c => c.id === commissionData.id);
        if (index !== -1) {
          commissionsArray[index] = commission;
        }
      } else {
        // Add new commission
        commissionsArray.unshift(commission); // Add to beginning for newest first
      }
      
      // Save updated commissions array
      await AsyncStorage.setItem('userCommissions', JSON.stringify(commissionsArray));
      
      console.log('Commission saved:', commission);
      return true;
    } catch (error) {
      console.error('Error saving commission:', error);
      return false;
    }
  };

  // UPDATED: Handle Confirm button with simpler navigation
  const handleConfirm = async () => {
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

    if (!category.trim()) {
      Alert.alert('Missing Information', 'Please select a category.');
      return;
    }

    if (!agreedPrice.trim()) {
      Alert.alert('Missing Information', 'Please enter the agreed price.');
      return;
    }

    if (!contactInfo.trim()) {
      Alert.alert('Missing Information', 'Please enter your contact information.');
      return;
    }

    const priceValue = parseFloat(agreedPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price amount.');
      return;
    }

    const newCommission = {
      id: commissionData.id || Date.now().toString(),
      title: commissionName,
      description: description,
      date: dateRequested,
      category: category,
      agreedPrice: agreedPrice,
      contact: contactInfo,
      referencePhotos: referencePhotos,
      status: commissionData.status || 'ongoing',
      createdAt: commissionData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save commission to AsyncStorage
    const saved = await saveCommissionToStorage(newCommission);
    
    if (saved) {
      const alertMessage = commissionData.id 
        ? 'Your commission request has been updated successfully.'
        : 'Your commission request has been submitted successfully. You will be notified when an artist accepts your request.';

      Alert.alert(
        commissionData.id ? 'Commission Updated!' : 'Commission Request Sent!',
        alertMessage,
        [
          {
            text: 'OK',
            onPress: () => {
              // SIMPLIFIED NAVIGATION - Navigate to CommissionScreen with the new commission data
              navigation.navigate('Commissions', {
                newCommission: newCommission,
                refresh: true
              });
            }
          }
        ]
      );
    } else {
      Alert.alert('Error', 'Failed to save commission. Please try again.');
    }
  };

  // Remove the handleConfirmSimple function since we're using handleConfirm

  const handleDecline = () => {
    const isEditing = !!commissionData.id;
    const alertTitle = isEditing ? 'Discard Changes' : 'Cancel Commission Request';
    const alertMessage = isEditing 
      ? 'Are you sure you want to discard your changes?'
      : 'Are you sure you want to cancel this commission request? All entered information will be lost.';

    Alert.alert(
      alertTitle,
      alertMessage,
      [
        {
          text: 'No, Keep Editing',
          style: 'cancel',
        },
        {
          text: 'Yes, Discard',
          style: 'destructive',
          onPress: () => {
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
          barStyle={isDarkMode ? "light-content" : "light-content"}
          backgroundColor="transparent"
          translucent
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backButtonText, { color: isDarkMode ? colors.primary : '#FFFFFF' }]}>←</Text>
          </TouchableOpacity>

          <Text style={[styles.screenTitle, { fontFamily: 'Milonga', color: isDarkMode ? colors.text : '#FFFFFF' }]}>
            Agreement Form
          </Text>

          <View style={styles.placeholder} />
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.detailsCard, { 
            backgroundColor: isDarkMode ? colors.card : 'rgba(255, 255, 255, 0.15)',
            borderColor: isDarkMode ? colors.border : colors.cardBorder
          }]}>
            {/* Commission Name */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Commission Name **\***</Text>
              <TextInput
                style={[styles.textInput, {
                  borderColor: colors.primary,
                  color: isDarkMode ? colors.text : '#FFFFFF',
                  backgroundColor: isDarkMode ? colors.inputBackground : 'transparent'
                }]}
                value={commissionName}
                onChangeText={setCommissionName}
                placeholder="Enter Commission Name"
                placeholderTextColor={isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)'}
              />
            </View>

            {/* Description */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Description **\***</Text>
              <TextInput
                style={[styles.textInput, {
                  borderColor: colors.primary,
                  color: isDarkMode ? colors.text : '#FFFFFF',
                  backgroundColor: isDarkMode ? colors.inputBackground : 'transparent'
                }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the commission details here..."
                placeholderTextColor={isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)'}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Date Requested */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Date Accepted **\***</Text>
              <View style={[styles.dateInputContainer, { borderColor: colors.primary }]}>
                <TextInput
                  style={[styles.dateTextInput, {
                    color: isDarkMode ? colors.text : '#FFFFFF',
                    backgroundColor: isDarkMode ? colors.inputBackground : 'transparent'
                  }]}
                  value={formatDateForDisplay(dateRequested)}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor={isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)'}
                  editable={false}
                />
                <TouchableOpacity style={[styles.calendarButton, { borderLeftColor: colors.primary }]} onPress={handleCalendarPress}>
                  <Ionicons name="calendar-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Category - UPDATED to Dropdown with Icons */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Category **\***</Text>
              
              {/* Category Dropdown Button */}
              <TouchableOpacity 
                style={[styles.categoryDropdownButton, { 
                  borderColor: colors.primary,
                  backgroundColor: isDarkMode ? colors.inputBackground : 'transparent'
                }]}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <View style={styles.categoryButtonContent}>
                  {/* Icon on the left */}
                  <Ionicons 
                    name={getSelectedCategoryIcon()} 
                    size={20} 
                    color={colors.primary}
                    style={styles.categoryButtonIcon}
                  />
                  <Text style={[styles.categorySelectedText, { 
                    color: category ? (isDarkMode ? colors.text : '#FFFFFF') : (isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)')
                  }]}>
                    {category || 'Select a category'}
                  </Text>
                </View>
                <Ionicons 
                  name={showCategoryDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.primary} 
                />
              </TouchableOpacity>

              {/* Category Dropdown Options */}
              {showCategoryDropdown && (
                <View style={[styles.categoryDropdownOptions, { 
                  backgroundColor: isDarkMode ? colors.card : '#FFFFFF',
                  borderColor: colors.primary,
                  shadowColor: isDarkMode ? '#000' : colors.primary
                }]}>
                  <ScrollView style={styles.categoryScrollView} nestedScrollEnabled={true}>
                    {CATEGORY_OPTIONS.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.categoryOption,
                          { 
                            borderBottomColor: colors.border,
                            backgroundColor: option.name === category 
                              ? (isDarkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 215, 0, 0.1)')
                              : 'transparent'
                          }
                        ]}
                        onPress={() => handleCategorySelect(option.name)}
                      >
                        {/* Icon on the left of each option */}
                        <View style={styles.categoryOptionContent}>
                          <Ionicons 
                            name={option.icon} 
                            size={18} 
                            color={colors.primary}
                            style={styles.categoryOptionIcon}
                          />
                          <Text style={[
                            styles.categoryOptionText,
                            { 
                              color: isDarkMode ? colors.text : '#000000',
                              fontWeight: option.name === category ? '600' : '400'
                            }
                          ]}>
                            {option.name}
                          </Text>
                        </View>
                        {option.name === category && (
                          <Ionicons name="checkmark" size={18} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Agreed Price */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Agreed Price **\***</Text>
              <View style={[styles.priceInputContainer, { borderColor: colors.primary }]}>
                <Text style={[styles.currencySymbol, { color: colors.primary, borderRightColor: colors.primary }]}>₱</Text>
                <TextInput
                  style={[styles.priceTextInput, {
                    color: isDarkMode ? colors.text : '#FFFFFF',
                    backgroundColor: isDarkMode ? colors.inputBackground : 'transparent'
                  }]}
                  value={agreedPrice}
                  onChangeText={handlePriceChange}
                  placeholder="0.00"
                  placeholderTextColor={isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)'}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Reference Photos */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Reference Photos ({referencePhotos.length})</Text>
              <View style={styles.photoGrid}>
                {referencePhotos.length === 0 ? (
                  <Text style={[styles.noPhotosText, { color: colors.primary }]}>
                    No reference photos yet. Add one below!
                  </Text>
                ) : (
                  referencePhotos.map((uri, index) => (
                    <TouchableOpacity
                      key={`photo-${index}-${uri}`}
                      style={styles.photoItem}
                      onPress={() => openPhotoModal(index)}
                      onLongPress={() => deleteReferencePhoto(index)}
                    >
                      <Image source={{ uri }} style={[styles.gridPhoto, { borderColor: colors.primary }]} resizeMode="cover" />
                      <View style={styles.deleteOverlay}>
                        <Ionicons name="trash-outline" size={18} color={colors.text} />
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>

              <TouchableOpacity style={[styles.addPhotoButton, { backgroundColor: colors.primary }]} onPress={showPhotoOptions}>
                <Ionicons name="add-circle-outline" size={28} color={isDarkMode ? colors.text : colors.buttonText} />
                <Text style={[styles.addPhotoText, { color: isDarkMode ? colors.text : colors.buttonText }]}>Add Reference Photo</Text>
              </TouchableOpacity>

              {referencePhotos.length > 0 && (
                <Text style={[styles.deleteHintText, { color: colors.primary }]}>
                  Long press a photo to delete it
                </Text>
              )}
            </View>

            {/* Contact Information */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Contact Information **\***</Text>
              <TextInput
                style={[styles.textInput, {
                  borderColor: colors.primary,
                  color: isDarkMode ? colors.text : '#FFFFFF',
                  backgroundColor: isDarkMode ? colors.inputBackground : 'transparent'
                }]}
                value={contactInfo}
                onChangeText={setContactInfo}
                placeholder="Enter your email"
                placeholderTextColor={isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)'}
                keyboardType="email-address"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.detailSection}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.buttonInput, styles.primaryButton, { 
                    backgroundColor: colors.primary,
                    borderColor: colors.primary
                  }]}
                  onPress={handleConfirm}
                >
                  <Text style={[styles.primaryButtonText, { color: isDarkMode ? colors.text : colors.buttonText }]}>{commissionData.id ? 'Update' : 'Confirm'}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.buttonInput, styles.secondaryButton, { borderColor: colors.border }]}
                  onPress={handleDecline}
                >
                  <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>{commissionData.id ? 'Cancel' : 'Decline'}</Text>
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

        {/* DateTimePicker - Platform Specific Fix */}
        {showCalendar && (
          Platform.OS === 'ios' ? (
            <Modal transparent={true} animationType="fade" visible={showCalendar} onRequestClose={() => setShowCalendar(false)}>
              <View style={styles.iosModalOverlay}>
                <View style={[styles.iosModalContent, { backgroundColor: isDarkMode ? '#30204D' : 'white' }]}>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    textColor={isDarkMode ? 'white' : 'black'}
                    themeVariant={isDarkMode ? "dark" : "light"}
                  />
                  <TouchableOpacity 
                    onPress={confirmIOSDate}
                    style={[styles.iosDoneButton, { backgroundColor: colors.primary }]}
                  >
                    <Text style={[styles.iosDoneText, { color: isDarkMode ? colors.text : '#fff' }]}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )
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
    width: 40,
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
  
  // Category Dropdown Styles with Icons
  categoryDropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  categoryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryButtonIcon: {
    marginRight: 10,
  },
  categorySelectedText: {
    fontSize: 16,
    flex: 1,
  },
  categoryDropdownOptions: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  categoryScrollView: {
    maxHeight: 200,
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  categoryOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryOptionIcon: {
    marginRight: 10,
  },
  categoryOptionText: {
    fontSize: 16,
    flex: 1,
  },

  // Price Input Styles
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRightWidth: 1,
  },
  priceTextInput: {
    fontSize: 16,
    padding: 12,
    flex: 1,
    textAlignVertical: 'top',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'transparent',
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
    borderWidth: 1
  },
  noPhotosText: { 
    textAlign: 'center', 
    opacity: 0.7,
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
    opacity: 0.6 
  },
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
  iosModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  iosModalContent: {
    width: '100%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  iosDoneButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  iosDoneText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default AgreementFormScreen;