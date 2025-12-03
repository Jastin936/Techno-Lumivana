import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Animated,
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
import { CATEGORY_LIST } from '../constants/categories';
import { useTheme } from '../context/ThemeContext';

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
const FILTER_CATEGORY_MAP = CATEGORY_LIST;

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
  const { isDarkMode, colors } = useTheme();
  const getStatusColor = (status) => {
    const normalizedStatus = status ? status.toLowerCase() : '';
    
    if (normalizedStatus === 'on going' || normalizedStatus === 'ongoing') return '#4CAF50';
    if (normalizedStatus === 'canceled' || normalizedStatus === 'cancelled') return '#F44336';
    if (normalizedStatus === 'complete' || normalizedStatus === 'completed') return '#2196F3';
    
    return colors.textMuted;
  };

  return (
    <TouchableOpacity style={[styles.commissionItemCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]} onPress={onPress}>
      <View style={[styles.thumbnailPlaceholder, { backgroundColor: colors.surfaceLight }]}>
        {referencePhotos && referencePhotos.length > 0 ? (
          <Image 
            source={{ uri: referencePhotos[0] }} 
            style={styles.thumbnailImage} 
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="image-outline" size={30} color={colors.textMuted} />
        )}
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
          <Ionicons name={FILTER_CATEGORY_MAP.find(cat => cat.name === category)?.icon || 'apps-outline'} size={14} color={colors.primary} />
          <Text style={[styles.categoryText, { color: colors.primary }]}>{category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Filter Modal Component
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
                    <Ionicons name="checkmark-sharp" size={16} color={isDarkMode ? "#000000ff" : "#000"} />
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
  const { isDarkMode, colors, gradients } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // UPDATED: Start with empty state, load mock only if storage is empty
  const [commissions, setCommissions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [userData, setUserData] = useState({
    name: 'Lumivana Vivistera',
    profileImage: null
  });

  const getGradientLocations = () => {
    const currentColors = isDarkMode ? gradients.background : gradients.main;
    return currentColors.length === 3 ? [0, 0.58, 0.84] : [0, 1];
  };

  // Helper function to remove duplicates
  const getUniqueCommissions = (list) => {
    const unique = new Map();
    list.forEach(item => {
      const key = item.id || `${item.title}-${item.artist}`;
      if (!unique.has(key)) {
        unique.set(key, item);
      }
    });
    return Array.from(unique.values());
  };

  // UPDATED: Load commissions from Storage on mount
  useEffect(() => {
    const loadCommissions = async () => {
      try {
        const savedData = await AsyncStorage.getItem('savedCommissions');
        if (savedData) {
          console.log('Loaded commissions from storage');
          setCommissions(JSON.parse(savedData));
        } else {
          console.log('No saved commissions, loading mock data');
          setCommissions(mockCommissionsData);
        }
      } catch (error) {
        console.log('Error loading commissions:', error);
        setCommissions(mockCommissionsData);
      } finally {
        setIsLoaded(true);
      }
    };
    loadCommissions();
  }, []);

  // UPDATED: Save commissions to Storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      const saveCommissions = async () => {
        try {
          await AsyncStorage.setItem('savedCommissions', JSON.stringify(commissions));
          console.log('Commissions saved to storage');
        } catch (error) {
          console.log('Error saving commissions:', error);
        }
      };
      saveCommissions();
    }
  }, [commissions, isLoaded]);

  // Handle Updates (New, Complete, Cancel)
  useEffect(() => {
    if (!isLoaded) return; // Wait until loaded

    // New Commission
    if (route.params?.newCommission) {
      const newCommission = {
        ...route.params.newCommission,
        id: route.params.newCommission.id || `commission-${Date.now()}`,
        date: route.params.newCommission.date || new Date().toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        }),
        status: route.params.newCommission.status || 'On Going',
        category: route.params.newCommission.category || 'Custom Commission',
        artist: route.params.newCommission.artist || 'Pending Artist',
        email: route.params.newCommission.email || route.params.newCommission.contact || 'No email provided',
        referencePhotos: route.params.newCommission.referencePhotos || []
      };
      
      setCommissions(prevCommissions => {
        const exists = prevCommissions.some(c => c.id === newCommission.id);
        if (exists) return prevCommissions;
        return [newCommission, ...prevCommissions];
      });
      navigation.setParams({ newCommission: null });
    }

    // Completed Commission
    if (route.params?.completedCommission) {
      const completedCommission = route.params.completedCommission;
      setCommissions(prevCommissions => {
        const exists = prevCommissions.some(c => c.id === completedCommission.id);
        if (exists) {
          return prevCommissions.map(commission => {
            if (commission.id === completedCommission.id) {
              return { 
                ...commission, 
                status: 'Complete',
                completedAt: completedCommission.completedAt,
                agreedPrice: completedCommission.agreedPrice
              };
            }
            return commission;
          });
        } else {
          return [{
            ...completedCommission,
            status: 'Complete',
            date: completedCommission.date || new Date().toLocaleDateString()
          }, ...prevCommissions];
        }
      });
      navigation.setParams({ completedCommission: null });
    }

    // Cancelled Commission
    if (route.params?.cancelledCommission) {
      const cancelledCommission = route.params.cancelledCommission;
      setCommissions(prevCommissions => {
        return prevCommissions.map(commission => {
          if (commission.id === cancelledCommission.id) {
            return { 
              ...commission, 
              status: 'Canceled',
              cancellationReason: cancelledCommission.cancellationReason,
              cancelledAt: cancelledCommission.cancelledAt
            };
          }
          return commission;
        });
      });
      navigation.setParams({ cancelledCommission: null });
    }

    // General Update
    if (route.params?.updatedCommission) {
      const updatedCommission = route.params.updatedCommission;
      setCommissions(prevCommissions => 
        prevCommissions.map(commission => {
          if (commission.id === updatedCommission.id) {
            return { ...commission, ...updatedCommission };
          }
          return commission;
        })
      );
      navigation.setParams({ updatedCommission: null });
    }
  }, [route.params, navigation, isLoaded]);

  // Load User Data
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
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
        } catch (error) { console.log(error); }
      };
      loadUserData();
    });
    return unsubscribe;
  }, [navigation]);

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

  const filteredCommissions = getUniqueCommissions(commissions).filter((commission) => {
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
      colors={isDarkMode ? gradients.background : gradients.main}
      locations={getGradientLocations()}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "light-content"} translucent backgroundColor="transparent" />

        {/* Header */}
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
                  style={[styles.profileImage, { borderColor: colors.primary }]} 
                />
              ) : (
                <Ionicons name="person-circle-outline" size={36} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* 🔍 SEARCH BAR AND FILTER */}
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
          <View style={[styles.activeFilterContainer, { 
            backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(207, 173, 1, 0.2)' 
          }]}>
            <Text style={[styles.activeFilterText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.9)' }]}>
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

        {/* Main Content: Commission List */}
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.commissionsList}>
            {filteredCommissions.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={50} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.6)'} />
                <Text style={[styles.noResultsText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.9)' }]}>
                  {searchQuery.length > 0 
                    ? `No results found for "${searchQuery}"`
                    : `No ${selectedCategory} commissions found`
                  }
                </Text>
                <Text style={[styles.noResultsSubText, { color: isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)' }]}>
                  Try adjusting your search or filters
                </Text>
              </View>
            ) : (
              filteredCommissions.map((item, index) => (
                <CommissionItem
                  key={item.id || `commission-${index}`} 
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
        <View style={[styles.footer, { 
          backgroundColor: isDarkMode ? colors.surface : 'rgba(255, 255, 255, 0.15)' 
        }]}>
          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('Search')}
          >
            <Ionicons name="search-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>Search</Text>
          </TouchableOpacity>

          {/* Plus Square Icon in Center */}
          <TouchableOpacity 
            style={styles.plusSquareButton}
            onPress={() => navigation.navigate('Request')}
          >
            <View style={[styles.plusSquareContainer, { borderColor: colors.primary }]}>
              <Ionicons name="add" size={30} color={colors.primary} /> 
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem}>
            <Ionicons name="briefcase" size={24} color={colors.primary} />
            <Text style={[styles.footerText, styles.activeFooterText, { color: colors.primary }]}>Commissions</Text>
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
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'flex-start',
    borderWidth: 1,
  },
  thumbnailPlaceholder: {
    width: 90,
    height: 90, 
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
  
  // No Results Styles
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
  
  // --- Footer Styles ---
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