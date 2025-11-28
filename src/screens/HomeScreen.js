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
  Easing,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORY_LIST, CATEGORY_ICON_MAP } from '../constants/categories';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MoreOptionsModal from "../components/MoreOptionsModal";

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  
  // NEW: State for ellipsis modal
  const [moreModal, setMoreModal] = useState({ visible: false, post: null });
  const [blockedPosts, setBlockedPosts] = useState([]);
  const slideAnim = useState(new Animated.Value(300))[0];

  const [requests, setRequests] = useState([
    {
      id: 1,
      title: "Poster/Banner Design",
      description: "Offering custom poster designs for events and orgs.",
      icon: "image-outline",
      category: "Graphic Design",
      artist: "Kredaspirinz",
      email: "e-mail@poster.com"
    },
    {
      id: 2,
      title: "Logo Design Request",
      description: "Need a modern logo for my startup company.",
      icon: "diamond-outline",
      category: "Graphic Design",
      artist: "DesignPro",
      email: "contact@designpro.com"
    },
    {
      id: 3,
      title: "Character Illustration",
      description: "Fantasy character art for book cover.",
      icon: "color-palette-outline",
      category: "Illustration",
      artist: "ArtMaster",
      email: "art@master.com"
    },
    {
      id: 4,
      title: "Website Development",
      description: "Portfolio website with modern design.",
      icon: "code-outline",
      category: "Graphic Design",
      artist: "WebDevPro",
      email: "dev@webpro.com"
    },
    {
      id: 5,
      title: "Content Writing",
      description: "Blog articles for tech company.",
      icon: "document-text-outline",
      category: "Writing",
      artist: "ContentWriter",
      email: "write@content.com"
    },
    {
      id: 6,
      title: "Photo Editing",
      description: "Professional photo retouching services.",
      icon: "camera-outline",
      category: "Photography",
      artist: "PhotoExpert",
      email: "edit@photo.com"
    }
  ]);

  // Handle new commission from RequestCommissionScreen
  useEffect(() => {
    if (route.params?.newCommission) {
      const newRequest = {
        id: Date.now().toString(),
        title: route.params.newCommission.title,
        description: route.params.newCommission.description,
        icon: getIconForCategory(route.params.newCommission.category),
        category: route.params.newCommission.category,
        artist: "Pending Artist",
        email: route.params.newCommission.contact,
        referencePhotos: route.params.newCommission.referencePhotos,
        date: route.params.newCommission.date,
        status: "pending"
      };
      
      // Add the new request to the beginning of the list
      setRequests(prevRequests => [newRequest, ...prevRequests]);
      
      // Clear the params to avoid adding duplicate requests
      navigation.setParams({ newCommission: null });
    }
  }, [route.params?.newCommission]);

  // Helper function to get icon based on category
  const getIconForCategory = (category) => {
  return CATEGORY_ICON_MAP[category] || 'create-outline';
};

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
    inputRange: [0, 10],
    outputRange: ['0deg', '3600deg'],
  });

  // Animated style for logo
  const animatedLogoStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  // NEW: Slide animation for modal
  const slideUp = () => {
    slideAnim.setValue(300);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // Use the same categories and icons as CommissionsScreen
 const FILTER_CATEGORY_MAP = CATEGORY_LIST;

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
      category: "Graphic Design"
    },
    {
      id: 2,
      user: "Timaeus",
      role: "Tutor",
      title: "Peer Tutoring",
      description: "Helping college students excel in creative writing.",
      likes: 542,
      type: "home",
      category: "Tutoring"
    },
    {
      id: 3,
      user: "Pierro",
      role: "Designer",
      title: "Poster Commission",
      description: "Offering custom poster designs for events and orgs.",
      likes: 430,
      type: "request",
      category: "Graphic Design"
    },
    {
      id: 4,
      user: "Aelric",
      role: "Writer",
      title: "Content Writing",
      description: "Professional blog and article writing services.",
      likes: 320,
      type: "home",
      category: "Writing"
    },
    {
      id: 5,
      user: "Chiori",
      role: "Crafter",
      title: "Handmade Crafts",
      description: "Custom handmade crafts and DIY projects.",
      likes: 280,
      type: "home",
      category: "Crafting"
    },
  ];

  // NEW: Functions for ellipsis modal actions
  const openMoreModal = (post) => {
    setMoreModal({ visible: true, post });
    slideUp();
  };

  const handleBlockPost = () => {
    if (moreModal.post) {
      setBlockedPosts((prev) => [...prev, moreModal.post.id]);
      setMoreModal({ visible: false, post: null });
      Alert.alert("Success", "Post has been blocked");
    }
  };

    const handleNotInterested = () => {
  if (moreModal.post) {
    setNotInterestedPosts(prev => [...prev, moreModal.post.id]);
    setMoreModal({ visible: false, post: null });
    Alert.alert("Noted", "We'll show fewer posts like this.");
  }
};


  const handleReportPost = () => {
    if (moreModal.post) {
      console.log('Report post:', moreModal.post.title);
      setMoreModal({ visible: false, post: null });
      Alert.alert("Report Submitted", "Thank you for reporting this post");
    }
  };

  // Filter functions for different tabs - EXACT SAME LOGIC AS COMMISSIONS SCREEN
  const getFilteredRecommendedUsers = () => {
    return recommendedUsers.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "All" || user.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  const getFilteredPosts = () => {
    let filtered = allPosts.filter((post) => {
      if (activeTab === "Following") return following[post.user];
      if (activeTab === "Requests") return post.type === "request";
      return post.type === "home";
    });

    // Apply search and category filters - SAME LOGIC AS COMMISSIONS SCREEN
    filtered = filtered.filter((post) => {
      const matchesSearch = 
        post.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "All" || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Filter out blocked posts
    filtered = filtered.filter((post) => !blockedPosts.includes(post.id));

    return filtered;
  };

  const getFilteredRequests = () => {
    return requests.filter((request) => {
      const matchesSearch = 
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "All" || request.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

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

        <View style={styles.postHeaderRight}>
          <TouchableOpacity
            style={[styles.followBtn, following[item.user] && styles.followingBtn]}
            onPress={() => toggleFollow(item.user)}
          >
            <Text style={[styles.followText, following[item.user] && styles.followingText]}>
              {following[item.user] ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.ellipsisButton}
            onPress={() => openMoreModal(item)}
          >
            <Ionicons name="ellipsis-vertical" size={16} color="#999" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.imagePlaceholder} />

      <View style={styles.postBody}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDesc}>{item.description}</Text>
        <View style={styles.categoryRow}>
          <Ionicons name={FILTER_CATEGORY_MAP.find(cat => cat.name === item.category)?.icon || 'apps-outline'} size={14} color="#FFD700" />
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.postFooter}>
        <Ionicons name="heart" size={18} color="#FF5555" />
        <Text style={styles.likeCount}>{item.likes}</Text>
      </View>
    </View>
  );

  // Render Request Card for Requests Tab - 2-column grid layout
  const renderRequestCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.quickLinkItem}
      onPress={() => {
        // Navigate to RequestInfoScreen and pass the request data
        navigation.navigate('RequestInfo', {
          requestData: item // Pass the entire request item
        });
      }}
    >
      <View style={styles.quickLinkImageContainer}>
        {item.referencePhotos && item.referencePhotos.length > 0 ? (
          <Image 
            source={{ uri: item.referencePhotos[0] }} 
            style={styles.requestImage}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name={item.icon} size={40} color="#FFD700" />
        )}
      </View>
      <View style={styles.quickLinkTextContent}>
        <Text style={styles.quickLinkTitle}>{item.title}</Text>
        <Text style={styles.quickLinkDescription}>{item.description}</Text>
        <View style={styles.categoryRow}>
          <Ionicons name={FILTER_CATEGORY_MAP.find(cat => cat.name === item.category)?.icon || 'apps-outline'} size={12} color="#FFD700" />
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        {item.status === 'pending' && (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>New</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render Recommended User Card
  const renderRecommendedCard = (user) => (
    <View key={user.id} style={styles.recommendedCard}>
      <View style={styles.avatarLarge} />
      <Text style={styles.recUserName}>{user.name}</Text>
      <Text style={styles.recUserRole}>{user.role}</Text>
      <View style={styles.categoryRow}>
        <Ionicons name={FILTER_CATEGORY_MAP.find(cat => cat.name === user.category)?.icon || 'apps-outline'} size={12} color="#FFD700" />
        <Text style={styles.categoryText}>{user.category}</Text>
      </View>
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
  );

  // Filter Modal Component (EXACT SAME AS CommissionsScreen)
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

  return (
    <LinearGradient colors={["#0E0E0E", "#1A1A1A"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        
        {/* HEADER - Updated Profile Icon */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
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

        {/* 🔍 SEARCH BAR AND FILTER - EXACT SAME AS COMMISSIONS SCREEN */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#FFD700" />
            <TextInput
              placeholder="Search users, posts, requests..."
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

        {/* Active Filter Indicator - SAME AS COMMISSIONS SCREEN */}
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

        {/* Main Content */}
        {activeTab === "Requests" ? (
          // REQUESTS TAB CONTENT - 2-column grid layout
          <ScrollView style={styles.scrollableContent}>
            <View style={styles.quickLinksSection}>
              <Text style={styles.sectionTitle}>Available Requests</Text>
              {getFilteredRequests().length === 0 ? (
                <View style={styles.noResultsContainer}>
                  <Ionicons name="search-outline" size={50} color="#666" />
                  <Text style={styles.noResultsText}>
                    {searchQuery.length > 0 
                      ? `No results found for "${searchQuery}"`
                      : `No ${selectedCategory} requests found`
                    }
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={getFilteredRequests()}
                  renderItem={renderRequestCard}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  scrollEnabled={false} 
                  columnWrapperStyle={styles.quickLinkColumnWrapper}
                />
              )}
            </View>
          </ScrollView>
        ) : (
          // ORIGINAL CONTENT for Home and Following tabs
          <ScrollView>
            {/* Recommended Users */}
            {activeTab === "Home" && (
              <View style={styles.recommendedSection}>
                <View style={styles.recommendedHeader}>
                  <Text style={styles.sectionTitle}>Recommended Users</Text>
                  <TouchableOpacity onPress={() => navigation.navigate("RecommendedUsersScreen")}>
                    <Text style={styles.viewMore}>View More</Text>
                  </TouchableOpacity>
                </View>

                {getFilteredRecommendedUsers().length === 0 ? (
                  <View style={styles.noResultsContainer}>
                    <Ionicons name="people-outline" size={40} color="#666" />
                    <Text style={styles.noResultsText}>
                      {searchQuery.length > 0 
                        ? `No users found for "${searchQuery}"`
                        : `No ${selectedCategory} users found`
                      }
                    </Text>
                  </View>
                ) : (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {getFilteredRecommendedUsers().map(renderRecommendedCard)}
                  </ScrollView>
                )}
              </View>
            )}

            {/* POSTS */}
            <View style={styles.postsSection}>
              <Text style={styles.sectionTitle}>
                {activeTab === "Following" ? "Posts from Following" : "Recent Posts"}
              </Text>
              {getFilteredPosts().length === 0 ? (
                <View style={styles.noResultsContainer}>
                  <Ionicons name="document-outline" size={50} color="#666" />
                  <Text style={styles.noResultsText}>
                    {searchQuery.length > 0 
                      ? `No posts found for "${searchQuery}"`
                      : `No ${selectedCategory} posts found`
                    }
                  </Text>
                  <Text style={styles.noResultsSubText}>
                    {activeTab === "Following" 
                      ? "Follow more users to see their posts here" 
                      : "Try adjusting your search or filters"}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={getFilteredPosts()}
                  renderItem={renderPostCard}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  contentContainerStyle={{ paddingBottom: 100 }}
                />
              )}
            </View>
          </ScrollView>
        )}

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

        {/* 🧩 FILTER MODAL - EXACT SAME AS COMMISSIONS SCREEN */}
        <FilterModal 
          isVisible={filterVisible} 
          onClose={() => setFilterVisible(false)}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* NEW: ELLIPSIS MODAL - COPIED FROM RequestInfoScreen */}
        {/* More Options Modal */}  
      <MoreOptionsModal
        visible={moreModal.visible}
        onClose={() => setMoreModal({ visible: false, post: null })}
        onBlock={handleBlockPost}
        onReport={handleReportPost}
        onNotInterested={handleNotInterested}
      />

      </SafeAreaView>
    </LinearGradient>
  );
};

// --- Modal Specific Styles (EXACT SAME AS CommissionsScreen) ---
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

// --- Main Styles ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // HEADER STYLES - Updated Profile Icon
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
  
  // 🔍 SEARCH BAR STYLES - EXACT SAME AS COMMISSIONS SCREEN
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

  // Active Filter Indicator - SAME AS COMMISSIONS SCREEN
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

  // No Results Styles
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  noResultsSubText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
  },

  recommendedSection: { paddingVertical: 10, paddingHorizontal: 16 },
  recommendedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: { 
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
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
  recUserRole: { color: "#ccc", fontSize: 12, textAlign: "center", marginBottom: 4 },

  // Category Row (Same as CommissionsScreen)
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#FFD700',
    marginLeft: 4,
  },

  postsSection: {
    paddingHorizontal: 16,
  },
  postCard: {
    backgroundColor: "#1C1C1C",
    borderRadius: 14,
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
  postUser: { 
    flexDirection: "row", 
    alignItems: "center",
    flex: 1,
  },
  // NEW: Container for follow button and ellipsis
  postHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
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
    marginRight: 8, // Add space between follow button and ellipsis
  },
  followText: { color: "#000", fontWeight: "600", fontSize: 12 },
  followingBtn: { backgroundColor: "#333" },
  followingText: { color: "#FFD700" },
  // NEW: Ellipsis button styles
  ellipsisButton: {
    padding: 4,
  },
  imagePlaceholder: {
    backgroundColor: "#333",
    borderRadius: 12,
    height: 150,
    marginVertical: 10,
  },
  postBody: { marginBottom: 8 },
  postTitle: { color: "#fff", fontWeight: "bold", fontSize: 15, marginBottom: 4 },
  postDesc: { color: "#ccc", fontSize: 13, marginBottom: 8 },
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

  // SCROLLABLE CONTENT (For Requests Tab)
  scrollableContent: {
    flex: 1,
  },

  // QUICK LINKS / REQUESTS STYLES
  quickLinksSection: {
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  quickLinkItem: {
    width: '48%', 
    backgroundColor: 'rgba(30,30,30,0.85)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    position: 'relative',
  },
  quickLinkColumnWrapper: {
    justifyContent: 'space-between', 
  },
  quickLinkImageContainer: {
    width: '100%',
    height: 80, 
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  requestImage: {
    width: '100%',
    height: '100%',
  },
  quickLinkTextContent: {
    //
  },
  quickLinkTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickLinkDescription: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 8,
  },
  pendingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFA500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pendingText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // NEW: ELLIPSIS MODAL STYLES (COPIED FROM RequestInfoScreen)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#2A2A2A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: "#FFD700",
    padding: 20,
  },
  modalTitle: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
    color: "#fff", 
    marginLeft: 8, 
    fontSize: 15 
  },
  closeBtn: { 
    position: "absolute", 
    top: 10, 
    right: 15 
  },
});

export default HomeScreen;