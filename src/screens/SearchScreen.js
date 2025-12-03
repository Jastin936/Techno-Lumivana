import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
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
import { CATEGORY_LIST } from '../constants/categories';
import { useTheme } from '../context/ThemeContext';

const rotateValue = new Animated.Value(0);
const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- Mock Data for Search Results ---
const mockCommissionsData = [
  {
    id: '1',
    date: 'August 8, 2025',
    title: 'Gold Earrings',
    description: 'A pair of shiny gold earrings with a few diamonds.',
    status: 'On Going',
    category: 'Crafting',
    artist: 'Jewelry Master',
    email: 'jewelry@example.com',
    referencePhotos: [],
  },
  {
    id: '2',
    date: 'August 14, 2025',
    title: 'Green Wallet',
    description: 'A sturdy green leather wallet with a few cards.',
    status: 'On Going',
    category: 'Crafting',
    artist: 'Leather Craftsman',
    email: 'leather@example.com',
    referencePhotos: [],
  },
  {
    id: '3',
    date: 'August 5, 2025',
    title: 'Red Bracelet',
    description: 'Red bracelet with a gold flower ornament',
    status: 'On Going',
    category: 'Crafting',
    artist: 'Accessory Artist',
    email: 'accessories@example.com',
    referencePhotos: [],
  },
  {
    id: '4',
    date: 'July 29, 2025',
    title: 'Logo Design',
    description: 'A modern logo for a tech startup',
    status: 'Canceled',
    category: 'Graphic Design',
    artist: 'Design Pro',
    email: 'design@example.com',
    referencePhotos: [],
  },
  {
    id: '5',
    date: 'July 28, 2025',
    title: 'Portrait Illustration',
    description: 'Digital portrait illustration in watercolor style',
    status: 'On Going',
    category: 'Illustration',
    artist: 'Digital Artist',
    email: 'illustration@example.com',
    referencePhotos: [],
  },
  {
    id: '6',
    date: 'July 25, 2025',
    title: 'Product Photography',
    description: 'Professional product photos for e-commerce',
    status: 'On Going',
    category: 'Photography',
    artist: 'Photo Expert',
    email: 'photo@example.com',
    referencePhotos: [],
  },
];

// Filter categories - Same as CommissionsScreen
const FILTER_CATEGORY_MAP = CATEGORY_LIST;


const COMMISSION_QUICK_LINKS = [
  { 
    id: 1, 
    title: 'Poster/Banner Design', 
    description: 'Eye-catching posters for school events, org activities, or academic presentations.', 
    icon: 'image-outline',
    searchTag: 'poster design',
    category: 'Graphic Design',
    artist: 'Design Specialist',
    email: 'poster@example.com',
  },
  { 
    id: 2, 
    title: 'Caricatures', 
    description: 'Fun, exaggerated portraits for birthdays, events, or gifts.', 
    icon: 'happy-outline',
    searchTag: 'caricature portrait',
    category: 'Illustration',
    artist: 'Portrait Artist',
    email: 'caricature@example.com',
  },
  { 
    id: 3, 
    title: 'Invitation designs', 
    description: 'Digital invites for birthdays, parties, or school events.', 
    icon: 'mail-outline',
    searchTag: 'digital invitation',
    category: 'Graphic Design',
    artist: 'Invitation Designer',
    email: 'invitation@example.com',
  },
  { 
    id: 4, 
    title: 'Cover art', 
    description: 'For Wattpad stories, school publications, or music projects.', 
    icon: 'book-outline',
    searchTag: 'book cover art',
    category: 'Illustration',
    artist: 'Cover Artist',
    email: 'cover@example.com',
  },
  { 
    id: 5, 
    title: 'Custom Illustrations', 
    description: 'Original artwork for personal or commercial use.', 
    icon: 'color-palette-outline',
    searchTag: 'custom illustration',
    category: 'Illustration',
    artist: 'Illustration Expert',
    email: 'illustration@example.com',
  },
  { 
    id: 6, 
    title: 'Logo/Branding', 
    description: 'Professional logos and branding packages.', 
    icon: 'diamond-outline',
    searchTag: 'brand logo',
    category: 'Graphic Design',
    artist: 'Branding Specialist',
    email: 'logo@example.com',
  },
];

