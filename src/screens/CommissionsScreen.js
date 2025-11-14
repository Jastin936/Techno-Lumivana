import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  Animated,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rotateValue = new Animated.Value(0);
const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- Mock Data for Commission List ---
const mockCommissionsData = [
  {
    id: '1',
    date: 'August 8, 2025',
    title: 'Gold Earrings',
    description: 'A pair of shiny gold earrings with a few diamonds.',
    status: 'On Going',
    category: 'Crafting',
    artist: 'Kreideprinz',
    email: 'erinko@gmail.com',
    referencePhotos: [],
  },
  {
    id: '2',
    date: 'August 14, 2025',
    title: 'Green Wallet',
    description: 'A sturdy green leather wallet with a few cards.',
    status: 'On Going',
    category: 'Crafting',
    artist: 'Chiori',
    email: 'chiori@crafts.com',
    referencePhotos: [],
  },
  {
    id: '3',
    date: 'August 5, 2025',
    title: 'Red Bracelet',
    description: 'Red bracelet with a gold flower ornament',
    status: 'On Going',
    category: 'Crafting',
    artist: 'Aelric',
    email: 'aelric@design.com',
    referencePhotos: [],
  },
  {
    id: '4',
    date: 'July 29, 2025',
    title: 'Logo Design',
    description: 'A modern logo for a tech startup',
    status: 'Canceled',
    category: 'Graphic Design',
    artist: 'DesignPro',
    email: 'contact@designpro.com',
    referencePhotos: [],
  },
  {
    id: '5',
    date: 'July 28, 2025',
    title: 'Portrait Illustration',
    description: 'Digital portrait illustration in watercolor style',
    status: 'Complete',
    category: 'Illustration',
    artist: 'ArtMaster',
    email: 'art@master.com',
    referencePhotos: [],
  },
  {
    id: '6',
    date: 'July 25, 2025',
    title: 'Product Photography',
    description: 'Professional product photos for e-commerce',
    status: 'Complete',
    category: 'Photography',
    artist: 'PhotoExpert',
    email: 'photo@expert.com',
    referencePhotos: [],
  },
];

// Filter categories
const FILTER_CATEGORY_MAP = [
  { name: 'All', icon: 'apps-outline' },
  { name: 'Graphic Design', icon: 'color-palette-outline' },
  { name: 'Illustration', icon: 'brush-outline' },
  { name: 'Crafting', icon: 'hammer-outline' },
  { name: 'Writing', icon: 'document-text-outline' },
  { name: 'Photography', icon: 'camera-outline' },
  { name: 'Tutoring', icon: 'school-outline' },
];

