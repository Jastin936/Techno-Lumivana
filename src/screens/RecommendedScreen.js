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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RecommendedScreen = ({ navigation }) => {
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
    "Producer",
    "Editor",
  ];
  const USERS = [
    {
      id: 1,
      name: "Kreldeprint",
      role: "Artist",
      followers: 707,
      title: "Bouquet",
      description: "Creates handcrafted bouquet gifts with floral art.",
    },
    {
      id: 2,
      name: "Trevenaa",
      role: "Writer",
      followers: 532,
      title: "Logo Design",
      description: "Designs sleek, minimal logos for small businesses.",
    },
    {
      id: 3,
      name: "Pierra",
      role: "Producer",
      followers: 401,
      title: "Peer Tutoring",
      description: "Guides college students in creative writing projects.",
    },
    {
      id: 4,
      name: "Chieil",
      role: "Editor",
      followers: 689,
      title: "Poster Design",
      description: "Creates stunning poster art and visual campaigns.",
    },
    {
      id: 5,
      name: "Enjoe",
      role: "Programmer",
      followers: 298,
      title: "App Development",
      description: "Builds mobile and web apps using React Native.",
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
      (selectedFilter === "All" || u.role === selectedFilter)
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

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={["#0E0E0E", "#1A1A1A"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />

        {/* HEADER - Simplified without logo and profile */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { fontFamily: "Milonga" }]}>
              Recommended Users
            </Text>
          </View>
        </View>

        {/* FILTER TABS - SAME POSITION AND STYLING AS HOME SCREEN */}
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
                style={[styles.tabButton, selectedFilter === filter && styles.activeTabButton]}
              >
                <Text style={[styles.tabText, selectedFilter === filter && styles.activeTabText]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* CONTENT */}
        <ScrollView contentContainerStyle={styles.content}>
          {/* User Cards */}
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.cardInner}>
                  <View style={styles.avatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userSub}>
                      {user.role} · {user.followers} followers
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.followBtn,
                      following[user.id] && styles.followingBtn,
                    ]}
                    onPress={() => toggleFollow(user.id)}
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

                  <TouchableOpacity onPress={() => openMoreModal(user)}>
                    <Text style={styles.actionText}>⋮</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.innerPost}>
                  <View style={styles.imagePlaceholder} />
                  <Text style={styles.postTitle}>{user.title}</Text>
                  <Text style={styles.postDesc}>{user.description}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noUsersText}>No users found</Text>
          )}
        </ScrollView>

        {/* MORE OPERATIONS TAB */}
        <Modal transparent visible={moreModal.visible} animationType="none">
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
        </Modal>

        {/* FOOTER - From SearchScreen */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="home-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate("Search")}
          >
            <Ionicons name="search" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Search</Text>
          </TouchableOpacity>

          {/* Plus Square Icon in Center */}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // HEADER STYLES - Simplified without logo and profile
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
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backButtonText: {
    fontSize: 28,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  headerTitle: { 
    fontSize: 24, 
    color: '#fff',
  },

  // FILTER TABS - SAME POSITION AND STYLING AS HOME SCREEN
  tabContainer: {
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderColor: "#333",
    marginTop: 10, // Added to match HomeScreen positioning
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

  // Content area
  content: { 
    paddingHorizontal: 20, 
    paddingBottom: 80,
    paddingTop: 10,
    flexGrow: 1,
  },

  // User Cards Styles
  userCard: {
    backgroundColor: "#1C1C1C",
    borderRadius: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFD700",
    overflow: "hidden",
  },
  cardInner: { flexDirection: "row", alignItems: "center", padding: 16 },
  avatar: {
    width: 45,
    height: 45,
    backgroundColor: "#FFD700",
    borderRadius: 22.5,
    marginRight: 12,
  },
  userName: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  userSub: { color: "#999", fontSize: 13 },
  followBtn: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  followText: { color: "#000", fontWeight: "600" },
  followingBtn: { backgroundColor: "#333" },
  followingText: { color: "#FFD700" },
  actionText: { color: "#FFD700", marginLeft: 8, fontSize: 20 },
  innerPost: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    marginHorizontal: 10,
    marginBottom: 12,
    padding: 12,
  },
  imagePlaceholder: {
    backgroundColor: "#333",
    borderRadius: 12,
    height: 150,
    marginVertical: 10,
  },
  postTitle: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  postDesc: { color: "#ccc", fontSize: 13 },
  noUsersText: {
    color: "#999",
    textAlign: "center",
    fontSize: 16,
    marginTop: 50,
  },

  // Modal Styles
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
  optionRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  optionText: { color: "#fff", marginLeft: 8, fontSize: 15 },
  closeBtn: { position: "absolute", top: 10, right: 15 },

  // FOOTER STYLES - From SearchScreen
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

export default RecommendedScreen;