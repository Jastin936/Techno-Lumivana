import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

// Get screen width for dynamic image sizes
const { width } = Dimensions.get("window");
const IMAGE_SIZE = (width - 40 - 12 * 2 - 8 * 2) / 3;

const RecommendedUsersScreen = ({ navigation }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [fontsLoaded] = useFonts({
    Milonga: require("../../assets/fonts/Milonga-Regular.ttf"),
  });

  const [userData, setUserData] = useState({
    name: "Lumivana Vivistera",
    profileImage: null,
  });

  const FILTERS = [
    "All",
    "Artist",
    "Writer",
    "Programmer",
    "Proofreader",
    "Editor",
    "Casual",
    "Graphic Designer",
  ];

  // Updated USERS array with complete data for RecommendedUsersInfoScreen
  const USERS = [
    {
      id: 1,
      name: "Kreideprinz",
      title: "Student Information",
      role: "Illustration, Graphic design, Artist",
      email: "kreideprinz@example.com",
      skills: "Logo Design, Brand Identity, Vector Illustration, Typography, Digital Art",
      joinedDate: "January 15, 2023",
      bio: "Professional illustrator and graphic designer with 5+ years of experience. Specializing in brand identity and digital art creation for various clients.",
      followers: 70,
      milestone: true,
      referencePhotos: []
    },
    {
      id: 2,
      name: "Caribert",
      title: "Student Information",
      role: "Programmer, Artist, Writer",
      email: "caribert@example.com",
      skills: "Web Development, UI/UX Design, Creative Coding, Technical Writing",
      joinedDate: "March 22, 2023",
      bio: "Full-stack developer and creative coder passionate about building interactive experiences and writing technical content.",
      followers: 70,
      milestone: true,
      referencePhotos: []
    },
    {
      id: 3,
      name: "Enjou",
      title: "Student Information",
      role: "Writer, Proofreader",
      email: "enjou@example.com",
      skills: "Content Writing, Proofreading, Editing, Creative Writing",
      joinedDate: "February 10, 2023",
      bio: "Experienced writer and proofreader with a passion for creating engaging content and ensuring grammatical perfection.",
      followers: 70,
      milestone: true,
      referencePhotos: []
    },
    {
      id: 4,
      name: "Grace",
      title: "Student Information",
      role: "Illustration, Graphic design, Artist",
      email: "grace@example.com",
      skills: "Digital Painting, Character Design, Concept Art, Illustration",
      joinedDate: "April 5, 2023",
      bio: "Digital artist specializing in character design and concept art for games and animation projects.",
      followers: 70,
      milestone: true,
      referencePhotos: []
    },
    {
      id: 5,
      name: "Trevenaa",
      title: "Student Information",
      role: "Writer",
      email: "trevenaa@example.com",
      skills: "Fiction Writing, Blog Writing, Copywriting, Editing",
      joinedDate: "December 18, 2022",
      bio: "Award-winning fiction writer and content creator with multiple published works and extensive blogging experience.",
      followers: 532,
      milestone: false,
      referencePhotos: []
    },
    {
      id: 6,
      name: "Pierra",
      title: "Student Information",
      role: "Producer",
      email: "pierra@example.com",
      skills: "Music Production, Sound Design, Audio Engineering, Mixing",
      joinedDate: "November 30, 2022",
      bio: "Professional music producer and sound designer with expertise in various genres and audio production techniques.",
      followers: 401,
      milestone: false,
      referencePhotos: []
    },
  ];

  const [selectedFilter, setSelectedFilter] = useState("All");
  // Change from object to array to store user IDs that are followed
  const [followingUsers, setFollowingUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [notInterestedUsers, setNotInterestedUsers] = useState([]);
  const [reportedUsers, setReportedUsers] = useState([]);
  const [moreModal, setMoreModal] = useState({ visible: false, user: null });

  const slideAnim = useState(new Animated.Value(300))[0];

  // Load states from AsyncStorage
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      await loadFollowingUsers();
      await loadNotInterestedUsers();
      await loadReportedUsers();
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  // Updated: Load following users from AsyncStorage
  const loadFollowingUsers = async () => {
    try {
      const savedFollowing = await AsyncStorage.getItem('followingUsers');
      if (savedFollowing) {
        try {
          setFollowingUsers(JSON.parse(savedFollowing));
        } catch (e) {
          console.log('Error parsing following users');
        }
      }
    } catch (error) {
      console.log('Error loading following users:', error);
    }
  };

  // Check if a user is followed
  const isFollowing = (userId) => {
    return followingUsers.includes(userId);
  };

  const loadNotInterestedUsers = async () => {
    try {
      const savedNotInterested = await AsyncStorage.getItem('notInterestedUsers');
      if (savedNotInterested) {
        setNotInterestedUsers(JSON.parse(savedNotInterested));
      }
    } catch (error) {
      console.log('Error loading not interested users:', error);
    }
  };

  const loadReportedUsers = async () => {
    try {
      const savedReported = await AsyncStorage.getItem('reportedUsers');
      if (savedReported) {
        setReportedUsers(JSON.parse(savedReported));
      }
    } catch (error) {
      console.log('Error loading reported users:', error);
    }
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

  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem("userProfileData");
      if (savedUserData) {
        try {
          const parsedData = JSON.parse(savedUserData);
          setUserData((prev) => ({
            ...prev,
            name: parsedData.name || "Lumivana Vivistera",
            profileImage: parsedData.profileImage || null,
          }));
        } catch (e) {
          console.log('Error parsing user data');
        }
      }
      const savedProfileImage = await AsyncStorage.getItem("profileImage");
      if (savedProfileImage) {
        setUserData((prev) => ({ ...prev, profileImage: savedProfileImage }));
      }
    } catch (error) {
      console.log("Error loading user data:", error);
    }
  };

  useEffect(() => {
    loadUserData();
    loadAllData();
  }, []);

  // Refresh following state when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFollowingUsers();
    });

    return unsubscribe;
  }, [navigation]);

  // Filter out blocked users, not interested users, and reported users
  const filteredUsers = USERS.filter(
    (u) =>
      !blockedUsers.includes(u.id) &&
      !notInterestedUsers.includes(u.id) &&
      (selectedFilter === "All" || u.role.includes(selectedFilter))
  );

  // Updated: Toggle follow function
  const toggleFollow = async (userId) => {
    const user = USERS.find(u => u.id === userId);
    if (!user) return;
    
    let updatedFollowingUsers;
    
    if (isFollowing(userId)) {
      // Unfollow: remove user ID from array
      updatedFollowingUsers = followingUsers.filter(id => id !== userId);
    } else {
      // Follow: add user ID to array
      updatedFollowingUsers = [...followingUsers, userId];
    }
    
    setFollowingUsers(updatedFollowingUsers);
    
    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem('followingUsers', JSON.stringify(updatedFollowingUsers));
      
      // Show feedback
      Alert.alert(
        isFollowing(userId) ? "Unfollowed" : "Following",
        isFollowing(userId) 
          ? `You have unfollowed ${user.name}` 
          : `You are now following ${user.name}. They will appear in your Following tab.`,
        [{ text: "OK" }]
      );
      
    } catch (error) {
      console.log('Error saving following state:', error);
      Alert.alert("Error", "Failed to update follow status. Please try again.");
    }
  };

  const handleBlockUser = (user) => {
    setBlockedUsers((prev) => [...prev, user.id]);
    setMoreModal({ visible: false, user: null });
  };

  const handleNotInterested = async () => {
    if (moreModal.user) {
      try {
        const updatedNotInterested = [...notInterestedUsers, moreModal.user.id];
        setNotInterestedUsers(updatedNotInterested);
        
        await AsyncStorage.setItem('notInterestedUsers', JSON.stringify(updatedNotInterested));
        
        setMoreModal({ visible: false, user: null });
        
        Alert.alert("Noted", "We'll show fewer users like this in your recommendations.");
        
      } catch (error) {
        console.log('Error saving not interested user:', error);
        Alert.alert("Error", "Failed to save your preference. Please try again.");
      }
    }
  };

  const handleReportUser = async () => {
    if (moreModal.user) {
      Alert.alert(
        "Report User",
        "Are you sure you want to report this user?",
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
                const updatedReported = [...reportedUsers, moreModal.user.id];
                setReportedUsers(updatedReported);
                
                await AsyncStorage.setItem('reportedUsers', JSON.stringify(updatedReported));
                
                setBlockedUsers((prev) => [...prev, moreModal.user.id]);
                
                setMoreModal({ visible: false, user: null });
                
                Alert.alert("Report Submitted", "Thank you for reporting this user. Our team will review it.");
                
              } catch (error) {
                console.log('Error saving reported user:', error);
                Alert.alert("Error", "Failed to submit report. Please try again.");
              }
            }
          }
        ]
      );
    }
  };

  const openMoreModal = (user) => {
    setMoreModal({ visible: true, user });
    slideUp();
  };

  // Function to handle user card press
  const handleUserPress = (user) => {
    navigation.navigate("RecommendedUsersInfoScreen", { 
      requestData: {
        title: user.title,
        artist: user.name,
        email: user.email,
        skills: user.skills,
        joinedDate: user.joinedDate,
        bio: user.bio,
        referencePhotos: user.referencePhotos || []
      }
    });
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient 
      colors={isDarkMode ? gradients.background : gradients.main} 
      locations={isDarkMode ? [0, 1] : [0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "light-content"}
          translucent
          backgroundColor="transparent"
        />

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={[styles.backButtonText, { color: colors.primary }]}>←</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { fontFamily: "Milonga", color: isDarkMode ? colors.text : '#FFFFFF' }]}>
              Recommended Users
            </Text>
          </View>
        </View>

        {/* FILTER TABS */}
        <View style={[styles.tabContainer, { 
          backgroundColor: isDarkMode ? colors.surface : 'rgba(255, 255, 255, 0.15)',
          borderColor: colors.border 
        }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabRow}
          >
            {FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={[
                  styles.tabButton,
                  selectedFilter === filter && { borderBottomWidth: 2, borderColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.8)' },
                    selectedFilter === filter && { color: colors.primary, fontWeight: "bold" },
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* CONTENT */}
        <ScrollView contentContainerStyle={styles.content}>
          {/* User Cards */}
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <TouchableOpacity 
                key={user.id} 
                style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => handleUserPress(user)}
                activeOpacity={0.7}
              >
                <View style={styles.cardInner}>
                  <View style={[styles.avatar, { backgroundColor: colors.primary }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                    <Text style={[styles.userRole, { color: colors.textSecondary }]}>{user.role}</Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.followBtn,
                      { 
                        backgroundColor: isFollowing(user.id) ? 'transparent' : colors.primary,
                        borderWidth: isFollowing(user.id) ? 1.5 : 0,
                        borderColor: isFollowing(user.id) ? colors.primary : 'transparent'
                      },
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFollow(user.id);
                    }}
                  >
                    <Text
                      style={[
                        styles.followText,
                        { 
                          color: isFollowing(user.id) 
                            ? colors.primary 
                            : (isDarkMode ? colors.text : "#000") 
                        },
                      ]}
                    >
                      {isFollowing(user.id) ? "Following" : "Follow"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={(e) => {
                      e.stopPropagation();
                      openMoreModal(user);
                    }}
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>

                {/* Milestone Text Row */}
                {user.milestone && (
                  <View style={styles.milestoneRow}>
                    <Text style={[styles.milestoneText, { color: colors.primary }]}>
                      <Text style={styles.trophyEmoji}>🏆</Text> Reached a new
                      milestone of {user.followers} total followers
                    </Text>
                  </View>
                )}

                {/* Post Preview */}
                <View style={styles.postPreviewRow}>
                  <View style={[styles.postImagePlaceholder, { backgroundColor: colors.surfaceLight }]} />
                  <View style={[styles.postImagePlaceholder, { backgroundColor: colors.surfaceLight }]} />
                  <View style={[styles.postImagePlaceholder, { backgroundColor: colors.surfaceLight }]} />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.noUsersText, { color: colors.textSecondary }]}>No users found</Text>
          )}
        </ScrollView>

        {/* MORE OPERATIONS MODAL */}
        <Modal transparent visible={moreModal.visible} animationType="none">
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setMoreModal({ visible: false, user: null })}
          >
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
                onPress={handleReportUser}
              >
                <Ionicons name="flag-outline" size={22} color="red" />
                <Text style={[styles.optionText, { color: colors.text }]}>Report User</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handleBlockUser(moreModal.user)}
              >
                <Ionicons name="close-circle-outline" size={22} color="red" />
                <Text style={[styles.optionText, { color: colors.text }]}>Block user</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setMoreModal({ visible: false, user: null })}
              >
                <Ionicons name="close" size={24} color={colors.primary} />
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Modal>

        {/* FOOTER */}
        <View style={[styles.footer, { backgroundColor: isDarkMode ? colors.surface : 'rgba(255, 255, 255, 0.15)' }]}>
          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="home" size={24} color={colors.primary} />
            <Text style={[styles.footerText, styles.activeFooterText, { color: colors.primary }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => navigation.navigate("Search")}
          >
            <Ionicons name="search" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.plusSquareButton}
            onPress={() => navigation.navigate("Request")}
          >
            <View style={[styles.plusSquareContainer, { borderColor: colors.primary }]}>
              <Ionicons name="add" size={30} color={colors.primary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => navigation.navigate("Commissions")}
          >
            <Ionicons name="briefcase-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>Commissions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => navigation.navigate("FAQs")}
          >
            <Ionicons name="help-circle-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>FAQs</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 24,
  },
  tabContainer: {
    borderBottomWidth: 1,
    marginTop: 0,
    paddingBottom: 5,
  },
  tabRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 10,
  },
  tabText: { fontSize: 13 },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    paddingTop: 10,
    flexGrow: 1,
  },
  userCard: {
    borderRadius: 15,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardInner: { flexDirection: "row", alignItems: "center", padding: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: { fontWeight: "bold", fontSize: 15 },
  userRole: { fontSize: 12 },
  milestoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginBottom: 8,
  },
  milestoneText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 0,
  },
  trophyEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  followBtn: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginLeft: 'auto',
    marginRight: 10,
  },
  followText: { fontWeight: "600", fontSize: 14 },
  postPreviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  postImagePlaceholder: {
    borderRadius: 8,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  noUsersText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 50,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
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
  optionRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  optionText: { marginLeft: 8, fontSize: 15 },
  closeBtn: { position: "absolute", top: 10, right: 15 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerItem: {
    alignItems: "center",
    flex: 1,
  },
  footerText: {
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
  },
  activeFooterText: {
    fontWeight: "bold",
  },
  plusSquareButton: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  plusSquareContainer: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default RecommendedUsersScreen;