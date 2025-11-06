import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const categories = [
  "All",
  "Artist",
  "Writer",
  "Programmer",
  "Proofreader",
  "Editor",
];

const usersData = [
  {
    id: "1",
    name: "Kreidedeprinz",
    roles: ["Artist", "Writer"],
    milestone: "Reached a new milestone of 70 total followers",
  },
  {
    id: "2",
    name: "Coribert",
    roles: ["Programmer"],
    milestone: "Reached 100 total followers",
  },
  {
    id: "3",
    name: "Grace",
    roles: ["Proofreader"],
    milestone: "Reached 50 total followers",
  },
];

export default function RecommendedUsersScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredUsers =
    selectedCategory === "All"
      ? usersData
      : usersData.filter((user) => user.roles.includes(selectedCategory));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recommended Users</Text>
      </View>

      <View style={styles.categoryBar}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item)}
              activeOpacity={0.8}
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.activeCategoryButton,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.activeCategoryText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.avatarPlaceholder} />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userRole}>{item.roles.join(", ")}</Text>
              <View style={styles.milestoneBox}>
                <Text style={styles.milestoneText}>{item.milestone}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 5,
  },
  headerTitle: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  categoryBar: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  categoryButton: {
    height: 36,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#222",
    marginHorizontal: 5,
  },
  activeCategoryButton: {
    backgroundColor: "#FFD700",
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
  },
  activeCategoryText: {
    color: "#000",
    fontWeight: "bold",
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: "#FFD700",
    borderRadius: 25,
    marginRight: 12,
  },
  userName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  userRole: {
    color: "#aaa",
    fontSize: 13,
  },
  milestoneBox: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 6,
    marginTop: 6,
  },
  milestoneText: {
    color: "#fff",
    fontSize: 12,
  },
  followButton: {
    backgroundColor: "#FFD700",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: "center",
    marginLeft: 10,
  },
  followText: {
    fontWeight: "bold",
    color: "#000",
  },
});
