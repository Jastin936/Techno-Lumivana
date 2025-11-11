import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rotateValue = new Animated.Value(0);

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- Icon Mapping for Filter Categories ---
const FILTER_CATEGORY_MAP = [
  { name: 'Creative' },
  { name: 'Writing' },
  { name: 'Customize' },
  { name: 'Food' },
  { name: 'Tools' },
  { name: 'Accessories' },
  { name: 'Gears' },
  { name: 'School Supplies' },
];

// --- Component for the Filter Modal ---
const FilterModal = ({ isVisible, onClose, selectedCategory, onCategorySelect }) => {
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
                  onCategorySelect(item.name);
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

// --- SearchScreen Component ---

const COMMISSION_QUICK_LINKS = [
  { 
    id: 1, 
    title: 'Poster/Banner Design', 
    description: 'Eye-catching posters for school events, org activities, or academic presentations.', 
    icon: 'image-outline',
    searchTag: 'poster design',
    category: 'Creative'
  },
  { 
    id: 2, 
    title: 'Caricatures', 
    description: 'Fun, exaggerated portraits for birthdays, events, or gifts.', 
    icon: 'happy-outline',
    searchTag: 'caricature portrait',
    category: 'Creative'
  },
  { 
    id: 3, 
    title: 'Invitation designs', 
    description: 'Digital invites for birthdays, parties, or school events.', 
    icon: 'mail-outline',
    searchTag: 'digital invitation',
    category: 'Creative'
  },
  { 
    id: 4, 
    title: 'Cover art', 
    description: 'For Wattpad stories, school publications, or music projects.', 
    icon: 'book-outline',
    searchTag: 'book cover art',
    category: 'Writing'
  },
  { 
    id: 5, 
    title: 'Custom Illustrations', 
    description: 'Original artwork for personal or commercial use.', 
    icon: 'color-palette-outline',
    searchTag: 'custom illustration',
    category: 'Creative'
  },
  { 
    id: 6, 
    title: 'Logo/Branding', 
    description: 'Professional logos and branding packages.', 
    icon: 'diamond-outline',
    searchTag: 'brand logo',
    category: 'Customize'
  },
  { 
    id: 7, 
    title: 'Food Photography', 
    description: 'Professional food shots for menus and social media.', 
    icon: 'camera-outline',
    searchTag: 'food photography',
    category: 'Food'
  },
  { 
    id: 8, 
    title: 'Recipe Writing', 
    description: 'Detailed recipe creation and food blog content.', 
    icon: 'restaurant-outline',
    searchTag: 'recipe writing',
    category: 'Writing'
  },
  { 
    id: 9, 
    title: 'Custom Stickers', 
    description: 'Personalized sticker designs for planners and laptops.', 
    icon: 'shapes-outline',
    searchTag: 'custom stickers',
    category: 'Accessories'
  },
  { 
    id: 10, 
    title: 'T-Shirt Design', 
    description: 'Unique designs for clothing and merchandise.', 
    icon: 'shirt-outline',
    searchTag: 't-shirt design',
    category: 'Accessories'
  },
  { 
    id: 11, 
    title: 'Notebook Covers', 
    description: 'Custom designs for school notebooks and journals.', 
    icon: 'journal-outline',
    searchTag: 'notebook design',
    category: 'School Supplies'
  },
  { 
    id: 12, 
    title: 'Repair Services', 
    description: 'Fix and maintenance for gadgets and electronics.', 
    icon: 'construct-outline',
    searchTag: 'repair services',
    category: 'Tools'
  },
  { 
    id: 13, 
    title: 'Essay Writing', 
    description: 'Academic essays and research papers for students.', 
    icon: 'newspaper-outline',
    searchTag: 'essay writing',
    category: 'Writing'
  },
  { 
    id: 14, 
    title: 'Story Writing', 
    description: 'Creative fiction, short stories, and narratives.', 
    icon: 'book-outline',
    searchTag: 'story writing',
    category: 'Writing'
  },
  { 
    id: 15, 
    title: 'Script Writing', 
    description: 'Scripts for videos, plays, and presentations.', 
    icon: 'film-outline',
    searchTag: 'script writing',
    category: 'Writing'
  },
  { 
    id: 16, 
    title: 'Copywriting', 
    description: 'Marketing copy, ads, and promotional content.', 
    icon: 'megaphone-outline',
    searchTag: 'copywriting',
    category: 'Writing'
  },
];

const SearchScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userData, setUserData] = useState({
    name: '',
    profileImage: null
  });

  // Load user data from AsyncStorage
  useEffect(() => {
    loadUserData();
  }, []);

  // Continuous rotation loop (30s rotate, 30s rest)
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
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedLogoStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userProfileData');
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        setUserData(prevData => ({
          ...prevData,
          name: parsedData.name || '',
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });

    return unsubscribe;
  }, [navigation]);

  const SEARCH_CATEGORIES = ['All', 'Creative', 'Writing', 'Customize', 'Food', 'Tools', 'Accessories', 'Gears', 'School Supplies'];
  
  // Filter commission links based on search query and category
  const getFilteredCommissions = () => {
    let filtered = COMMISSION_QUICK_LINKS;

    // Filter by category
    if (activeTab !== 'All') {
      filtered = filtered.filter(item => item.category === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.searchTag.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredCommissions = getFilteredCommissions();

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setActiveTab(category);
  };
  
  const handleQuickLinkPress = (searchTag) => {
    setSearchQuery(searchTag);
  };
  
  const renderQuickLink = ({ item }) => (
    <TouchableOpacity 
      style={styles.quickLinkItem} 
      onPress={() => handleQuickLinkPress(item.searchTag)} 
    >
      <View style={styles.quickLinkImageContainer}>
        <Ionicons name={item.icon} size={40} color="#999" />
      </View>
      <View style={styles.quickLinkTextContent}>
        <Text style={styles.quickLinkTitle}>{item.title}</Text>
        <Text style={styles.quickLinkDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={["#0E0E0E", "#1A1A1A"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Animated.Image
              source={require('../../assets/lumivana.png')}
              style={[styles.logo, animatedLogoStyle]}
              resizeMode="contain"
            />
            <Text style={[styles.logoText, { fontFamily: 'Milonga' }]}>Lumivana</Text>
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
              <Ionicons name="person-circle-outline" size={36} color="#FFD700" />
            )}
          </TouchableOpacity>
        </View>

        {/* IMAGE PLACEHOLDER */}
        <View style={styles.imagePlaceholderContainer}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={40} color="#999" />
            <Text style={styles.imagePlaceholderText}>Featured Content</Text>
          </View>
        </View>

        {/* FIXED SEARCH AND FILTER SECTION */}
        <View style={styles.fixedSection}>
          {/* FILTER TABS */}
          <View style={filterTabStyles.tabContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={filterTabStyles.tabRow}
            >
              {SEARCH_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setActiveTab(category)}
                  style={[filterTabStyles.tabButton, activeTab === category && filterTabStyles.activeTabButton]}
                >
                  <Text style={[filterTabStyles.tabText, activeTab === category && filterTabStyles.activeTabText]}>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Search Bar */}
          <View style={searchBarStyles.searchBarContainer}>
            <View style={searchBarStyles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#FFD700" />
              <TextInput
                placeholder="Search commissions..."
                placeholderTextColor="#aaa"
                style={searchBarStyles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity style={searchBarStyles.filterButton} onPress={() => setIsFilterModalVisible(true)}>
              <Ionicons name="filter-outline" size={22} color="#FFD700" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SCROLLABLE CONTENT AREA */}
        <ScrollView 
          style={styles.scrollableContent}
          contentContainerStyle={styles.scrollableContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Commission Quick Links / Categories */}
          <View style={styles.quickLinksSection}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? `Results for "${searchQuery}"` : 'Browse Commission Types'}
            </Text>
            
            {filteredCommissions.length > 0 ? (
              <FlatList
                data={filteredCommissions}
                renderItem={renderQuickLink}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                scrollEnabled={false} 
                columnWrapperStyle={styles.quickLinkColumnWrapper}
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={64} color="#555" />
                <Text style={styles.noResultsTitle}>No results found</Text>
                <Text style={styles.noResultsText}>
                  Try searching with different keywords or browse all categories
                </Text>
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => {
                    setSearchQuery('');
                    setActiveTab('All');
                  }}
                >
                  <Text style={styles.clearButtonText}>Clear Search</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Filter Modal Integration */}
        <FilterModal 
          isVisible={isFilterModalVisible} 
          onClose={() => setIsFilterModalVisible(false)}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem}>
            <Ionicons name="search" size={24} color="#FFD700" />
            <Text style={[styles.footerText, styles.activeFooterText]}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.plusSquareButton}
            onPress={() => navigation.navigate('Request')}
          >
            <View style={styles.plusSquareContainer}>
              <Ionicons name="add" size={30} color="#FFD700" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('Commissions')}
          >
            <Ionicons name="briefcase-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Commissions</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('FAQs')}
          >
            <Ionicons name="help-circle-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>FAQs</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingTop: 50, 
    paddingHorizontal: 24, 
    paddingBottom: 16, 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20, 
    backgroundColor: 'rgba(0,0,0,0.2)' 
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, marginRight: 8 },
  logoText: { fontSize: 28, color: '#fff' },
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
  
  imagePlaceholderContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    color: '#999',
    fontSize: 16,
    marginTop: 8,
    fontWeight: '500',
  },
  
  fixedSection: {},
  
  scrollableContent: {
    flex: 1,
  },
  scrollableContentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },

  quickLinksSection: {
    marginBottom: 20,
  },
  quickLinkItem: {
    width: '48%', 
    backgroundColor: 'rgba(30,30,30,0.85)',
    borderRadius: 12,
    padding: 12,
  },
  quickLinkColumnWrapper: {
    justifyContent: 'space-between', 
    marginBottom: 16, 
  },
  quickLinkImageContainer: {
    width: '100%',
    height: 80, 
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLinkTextContent: {},
  quickLinkTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickLinkDescription: {
    color: '#aaa',
    fontSize: 12,
  },
  
  // No Results Styles
  noResultsContainer: {
    backgroundColor: 'rgba(30,30,30,0.5)',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginTop: 20,
  },
  noResultsTitle: {
    color: '#ddd',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  clearButton: {
    backgroundColor: '#f6c33b',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  clearButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  
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
    color: '#fff', 
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

// --- Filter Tab Styles ---
const filterTabStyles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    backgroundColor: "#1A1A1A",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#333",
    marginTop: 10,
  },
  tabRow: {
    flexDirection: "row",
  },
  tabButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 10,
  },
  tabText: { 
    color: "#999", 
    fontSize: 13 
  },
  activeTabButton: { 
    borderBottomWidth: 2, 
    borderColor: "#FFD700" 
  },
  activeTabText: { 
    color: "#FFD700", 
    fontWeight: "bold" 
  },
});

// --- Search Bar Styles ---
const searchBarStyles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 24,
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
});

// --- Modal Specific Styles ---
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

export default SearchScreen;