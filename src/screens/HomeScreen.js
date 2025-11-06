import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Home");
  const [following, setFollowing] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Graphic Design",
    "Illustration",
    "Crafting",
    "Writing",
    "Photography",
    "Tutoring",
  ];

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

  return (
    <LinearGradient colors={["#0E0E0E", "#1A1A1A"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        
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
          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate("Home")}>
            <Ionicons name="home" size={24} color="#FFD700" />
            <Text style={[styles.footerText, styles.activeFooterText]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate("Search")}>
            <Ionicons name="search-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => navigation.navigate("OfferCommission")}
          >
            <Ionicons name="add" size={30} color="#FFD700" />
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
            onPress={() => navigation.navigate("Profile")}
          >
            <Ionicons name="person-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* 🧩 FILTER MODAL */}
        <Modal
          visible={filterVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setFilterVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filter by Category</Text>

              {/* 🟡 Category List (List Style) */}
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryListItem,
                    selectedCategory === cat && styles.categoryListItemActive,
                  ]}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setFilterVisible(false);
                  }}
                >
                  <View
                    style={[
                      styles.checkbox,
                      selectedCategory === cat && styles.checkboxChecked,
                    ]}
                  />
                  <Text
                    style={[
                      styles.categoryListText,
                      selectedCategory === cat && styles.activeCategoryText,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    backgroundColor: "#1A1A1A",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#333",
    marginTop: 30,
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

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingBottom: 40,
    backgroundColor: "#0E0E0E",
  },
  footerItem: { alignItems: "center", flex: 1 },
  footerText: { color: "#fff", fontSize: 12, marginTop: 2 },
  activeFooterText: { color: "#FFD700", fontWeight: "bold" },
  plusButton: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "#FFD700",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    backgroundColor: "#1A1A1A",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1C1C1C",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  // 🟡 List Style Categories
  categoryListItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  categoryListItemActive: { backgroundColor: "#FFD70030" },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#FFD700",
    marginRight: 10,
  },
  checkboxChecked: { backgroundColor: "#FFD700" },
  categoryListText: { color: "#fff", fontSize: 14 },
  activeCategoryText: { color: "#FFD700", fontWeight: "bold" },
});

export default HomeScreen;
