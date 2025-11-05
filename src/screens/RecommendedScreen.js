import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
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
  const [filterVisible, setFilterVisible] = useState(false);

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
      (selectedFilter === "All" || u.role === selectedFilter) &&
      !blockedUsers.includes(u.id)
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

  const openFilterModal = () => {
    setFilterVisible(true);
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

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/lumivana.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.logoText, { fontFamily: "Milonga" }]}>
              Lumivana
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => navigation.navigate("Profile")}
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

        {/* SEARCH BAR + FILTER */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#000"
              style={{ marginHorizontal: 8 }}
            />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#444"
              style={{ flex: 1, color: "#000" }}
            />
          </View>
          <TouchableOpacity onPress={openFilterModal}>
            <Ionicons name="filter" size={24} color="#FFD700" />
          </TouchableOpacity>
        </View>

        {/* CONTENT */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Recommended Users</Text>

          {/* User Cards */}
          {filteredUsers.map((user) => (
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
          ))}
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

        {/* FILTER TAB */}
        <Modal transparent visible={filterVisible} animationType="none">
          <Animated.View
            style={[
              styles.bottomSheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.modalTitle}>Filter</Text>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterOption,
                  selectedFilter === f && styles.filterOptionActive,
                ]}
                onPress={() => {
                  setSelectedFilter(f);
                  setFilterVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedFilter === f && { color: "#FFD700" },
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setFilterVisible(false)}
            >
              <Ionicons name="close" size={24} color="#FFD700" />
            </TouchableOpacity>
          </Animated.View>
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
            <Ionicons name="search-outline" size={24} color="#FFD700" />
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: "#0E0E0E",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logo: { width: 40, height: 40, marginRight: 8 },
  logoText: { fontSize: 28, color: "#FFD700" },
  profileIcon: { width: 36, height: 36, borderRadius: 18, overflow: "hidden" },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ccc",
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    paddingHorizontal: 6,
  },
  content: { paddingHorizontal: 20, paddingBottom: 80 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 16,
  },
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
  postTitle: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  postDesc: { color: "#ccc", fontSize: 13 },
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
  filterOption: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  filterOptionActive: {
    backgroundColor: "#FFD70020",
  },
  closeBtn: { position: "absolute", top: 10, right: 15 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingBottom: 40,
    backgroundColor: "#0E0E0E",
  },
  footerItem: { alignItems: "center", flex: 1 },
  footerText: { color: "#fff", fontSize: 12, marginTop: 2, textAlign: "center" },
  activeFooterText: { color: "#FFD700", fontWeight: "bold" },
  plusSquareButton: { alignItems: "center", marginHorizontal: 10 },
  plusSquareContainer: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderColor: "#FFD700",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecommendedScreen;



