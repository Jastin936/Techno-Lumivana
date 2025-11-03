import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [userData, setUserData] = useState({
    name: 'Lumivana Vivistera',
    profileImage: null,
  });

  const FILTERS = ['All', 'Artist', 'Writer', 'Programmer', 'Producer', 'Editor'];
  const USERS = [
    { id: 1, name: 'Kreldeprint', role: 'Artist', followers: 707, title: 'Bouquet', description: 'Creates handcrafted bouquet gifts with floral art.' },
    { id: 2, name: 'Trevenaa', role: 'Writer', followers: 532, title: 'Logo Design', description: 'Designs sleek, minimal logos for small businesses.' },
    { id: 3, name: 'Pierra', role: 'Producer', followers: 401, title: 'Peer Tutoring', description: 'Guides college students in creative writing projects.' },
    { id: 4, name: 'Chieil', role: 'Graphic Designer', followers: 689, title: 'Poster Design', description: 'Creates stunning poster art and visual campaigns.' },
    { id: 5, name: 'Enjoe', role: 'Programmer', followers: 298, title: 'App Development', description: 'Builds mobile and web apps using React Native.' },
  ];

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [following, setFollowing] = useState({});
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [modal, setModal] = useState({ visible: false, user: null });

  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userProfileData');
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        setUserData((prev) => ({
          ...prev,
          name: parsedData.name || 'Lumivana Vivistera',
          profileImage: parsedData.profileImage || null,
        }));
      }
      const savedProfileImage = await AsyncStorage.getItem('profileImage');
      if (savedProfileImage) {
        setUserData((prev) => ({ ...prev, profileImage: savedProfileImage }));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadUserData);
    return unsubscribe;
  }, [navigation]);

  const filteredUsers = USERS.filter(
    (u) => (selectedFilter === 'All' || u.role === selectedFilter) && !blockedUsers.includes(u.id)
  );

  const toggleFollow = (id) => {
    setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBlockUser = (user) => {
    Alert.alert(
      'Block User',
      `Are you sure you want to block ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            setBlockedUsers((prev) => [...prev, user.id]);
            setModal({ visible: false, user: null });
          },
        },
      ]
    );
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={['#0E0E0E', '#1A1A1A']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={require('../../assets/lumivana.png')} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.logoText, { fontFamily: 'Milonga' }]}>Lumivana</Text>
          </View>
          <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Profile')}>
            {userData.profileImage ? (
              <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person-circle-outline" size={36} color="#FFD700" />
            )}
          </TouchableOpacity>
        </View>

        {/* CONTENT */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Recommended Users</Text>

          {/* Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.chip, selectedFilter === f && styles.chipActive]}
                onPress={() => setSelectedFilter(f)}
              >
                <Text style={[styles.chipText, selectedFilter === f && styles.chipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

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
                  style={[styles.followBtn, following[user.id] && styles.followingBtn]}
                  onPress={() => toggleFollow(user.id)}
                >
                  <Text style={[styles.followText, following[user.id] && styles.followingText]}>
                    {following[user.id] ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setModal({ visible: true, user })}>
                  <Text style={styles.actionText}>⋮</Text>
                </TouchableOpacity>
              </View>

              {/* Post */}
              <View style={styles.innerPost}>
                <View style={styles.imagePlaceholder} />
                <Text style={styles.postTitle}>{user.title}</Text>
                <Text style={styles.postDesc}>{user.description}</Text>
                <View style={styles.bottomRow}>
                  <Ionicons name="heart-outline" size={18} color="#FFD700" />
                  <Text style={styles.likeCount}>{user.followers}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* MODAL MENU */}
        <Modal transparent visible={modal.visible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{modal.user?.name}</Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModal({ visible: false, user: null });
                  navigation.navigate('Profile', { user: modal.user });
                }}
              >
                <Text style={styles.modalButtonText}>View Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#FFD70020', borderColor: '#FFD700' }]}
                onPress={() => handleBlockUser(modal.user)}
              >
                <Text style={[styles.modalButtonText, { color: '#FFD700' }]}>Block User</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModal({ visible: false, user: null })}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerItem}>
            <Ionicons name="home" size={24} color="#FFD700" />
            <Text style={[styles.footerText, styles.activeFooterText]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem}>
            <Ionicons name="search-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.plusSquareButton}>
            <View style={styles.plusSquareContainer}>
              <Ionicons name="add" size={30} color="#FFD700" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem}>
            <Ionicons name="briefcase-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Commissions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem}>
            <Ionicons name="help-circle-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>FAQs</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 24, paddingBottom: 16, backgroundColor: '#0E0E0E' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, marginRight: 8 },
  logoText: { fontSize: 28, color: '#FFD700' },
  profileIcon: { width: 36, height: 36, borderRadius: 18, overflow: 'hidden' },
  profileImage: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#FFD700' },
  content: { paddingHorizontal: 20, paddingBottom: 80 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFD700', marginBottom: 16 },

  chip: { backgroundColor: '#222', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8 },
  chipActive: { backgroundColor: '#FFD700' },
  chipText: { color: '#fff' },
  chipTextActive: { color: '#000', fontWeight: '600' },

  userCard: { backgroundColor: '#1C1C1C', borderRadius: 15, marginBottom: 16, borderWidth: 1, borderColor: '#FFD700', overflow: 'hidden' },
  cardInner: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: { width: 45, height: 45, backgroundColor: '#FFD700', borderRadius: 22.5, marginRight: 12 },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  userSub: { color: '#999', fontSize: 13 },
  followBtn: { backgroundColor: '#FFD700', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  followText: { color: '#000', fontWeight: '600' },
  followingBtn: { backgroundColor: '#333' },
  followingText: { color: '#FFD700' },
  actionText: { color: '#FFD700', marginLeft: 8, fontSize: 20 },

  innerPost: { backgroundColor: '#2A2A2A', borderRadius: 12, marginHorizontal: 10, marginBottom: 12, padding: 12 },
  imagePlaceholder: { backgroundColor: '#444', height: 100, borderRadius: 8, marginBottom: 10 },
  postTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  postDesc: { color: '#ccc', fontSize: 13, marginBottom: 8 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  likeCount: { color: '#FFD700', marginLeft: 4, fontWeight: '600' },

  footer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, paddingBottom: 40, backgroundColor: '#0E0E0E' },
  footerItem: { alignItems: 'center', flex: 1 },
  footerText: { color: '#fff', fontSize: 12, marginTop: 2, textAlign: 'center' },
  activeFooterText: { color: '#FFD700', fontWeight: 'bold' },
  plusSquareButton: { alignItems: 'center', marginHorizontal: 10 },
  plusSquareContainer: { width: 45, height: 45, borderWidth: 2, borderColor: '#FFD700', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: 250, backgroundColor: '#1A1A1A', borderRadius: 10, padding: 20, alignItems: 'center', borderColor: '#FFD700', borderWidth: 1 },
  modalTitle: { color: '#FFD700', fontWeight: 'bold', fontSize: 18, marginBottom: 12 },
  modalButton: { width: '100%', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#444', marginBottom: 10, alignItems: 'center' },
  modalButtonText: { color: '#fff', fontWeight: '600' },
  modalCancel: { color: '#ccc', marginTop: 4 },
});

export default HomeScreen;
