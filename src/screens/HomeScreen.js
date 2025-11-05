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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Home");
  const [following, setFollowing] = useState({});

  // Mock Recommended Users
  const recommendedUsers = [
    { id: 1, name: "Kreidedeprinz", role: "Illustrator", followers: 707 },
    { id: 2, name: "Chiori", role: "Crafter, Graphic Designer", followers: 680 },
    { id: 3, name: "Aelric", role: "Writer", followers: 423 },
  ];

  // Mock Feed Posts
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

  // Filter logic based on active tab
  const filteredPosts = allPosts.filter((post) => {
    if (activeTab === "Following") {
      return following[post.user];
    }
    if (activeTab === "Requests") {
      return post.type === "request";
    }
    return true; // Home tab shows all
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
          style={[
            styles.followBtn,
            following[item.user] && styles.followingBtn,
          ]}
          onPress={() => toggleFollow(item.user)}
        >
          <Text
            style={[
              styles.followText,
              following[item.user] && styles.followingText,
            ]}
          >
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

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home Feeds</Text>
        </View>

        {/* TOP TABS */}
        <View style={styles.tabRow}>
          {["Following", "Home", "Requests"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTabButton,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView>
          {/* Recommended Users (Home Tab only) */}
          {activeTab === "Home" && (
            <View style={styles.recommendedSection}>
              <View style={styles.recommendedHeader}>
                <Text style={styles.sectionTitle}>Recommended Users</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("RecommendedScreen")}
                >
                  <Text style={styles.viewMore}>View More</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recommendedUsers.map((user) => (
                  <View key={user.id} style={styles.recommendedCard}>
                    <View style={styles.avatarLarge} />
                    <Text style={styles.recUserName}>{user.name}</Text>
                    <Text style={styles.recUserRole}>{user.role}</Text>
                    <TouchableOpacity
                      style={[
                        styles.followBtn,
                        following[user.name] && styles.followingBtn,
                      ]}
                      onPress={() => toggleFollow(user.name)}
                    >
                      <Text
                        style={[
                          styles.followText,
                          following[user.name] && styles.followingText,
                        ]}
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
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50,
    paddingBottom: 12,
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "bold",
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1A1A1A",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  tabButton: { paddingHorizontal: 8 },
  tabText: { color: "#999", fontSize: 14 },
  activeTabButton: { borderBottomWidth: 2, borderColor: "#FFD700" },
  activeTabText: { color: "#FFD700", fontWeight: "bold" },

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
});

export default HomeScreen;
