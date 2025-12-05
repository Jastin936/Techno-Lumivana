import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Animated,
  Easing,
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
} from "react-native";
import { useTheme } from '../context/ThemeContext';

const RecommendedScreen = ({ navigation }) => {
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
    "Producer",
    "Editor",
  ];
  
  // FIX: Added referencePhotos: [] to all users to prevent navigation crashes
  const USERS = [
    {
      id: 1,
      name: "Kreldeprint",
      role: "Artist",
      followers: 707,
      title: "Bouquet",
      description: "Creates handcrafted bouquet gifts with floral art.",
      referencePhotos: []
    },
    {
      id: 2,
      name: "Trevenaa",
      role: "Writer",
      followers: 532,
      title: "Logo Design",
      description: "Designs sleek, minimal logos for small businesses.",
      referencePhotos:  []
    },
    {
      id: 3,
      name: "Pierra",
      role: "Producer",
      followers: 401,
      title: "Peer Tutoring",
      description: "Guides college students in creative writing projects.",
      referencePhotos: []
    },
    {
      id: 4,
      name: "Chieil",
      role: "Editor",
      followers: 689,
      title: "Poster Design",
      description: "Creates stunning poster art and visual campaigns.",
      referencePhotos: []
    },
    {
      id: 5,
      name: "Enjoe",
      role: "Programmer",
      followers: 298,
      title: "App Development",
      description: "Builds mobile and web apps using React Native.",
      referencePhotos: []
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
        // FIX: Wrapped in try/catch to prevent crash on corrupted data
        try {
          const parsedData = JSON.parse(savedUserData);
          setUserData((prev) => ({
            ...prev,
            name: parsedData.name || "Lumivana Vivistera",
            profileImage: parsedData.profileImage || null,
          }));
        } catch (parseError) {
          console.log('Error parsing user data:', parseError);
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
            <Image
              source={require("../../assets/lumivana.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.logoText, { fontFamily: "Milonga", color: isDarkMode ? colors.primary : '#FFFFFF' }]}>
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
              <Ionicons name="person-circle-outline" size={36} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR + FILTER */}
        <View style={styles.searchRow}>
          <View style={[styles.searchBar, { 
            backgroundColor: isDarkMode ? colors.inputBackground : 'rgba(255, 255, 255, 0.9)'
          }]}>
            <Ionicons
              name="search-outline"
              size={20}
              color={isDarkMode ? colors.textMuted : colors.text}
              style={{ marginHorizontal: 8 }}
            />
            <TextInput
              placeholder="Search"
              placeholderTextColor={isDarkMode ? colors.inputPlaceholder : colors.textSecondary}
              style={{ flex: 1, color: isDarkMode ? colors.inputText : colors.text }}
            />
          </View>
          <TouchableOpacity onPress={openFilterModal}>
            <Ionicons name="filter" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* CONTENT */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Recommended Users</Text>

          {/* User Cards */}
          {filteredUsers.map((user) => (
            <View key={user.id} style={[styles.userCard, { 
              backgroundColor: isDarkMode ? colors.card : 'rgba(255, 255, 255, 0.15)',
              borderColor: isDarkMode ? colors.border : colors.cardBorder
            }]}>
              <View style={styles.cardInner}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                  <Text style={[styles.userSub, { color: colors.textSecondary }]}>
                    {user.role} · {user.followers} followers
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.followBtn,
                    { borderColor: colors.border },
                    following[user.id] && { backgroundColor: colors.surface }
                  ]}
                  onPress={() => toggleFollow(user.id)}
                >
                  <Text
                    style={[
                      styles.followText,
                      { color: following[user.id] ? colors.primary : colors.text }
                    ]}
                  >
                    {following[user.id] ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => openMoreModal(user)}>
                  <Text style={[styles.actionText, { color: colors.text }]}>⋮</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.innerPost}>
                <View style={[styles.imagePlaceholder, { 
                  backgroundColor: isDarkMode ? colors.surfaceLight : colors.surfaceLight 
                }]} />
                <Text style={[styles.postTitle, { color: colors.text }]}>{user.title}</Text>
                <Text style={[styles.postDesc, { color: colors.textSecondary }]}>{user.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* MORE OPERATIONS TAB */}
        <Modal transparent visible={moreModal.visible} animationType="none">
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
              <Ionicons name="logo-facebook" size={28} color="#1877F2" />
              <Ionicons name="mail-outline" size={28} color="#EA4335" />
              <Ionicons name="send-outline" size={28} color="#1DA1F2" />
              <Ionicons name="logo-twitter" size={28} color={colors.text} />
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
        </Modal>

        {/* FILTER TAB */}
        <Modal transparent visible={filterVisible} animationType="none">
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
            <Text style={[styles.modalTitle, { color: colors.primary }]}>Filter</Text>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterOption,
                  { borderBottomColor: colors.border },
                  selectedFilter === f && { backgroundColor: colors.surface }
                ]}
                onPress={() => {
                  setSelectedFilter(f);
                  setFilterVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: colors.text },
                    selectedFilter === f && { color: colors.primary },
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
              <Ionicons name="close" size={24} color={colors.primary} />
            </TouchableOpacity>
          </Animated.View>
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
            <Ionicons name="search-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
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
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logo: { width: 40, height: 40, marginRight: 8 },
  logoText: { fontSize: 28 },
  profileIcon: { width: 36, height: 36, borderRadius: 18, overflow: "hidden" },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    paddingHorizontal: 6,
  },
  content: { paddingHorizontal: 20, paddingBottom: 80 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  userCard: {
    borderRadius: 15,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardInner: { flexDirection: "row", alignItems: "center", padding: 16 },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  userName: { fontWeight: "bold", fontSize: 16 },
  userSub: { fontSize: 13 },
  followBtn: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  followText: { fontWeight: "600" },
  followingBtn: { },
  followingText: { },
  actionText: { marginLeft: 8, fontSize: 20 },
  innerPost: {
    borderRadius: 12,
    marginHorizontal: 10,
    marginBottom: 12,
    padding: 12,
  },
  postTitle: { fontWeight: "bold", fontSize: 15 },
  postDesc: { fontSize: 13 },
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
  optionRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  optionText: { marginLeft: 8, fontSize: 15 },
  filterOption: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  filterOptionActive: {
  },
  closeBtn: { position: "absolute", top: 10, right: 15 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingBottom: 40,
  },
  footerItem: { alignItems: "center", flex: 1 },
  footerText: { fontSize: 12, marginTop: 2, textAlign: "center" },
  activeFooterText: { fontWeight: "bold" },
  plusSquareButton: { alignItems: "center", marginHorizontal: 10 },
  plusSquareContainer: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecommendedScreen;