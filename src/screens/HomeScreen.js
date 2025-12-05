import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  FlatList,
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
} from "react-native";
import { CATEGORY_ICON_MAP, CATEGORY_LIST } from '../constants/categories';
import { useTheme } from '../context/ThemeContext';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');

// MOVE rotateValue OUTSIDE THE COMPONENT
const rotateValue = new Animated.Value(0);

const HomeScreen = ({ navigation, route }) => {
  const { isDarkMode, colors, gradients, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(route.params?.activeTab || "Home");
  const [following, setFollowing] = useState({});
  const [likes, setLikes] = useState({});
  const [likeCounts, setLikeCounts] = useState({}); 
  const [isFollowingLoaded, setIsFollowingLoaded] = useState(false);
  const [isLikesLoaded, setIsLikesLoaded] = useState(false);
  const [isLikeCountsLoaded, setIsLikeCountsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userData, setUserData] = useState({
    name: 'Student', 
    profileImage: null
  });
  
  const [moreModal, setMoreModal] = useState({ visible: false, post: null });
  const [blockedPosts, setBlockedPosts] = useState([]);
  const slideAnim = useState(new Animated.Value(300))[0];

  const initialRequests = [
    {
      id: 'req-1',
      title: "Poster/Banner Design",
      description: "Offering custom poster designs for events and orgs.",
      icon: "image-outline",
      category: "Graphic Design",
      artist: "Kredaspirinz",
      email: "e-mail@poster.com",
      likes: 0
    },
    {
      id: 'req-2',
      title: "Logo Design Request",
      description: "Need a modern logo for my startup company.",
      icon: "diamond-outline",
      category: "Graphic Design",
      artist: "DesignPro",
      email: "contact@designpro.com",
      likes: 0
    },
    {
      id: 'req-3',
      title: "Character Illustration",
      description: "Fantasy character art for book cover.",
      icon: "color-palette-outline",
      category: "Illustration",
      artist: "ArtMaster",
      email: "art@master.com",
      likes: 0
    },
    {
      id: 'req-4',
      title: "Website Development",
      description: "Portfolio website with modern design.",
      icon: "code-outline",
      category: "Graphic Design",
      artist: "WebDevPro",
      email: "dev@webpro.com",
      likes: 0
    },
    {
      id: 'req-5',
      title: "Content Writing",
      description: "Blog articles for tech company.",
      icon: "document-text-outline",
      category: "Writing",
      artist: "ContentWriter",
      email: "write@content.com",
      likes: 0
    },
    {
      id: 'req-6',
      title: "Photo Editing",
      description: "Professional photo retouching services.",
      icon: "camera-outline",
      category: "Photography",
      artist: "PhotoExpert",
      email: "edit@photo.com",
      likes: 0
    }
  ];

  const [requests, setRequests] = useState([]);

  const initialPosts = [
    {
      id: 'post-1',
      user: "Kreideprinz", 
      role: "Artist",
      title: "Logo Design",
      description: "Unique logos for student organizations or small businesses.",
      likes: 707,
      type: "home",
      category: "Graphic Design",
      image: null,
      email: "kreideprinz@example.com" 
    },
    {
      id: 'post-2',
      user: "Timaeus",
      role: "Tutor",
      title: "Peer Tutoring",
      description: "Helping college students excel in creative writing.",
      likes: 542,
      type: "home",
      category: "Tutoring",
      image: null,
      email: "timaeus@example.com"
    },
    {
      id: 'post-3',
      user: "Pierro",
      role: "Designer",
      title: "Poster Commission",
      description: "Offering custom poster designs for events and orgs.",
      likes: 430,
      type: "request",
      category: "Graphic Design",
      image: null,
      email: "pierro@example.com"
    },
    {
      id: 'post-4',
      user: "Aelric",
      role: "Writer",
      title: "Content Writing",
      description: "Professional blog and article writing services.",
      likes: 320,
      type: "home",
      category: "Writing",
      image: null,
      email: "aelric@example.com"
    },
    {
      id: 'post-5',
      user: "Chiori",
      role: "Crafter",
      title: "Handmade Crafts",
      description: "Custom handmade crafts and DIY projects.",
      likes: 280,
      type: "home",
      category: "Crafting",
      image: null,
      email: "chiori@example.com"
    },
  ];

  const [posts, setPosts] = useState([]);

  const getIconForCategory = (category) => {
    return CATEGORY_ICON_MAP[category] || 'create-outline';
  };

  // ✅ FIXED: Added full profile details (bio, email, skills, joinedDate)
  // This ensures the RecommendedUsersInfoScreen displays data correctly instead of blank spaces.
  const recommendedUsers = [
    { 
      id: 1, 
      name: "Kreideprinz", 
      role: "Illustrator", 
      followers: 707, 
      category: "Illustration",
      email: "kreideprinz@example.com",
      skills: "Digital Art, Character Design, Vector Illustration",
      joinedDate: "January 15, 2023",
      bio: "Professional illustrator specializing in anime style art and character design. Open for commissions.",
      referencePhotos: []
    },
    { 
      id: 2, 
      name: "Chiori", 
      role: "Crafter, Graphic Designer", 
      followers: 680, 
      category: "Crafting",
      email: "chiori@designs.com",
      skills: "Fabric Crafts, Fashion Design, Logo Design",
      joinedDate: "March 10, 2023",
      bio: "Fashion designer and crafter. I create unique handmade items and custom clothing designs.",
      referencePhotos: []
    },
    { 
      id: 3, 
      name: "Aelric", 
      role: "Writer", 
      followers: 423, 
      category: "Writing",
      email: "aelric@writer.com",
      skills: "Creative Writing, Copywriting, Editing",
      joinedDate: "February 22, 2023",
      bio: "Experienced writer with a passion for storytelling. I can help with essays, stories, and articles.",
      referencePhotos: []
    },
    { 
      id: 4, 
      name: "Timaeus", 
      role: "Tutor", 
      followers: 520, 
      category: "Tutoring",
      email: "timaeus@academy.com",
      skills: "Chemistry, Academic Writing, Research",
      joinedDate: "April 05, 2023",
      bio: "Academic tutor specializing in sciences and research papers. Helping students achieve their best.",
      referencePhotos: []
    },
  ];

  const loadPosts = async () => {
    try {
      const savedPosts = await AsyncStorage.getItem('savedPosts');
      let posts = initialPosts;
      if (savedPosts) {
        try {
          const parsedPosts = JSON.parse(savedPosts);
          const mergedPosts = [...parsedPosts, ...initialPosts]; 
          const uniquePosts = mergedPosts.filter((post, index, self) =>
            index === self.findIndex((t) => (
              t.id === post.id
            ))
          )
          posts = uniquePosts;
        } catch (e) {
          console.log('Error parsing saved posts');
        }
      }
      setPosts(posts);
    } catch (error) {
      console.log('Error loading posts:', error);
      setPosts(initialPosts);
    }
  };

  useEffect(() => {
    if (route.params?.newPost) {
      const newPost = route.params.newPost;

      const addNewPost = async () => {
        const savedPosts = await AsyncStorage.getItem('savedPosts');
        let posts = [];
        if (savedPosts) {
          posts = JSON.parse(savedPosts);
        } else {
          posts = initialPosts;
        }

        const exists = posts.some(p => p.id === newPost.id);
        if (!exists) {
          const updatedPosts = [newPost, ...posts];
          setPosts(updatedPosts);
          await AsyncStorage.setItem('savedPosts', JSON.stringify(updatedPosts));
        }
      };

      addNewPost();

      setLikeCounts(prevCounts => {
        const newLikeCounts = { ...prevCounts, [newPost.id]: 0 };
        try {
          AsyncStorage.setItem('likeCounts', JSON.stringify(newLikeCounts));
        } catch (error) {
          console.log('Error saving like counts:', error);
        }
        return newLikeCounts;
      });

      navigation.setParams({ newPost: null });
    }
  }, [route.params?.newPost, navigation]);

  useEffect(() => {
    if (route.params?.newCommission) {
      const handleNewRequest = async () => {
        try {
          // 1. Force load the name from storage
          const savedProfile = await AsyncStorage.getItem('userProfileData');
          let currentUserName = "Student"; 
          
          if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            if (profile.name && profile.name.trim() !== "") {
                currentUserName = profile.name;
            }
          }

          const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
          const newRequest = {
            id: uniqueId,
            title: route.params.newCommission.title,
            description: route.params.newCommission.description,
            icon: getIconForCategory(route.params.newCommission.category),
            category: route.params.newCommission.category,
            artist: currentUserName, 
            email: route.params.newCommission.contact,
            referencePhotos: route.params.newCommission.referencePhotos,
            date: route.params.newCommission.date,
            status: "pending",
            likes: 0
          };

          const savedRequestsJSON = await AsyncStorage.getItem('savedRequests');
          let currentRequests = [];
          
          if (savedRequestsJSON) {
            currentRequests = JSON.parse(savedRequestsJSON);
          } else {
            currentRequests = initialRequests;
          }

          const updatedRequests = [newRequest, ...currentRequests];
          await AsyncStorage.setItem('savedRequests', JSON.stringify(updatedRequests));
          setRequests(updatedRequests);

          setLikeCounts(prevCounts => {
            const newLikeCounts = { ...prevCounts, [newRequest.id]: 0 };
            AsyncStorage.setItem('likeCounts', JSON.stringify(newLikeCounts));
            return newLikeCounts;
          });

          setLikes(prevLikes => {
            const newLikes = { ...prevLikes, [newRequest.id]: false };
            AsyncStorage.setItem('likesState', JSON.stringify(newLikes));
            return newLikes;
          });

        } catch (error) {
          console.log('Error adding new request:', error);
        }
      };
      
      handleNewRequest();
      navigation.setParams({ newCommission: null });
    }
  }, [route.params?.newCommission, navigation]);

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

  const slideUp = () => {
    slideAnim.setValue(300);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

 const FILTER_CATEGORY_MAP = CATEGORY_LIST;

  useEffect(() => {
    const loadAllData = async () => {
      await loadUserData();
      await loadFollowingState();
      await loadLikesState();
      await loadRequests();
      await loadPosts();
      await loadLikeCounts();
    };
    loadAllData();
  }, []);

  // Refresh follow status on screen focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadLikesState();
      loadLikeCounts();
      loadRequests();
      loadPosts();
      loadUserData();
      loadFollowingState(); 
    });
    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userProfileData');
      if (savedUserData) {
        try {
          const parsedData = JSON.parse(savedUserData);
          setUserData(prevData => ({
            ...prevData,
            name: parsedData.name || 'Student',
            profileImage: parsedData.profileImage || null
          }));
        } catch (e) {
          console.log('Error parsing user data');
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

  const loadFollowingState = async () => {
    try {
      const savedFollowing = await AsyncStorage.getItem('followingState');
      if (savedFollowing) {
        try {
          setFollowing(JSON.parse(savedFollowing));
        } catch (e) {
          console.log('Error parsing following state');
        }
      }
      setIsFollowingLoaded(true);
    } catch (error) {
      console.log('Error loading following state:', error);
      setIsFollowingLoaded(true);
    }
  };

  const loadLikesState = async () => {
    try {
      const savedLikes = await AsyncStorage.getItem('likesState');
      if (savedLikes) {
        try {
          setLikes(JSON.parse(savedLikes));
        } catch (e) {
          console.log('Error parsing likes state');
        }
      }
      setIsLikesLoaded(true);
    } catch (error) {
      console.log('Error loading likes state:', error);
      setIsLikesLoaded(true);
    }
  };

  const loadRequests = async () => {
    try {
      const savedRequests = await AsyncStorage.getItem('savedRequests');
      if (savedRequests) {
        try {
          const parsedRequests = JSON.parse(savedRequests);
          setRequests(parsedRequests);
        } catch (e) {
          console.log('Error parsing saved requests');
          setRequests(initialRequests);
        }
      } else {
        setRequests(initialRequests);
        try {
          await AsyncStorage.setItem('savedRequests', JSON.stringify(initialRequests));
        } catch (err) {
          console.log('Error saving initial requests:', err);
        }
      }
    } catch (error) {
      console.log('Error loading requests:', error);
      setRequests(initialRequests);
      try {
        await AsyncStorage.setItem('savedRequests', JSON.stringify(initialRequests));
      } catch (err) {}
    }
  };

  const loadLikeCounts = async () => {
    try {
      const savedCounts = await AsyncStorage.getItem('likeCounts');
      const savedRequests = await AsyncStorage.getItem('savedRequests');
      
      let currentRequests = requests;
      if (savedRequests) {
        try {
          currentRequests = JSON.parse(savedRequests);
        } catch (err) { console.log('Error parsing saved requests:', err); }
      }
      
      if (savedCounts) {
        let parsedCounts = {};
        try {
          parsedCounts = JSON.parse(savedCounts);
        } catch(e) { console.log("Failed to parse counts"); }

        const mergedCounts = {};
        posts.forEach(post => {
          mergedCounts[post.id] = parsedCounts[post.id] !== undefined ? parsedCounts[post.id] : post.likes;
        });
        if (currentRequests && Array.isArray(currentRequests)) {
          currentRequests.forEach(request => {
            mergedCounts[request.id] = parsedCounts[request.id] !== undefined ? parsedCounts[request.id] : (request.likes || 0);
          });
        }
        setLikeCounts(mergedCounts);
      } else {
        const initialCounts = {};
        posts.forEach(post => {
          initialCounts[post.id] = post.likes;
        });
        if (currentRequests && Array.isArray(currentRequests)) {
          currentRequests.forEach(request => {
            initialCounts[request.id] = request.likes || 0;
          });
        }
        setLikeCounts(initialCounts);
        try {
          await AsyncStorage.setItem('likeCounts', JSON.stringify(initialCounts));
        } catch (err) {}
      }
      setIsLikeCountsLoaded(true);
    } catch (error) {
      console.log('Error loading like counts:', error);
      const initialCounts = {};
      posts.forEach(post => {
        initialCounts[post.id] = post.likes;
      });
      try {
        const savedRequests = await AsyncStorage.getItem('savedRequests');
        if (savedRequests) {
          const currentRequests = JSON.parse(savedRequests);
          if (currentRequests && Array.isArray(currentRequests)) {
            currentRequests.forEach(request => {
              initialCounts[request.id] = request.likes || 0;
            });
          }
        }
      } catch (err) {}
      setLikeCounts(initialCounts);
      setIsLikeCountsLoaded(true);
    }
  };

  useEffect(() => {
    if (route.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
  }, [route.params?.activeTab]);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });
    return unsubscribe;
  }, [navigation]);

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

  const handleReportPost = () => {
    if (moreModal.post) {
      console.log('Report post:', moreModal.post.title);
      setMoreModal({ visible: false, post: null });
      Alert.alert("Report Submitted", "Thank you for reporting this post");
    }
  };

  const handleNotInterested = () => {
    if (moreModal.post) {
      console.log('Not interested in:', moreModal.post.title);
      setMoreModal({ visible: false, post: null });
      Alert.alert("Noted", "We'll show you less content like this");
    }
  };

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
    if (activeTab === "Following" && !isFollowingLoaded) {
      return null;
    }
    
    let filtered = posts.filter((post) => {
      if (activeTab === "Following") return following[post.user] === true;
      if (activeTab === "Requests") return post.type === "request";
      return post.type === "home";
    });

    filtered = filtered.filter((post) => {
      const matchesSearch = 
        post.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "All" || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

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

  const toggleFollow = async (userName) => {
    const newFollowing = { ...following, [userName]: !following[userName] };
    setFollowing(newFollowing);
    try {
      await AsyncStorage.setItem('followingState', JSON.stringify(newFollowing));
    } catch (error) {
      console.log('Error saving following state:', error);
    }
  };

  const toggleLike = async (postId, currentLikeCount) => {
    if (!isLikesLoaded || !isLikeCountsLoaded) {
      Alert.alert('Please wait', 'Loading like data...');
      return;
    }

    const wasLiked = likes[postId] === true;
    const newLikes = { ...likes, [postId]: !wasLiked };
    setLikes(newLikes);
    
    const currentCount = likeCounts[postId] !== undefined ? likeCounts[postId] : currentLikeCount;
    const newCount = wasLiked ? Math.max(0, currentCount - 1) : currentCount + 1;
    const newLikeCounts = { ...likeCounts, [postId]: newCount };
    setLikeCounts(newLikeCounts);
    
    try {
      await AsyncStorage.setItem('likesState', JSON.stringify(newLikes));
      await AsyncStorage.setItem('likeCounts', JSON.stringify(newLikeCounts));
    } catch (error) {
      console.log('Error saving likes state:', error);
    }
  };

    const renderPostCard = ({ item }) => {
      const isOwner = item.user === userData.name;

      return (
      <TouchableOpacity 
        style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ProductInfo', { 
          requestData: {
            ...item,
            artist: item.user,
            referencePhotos: item.image ? [item.image] : [],
            email: item.email || "email@example.com" 
          } 
        })}
      >

        <View style={styles.postHeader}>
          <View style={styles.postUser}>
            {item.profileImage ? (
              <Image source={{ uri: item.profileImage }} style={styles.avatar} />
            ) : (
              <Ionicons name="person-circle-outline" size={40} color={colors.primary} style={styles.avatar} />
            )}
            <View>
              <Text style={[styles.userName, { color: colors.text }]}>{item.user}</Text>
              <Text style={[styles.userRole, { color: colors.textSecondary }]}>{item.role}</Text>
            </View>
          </View>
  
          <View style={styles.postHeaderRight}>
          
          {isOwner ? (
            <Text style={[styles.youText, { color: colors.textSecondary }]}>You</Text>
          ) : (
            <TouchableOpacity
              style={[
                styles.followBtn, 
                { backgroundColor: following[item.user] ? colors.surface : colors.primary },
                following[item.user] && styles.followingBtn
              ]}
              onPress={() => toggleFollow(item.user)}
            >
              <Text style={[
                styles.followText, 
                { color: following[item.user] ? colors.primary : (isDarkMode ? colors.text : "#000") },
                following[item.user] && styles.followingBtn
              ]}>
                {following[item.user] ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
          )}
            
            <TouchableOpacity 
              style={styles.ellipsisButton}
              onPress={() => openMoreModal(item)}
            >
              <Ionicons name="ellipsis-vertical" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
  
        <View style={[
          styles.imagePlaceholder, { 
          backgroundColor: item.image ? 'transparent' : colors.surfaceLight,
          height: item.image ? 200 : 150 
        }]}>
          {item.image ? (
            <Image 
              source={{ uri: item.image }} 
              style={{ width: '100%', height: '100%', borderRadius: 12 }} 
              resizeMode="cover"
            />
          ) : null}
        </View>
  
        <View style={styles.postBody}>
          <Text style={[styles.postTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.postDesc, { color: colors.textSecondary }]}>{item.description}</Text>
          <View style={styles.categoryRow}>
            {/* ✅ FIXED: Changed Icon color from primary to text */}
            <Ionicons name={FILTER_CATEGORY_MAP.find(cat => cat.name === item.category)?.icon || 'apps-outline'} size={14} color={colors.text} />
            {/* ✅ FIXED: Changed Text color from primary to text */}
            <Text style={[styles.categoryText, { color: colors.text }]}>{item.category}</Text>
          </View>
        </View>
  
        <View style={styles.postFooter}>
          <TouchableOpacity 
            onPress={() => toggleLike(item.id, item.likes)}
            style={styles.likeButton}
          >
            <Ionicons 
              name={isLikesLoaded && likes[item.id] === true ? "heart" : "heart-outline"} 
              size={18} 
              color={isLikesLoaded && likes[item.id] === true ? "#FF5555" : colors.text} 
            />
          </TouchableOpacity>
          <Text style={[styles.likeCount, { color: colors.text }]}>
            {isLikeCountsLoaded && likeCounts[item.id] !== undefined ? likeCounts[item.id] : item.likes}
          </Text>
        </View>

      </TouchableOpacity>
    );
  };

  const renderRequestCard = ({ item }) => (
    <TouchableOpacity 
      style={[styles.quickLinkItem, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
      onPress={() => {
        navigation.navigate('RequestInfo', {
          requestData: item 
        });
      }}
    >
      <View style={[styles.quickLinkImageContainer, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
        {item.referencePhotos?.length > 0 ? (
          <Image 
            source={{ uri: item.referencePhotos[0] }} 
            style={styles.requestImage}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name={item.icon} size={40} color={colors.primary} />
        )}
      </View>
      <View style={styles.quickLinkTextContent}>
        <Text style={[styles.quickLinkTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.quickLinkDescription, { color: colors.textSecondary }]}>{item.description}</Text>
        <View style={styles.categoryRow}>
          {/* ✅ FIXED: Changed Icon color from primary to text */}
          <Ionicons name={FILTER_CATEGORY_MAP.find(cat => cat.name === item.category)?.icon || 'apps-outline'} size={12} color={colors.text} />
          {/* ✅ FIXED: Changed Text color from primary to text */}
          <Text style={[styles.categoryText, { color: colors.text }]}>{item.category}</Text>
        </View>
        {item.status === 'pending' && (
          <View style={[styles.pendingBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.pendingText, { color: '#000' }]}>New</Text>
          </View>
        )}
        <View style={styles.requestLikeContainer}>
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              toggleLike(item.id, item.likes || 0);
            }}
            style={styles.requestLikeButton}
          >
            <Ionicons 
              name={isLikesLoaded && likes[item.id] === true ? "heart" : "heart-outline"} 
              size={16} 
              color={isLikesLoaded && likes[item.id] === true ? "#FF5555" : colors.text} 
            />
          </TouchableOpacity>
          <Text style={[styles.requestLikeCount, { color: colors.text }]}>
            {isLikeCountsLoaded && likeCounts[item.id] !== undefined ? likeCounts[item.id] : (item.likes || 0)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecommendedCard = (user) => (
    <TouchableOpacity 
      key={user.id} 
      style={[styles.recommendedCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
      // FIX: Passing the full user object (including bio/email) so the profile page works correctly
      onPress={() => navigation.navigate("RecommendedUsersInfoScreen", { 
        requestData: {
          artist: user.name,
          title: "Student Information", 
          ...user
        }
      })}
    >
      <Ionicons name="person-circle-outline" size={60} color={colors.primary} style={styles.avatarLarge} />
      <Text style={[styles.recUserName, { color: colors.text }]}>{user.name}</Text>
      <Text style={[styles.recUserRole, { color: colors.textSecondary }]}>{user.role}</Text>
      <View style={styles.categoryRow}>
        {/* ✅ FIXED: Changed Icon color from primary to text */}
        <Ionicons name={FILTER_CATEGORY_MAP.find(cat => cat.name === user.category)?.icon || 'apps-outline'} size={12} color={colors.text} />
        {/* ✅ FIXED: Changed Text color from primary to text */}
        <Text style={[styles.categoryText, { color: colors.text }]}>{user.category}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.followBtn, 
          { backgroundColor: following[user.name] ? colors.surface : colors.primary },
          following[user.name] && styles.followingBtn
        ]}
        onPress={() => toggleFollow(user.name)}
      >
        <Text
          style={[
            styles.followText, 
            { color: following[user.name] ? colors.primary : (isDarkMode ? colors.text : "#000") },
            following[user.name] && styles.followingText
          ]}
        >
          {following[user.name] ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
            <View style={styles.optionRow}>
              <Ionicons name="heart-dislike-outline" size={22} color="red" />
              <Text style={[styles.optionText, { color: colors.text }]}>Not interested</Text>
            </View>
            <View style={styles.optionRow}>
              <Ionicons name="flag-outline" size={22} color="red" />
              <Text style={[styles.optionText, { color: colors.text }]}>Report Post</Text>
            </View>
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
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Animated.Image
                source={require('../../assets/lumivana.png')}
                style={[styles.logo, animatedLogoStyle]}
                resizeMode="contain"
              />
              {/* FIX: Logo Text White */}
              <Text style={[styles.logoText, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Lumivana</Text>
            </View>
            
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.themeToggle}
                onPress={toggleTheme}
              >
                <Ionicons
                  name={isDarkMode ? 'sunny' : 'moon'}
                  size={24}
                  color={'#ffff'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileIcon}
                onPress={() => navigation.navigate('Profile')} // ✅ CHANGED: Back to Profile screen
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
        </View>

        {/* TOP TABS */}
        <View style={[styles.tabRow, { 
          backgroundColor: isDarkMode ? colors.surface : 'rgba(255, 255, 255, 0.15)', 
          borderColor: colors.border 
        }]}>
          {["Following", "Home", "Requests"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabButton, activeTab === tab && { borderBottomWidth: 2, borderColor: colors.primary }]}
            >
              {/* FIX: Tabs White */}
              <Text style={[
                styles.tabText, 
                { color: isDarkMode ? colors.textMuted : '#FFFFFF' }, 
                activeTab === tab && { color: colors.primary, fontWeight: "bold" }
              ]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SEARCH BAR AND FILTER */}
        <View style={styles.searchBarContainer}>
          {/* FIX: Make background more opaque in light mode for contrast */}
          <View style={[styles.searchBar, { 
            backgroundColor: isDarkMode ? colors.surface : 'rgba(255, 255, 255, 0.3)' 
          }]}>
            {/* CHANGED: Search Icon to White */}
            <Ionicons name="search-outline" size={20} color="#FFFFFF" />
            {/* FIX: Ensure Search Input Text and Placeholder are visible (Black in light mode) */}
            <TextInput
              placeholder="Search users, posts, requests..."
              placeholderTextColor={isDarkMode ? colors.textMuted : 'rgba(0, 0, 0, 0.5)'}
              style={[styles.searchInput, { color: isDarkMode ? colors.text : '#000000' }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={[styles.filterButton, { 
            backgroundColor: isDarkMode ? colors.surface : 'rgba(255, 255, 255, 0.3)' 
          }]} onPress={() => setFilterVisible(true)}>
            {/* CHANGED: Filter Icon to White */}
            <Ionicons name="filter-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {selectedCategory !== 'All' && (
          <View style={[styles.activeFilterContainer, { 
            backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(207, 173, 1, 0.2)' 
          }]}>
            <Text style={[styles.activeFilterText, { color: isDarkMode ? colors.textSecondary : '#000000' }]}>
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

        {/* Main Content */}
        {activeTab === "Requests" ? (
          <ScrollView style={styles.scrollableContent}>
            <View style={styles.quickLinksSection}>
              {/* FIX: Ensure Title is visible (Black in light mode) */}
              <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Available Requests</Text>
              {getFilteredRequests().length === 0 ? (
                <View style={styles.noResultsContainer}>
                  <Ionicons name="search-outline" size={50} color={isDarkMode ? colors.textMuted : 'rgba(0, 0, 0, 0.5)'} />
                  <Text style={[styles.noResultsText, { color: isDarkMode ? colors.textSecondary : '#FFFFFF' }]}>
                    {searchQuery.length > 0 
                      ? `No results found for "${searchQuery}"`
                      : `No ${selectedCategory} requests found`
                    }
                  </Text>
                </View>
              ) : (
                <>
                  {getFilteredRequests().length > 0 && (
                    <FlatList
                      data={getFilteredRequests()}
                      renderItem={renderRequestCard}
                      keyExtractor={(item) => item.id.toString()}
                      numColumns={2}
                      scrollEnabled={false} 
                      columnWrapperStyle={styles.quickLinkColumnWrapper}
                    />
                  )}
                </>
              )}
            </View>
          </ScrollView>
        ) : (
          <ScrollView>
            {activeTab === "Home" && (
              <View style={styles.recommendedSection}>
                <View style={styles.recommendedHeader}>
                  {/* FIX: Ensure Title is visible (Black in light mode) */}
                  <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.text : '#ffff' }]}>Recommended Users</Text>
                  <TouchableOpacity onPress={() => navigation.navigate("RecommendedUsersScreen")}>
                    <Text style={[styles.viewMore, { color: '#ffff', textDecorationLine: 'underline' }]}>View More</Text>
                  </TouchableOpacity>
                </View>

                {getFilteredRecommendedUsers().length === 0 ? (
                  <View style={styles.noResultsContainer}>
                      <Ionicons name="people-outline" size={40} color={isDarkMode ? colors.textMuted : 'rgba(0, 0, 0, 0.5)'} />
                      <Text style={[styles.noResultsText, { color: isDarkMode ? colors.textSecondary : '#000000' }]}>
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

            <View style={styles.postsSection}>
              {/* FIX: Ensure Title is visible (Black in light mode) */}
              <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.text : '#ffff' }]}>
                {activeTab === "Following" ? "Posts from Following" : "Recent Posts"}
              </Text>
              {(() => {
                const filteredPosts = getFilteredPosts();
                if (filteredPosts === null) {
                  return (
                    <View style={styles.noResultsContainer}>
                      <ActivityIndicator size="large" color={colors.primary} />
                      <Text style={[styles.noResultsText, { color: isDarkMode ? colors.textSecondary : '#000000' }]}>Loading...</Text>
                    </View>
                  );
                } else if (filteredPosts.length === 0) {
                  return (
                    <View style={styles.noResultsContainer}>
                      <Ionicons name="document-outline" size={50} color={isDarkMode ? colors.textMuted : 'rgba(0, 0, 0, 0.5)'} />
                      <Text style={[styles.noResultsText, { color: isDarkMode ? colors.textSecondary : '#000000' }]}>
                        {searchQuery.length > 0
                          ? `No posts found for "${searchQuery}"`
                          : `No ${selectedCategory} posts found`
                        }
                      </Text>
                      <Text style={[styles.noResultsSubText, { color: isDarkMode ? colors.textMuted : 'rgba(0, 0, 0, 0.5)' }]}>
                        {activeTab === "Following"
                          ? "Follow more users to see their posts here"
                          : "Try adjusting your search or filters"}
                      </Text>
                    </View>
                  );
                } else {
                  return (
                    <FlatList
                      data={filteredPosts}
                      renderItem={renderPostCard}
                      keyExtractor={(item) => item.id.toString()}
                      scrollEnabled={false}
                      contentContainerStyle={{ paddingBottom: 100 }}
                    />
                  );
                }
              })()}
            </View>
          </ScrollView>
        )}

        <View style={[styles.footer, { 
          backgroundColor: isDarkMode ? colors.surface : 'rgba(255, 255, 255, 0.15)' 
        }]}>
          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home" size={24} color={colors.primary} />
            <Text style={[styles.footerText, styles.activeFooterText, { color: colors.primary }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('Search')}
          >
            <Ionicons name="search-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>Search</Text>
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

        <FilterModal 
          isVisible={filterVisible} 
          onClose={() => setFilterVisible(false)}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <EllipsisModal />
      </SafeAreaView>
    </LinearGradient>
  );
};

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
  container: { flex: 1 },
  
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeToggle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logo: { 
    width: 40, 
    height: 40, 
    marginRight: 8 
  },
  logoText: { 
    fontSize: 28, 
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
  },

  tabRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    marginTop: 10,
  },
  tabButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 10,
  },
  tabText: { fontSize: 13 },
  
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

  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  noResultsSubText: {
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
    minHeight: 24, 
  },
  sectionTitle: { 
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  viewMore: { fontSize: 13, textDecorationLine: "underline" },
  recommendedCard: {
    width: 140,
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'transparent',
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  recUserName: { fontWeight: "bold", fontSize: 14 },
  recUserRole: { fontSize: 12, textAlign: "center", marginBottom: 4 },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    marginLeft: 4,
  },

  postsSection: {
    paddingHorizontal: 16,
  },
  postCard: {
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
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
  postHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: { fontWeight: "bold", fontSize: 15 },
  userRole: { fontSize: 12 },
  followBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  followText: { fontWeight: "600", fontSize: 12 },
  followingBtn: {},
  followingText: {},
  ellipsisButton: {
    padding: 4,
  },
  imagePlaceholder: {
    borderRadius: 12,
    height: 150,
    marginVertical: 10,
    overflow: 'hidden',
  },
  postBody: { marginBottom: 8 },
  postTitle: { fontWeight: "bold", fontSize: 15, marginBottom: 4 },
  postDesc: { fontSize: 13, marginBottom: 8 },
  postFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  likeButton: {
    padding: 4,
  },
  likeCount: { marginLeft: 6 },
  youText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
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
    borderColor: 'transparent',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  scrollableContent: {
    flex: 1,
  },

  quickLinksSection: {
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  quickLinkItem: {
    width: '48%', 
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    position: 'relative',
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
    overflow: 'hidden',
    borderWidth: 1,
  },
  requestImage: {
    width: '100%',
    height: '100%',
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
    marginBottom: 8,
  },
  requestLikeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  requestLikeButton: {
    padding: 4,
    marginRight: 4,
  },
  requestLikeCount: {
    fontSize: 12,
  },
  pendingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pendingText: {
    fontSize: 10,
    fontWeight: 'bold',
  },

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
  modalTitle: {
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