// --- Helper Component for Commission Item ---
const CommissionItem = ({ date, title, description, status, category, onPress }) => {
  const { isDarkMode, colors } = useTheme();
  const getStatusColor = (status) => {
    switch (status) {
      case 'On Going':
        return '#4CAF50'; // Green
      case 'Canceled':
        return '#F44336'; // Red
      default:
        return colors.textMuted;
    }
  };

  return (
    <TouchableOpacity style={[styles.commissionItemCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]} onPress={onPress}>
      <View style={[styles.thumbnailPlaceholder, { backgroundColor: colors.surfaceLight }]}>
        <Ionicons name="image-outline" size={30} color={colors.textMuted} />
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>{date}</Text>
          <Text style={[styles.statusTag, { backgroundColor: getStatusColor(status) }]}>
            {status}
          </Text>
        </View>
        <Text style={[styles.titleText, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>{description}</Text>
        <View style={styles.categoryRow}>
          {/* FIX: Safe find for category icon */}
          <Ionicons name={FILTER_CATEGORY_MAP.find(cat => cat.name === category)?.icon || 'apps-outline'} size={14} color={colors.primary} />
          <Text style={[styles.categoryText, { color: colors.primary }]}>{category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- Filter Modal Component - Same as CommissionsScreen ---
const FilterModal = ({ isVisible, onClose, selectedCategory, setSelectedCategory }) => {
  const { isDarkMode, colors } = useTheme();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={[modalStyles.modalView, { backgroundColor: colors.card }]}>
          <View style={modalStyles.headerRow}>
            <Text style={[modalStyles.title, { color: colors.primary }]}>Filter</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Ionicons name="close" size={24} color={colors.primary} /> 
            </TouchableOpacity>
          </View>
          
          <Text style={[modalStyles.categoryHeader, { color: colors.text }]}>Category</Text>
          <ScrollView style={modalStyles.categoryList}>
            {FILTER_CATEGORY_MAP.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={[modalStyles.categoryItem, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setSelectedCategory(item.name);
                  onClose();
                }}
              >
                <View style={modalStyles.categoryTextContainer}>
                  <Ionicons 
                    name={item.icon} 
                    size={25} 
                    color={colors.primary}
                    style={modalStyles.categoryIcon}
                  />
                  <Text style={[modalStyles.categoryText, { color: colors.textSecondary }]}>{item.name}</Text>
                </View>

                <View style={[modalStyles.checkbox(selectedCategory === item.name), { 
                  borderColor: selectedCategory === item.name ? colors.primary : colors.border,
                  backgroundColor: selectedCategory === item.name ? colors.primary : 'transparent'
                }]}>
                  {selectedCategory === item.name && (
                    <Ionicons name="checkmark-sharp" size={16} color={isDarkMode ? "#000" : "#000"} />
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

// --- SearchScreen Component ---
const SearchScreen = ({ navigation }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userData, setUserData] = useState({
    name: '',
    profileImage: null
  });

  // Load user data from AsyncStorage
  useEffect(() => {
    loadUserData();
  }, []);

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

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 10],
    outputRange: ['0deg', '3600deg'],
  });

  const animatedLogoStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userProfileData');
      if (savedUserData) {
        // FIX: Safer parsing
        try {
          const parsedData = JSON.parse(savedUserData);
          setUserData(prevData => ({
            ...prevData,
            name: parsedData.name || '',
            profileImage: parsedData.profileImage || null
          }));
        } catch (parseError) {
          console.log('Error parsing user data:', parseError);
        }
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });

    return unsubscribe;
  }, [navigation]);

  // Filter commissions based on search and category - Same logic as CommissionsScreen
  const filteredCommissions = mockCommissionsData.filter((commission) => {
    const matchesSearch = 
      commission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commission.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All' || commission.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Filter quick links based on selected category
  const filteredQuickLinks = COMMISSION_QUICK_LINKS.filter((link) => {
    return selectedCategory === 'All' || link.category === selectedCategory;
  });

  // Handle commission item click
  const handleCommissionItemPress = (commission) => {
    const productData = {
      title: commission.title,
      type: commission.category,
      artist: commission.artist,
      description: commission.description,
      email: commission.email,
      referencePhotos: commission.referencePhotos,
      category: commission.category
    };
    
    navigation.navigate('ProductInfo', {
      requestData: productData
    });
  };

  // Handle quick link press
  const handleQuickLinkPress = (item) => {
    const productData = {
      title: item.title,
      type: item.category,
      artist: item.artist,
      description: item.description,
      email: item.email,
      referencePhotos: [],
      category: item.category
    };

    navigation.navigate('ProductInfo', {
      requestData: productData
    });
  };

  const renderQuickLink = ({ item }) => (
    <TouchableOpacity 
      style={[styles.quickLinkItem, { backgroundColor: colors.card, borderColor: colors.cardBorder }]} 
      onPress={() => handleQuickLinkPress(item)} 
    >
      <View style={[styles.quickLinkImageContainer, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
        <Ionicons name={item.icon} size={40} color={colors.primary} />
      </View>
      <View style={styles.quickLinkTextContent}>
        <Text style={[styles.quickLinkTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.quickLinkDescription, { color: colors.textSecondary }]}>{item.description}</Text>
        <View style={styles.quickLinkCategory}>
          {/* FIX: Safe find for category icon */}
          <Ionicons name={FILTER_CATEGORY_MAP.find(cat => cat.name === item.category)?.icon || 'apps-outline'} size={12} color={colors.primary} />
          <Text style={[styles.quickLinkCategoryText, { color: colors.primary }]}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient 
      colors={isDarkMode ? gradients.background : gradients.main} 
      locations={isDarkMode ? [0, 1] : [0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "light-content"} translucent backgroundColor="transparent" />

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Animated.Image
                source={require('../../assets/lumivana.png')}
                style={[styles.logo, animatedLogoStyle]}
                resizeMode="contain"
              />
              <Text style={[styles.logoText, { fontFamily: 'Milonga', color: isDarkMode ? colors.text : '#FFFFFF' }]}>Lumivana</Text>
            </View>

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
                <Ionicons name="person-circle-outline" size={36} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* IMAGE PLACEHOLDER - MOVED ABOVE SEARCH BAR */}
        {searchQuery.length === 0 && (
          <View style={styles.imagePlaceholderContainer}>
            <View style={[styles.imagePlaceholder, { 
              backgroundColor: isDarkMode ? colors.surface : colors.surfaceLight,
              borderColor: isDarkMode ? colors.border : colors.cardBorder
            }]}>
              <Ionicons name="images-outline" size={50} color={isDarkMode ? colors.textMuted : colors.primary} />
              <Text style={[styles.imagePlaceholderText, { 
                color: isDarkMode ? colors.text : '#0B005F',
                fontWeight: 'bold'
              }]}>Featured Commissions</Text>
              <Text style={[styles.imagePlaceholderSubtext, { 
                color: isDarkMode ? colors.textSecondary : '#0B005F' 
              }]}>
                Discover amazing artwork and creative services
              </Text>
            </View>
          </View>
        )}

        {/* 🔍 SEARCH BAR AND FILTER - Now below image placeholder */}
        <View style={styles.searchBarContainer}>
          <View style={[styles.searchBar, { backgroundColor: isDarkMode ? colors.surface : 'rgba(255, 255, 255, 0.15)' }]}>
            <Ionicons name="search-outline" size={20} color={colors.primary} />
            <TextInput
              placeholder="Search commissions..."
              placeholderTextColor={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.6)'}
              style={[styles.searchInput, { color: isDarkMode ? colors.text : '#FFFFFF' }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: isDarkMode ? colors.surface : 'rgba(255, 255, 255, 0.15)' }]} onPress={() => setFilterVisible(true)}>
            <Ionicons name="filter-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Active Filter Indicator */}
        {selectedCategory !== 'All' && (
          <View style={[styles.activeFilterContainer, { backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(207, 173, 1, 0.1)' }]}>
            <Text style={[styles.activeFilterText, { color: colors.textSecondary }]}>
              Filtering by: <Text style={[styles.activeFilterCategory, { color: colors.primary }]}>{selectedCategory}</Text>
            </Text>
            <TouchableOpacity 
              style={styles.clearFilterButton}
              onPress={() => setSelectedCategory('All')}
            >
              <Ionicons name="close-circle" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}

        {/* SCROLLABLE CONTENT AREA */}
        <ScrollView 
          style={styles.scrollableContent}
          contentContainerStyle={styles.scrollableContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Commission Quick Links (Only visible when search bar is empty) */}
          {searchQuery.length === 0 && (
            <View style={styles.quickLinksSection}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Browse Commission Types</Text>
              <FlatList
                data={filteredQuickLinks}
                renderItem={renderQuickLink}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.quickLinkColumnWrapper}
              />
            </View>
          )}

          {/* Search Results (Displayed when searching or when category filter is active) */}
          {(searchQuery.length > 0 || selectedCategory !== 'All') && (
            <View style={styles.resultsContainer}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>
                {searchQuery.length > 0 
                  ? `Search Results for "${searchQuery}"`
                  : `All ${selectedCategory} Commissions`
                }
              </Text>
              <View style={styles.commissionsList}>
                {filteredCommissions.map((item) => (
                  <CommissionItem
                    key={item.id}
                    date={item.date}
                    title={item.title}
                    description={item.description}
                    status={item.status}
                    category={item.category}
                    onPress={() => handleCommissionItemPress(item)}
                  />
                ))}
                {filteredCommissions.length === 0 && (
                  <View style={styles.noResultsContainer}>
                    <Ionicons name="search-outline" size={50} color={colors.textMuted} />
                    <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
                      {searchQuery.length > 0 
                        ? `No results found for "${searchQuery}"`
                        : `No ${selectedCategory} commissions found`
                      }
                    </Text>
                    <Text style={[styles.noResultsSubText, { color: colors.textMuted }]}>
                      Try adjusting your search or filters
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* FOOTER */}
        <View style={[styles.footer, { backgroundColor: isDarkMode ? colors.surface : 'rgba(255, 255, 255, 0.15)' }]}>
          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem}>
            <Ionicons name="search" size={24} color={colors.primary} />
            <Text style={[styles.footerText, styles.activeFooterText, { color: colors.primary }]}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.plusSquareButton}
            onPress={() => navigation.navigate('Request')}
          >
            <View style={[styles.plusSquareContainer, { borderColor: colors.primary }]}>
              <Ionicons name="add" size={30} color={colors.primary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('Commissions')}
          >
            <Ionicons name="briefcase-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>Commissions</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('FAQs')}
          >
            <Ionicons name="help-circle-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>FAQs</Text>
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

// --- Main Styles ---
const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
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
    borderColor: 'transparent', // Will be set dynamically
  },
  
  // NEW: Image Placeholder Styles - Now positioned above search bar
  imagePlaceholderContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 15,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  imagePlaceholderSubtext: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  // 🔍 SEARCH BAR STYLES - Same as CommissionsScreen
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 5,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 8, 
    fontSize: 14 
  },
  filterButton: {
    marginLeft: 10,
    borderRadius: 10,
    padding: 10,
  },

  // Active Filter Indicator
  activeFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  activeFilterText: {
    fontSize: 14,
    marginRight: 8,
  },
  activeFilterCategory: {
    fontWeight: 'bold',
  },
  clearFilterButton: {
    padding: 4,
  },

  // SCROLLABLE CONTENT
  scrollableContent: {
    flex: 1,
  },
  scrollableContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  quickLinksSection: {
    marginBottom: 20,
  },
  quickLinkItem: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  quickLinkColumnWrapper: {
    justifyContent: 'space-between',
  },
  quickLinkImageContainer: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  quickLinkTextContent: {
    // 
  },
  quickLinkTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickLinkDescription: {
    fontSize: 12,
    marginBottom: 6,
  },
  quickLinkCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickLinkCategoryText: {
    fontSize: 11,
    marginLeft: 4,
  },

  // Results container
  resultsContainer: {
    marginBottom: 10,
  },

  // Commission List Styles - Same as CommissionsScreen
  commissionsList: {
    // List container
  },
  commissionItemCard: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  thumbnailPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 2,
  },
  descriptionText: {
    fontSize: 12,
    marginBottom: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  categoryText: {
    fontSize: 12,
    marginLeft: 4,
  },

  // No Results Styles - SAME AS HOME SCREEN
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  noResultsSubText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },

  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  // Footer
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    paddingVertical: 10, 
    paddingBottom: 40, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
  },
  footerItem: { 
    alignItems: 'center',
    flex: 1,
  },
  footerText: { 
    fontSize: 12, 
    marginTop: 2, 
    textAlign: 'center' 
  },
  activeFooterText: { 
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
    borderColor: 'transparent', // Will be set dynamically
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

// --- Modal Styles (same as CommissionsScreen) ---
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
  },
  checkbox: (isChecked) => ({
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  }),
});

export default SearchScreen;