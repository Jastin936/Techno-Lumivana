import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  Linking,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AcceptedCommissionInfoScreen = ({ navigation, route }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [isModalVisible, setModalVisible] = useState(false);
  const [isStopProcessModalVisible, setStopProcessModalVisible] = useState(false);
  const [moreModal, setMoreModal] = useState({ visible: false, post: null });
  const [imageModal, setImageModal] = useState({ visible: false, imageUri: null });
  const [blockedPosts, setBlockedPosts] = useState([]);
  const [notInterestedPosts, setNotInterestedPosts] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [commissionStatus, setCommissionStatus] = useState('ongoing');
  const [cancellationModalVisible, setCancellationModalVisible] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  const slideAnim = useState(new Animated.Value(300))[0];

  // Initialize requestData with route params or use default data
  const [requestData, setRequestData] = useState(
    route.params?.requestData || {
      title: 'Gold Earrings',
      type: 'Crafting',
      artist: 'Kreideprinz',
      description: 'Custom gold earrings with intricate designs and gemstone accents.',
      email: 'erinko@gmail.com',
      referencePhotos: [],
      category: 'Crafting',
      status: 'accepted'
    }
  );

  // Load not interested and reported posts from AsyncStorage
  useEffect(() => {
    loadNotInterestedPosts();
    loadReportedPosts();
    loadBlockedCommissions();
  }, []);

  // Handle route params updates - including cancellation and completion data
  useEffect(() => {
    if (route.params?.requestData) {
      const commissionData = route.params.requestData;
      setRequestData(commissionData);
      
      // Set commission status based on the received data
      const status = commissionData.status?.toLowerCase();
      console.log('Commission status received:', status);
      
      if (status === 'cancelled' || status === 'canceled') {
        setCommissionStatus('cancelled');
      } else if (status === 'complete' || status === 'completed') {
        setCommissionStatus('completed');
      } else if (status === 'on going' || status === 'ongoing') {
        setCommissionStatus('ongoing');
      } else {
        setCommissionStatus(commissionData.status || 'ongoing');
      }
    }
  }, [route.params?.requestData]);

  // Check if we need to show cancellation modal when component mounts
  useEffect(() => {
    if (route.params?.showCancellationModal) {
      setCancellationModalVisible(true);
    }
  }, [route.params?.showCancellationModal]);

  const loadNotInterestedPosts = async () => {
    try {
      const savedNotInterested = await AsyncStorage.getItem('notInterestedPosts');
      if (savedNotInterested) {
        setNotInterestedPosts(JSON.parse(savedNotInterested));
      }
    } catch (error) {
      console.log('Error loading not interested posts:', error);
    }
  };

  const loadReportedPosts = async () => {
    try {
      const savedReported = await AsyncStorage.getItem('reportedPosts');
      if (savedReported) {
        setReportedPosts(JSON.parse(savedReported));
      }
    } catch (error) {
      console.log('Error loading reported posts:', error);
    }
  };

  const loadBlockedCommissions = async () => {
    try {
      const savedBlocked = await AsyncStorage.getItem('blockedCommissions');
      if (savedBlocked) {
        setBlockedPosts(JSON.parse(savedBlocked));
      }
    } catch (error) {
      console.log('Error loading blocked commissions:', error);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? colors.background : colors.background }]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  const slideUp = () => {
    slideAnim.setValue(300);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleHoldOff = () => {
    setModalVisible(false);
    console.log('Hold off pressed');
  };

  const handleProceed = () => {
    setModalVisible(false);
    // Navigate to the Agreement Form screen with the request data
    navigation.navigate('AgreementForm', { 
      requestData: requestData 
    });
    console.log('Proceed pressed, navigating to AgreementForm');
  };

  const openMoreModal = () => {
    setMoreModal({ visible: true, post: requestData });
    slideUp();
  };

  // UPDATED: Handle Not Interested with AsyncStorage persistence AND commission removal
  const handleNotInterested = async () => {
    if (moreModal.post) {
      try {
        // Generate commission ID (use the same format as CommissionsScreen)
        const commissionId = moreModal.post.id || 
          `${moreModal.post.title}-${moreModal.post.artist}`;
        
        console.log('Processing not interested for commission:', commissionId);
        
        // 1. Add to not interested list
        const updatedNotInterested = [...notInterestedPosts, commissionId];
        setNotInterestedPosts(updatedNotInterested);
        
        // Save to AsyncStorage
        await AsyncStorage.setItem('notInterestedPosts', JSON.stringify(updatedNotInterested));
        
        // 2. Add to blocked commissions list
        const blockedCommissionsKey = 'blockedCommissions';
        const savedBlocked = await AsyncStorage.getItem(blockedCommissionsKey);
        let blockedCommissions = savedBlocked ? JSON.parse(savedBlocked) : [];
        
        if (!blockedCommissions.includes(commissionId)) {
          blockedCommissions.push(commissionId);
          await AsyncStorage.setItem(blockedCommissionsKey, JSON.stringify(blockedCommissions));
          console.log('Added to blockedCommissions:', commissionId);
        }
        
        // 3. Remove from saved commissions
        const savedCommissionsKey = 'savedCommissions';
        const savedCommissions = await AsyncStorage.getItem(savedCommissionsKey);
        if (savedCommissions) {
          let commissionsArray = JSON.parse(savedCommissions);
          const initialLength = commissionsArray.length;
          
          // Filter out the commission using multiple ID formats
          commissionsArray = commissionsArray.filter(commission => {
            // Check multiple possible ID formats
            const currentCommissionId = commission.id || 
              `${commission.title}-${commission.artist}`;
            const compositeId = `${commission.title}-${commission.artist}-${commission.date || ''}`;
            
            // Return false if any ID matches
            if (currentCommissionId === commissionId) return false;
            if (compositeId === commissionId) return false;
            if (commission.id === commissionId) return false;
            
            return true;
          });
          
          if (commissionsArray.length < initialLength) {
            await AsyncStorage.setItem(savedCommissionsKey, JSON.stringify(commissionsArray));
            console.log(`Removed commission from savedCommissions. Was: ${initialLength}, Now: ${commissionsArray.length}`);
          } else {
            console.log('Commission not found in savedCommissions');
          }
        }
        
        // 4. Close modal
        setMoreModal({ visible: false, post: null });
        
        // 5. Show success message
        Alert.alert("Success", "Commission has been removed from your list.");
        
        // 6. Navigate back to Commissions with params to trigger refresh
        navigation.navigate('Commissions', { 
          commissionBlocked: true,
          blockedCommissionId: commissionId,
          refreshTimestamp: Date.now() // Force refresh
        });
        
      } catch (error) {
        console.log('Error saving not interested post:', error);
        Alert.alert("Error", "Failed to remove commission. Please try again.");
      }
    }
  };

  // UPDATED: Handle Report Post with AsyncStorage persistence and confirmation (same as HomeScreen)
  const handleReportPost = async () => {
    if (moreModal.post) {
      // Show confirmation dialog
      Alert.alert(
        "Report Post",
        "Are you sure you want to report this post?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Report",
            style: "destructive",
            onPress: async () => {
              try {
                // Add to reported list
                const updatedReported = [...reportedPosts, moreModal.post.id];
                setReportedPosts(updatedReported);
                
                // Save to AsyncStorage
                await AsyncStorage.setItem('reportedPosts', JSON.stringify(updatedReported));
                
                // Also block the commission immediately
                await handleBlockCommission();
                
                // Close modal
                setMoreModal({ visible: false, post: null });
                
                // Show success message
                Alert.alert("Report Submitted", "Thank you for reporting this post. Our team will review it.");
                
                console.log('Reported post:', {
                  id: moreModal.post.id,
                  title: moreModal.post.title,
                  user: moreModal.post.artist,
                  timestamp: new Date().toISOString()
                });
                
                // Navigate back
                navigation.goBack();
              } catch (error) {
                console.log('Error saving reported post:', error);
                Alert.alert("Error", "Failed to submit report. Please try again.");
              }
            }
          }
        ]
      );
    }
  };

  // NEW: Function to block commission and save to AsyncStorage
  const handleBlockCommission = async () => {
    if (moreModal.post) {
      try {
        // Generate a unique ID for the commission if it doesn't have one
        const commissionId = moreModal.post.id || 
          `${moreModal.post.title}-${moreModal.post.artist}`;
        
        // Save blocked commission to AsyncStorage
        const blockedCommissionsKey = 'blockedCommissions';
        const savedBlocked = await AsyncStorage.getItem(blockedCommissionsKey);
        let blockedCommissions = savedBlocked ? JSON.parse(savedBlocked) : [];
        
        // Add the commission ID to blocked list
        if (!blockedCommissions.includes(commissionId)) {
          blockedCommissions.push(commissionId);
          await AsyncStorage.setItem(blockedCommissionsKey, JSON.stringify(blockedCommissions));
        }
        
        // Also add to local state
        setBlockedPosts((prev) => [...prev, commissionId]);
        
        console.log('Commission blocked:', commissionId);
        return commissionId;
        
      } catch (error) {
        console.log('Error blocking commission:', error);
        throw error;
      }
    }
  };

  // UPDATED: Handle Block Post - Now saves to AsyncStorage and notifies CommissionsScreen
  const handleBlockPost = async () => {
    if (moreModal.post) {
      try {
        // Block the commission
        const blockedCommissionId = await handleBlockCommission();
        
        // Close modal
        setMoreModal({ visible: false, post: null });
        
        // Show success message
        Alert.alert("Success", "Commission has been blocked and will be removed from your list.");
        
        // Navigate back to Commissions with a flag to refresh
        navigation.navigate('Commissions', { 
          commissionBlocked: true,
          blockedCommissionId: blockedCommissionId
        });
        
      } catch (error) {
        console.log('Error blocking commission:', error);
        Alert.alert("Error", "Failed to block commission. Please try again.");
      }
    }
  };

  const handleStatusChange = (status) => {
    if (requestData.status === 'cancelled' || requestData.status === 'Canceled' || requestData.status === 'canceled') {
      // Don't allow status changes if already cancelled
      Alert.alert('Cannot Change Status', 'This commission has been cancelled and cannot be modified.');
      return;
    }

    if (requestData.status === 'complete' || requestData.status === 'completed' || requestData.status === 'Complete') {
      // Don't allow status changes if already completed
      Alert.alert('Cannot Change Status', 'This commission has been completed and cannot be modified.');
      return;
    }

    setCommissionStatus(status);
    if (status === 'ongoing') {
      setModalVisible(true); // Show modal when Ongoing is clicked
    } else if (status === 'unclaimed') {
      // Navigate to ConfirmPayment when Unclaimed is clicked
      navigation.navigate('ConfirmPayment', { 
        requestData: requestData 
      });
    } else if (status === 'completed') {
      // Handle complete status - you can add specific logic here
      console.log('Commission marked as completed');
    } else if (status === 'claimed') {
      // Handle claimed status - you can add specific logic here
      console.log('Commission marked as claimed');
    }
    console.log(`Commission status changed to: ${status}`);
  };

  const handleStopProcess = () => {
    setModalVisible(false);
    setStopProcessModalVisible(true);
    console.log('Stop Process pressed');
  };

  const handleConfirmStop = () => {
    setStopProcessModalVisible(false);
    setCommissionStatus('unclaimed');
    // Navigate to CancelFormScreen when "Yes, Cancel" is clicked
    navigation.navigate('CancelForm', { 
      requestData: requestData 
    });
    console.log('Process stopped, navigating to CancelFormScreen');
  };

  const handleCancelStop = () => {
    setStopProcessModalVisible(false);
    console.log('Stop process cancelled');
  };

  const handleCloseCancellationModal = () => {
    setCancellationModalVisible(false);
    setConfirmationText('');
    console.log('Cancellation modal closed');
  };

  const handleConfirmCancellation = () => {
    if (confirmationText.trim().toLowerCase() === 'confirm cancellation') {
      // Success - cancellation confirmed
      setCancellationModalVisible(false);
      setConfirmationText('');
      setCommissionStatus('cancelled');
      
      // Update requestData with cancellation status
      const updatedRequestData = {
        ...requestData,
        status: 'cancelled',
        cancellationReason: 'Cancelled via confirmation modal',
        cancelledAt: new Date().toISOString()
      };
      setRequestData(updatedRequestData);

      console.log('Commission cancelled successfully');

      // Navigate to Commissions screen with cancellation data
      navigation.navigate('Commissions', { 
        cancelledCommission: updatedRequestData
      });
    } else {
      // Show alert when incorrect text
      Alert.alert(
        'Incorrect Confirmation',
        'Please type "Confirm Cancellation" exactly as shown to proceed.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleKeepCommission = () => {
    setCancellationModalVisible(false);
    setConfirmationText('');
    console.log('Commission kept - cancellation cancelled');
  };

  // Status Badges for the image corner - UPDATED WITH COMPLETE AND CLAIMED
  const ImageStatusBadges = () => {
    const isCancelled = requestData.status === 'cancelled' || requestData.status === 'Canceled' || requestData.status === 'canceled';
    const isCompleted = requestData.status === 'complete' || requestData.status === 'completed' || requestData.status === 'Complete';

    console.log('Status badges - isCompleted:', isCompleted, 'isCancelled:', isCancelled, 'status:', requestData.status);

    return (
      <View style={styles.imageBadgeContainer}>
        <View style={styles.horizontalBadgeWrapper}>
          
          {/* 1. The Dynamic Status Slot (Ongoing, Cancelled, or Complete) */}
          {isCompleted ? (
            // Show Complete Badge (non-clickable)
            <View style={[styles.smallBadgeButton, styles.completeBadge]}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#50FA7B" />
              <Text style={[styles.smallBadgeText, { color: '#50FA7B' }]}>Complete</Text>
            </View>
          ) : isCancelled ? (
            // Show Static Cancelled Badge
            <View style={[styles.smallBadgeButton, styles.cancelledBadge]}>
              <Ionicons name="close-circle-outline" size={18} color="#FF6B6B" />
              <Text style={[styles.smallBadgeText, { color: '#FF6B6B' }]}>Cancelled</Text>
            </View>
          ) : (
            // Show Ongoing Button (if not completed or cancelled)
            <TouchableOpacity 
              style={[styles.smallBadgeButton, styles.ongoingBadge]}
              onPress={() => handleStatusChange('ongoing')}
            >
              <Ionicons name="settings-outline" size={18} color="#50FA7B" />
              <Text style={[styles.smallBadgeText, { color: '#50FA7B' }]}>On Going</Text>
            </TouchableOpacity>
          )}

          {/* Divider - Always show */}
          <View style={styles.verticalDivider} />

          {/* 2. The Right Side Button - Unclaimed or Claimed */}
          {isCompleted ? (
            // Show Claimed Badge for completed commissions (non-clickable)
            <View style={[styles.smallBadgeButton, styles.claimedBadge]}>
              <Ionicons name="checkmark-done-outline" size={18} color="#FFB86C" />
              <Text style={[styles.smallBadgeText, { color: '#FFB86C' }]}>Claimed</Text>
            </View>
          ) : (
            // Show Unclaimed Button for non-completed commissions
            <TouchableOpacity 
              style={[styles.smallBadgeButton, styles.unclaimedBadge]}
              onPress={() => handleStatusChange('unclaimed')}
            >
              <Ionicons name="hand-right-outline" size={18} color="#FFB86C" />
              <Text style={[styles.smallBadgeText, { color: '#FFB86C' }]}>Unclaimed</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Cancelled Banner Component
  const CancelledBanner = () => {
    if (requestData.status !== 'cancelled' && requestData.status !== 'Canceled' && requestData.status !== 'canceled') return null;
    
    return (
      <View style={styles.cancelledBanner}>
        <Ionicons name="warning-outline" size={20} color="#FF6B6B" />
        <Text style={styles.cancelledBannerText}>
          This commission was cancelled on {requestData.cancelledAt ? new Date(requestData.cancelledAt).toLocaleDateString() : new Date().toLocaleDateString()}
        </Text>
      </View>
    );
  };

  // Completed Banner Component
  const CompletedBanner = () => {
    if (requestData.status !== 'complete' && requestData.status !== 'completed' && requestData.status !== 'Complete') return null;
    
    return (
      <View style={styles.completedBanner}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#50FA7B" />
        <Text style={styles.completedBannerText}>
          This commission was completed on {requestData.completedAt ? new Date(requestData.completedAt).toLocaleDateString() : new Date().toLocaleDateString()}
        </Text>
      </View>
    );
  };

  // UPDATED: More Operations Modal (same as HomeScreen)
  const EllipsisModal = () => {
    const { isDarkMode, colors } = useTheme();
    return (
      <Modal transparent visible={moreModal.visible} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.bottomSheet,
              { 
                transform: [{ translateY: slideAnim }], 
                backgroundColor: colors.card,
                borderColor: colors.primary
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.primary }]}>More Operations</Text>
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com')}>
                <Ionicons name="logo-facebook" size={28} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('mailto:support@lumivana.com')}>
                <Ionicons name="mail-outline" size={28} color="#EA4335" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://t.me/lumivana')}>
                <Ionicons name="send-outline" size={28} color="#1DA1F2" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/lumivana')}>
                <Ionicons name="logo-twitter" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={handleNotInterested}
            >
              <Ionicons name="heart-dislike-outline" size={22} color="red" />
              <Text style={[styles.optionText, { color: colors.text }]}>Not interested</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={handleReportPost}
            >
              <Ionicons name="flag-outline" size={22} color="red" />
              <Text style={[styles.optionText, { color: colors.text }]}>Report Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={handleBlockPost}
            >
              <Ionicons name="close-circle-outline" size={22} color="red" />
              <Text style={[styles.optionText, { color: colors.text }]}>Block user</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setMoreModal({ visible: false, post: null })}
            >
              <Ionicons name="close" size={24} color={colors.primary} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  return (
    <LinearGradient 
      colors={isDarkMode ? gradients.background : gradients.main} 
      locations={isDarkMode ? [0, 1] : [0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "light-content"} translucent backgroundColor="transparent" />

        {/* Header (Back button on the left) */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Commissions")}>
              <Text style={[styles.backButtonText, { color: isDarkMode ? colors.primary : '#FFFFFF' }]}>←</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* New Container for Image and Badges */}
          <View style={styles.imageContainerWithBadges}>
            {/* Top Image Placeholder - Show first reference photo if available */}
            <View style={[styles.topImagePlaceholder, { 
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight,
              borderColor: isDarkMode ? 'rgba(255, 215, 0, 0.2)' : colors.cardBorder
            }]}>
              {/* FIX: Use optional chaining to prevent crash */}
              {requestData.referencePhotos?.length > 0 ? (
                <Image 
                  source={{ uri: requestData.referencePhotos[0] }} 
                  style={styles.mainImage}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="image-outline" size={60} color={colors.textMuted} />
              )}
            </View>
            
            {/* Status Badges - positioned absolutely over the image */}
            <ImageStatusBadges />
          </View>

          {/* Info Section (below image) */}
          <View style={styles.infoSection}>
            <Text style={[styles.requestTitle, { color: colors.primary }]}>{requestData.title}</Text>
            <Text style={[styles.requestType, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>{requestData.category || requestData.type}</Text>

            {/* Cancelled Banner - Shows when commission is cancelled */}
            <CancelledBanner />

            {/* Completed Banner - Shows when commission is completed */}
            <CompletedBanner />

            {/* Artist Row */}
            <View style={styles.artistRow}>
              <View style={styles.leftSide}>
                <View style={styles.profileCircle}>
                  <Ionicons name="person-circle-outline" size={40} color={colors.primary} />
                </View>
                <Text style={[styles.artistName, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>{requestData.artist}</Text>
              </View>

              {/* Right Side Actions: Follow + Menu */}
              <View style={styles.rightSideActions}>
                <TouchableOpacity style={[styles.followButton, { borderColor: colors.border }]}>
                  <Text style={[styles.followButtonText, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Follow</Text>
                </TouchableOpacity>

                {/* Menu Button */}
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={openMoreModal}
                >
                  <Ionicons name="ellipsis-vertical" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Commission Details Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Commission Details</Text>

            {/* Show cancellation reason if cancelled */}
            {(requestData.status === 'cancelled' || requestData.status === 'Canceled' || requestData.status === 'canceled') && requestData.cancellationReason && (
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Cancellation Reason</Text>
                <Text style={[styles.detailValue, { 
                  color: colors.text, 
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight 
                }]}>{requestData.cancellationReason}</Text>
              </View>
            )}

            {/* Show completion details if completed */}
            {(requestData.status === 'complete' || requestData.status === 'completed' || requestData.status === 'Complete') && requestData.completionNotes && (
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Completion Notes</Text>
                <Text style={[styles.detailValue, { 
                  color: colors.text, 
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight 
                }]}>{requestData.completionNotes}</Text>
              </View>
            )}

            {/* Show agreed price if available (for completed commissions) */}
            {(requestData.status === 'complete' || requestData.status === 'completed' || requestData.status === 'Complete') && requestData.agreedPrice && (
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Agreed Price</Text>
                <Text style={[styles.detailValue, { 
                  color: colors.text, 
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight 
                }]}>${requestData.agreedPrice}</Text>
              </View>
            )}

            {/* Description */}
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textSecondary : '#FFFFFF' }]}>Description</Text>
              <Text style={[styles.detailValue, { 
                color: colors.text, 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight 
              }]}>{requestData.description}</Text>
            </View>

            {/* Contact Information */}
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textSecondary : '#FFFFFF' }]}>Contact Information</Text>
              <Text style={[styles.detailValue, { 
                color: colors.text, 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight 
              }]}>{requestData.email}</Text>
            </View>

            {/* Commission Date */}
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textSecondary : '#FFFFFF' }]}>Commission Date</Text>
              <Text style={[styles.detailValue, { 
                color: colors.text, 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight 
              }]}>{requestData.date}</Text>
            </View>
          </View>

          {/* Image Grid Section - Show all reference photos */}
          <View style={styles.imageGrid}>
            {/* FIX: Use optional chaining to prevent crash */}
            {requestData.referencePhotos?.length > 0 ? (
              requestData.referencePhotos.map((photoUri, index) => (
                <View key={`photo-${requestData.id || 'unknown'}-${index}-${photoUri}`} style={[styles.gridImage, { 
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight 
                }]}>
                  <Image 
                    source={{ uri: photoUri }} 
                    style={styles.gridImageContent}
                    resizeMode="cover"
                  />
                </View>
              ))
            ) : (
              // Show placeholder images if no reference photos - use unique keys
              [1, 2, 3, 4].map((_, index) => (
                <View key={`placeholder-${requestData.id || 'unknown'}-${index}`} style={[styles.gridImage, { 
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.surfaceLight 
                }]}>
                  <Ionicons name="image-outline" size={40} color={colors.textMuted} />
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* FOOTER */}
        <View style={[styles.footer, { backgroundColor: isDarkMode ? colors.surface : 'rgba(255, 255, 255, 0.15)' }]}>
          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.plusSquareButton} onPress={() => navigation.navigate('Request')}>
            <View style={[styles.plusSquareContainer, { borderColor: colors.primary }]}>
              <Ionicons name="add" size={30} color={colors.primary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Commissions')}>
            <Ionicons name="briefcase-outline" size={24} color={colors.primary} />
            <Text style={[styles.footerText, styles.activeFooterText, { color: colors.primary }]}>Commissions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('FAQs')}>
            <Ionicons name="help-circle-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>FAQs</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* CANCELLATION CONFIRMATION MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={cancellationModalVisible}
        onRequestClose={handleCloseCancellationModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.confirmationModalView}>
            <Text style={styles.confirmationModalTitle}>PLEASE CONFIRM</Text>
            <View style={styles.confirmationModalTitleUnderline} />
            
            <Text style={styles.confirmationModalDescription}>
              This action cannot be undone.
            </Text>
            
            <Text style={styles.confirmationModalInstruction}>
              Type <Text style={styles.redText}>Confirm Cancellation</Text> to permanently cancel this work.
            </Text>

            <TextInput
              style={styles.confirmationTextInput}
              value={confirmationText}
              onChangeText={setConfirmationText}
              placeholder="Type here"
              placeholderTextColor="#999"
            />

            <View style={styles.confirmationModalButtonContainer}>
              <TouchableOpacity
                style={[styles.confirmationModalButton, styles.confirmButton]}
                onPress={handleConfirmCancellation}
              >
                <Text style={styles.confirmButtonText}>
                  Confirm
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.confirmationModalButton, styles.keepButton]}
                onPress={handleKeepCommission}
              >
                <Text style={styles.keepButtonText}>No, Keep it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* FIRST MODAL - Status Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Status</Text>
            <View style={styles.modalTitleUnderline} />
            <Text style={styles.modalDescription}>
              Ongoing
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonHoldOff]}
                onPress={handleStopProcess}
              >
                <Text style={styles.textHoldOff}>Stop Process</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonProceed]}
                onPress={handleHoldOff}
              >
                <Text style={styles.textProceed}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SECOND MODAL - Stop Process Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isStopProcessModalVisible}
        onRequestClose={() => setStopProcessModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle2}>WARNING!</Text>
            <View style={styles.modalTitleUnderline} />
            <Text style={styles.modalDescription}>
              Once canceled, this work cannot be recovered. Are you sure?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonCancel]}
                onPress={handleConfirmStop}
              >
                <Text style={styles.textConfirmStop}>Yes, Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonConfirmStop]}
                onPress={handleCancelStop}
              >
                <Text style={styles.textCancel}>No, Keep it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* UPDATED: More Operations Modal (same as HomeScreen) */}
      <EllipsisModal />
    </LinearGradient>
  );
};

