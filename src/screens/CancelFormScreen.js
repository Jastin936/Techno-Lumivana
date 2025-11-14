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

const CancelFormScreen = ({ navigation, route }) => {
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [commissionName, setCommissionName] = useState('');
  const [description, setDescription] = useState('');

  // Get the original request data from navigation params
  const requestData = route.params?.requestData || {
    title: 'Gold Earrings',
    type: 'Crafting',
    artist: 'Kreideprinz',
    description: 'Custom gold earrings with intricate designs and gemstone accents.',
    email: 'erinko@gmail.com',
    referencePhotos: [],
    category: 'Crafting',
    status: 'accepted'
  };

  if (!fontsLoaded) return null;

  const handleConfirm = () => {
    // Validate required fields
    if (!commissionName.trim()) {
      Alert.alert('Missing Information', 'Please enter a commission name.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please enter a description.');
      return;
    }

    // Create cancellation data object
    const cancellationData = {
      id: Date.now().toString(), // Generate unique ID
      title: commissionName,
      description: description,
      cancelledAt: new Date().toISOString(),
    };

    // Show success alert
    Alert.alert(
      'Cancellation Submitted!',
      'Your commission cancellation has been submitted successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to AcceptedCommissionScreen and pass updated request data with cancellation info
            navigation.navigate('AcceptedCommissionInfo', { 
              requestData: {
                ...requestData, // Keep all original data
                status: 'cancelled', // Update status to cancelled
                cancellationReason: description, // Add cancellation reason
                cancelledAt: new Date().toISOString(), // Add cancellation timestamp
                title: commissionName || requestData.title // Use entered name or original title
              },
              cancellationData: cancellationData,
              showCancellationModal: true // Flag to show modal
            });
          }
        }
      ]
    );
  };

  const handleDecline = () => {
    Alert.alert(
      'Cancel Cancellation',
      'Are you sure you want to cancel this cancellation request? All entered information will be lost.',
      [
        {
          text: 'No, Keep Editing',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <Text style={[styles.screenTitle, { fontFamily: 'Milonga' }]}>
            Cancel Form
          </Text>

          <View style={styles.placeholder} />
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.detailsCard}>
            {/* Commission Name */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Commission Name **\***</Text>
              <TextInput
                style={styles.textInput}
                value={commissionName}
                onChangeText={setCommissionName}
                placeholder={`Enter Commission Name`}
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
              />
            </View>

            {/* Description */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Reason of Cancellation:</Text>

               {/* Added text below the description input */}
              <Text style={styles.instructionText}>
                Please tell us why you're canceling this work to continue.
                {"\n"}
                We'd appreciate your feedback — share your reason to proceed.
              </Text>
              <TextInput
                style={styles.textInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the reason for cancellation here..."
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.detailSection}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.buttonInput, styles.primaryButton]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.primaryButtonText}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.buttonInput, styles.secondaryButton]}
                  onPress={handleDecline}
                >
                  <Text style={styles.secondaryButtonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    width: 40,
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
  // New style for the instruction text
  instructionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'left',
    marginTop: 3,
    marginBottom: 16,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
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

export default CancelFormScreen;