// --- Helper Component for List Item ---
const CommissionItem = ({ 
  date, 
  title, 
  description, 
  status, 
  category, 
  referencePhotos, 
  artist, 
  email, 
  onPress 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'On Going':
        return '#4CAF50'; // Green
      case 'Canceled':
        return '#F44336'; // Red
      case 'Complete':
        return '#2196F3'; // Blue for Complete
      default:
        return '#aaa';
    }
  };

  return (
    <TouchableOpacity style={styles.commissionItemCard} onPress={onPress}>
      <View style={styles.thumbnailPlaceholder}>
        {referencePhotos && referencePhotos.length > 0 ? (
          <Image 
            source={{ uri: referencePhotos[0] }} 
            style={styles.thumbnailImage} 
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="image-outline" size={30} color="#555" />
        )}
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={[styles.statusTag, { backgroundColor: getStatusColor(status) }]}>
            {status}
          </Text>
        </View>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.descriptionText}>{description}</Text>
        <View style={styles.categoryRow}>
          <Ionicons name={FILTER_CATEGORY_MAP.find(cat => cat.name === category)?.icon || 'apps-outline'} size={14} color="#FFD700" />
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Filter Modal Component
const FilterModal = ({ isVisible, onClose, selectedCategory, setSelectedCategory }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <View style={modalStyles.headerRow}>
            <Text style={modalStyles.title}>Filter</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Ionicons name="close" size={24} color="#FFD700" /> 
            </TouchableOpacity>
          </View>
          
          <Text style={modalStyles.categoryHeader}>Category</Text>
          <ScrollView style={modalStyles.categoryList}>
            {FILTER_CATEGORY_MAP.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={modalStyles.categoryItem}
                onPress={() => {
                  setSelectedCategory(item.name);
                  onClose();
                }}
              >
                <View style={modalStyles.categoryTextContainer}>
                  <Ionicons 
                    name={item.icon} 
                    size={25} 
                    color="#FFD700"
                    style={modalStyles.categoryIcon}
                  />
                  <Text style={modalStyles.categoryText}>{item.name}</Text>
                </View>

                <View style={modalStyles.checkbox(selectedCategory === item.name)}>
                  {selectedCategory === item.name && (
                    <Ionicons name="checkmark-sharp" size={16} color="#000" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const CommissionsScreen = ({ navigation, route }) => {
  const [activeCategory, setActiveCategory] = useState('all'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [commissions, setCommissions] = useState(mockCommissionsData);

  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [userData, setUserData] = useState({
    name: 'Lumivana Vivistera',
    profileImage: null
  });

  // Handle ALL commission updates in one useEffect
  useEffect(() => {
    console.log('Route params updated:', route.params);
    
    // Handle new commission from AgreementFormScreen
    if (route.params?.newCommission) {
      const newCommission = {
        ...route.params.newCommission,
        id: route.params.newCommission.id || `commission-${Date.now()}`,
        date: route.params.newCommission.date || new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        status: route.params.newCommission.status || 'On Going',
        category: route.params.newCommission.category || 'Custom Commission',
        artist: route.params.newCommission.artist || 'Pending Artist',
        email: route.params.newCommission.email || route.params.newCommission.contact || 'No email provided',
        referencePhotos: route.params.newCommission.referencePhotos || []
      };
      
      console.log('Adding new commission:', newCommission);
      setCommissions(prevCommissions => [newCommission, ...prevCommissions]);
      navigation.setParams({ newCommission: null });
    }

    // Handle completed commission from ConfirmPaymentScreen
    if (route.params?.completedCommission) {
      const completedCommission = route.params.completedCommission;
      console.log('Processing completed commission:', completedCommission);
      
      setCommissions(prevCommissions => {
        let commissionUpdated = false;
        const updatedCommissions = prevCommissions.map(commission => {
          // Match by ID first, then by title and artist
          if (commission.id === completedCommission.id) {
            console.log('Matched commission by ID for completion:', commission.title);
            commissionUpdated = true;
            return { 
              ...commission, 
              status: 'Complete',
              completedAt: completedCommission.completedAt,
              agreedPrice: completedCommission.agreedPrice
            };
          }
          
          // Fallback matching by title and artist
          if (commission.title === completedCommission.title && 
              commission.artist === completedCommission.artist) {
            console.log('Matched commission by title/artist for completion:', commission.title);
            commissionUpdated = true;
            return { 
              ...commission, 
              status: 'Complete',
              completedAt: completedCommission.completedAt,
              agreedPrice: completedCommission.agreedPrice
            };
          }
          
          return commission;
        });

        // If no existing commission was found, add as new
        if (!commissionUpdated) {
          console.log('No existing commission found, adding as new completed commission');
          const newCompletedCommission = {
            ...completedCommission,
            status: 'Complete',
            date: completedCommission.date || new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          };
          return [newCompletedCommission, ...prevCommissions];
        }
        
        console.log('Commissions after completion update:', updatedCommissions);
        return updatedCommissions;
      });
      
      navigation.setParams({ completedCommission: null });
    }

    // Handle cancelled commission
    if (route.params?.cancelledCommission) {
      const cancelledCommission = route.params.cancelledCommission;
      console.log('Processing cancelled commission:', cancelledCommission);
      
      setCommissions(prevCommissions => {
        const updatedCommissions = prevCommissions.map(commission => {
          if (commission.id === cancelledCommission.id) {
            console.log('Matched commission for cancellation:', commission.title);
            return { 
              ...commission, 
              status: 'Canceled',
              cancellationReason: cancelledCommission.cancellationReason,
              cancelledAt: cancelledCommission.cancelledAt
            };
          }
          
          if (commission.title === cancelledCommission.title && 
              commission.artist === cancelledCommission.artist) {
            console.log('Matched commission by title/artist for cancellation:', commission.title);
            return { 
              ...commission, 
              status: 'Canceled',
              cancellationReason: cancelledCommission.cancellationReason,
              cancelledAt: cancelledCommission.cancelledAt
            };
          }
          
          return commission;
        });
        
        console.log('Commissions after cancellation update:', updatedCommissions);
        return updatedCommissions;
      });
      
      navigation.setParams({ cancelledCommission: null });
    }

    // Handle general commission updates
    if (route.params?.updatedCommission) {
      const updatedCommission = route.params.updatedCommission;
      console.log('Processing updated commission:', updatedCommission);
      
      setCommissions(prevCommissions => 
        prevCommissions.map(commission => {
          if (commission.id === updatedCommission.id) {
            return { ...commission, ...updatedCommission };
          }
          if (commission.title === updatedCommission.title && 
              commission.artist === updatedCommission.artist) {
            return { ...commission, ...updatedCommission };
          }
          return commission;
        })
      );
      
      navigation.setParams({ updatedCommission: null });
    }
  }, [route.params, navigation]);

  // Set up focus listener to refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('CommissionsScreen focused, checking for updates...');
      // Force re-check of route params when screen comes into focus
      if (route.params) {
        navigation.setParams({ ...route.params });
      }
      loadUserData();
    });

    return unsubscribe;
  }, [navigation, route.params]);

  // Continuous rotation loop
  useEffect(() => {
    const startRotation = () => {
      rotateValue.setValue(0);
      Animated.timing(rotateValue, {
        toValue: 10,
        duration: 30000,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          startRotation();
        }, 30000);
      });
    };

    startRotation();
    
    return () => {
      rotateValue.stopAnimation();
    };
  }, []);

  // Interpolate rotation value
  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 10],
    outputRange: ['0deg', '3600deg'],
  });

  // Animated style for logo
  const animatedLogoStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  // Load user data from AsyncStorage
  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userProfileData');
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        setUserData(prevData => ({
          ...prevData,
          name: parsedData.name || 'Lumivana Vivistera',
          profileImage: parsedData.profileImage || null
        }));
      }

      const savedProfileImage = await AsyncStorage.getItem('profileImage');
      if (savedProfileImage) {
        setUserData(prevData => ({
          ...prevData,
          profileImage: savedProfileImage
        }));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  // Handle commission item press - navigate to AcceptedCommissionInfoScreen
  const handleCommissionPress = (commission) => {
    const commissionData = {
      ...commission,
      title: commission.title,
      description: commission.description,
      category: commission.category,
      artist: commission.artist,
      email: commission.email,
      referencePhotos: commission.referencePhotos || [],
      status: commission.status,
      date: commission.date,
      cancellationReason: commission.cancellationReason,
      cancelledAt: commission.cancelledAt,
      completedAt: commission.completedAt,
      agreedPrice: commission.agreedPrice
    };

    navigation.navigate('AcceptedCommissionInfo', {
      requestData: commissionData,
    });
  };

  // Filter commissions based on search and category
  const filteredCommissions = commissions.filter((commission) => {
    const matchesSearch = 
      commission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commission.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All' || commission.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#0E0E0E", "#1A1A1A"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Animated.Image
                source={require('../../assets/lumivana.png')}
                style={[styles.logo, animatedLogoStyle]}
                resizeMode="contain"
              />
              <Text style={[styles.logoText, { fontFamily: 'Milonga' }]}>Lumivana</Text>
            </View>

            {/* Profile Icon Navigation */}
            <TouchableOpacity
              style={styles.profileIcon}
              onPress={() => navigation.navigate('Profile')}
            >
              {userData.profileImage ? (
                <Image 
                  source={{ uri: userData.profileImage }} 
                  style={styles.profileImage} 
                />
              ) : (
                <Ionicons name="person-circle-outline" size={36} color="#FFD700" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* 🔍 SEARCH BAR AND FILTER */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#FFD700" />
            <TextInput
              placeholder="Search commissions..."
              placeholderTextColor="#aaa"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
            <Ionicons name="filter-outline" size={22} color="#FFD700" />
          </TouchableOpacity>
        </View>

        {/* Active Filter Indicator */}
        {selectedCategory !== 'All' && (
          <View style={styles.activeFilterContainer}>
            <Text style={styles.activeFilterText}>
              Filtering by: <Text style={styles.activeFilterCategory}>{selectedCategory}</Text>
            </Text>
            <TouchableOpacity 
              style={styles.clearFilterButton}
              onPress={() => setSelectedCategory('All')}
            >
              <Ionicons name="close-circle" size={16} color="#FFD700" />
            </TouchableOpacity>
          </View>
        )}

        {/* Main Content: Commission List */}
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.commissionsList}>
            {filteredCommissions.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={50} color="#666" />
                <Text style={styles.noResultsText}>
                  {searchQuery.length > 0 
                    ? `No results found for "${searchQuery}"`
                    : `No ${selectedCategory} commissions found`
                  }
                </Text>
                <Text style={styles.noResultsSubText}>
                  Try adjusting your search or filters
                </Text>
              </View>
            ) : (
              filteredCommissions.map((item) => (
                <CommissionItem
                  key={item.id || `commission-${item.title}-${item.artist}`}
                  date={item.date}
                  title={item.title}
                  description={item.description}
                  status={item.status}
                  category={item.category}
                  referencePhotos={item.referencePhotos}
                  artist={item.artist}
                  email={item.email}
                  onPress={() => handleCommissionPress(item)}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('Search')}
          >
            <Ionicons name="search-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Search</Text>
          </TouchableOpacity>

          {/* Plus Square Icon in Center */}
          <TouchableOpacity 
            style={styles.plusSquareButton}
            onPress={() => navigation.navigate('Request')}
          >
            <View style={styles.plusSquareContainer}>
              <Ionicons name="add" size={30} color="#FFD700" /> 
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem}>
            <Ionicons name="briefcase" size={24} color="#FFD700" />
            <Text style={[styles.footerText, styles.activeFooterText]}>Commissions</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('FAQs')}
          >
            <Ionicons name="help-circle-outline" size={24} color="#FFD700" /> 
            <Text style={styles.footerText}>FAQs</Text>
          </TouchableOpacity>
        </View>

        {/* 🧩 FILTER MODAL */}
        <FilterModal 
          isVisible={filterVisible} 
          onClose={() => setFilterVisible(false)}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

// Modal Styles (same as HomeScreen)
const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end', 
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.45,
    backgroundColor: '#1C1C1C',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    flex: 1, 
    textAlign: 'center',
  },
  closeButton: {
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    position: 'absolute', 
    right: 20,
    top: 0,
  },
  categoryHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  categoryList: {
    flex: 1, 
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryTextContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    color: '#CCC',
  },
  checkbox: (isChecked) => ({
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: isChecked ? '#FFD700' : '#FFF', 
    backgroundColor: isChecked ? '#FFD700' : 'transparent', 
    justifyContent: 'center',
    alignItems: 'center',
  }),
});

const styles = StyleSheet.create({
  // --- General Styles ---
  container: { 
    flex: 1 
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },  
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  logo: { 
    width: 40, 
    height: 40, 
    marginRight: 8 
  },
  logoText: { 
    fontSize: 28, 
    color: '#fff',
    fontFamily: 'Milonga',
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  
  // 🔍 SEARCH BAR STYLES
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1C",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
  },
  searchInput: { 
    flex: 1, 
    color: "#fff", 
    marginLeft: 8, 
    fontSize: 14 
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: "#1C1C1C",
    borderRadius: 10,
    padding: 10,
  },

  // Active Filter Indicator
  activeFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    marginHorizontal: 16,
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  activeFilterText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 8,
  },
  activeFilterCategory: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  clearFilterButton: {
    padding: 4,
  },

  // --- Main Content & List Styles ---
  content: { 
    flexGrow: 1,
    paddingHorizontal: 24, 
    paddingTop: 20,
    paddingBottom: 20,
  },
  commissionsList: {
    // List container
  },
  
  // Commission Item Card Styles
  commissionItemCard: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1C', 
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  thumbnailPlaceholder: {
    width: 90,
    height: 90, 
    backgroundColor: '#333',
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#aaa',
    fontWeight: '500',
    marginTop: 2,
  },
  statusTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  descriptionText: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#FFD700',
    marginLeft: 4,
  },
  
  // No Results Styles
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  noResultsSubText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  
  // --- Footer Styles ---
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    paddingVertical: 10, 
    paddingBottom: 40, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    backgroundColor: 'rgba(0,0,0,0.2)' 
  },
  footerItem: { 
    alignItems: 'center',
    flex: 1,
  },
  footerText: { 
    color: '#aaa', 
    fontSize: 12, 
    marginTop: 2, 
    textAlign: 'center' 
  },
  activeFooterText: { 
    color: '#FFD700', 
    fontWeight: 'bold' 
  },
  plusSquareButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
   plusSquareContainer: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default CommissionsScreen;