// ... (styles remain the same)
const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 12, padding: 4 },
  backButtonText: { fontSize: 28, fontWeight: 'bold' },

  content: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },

  // NEW Container for Image + Badges
  imageContainerWithBadges: {
    position: 'relative',
    marginBottom: 20,
    width: SCREEN_WIDTH - 48,
    height: 180,
  },

  topImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },

  // Status Badge Styles (Small ones on the image)
  imageBadgeContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  horizontalBadgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallBadgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  ongoingBadge: {
    // Colors handled by text and icon
  },
  unclaimedBadge: {
    // Colors handled by text and icon
  },
  cancelledBadge: {
    // Colors handled by text and icon
  },
  completeBadge: {
    // Colors handled by text and icon
  },
  claimedBadge: {
    // Colors handled by text and icon
  },
  smallBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  // NEW: Vertical Divider Style
  verticalDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#666',
    marginHorizontal: 6,
    borderRadius: 1,
  },

  // Cancelled Banner Styles
  cancelledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  cancelledBannerText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },

  // Completed Banner Styles
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(80, 250, 123, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#50FA7B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  completedBannerText: {
    color: '#50FA7B',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },

  infoSection: {
    marginBottom: 20,
  },
  requestTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'Milonga',
  },
  requestType: {
    fontSize: 16,
    marginBottom: 8,
  },

  artistRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rightSideActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Follow button (Transparent with blue border)
  followButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 8,
  },
  followButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  menuButton: {
    padding: 5,
  },

  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailItem: { marginBottom: 16 },
  detailLabel: { fontSize: 14, marginBottom: 6 },
  detailValue: {
    fontSize: 15,
    padding: 12,
    borderRadius: 8,
  },

  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  gridImage: {
    width: (SCREEN_WIDTH - 72) / 2,
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  gridImageContent: {
    width: '100%',
    height: '100%',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerItem: { alignItems: 'center', flex: 1 },
  footerText: { fontSize: 12, marginTop: 2, textAlign: 'center' },
  activeFooterText: { fontWeight: 'bold' },
  plusSquareButton: { alignItems: 'center', marginHorizontal: 10 },
  plusSquareContainer: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- MODAL STYLES ---
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    padding: 25,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
    maxWidth: 400,
  },

  // NEW CONFIRMATION MODAL STYLES
  confirmationModalView: {
    margin: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    padding: 25,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
    maxWidth: 400,
  },
  confirmationModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4136',
    marginBottom: 10,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  confirmationModalTitleUnderline: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 20,
  },
  confirmationModalDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'left',
    marginBottom: 10,
    lineHeight: 22,
    alignSelf: 'flex-start',
  },
  confirmationModalInstruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
    marginBottom: 20,
    lineHeight: 20,
    alignSelf: 'flex-start',
  },
  confirmationTextInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 25,
    textAlign: 'left',
  },
  confirmationModalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15,
  },
  confirmationModalButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#FF4136',
  },
  keepButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#90EE90',
  },
  confirmButtonText: {
    color: '#FF4136',
    fontWeight: 'bold',
    fontSize: 16,
  },
  keepButtonText: {
    color: '#90EE90',
    fontWeight: 'bold',
    fontSize: 16,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalTitle2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4136',
    marginBottom: 5,
  },
  modalTitleUnderline: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 15,
    color: '#555',
    textAlign: 'left',
    marginBottom: 25,
    lineHeight: 22,
  },
  redText: {
    color: '#FF4136',
    fontWeight: 'bold',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15,
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonHoldOff: {
    backgroundColor: 'transparent', 
    borderWidth: 1.5,
    borderColor: '#FF4136',
  },
  textHoldOff: {
    color: '#FF4136',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonProceed: {
    backgroundColor: 'transparent', 
    borderWidth: 1.5,
    borderColor: '#90EE90',
  },
  textProceed: {
    color: '#90EE90',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonCancel: {
    backgroundColor: 'transparent', 
    borderWidth: 1.5,
    borderColor: '#FF4136',
  },
  textCancel: {
    color: '#90EE90',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonConfirmStop: {
    backgroundColor: 'transparent', 
    borderWidth: 1.5,
    borderColor: '#90EE90',
  },
  textConfirmStop: {
    color: '#FF4136',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // --- BOTTOM SHEET STYLES (same as HomeScreen) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  optionRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 12 
  },
  optionText: { 
    marginLeft: 8, 
    fontSize: 15 
  },
  closeBtn: { 
    position: "absolute", 
    top: 10, 
    right: 15 
  },
});

export default AcceptedCommissionInfoScreen;