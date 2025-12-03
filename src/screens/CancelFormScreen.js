import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
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

const CancelFormScreen = ({ navigation, route }) => {
  const { isDarkMode, colors, gradients } = useTheme();
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

    // Create cancelled commission data
    const cancelledCommission = {
      ...requestData,
      id: requestData.id || Date.now().toString(),
      status: 'Canceled',
      cancellationReason: description,
      cancelledAt: new Date().toISOString(),
      title: commissionName || requestData.title
    };

    // Show success alert
    Alert.alert(
      'Cancellation Submitted!',
      'Your commission cancellation has been submitted successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to Commissions screen with cancelled commission data
            navigation.navigate('Commissions', { 
              cancelledCommission: cancelledCommission
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
            Cancel Form
          </Text>

          <View style={styles.placeholder} />
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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
                placeholder={`Enter Commission Name`}
                placeholderTextColor={isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)'}
              />
            </View>

            {/* Description */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.primary }]}>Reason of Cancellation:</Text>

               {/* Added text below the description input */}
              <Text style={[styles.instructionText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>
                Please tell us why you're canceling this work to continue.
                {"\n"}
                We'd appreciate your feedback — share your reason to proceed.
              </Text>
              <TextInput
                style={[styles.textInput, {
                  borderColor: colors.primary,
                  color: isDarkMode ? colors.text : '#FFFFFF',
                  backgroundColor: isDarkMode ? colors.inputBackground : 'transparent'
                }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the reason for cancellation here..."
                placeholderTextColor={isDarkMode ? colors.inputPlaceholder : 'rgba(255, 255, 255, 0.6)'}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
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
                  <Text style={[styles.primaryButtonText, { color: isDarkMode ? colors.text : colors.buttonText }]}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.buttonInput, styles.secondaryButton, { borderColor: colors.border }]}
                  onPress={handleDecline}
                >
                  <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Decline</Text>
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
  // New style for the instruction text
  instructionText: {
    fontSize: 14,
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
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
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

export default CancelFormScreen;