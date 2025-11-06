import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  TextInput,
  Modal,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// MOVE rotateValue OUTSIDE THE COMPONENT - this is the key fix
const rotateValue = new Animated.Value(0);

const HomeScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState(route.params?.activeTab || "Home");
  const [following, setFollowing] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userData, setUserData] = useState({
    name: '',
    profileImage: null
  });

  // Continuous rotation loop (30s rotate, 30s rest)
  useEffect(() => {
    const startRotation = () => {
      // Reset rotation value
      rotateValue.setValue(0);
      
      // Rotate for 30 seconds
      Animated.timing(rotateValue, {
        toValue: 10,
        duration: 30000,
        useNativeDriver: true,
      }).start(() => {
        // After rotation completes, wait 30 seconds then restart
        setTimeout(() => {
          startRotation();
        }, 30000);
      });
    };

    // Start the loop
    startRotation();
    
    // Cleanup function
    return () => {
      rotateValue.stopAnimation();
    };
  }, []);

  // Interpolate rotation value
  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Animated style for logo
  const animatedLogoStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  // Use the same categories and icons as SearchScreen
  const FILTER_CATEGORY_MAP = [
    { name: 'All', icon: 'apps-outline' },
    { name: 'Graphic Design', icon: 'color-palette-outline' },
    { name: 'Illustration', icon: 'brush-outline' },
    { name: 'Crafting', icon: 'hammer-outline' },
    { name: 'Writing', icon: 'document-text-outline' },
    { name: 'Photography', icon: 'camera-outline' },
    { name: 'Tutoring', icon: 'school-outline' },
  ];

  // Load user data from AsyncStorage
  useEffect(() => {
    loadUserData();
  }, []);

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

      // Also load profile image from AsyncStorage
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

  // Handle activeTab parameter from navigation
  useEffect(() => {
    if (route.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
  }, [route.params?.activeTab]);
  
  // Refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });

    return unsubscribe;
  }, [navigation]);

  const recommendedUsers = [
    { id: 1, name: "Kreidedeprinz", role: "Illustrator", followers: 707, category: "Illustration" },
    { id: 2, name: "Chiori", role: "Crafter, Graphic Designer", followers: 680, category: "Crafting" },
    { id: 3, name: "Aelric", role: "Writer", followers: 423, category: "Writing" },
    { id: 4, name: "Timaeus", role: "Tutor", followers: 520, category: "Tutoring" },
  ];

  const allPosts = [
    {
      id: 1,
      user: "Kreidedeprinz",
      role: "Artist",
      title: "Logo Design",
      description: "Unique logos for student organizations or small businesses.",
      likes: 707,
      type: "home",
    },
    {
      id: 2,
      user: "Timaeus",
      role: "Tutor",
      title: "Peer Tutoring",
      description: "Helping college students excel in creative writing.",
      likes: 542,
      type: "home",
    },
    {
      id: 3,
      user: "Pierro",
      role: "Designer",
      title: "Poster Commission",
      description: "Offering custom poster designs for events and orgs.",
      likes: 430,
      type: "request",
    },
  ];

  const filteredPosts = allPosts.filter((post) => {
    if (activeTab === "Following") return following[post.user];
    if (activeTab === "Requests") return post.type === "request";
    return true;
  });

  const filteredUsers = recommendedUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || user.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFollow = (userName) => {
    setFollowing((prev) => ({ ...prev, [userName]: !prev[userName] }));
  };

  const renderPostCard = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postUser}>
          <View style={styles.avatar} />
          <View>
            <Text style={styles.userName}>{item.user}</Text>
            <Text style={styles.userRole}>{item.role}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.followBtn, following[item.user] && styles.followingBtn]}
          onPress={() => toggleFollow(item.user)}
        >
          <Text style={[styles.followText, following[item.user] && styles.followingText]}>
            {following[item.user] ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imagePlaceholder} />

      <View style={styles.postBody}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDesc}>{item.description}</Text>
      </View>

      <View style={styles.postFooter}>
        <Ionicons name="heart" size={18} color="#FF5555" />
        <Text style={styles.likeCount}>{item.likes}</Text>
      </View>
    </View>
  );

  // Filter Modal Component (Same as SearchScreen)
  const FilterModal = ({ isVisible, onClose }) => {
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

  return (
    <LinearGradient colors={["#0E0E0E", "#1A1A1A"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        
        {/* HEADER - Updated Profile Icon */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Animated.Image
              source={require('../../assets/lumivana.png')}
              style={[styles.logo, animatedLogoStyle]}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Lumivana</Text>
          </View>
          
          {/* Updated Profile Icon - Same as ProfileScreen */}
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

        {/* 🟡 TOP TABS */}
        <View style={styles.tabRow}>
          {["Following", "Home", "Requests"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🔍 SEARCH BAR BELOW TABS */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#FFD700" />
            <TextInput
              placeholder="Search users..."
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

        <ScrollView>
          {/* Recommended Users */}
          {activeTab === "Home" && (
            <View style={styles.recommendedSection}>
              <View style={styles.recommendedHeader}>
                <Text style={styles.sectionTitle}>Recommended Users</Text>
                <TouchableOpacity onPress={() => navigation.navigate("RecommendedScreen")}>
                  <Text style={styles.viewMore}>View More</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filteredUsers.map((user) => (
                  <View key={user.id} style={styles.recommendedCard}>
                    <View style={styles.avatarLarge} />
                    <Text style={styles.recUserName}>{user.name}</Text>
                    <Text style={styles.recUserRole}>{user.role}</Text>
                    <TouchableOpacity
                      style={[styles.followBtn, following[user.name] && styles.followingBtn]}
                      onPress={() => toggleFollow(user.name)}
                    >
                      <Text
                        style={[styles.followText, following[user.name] && styles.followingText]}
                      >
                        {following[user.name] ? "Following" : "Follow"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* POSTS */}
          <FlatList
            data={filteredPosts}
            renderItem={renderPostCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </ScrollView>

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home" size={24} color="#FFD700" />
            <Text style={[styles.footerText, styles.activeFooterText]}>Home</Text>
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

        {/* 🧩 FILTER MODAL - SAME DESIGN AS SEARCH SCREEN */}
        <FilterModal 
          isVisible={filterVisible} 
          onClose={() => setFilterVisible(false)} 
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

// --- Modal Specific Styles (Same as SearchScreen) ---
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

// --- Main Styles (Remain the same) ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // HEADER STYLES - Updated Profile Icon
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
    fontFamily: 'Milonga' 
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

  // Original HomeScreen Styles
  tabRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    backgroundColor: "#1A1A1A",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#333",
    marginTop: 10,
  },
  tabButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 10,
  },
  tabText: { color: "#999", fontSize: 13 },
  activeTabButton: { borderBottomWidth: 2, borderColor: "#FFD700" },
  activeTabText: { color: "#FFD700", fontWeight: "bold" },
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
  searchInput: { flex: 1, color: "#fff", marginLeft: 8, fontSize: 14 },
  filterButton: {
    marginLeft: 10,
    backgroundColor: "#1C1C1C",
    borderRadius: 10,
    padding: 10,
  },

  recommendedSection: { paddingVertical: 10, paddingHorizontal: 16 },
  recommendedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: { color: "#FFD700", fontSize: 16, fontWeight: "bold" },
  viewMore: { color: "#FFD700", fontSize: 13, textDecorationLine: "underline" },
  recommendedCard: {
    width: 140,
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    alignItems: "center",
  },
  avatarLarge: {
    width: 60,
    height: 60,
    backgroundColor: "#FFD700",
    borderRadius: 30,
    marginBottom: 8,
  },
  recUserName: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  recUserRole: { color: "#ccc", fontSize: 12, textAlign: "center" },

  postCard: {
    backgroundColor: "#1C1C1C",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFD70030",
    padding: 12,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postUser: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#FFD700",
    borderRadius: 20,
    marginRight: 10,
  },
  userName: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  userRole: { color: "#bbb", fontSize: 12 },
  followBtn: {
    backgroundColor: "#FFD700",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  followText: { color: "#000", fontWeight: "600" },
  followingBtn: { backgroundColor: "#333" },
  followingText: { color: "#FFD700" },
  imagePlaceholder: {
    backgroundColor: "#333",
    borderRadius: 12,
    height: 150,
    marginVertical: 10,
  },
  postBody: { marginBottom: 8 },
  postTitle: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  postDesc: { color: "#ccc", fontSize: 13 },
  postFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  likeCount: { color: "#fff", marginLeft: 6 },

  // FOOTER STYLES
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

export default HomeScreen;