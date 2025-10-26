import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';

const HomeScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  // 🌟 Recommended Users Data
  const FILTERS = ['All', 'Artist', 'Writer', 'Programmer', 'Producer', 'Editor'];
  const USERS = [
    { id: 1, name: 'KendrickPage', role: 'Artist', followers: 124 },
    { id: 2, name: 'Corbert', role: 'Writer', followers: 95 },
    { id: 3, name: 'Enjoe', role: 'Programmer', followers: 67 },
    { id: 4, name: 'Grace', role: 'Producer', followers: 112 },
    { id: 5, name: 'Marie', role: 'Editor', followers: 49 },
    { id: 6, name: 'Glory', role: 'Artist', followers: 89 },
  ];

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [following, setFollowing] = useState({});
  const [modal, setModal] = useState({ visible: false, type: '', user: null });

  const filteredUsers =
    selectedFilter === 'All'
      ? USERS
      : USERS.filter((u) => u.role === selectedFilter);

  const toggleFollow = (id) => {
    setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={['#CFAD01', '#30204D', '#0B005F']}
      locations={[0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* HEADER (unchanged) */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/lumivana.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.logoText, { fontFamily: 'Milonga' }]}>Lumivana</Text>
          </View>
          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle-outline" size={36} color="#FFD700" />
          </TouchableOpacity>
        </View>

        {/* 🌟 Recommended Users Only */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Recommended Users</Text>

          {/* Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.chip,
                  selectedFilter === f && styles.chipActive,
                ]}
                onPress={() => setSelectedFilter(f)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedFilter === f && styles.chipTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* User Cards */}
          {filteredUsers.map((user) => (
            <View key={user.id} style={styles.userCard}>
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
                  {following[user.id] ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    setModal({ visible: true, type: 'report', user })
                  }
                >
                  <Text style={styles.actionText}>⋮</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setModal({ visible: true, type: 'block', user })
                  }
                >
                  <Text style={styles.actionText}>🚫</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* 🌙 Popup Modal */}
        <Modal
          transparent
          visible={modal.visible}
          animationType="fade"
          onRequestClose={() => setModal({ visible: false })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                {modal.type === 'report' ? 'Report User' : 'Block User'}
              </Text>
              <Text style={{ color: '#ccc', textAlign: 'center', marginVertical: 10 }}>
                Are you sure you want to {modal.type}{' '}
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  {modal.user?.name}
                </Text>
                ?
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => setModal({ visible: false })}
                  style={styles.cancelBtn}
                >
                  <Text style={{ color: '#fff' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn}>
                  <Text style={{ color: '#000' }}>
                    {modal.type === 'report' ? 'Report' : 'Block'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* FOOTER (unchanged) */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerItem}>
            <Ionicons name="search-outline" size={24} color="#FFD700" />
            <Text style={[styles.footerText, styles.activeFooterText]}>Home Feed</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('Commissions')}
          >
            <FontAwesome5 name="briefcase" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Commissions</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('AcceptedCommissions')}
          >
            <Ionicons name="pencil-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Accepted{"\n"}Commissions</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('FAQs')}
          >
            <MaterialCommunityIcons name="question-mark-outline" size={24} color="#FFD700" />
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 24, paddingBottom: 16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: 'rgba(0,0,0,0.2)' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, marginRight: 8 },
  logoText: { fontSize: 28, color: '#fff' },
  profileIcon: {},
  content: { paddingHorizontal: 24, paddingBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 16, marginTop: 10 },

  // Recommended Users
  chip: { backgroundColor: '#333', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8 },
  chipActive: { backgroundColor: '#f6c33b' },
  chipText: { color: '#fff' },
  chipTextActive: { color: '#000', fontWeight: '600' },
  userCard: { backgroundColor: 'rgba(30,30,30,0.85)', borderRadius: 10, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, position: 'relative' },
  avatar: { width: 48, height: 48, backgroundColor: '#555', borderRadius: 24, marginRight: 12 },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  userSub: { color: '#aaa', fontSize: 13 },
  followBtn: { backgroundColor: '#f6c33b', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  followText: { color: '#000' },
  followingBtn: { backgroundColor: '#333' },
  followingText: { color: '#f6c33b' },
  actions: { position: 'absolute', top: 10, right: 10, flexDirection: 'row' },
  actionText: { color: '#fff', marginLeft: 8, fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  modalBox: { backgroundColor: '#222', borderRadius: 10, padding: 20, width: '80%', alignItems: 'center' },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cancelBtn: { backgroundColor: '#444', padding: 8, borderRadius: 6, marginRight: 8, minWidth: 80, alignItems: 'center' },
  confirmBtn: { backgroundColor: '#f6c33b', padding: 8, borderRadius: 6, minWidth: 80, alignItems: 'center' },

  // Footer
  footer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, paddingBottom: 40, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: 'rgba(0,0,0,0.2)' },
  footerItem: { alignItems: 'center' },
  footerText: { color: '#fff', fontSize: 12, marginTop: 2, textAlign: 'center' },
  activeFooterText: { color: '#FFD700', fontWeight: 'bold' },
});

export default HomeScreen;
