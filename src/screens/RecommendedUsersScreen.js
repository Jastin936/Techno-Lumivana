import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Get screen width for dynamic image sizes
const { width } = Dimensions.get("window");
const IMAGE_SIZE = (width - 40 - 12 * 2 - 8 * 2) / 3;

const RecommendedUsersScreen = ({ navigation }) => {
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

    },
    {
      id: 6,
      name: "Pierra",
      title: "Music Producer",
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
  const [following, setFollowing] = useState({});
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [moreModal, setMoreModal] = useState({ visible: false, user: null });

  const slideAnim = useState(new Animated.Value(300))[0];

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
        const parsedData = JSON.parse(savedUserData);
        setUserData((prev) => ({
          ...prev,
          name: parsedData.name || "Lumivana Vivistera",
          profileImage: parsedData.profileImage || null,
        }));
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
  }, []);

  const filteredUsers = USERS.filter(
    (u) =>
      !blockedUsers.includes(u.id) &&
      (selectedFilter === "All" || u.role.includes(selectedFilter))
  );

  const toggleFollow = (id) => {
    setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBlockUser = (user) => {
    setBlockedUsers((prev) => [...prev, user.id]);
    setMoreModal({ visible: false, user: null });
  };

  const openMoreModal = (user) => {
    setMoreModal({ visible: true, user });
    slideUp();
  };

  // Function to handle user card press - UPDATED
  const handleUserPress = (user) => {
    navigation.navigate("RecommendedUsersInfo", { 
      requestData: {
        title: user.title,
        artist: user.name,
        email: user.email,
        skills: user.skills,
        joinedDate: user.joinedDate,
        bio: user.bio,
        referencePhotos: user.referencePhotos
      }
    });
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={["#0E0E0E", "#1A1A1A"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
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
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { fontFamily: "Milonga" }]}>
              Recommended Users
            </Text>
          </View>
        </View>

        {/* FILTER TABS */}
        <View style={styles.tabContainer}>
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
                  selectedFilter === filter && styles.activeTabButton,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedFilter === filter && styles.activeTabText,
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
                style={styles.userCard}
                onPress={() => handleUserPress(user)}
                activeOpacity={0.7}
              >
                <View style={styles.cardInner}>
                  <View style={styles.avatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userRole}>{user.role}</Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.followBtn,
                      following[user.id] && styles.followingBtn,
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFollow(user.id);
                    }}
                  >
                    <Text
                      style={[
                        styles.followText,
                        following[user.id] && styles.followingText,
                      ]}
                    >
                      {following[user.id] ? "Following" : "Follow"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={(e) => {
                      e.stopPropagation();
                      openMoreModal(user);
                    }}
                  >
                    <Text style={styles.actionText}>⋮</Text>
                  </TouchableOpacity>
                </View>

                {/* Milestone Text Row */}
                {user.milestone && (
                  <View style={styles.milestoneRow}>
                    <Text style={styles.milestoneText}>
                      <Text style={styles.trophyEmoji}>🏆</Text> Reached a new
                      milestone of {user.followers} total followers
                    </Text>
                  </View>
                )}

                {/* Post Preview */}
                <View style={styles.postPreviewRow}>
                  <View style={styles.postImagePlaceholder} />
                  <View style={styles.postImagePlaceholder} />
                  <View style={styles.postImagePlaceholder} />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noUsersText}>No users found</Text>
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
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <Text style={styles.modalTitle}>More Operations</Text>
              <View style={styles.iconRow}>
                <Ionicons name="logo-facebook" size={28} color="#1877F2" />
                <Ionicons name="mail-outline" size={28} color="#EA4335" />
                <Ionicons name="send-outline" size={28} color="#1DA1F2" />
                <Ionicons name="logo-twitter" size={28} color="#fff" />
              </View>
              <View style={styles.optionRow}>
                <Ionicons name="heart-dislike-outline" size={22} color="red" />
                <Text style={styles.optionText}>Not interested</Text>
              </View>
              <View style={styles.optionRow}>
                <Ionicons name="flag-outline" size={22} color="red" />
                <Text style={styles.optionText}>Report Post</Text>
              </View>
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handleBlockUser(moreModal.user)}
              >
                <Ionicons name="close-circle-outline" size={22} color="red" />
                <Text style={styles.optionText}>Block user</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setMoreModal({ visible: false, user: null })}
              >
                <Ionicons name="close" size={24} color="#FFD700" />
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Modal>

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="home" size={24} color="#FFD700" />
            <Text style={[styles.footerText, styles.activeFooterText]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => navigation.navigate("Search")}
          >
            <Ionicons name="search" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.plusSquareButton}
            onPress={() => navigation.navigate("Request")}
          >
            <View style={styles.plusSquareContainer}>
              <Ionicons name="add" size={30} color="#FFD700" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => navigation.navigate("Commissions")}
          >
            <Ionicons name="briefcase-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Commissions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => navigation.navigate("FAQs")}
          >
            <Ionicons name="help-circle-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>FAQs</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

// ... (styles remain the same)
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
    backgroundColor: "rgba(0,0,0,0.2)",
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
    color: "#FFD700",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 24,
    color: "#fff",
  },
  tabContainer: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 1,
    borderColor: "#333",
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
  tabText: { color: "#999", fontSize: 13 },
  activeTabButton: { borderBottomWidth: 2, borderColor: "#FFD700" },
  activeTabText: { color: "#FFD700", fontWeight: "bold" },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    paddingTop: 10,
    flexGrow: 1,
  },
  userCard: {
    backgroundColor: "#1C1C1C",
    borderRadius: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
    overflow: "hidden",
  },
  cardInner: { flexDirection: "row", alignItems: "center", padding: 12 },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#FFD700",
    borderRadius: 20,
    marginRight: 10,
  },
  userName: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  userRole: { color: "#999", fontSize: 12 },
  milestoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginBottom: 8,
  },
  milestoneText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 0,
  },
  trophyEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  followBtn: {
    backgroundColor: "#FFD700",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginLeft: 'auto',
  },
  followText: { color: "#000", fontWeight: "600", fontSize: 14 },
  followingBtn: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#FFD700",
  },
  followingText: { color: "#FFD700" },
  actionText: {
    color: "#FFD700",
    marginLeft: 8,
    fontSize: 24,
    alignSelf: 'center',
    paddingHorizontal: 4,
  },
  postPreviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  postImagePlaceholder: {
    backgroundColor: "#333",
    borderRadius: 8,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  noUsersText: {
    color: "#999",
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
  optionRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  optionText: { color: "#fff", marginLeft: 8, fontSize: 15 },
  closeBtn: { position: "absolute", top: 10, right: 15 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  footerItem: {
    alignItems: "center",
    flex: 1,
  },
  footerText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
  },
  activeFooterText: {
    color: "#FFD700",
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
    borderColor: "#FFD700",
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