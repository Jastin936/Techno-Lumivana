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
  Dimensions,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');

const AcceptedCommissionsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');

  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const acceptedCommissions = [
    {
      id: 1,
      title: 'Website Design',
      client: 'John Smith',
      deadline: '01/01/2026',
      price: '₱25,000',
      status: 'active',
      category: 'Creative/Art'
    },
    {
      id: 2,
      title: 'Research Paper',
      client: 'Sarah Johnson',
      deadline: '12/26/2025',
      price: '₱15,000',
      status: 'completed',
      category: 'Academic'
    },
    {
      id: 3,
      title: 'Content Writing',
      client: 'Mike Davis',
      deadline: '09/29/2025',
      price: '₱10,000',
      status: 'active',
      category: 'Writing/Editing'
    },
  ];

  const filteredCommissions = acceptedCommissions.filter(
    commission =>
      commission.status === activeTab &&
      commission.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }

  const getStatusColor = status => (status === 'active' ? '#4CAF50' : '#2196F3');
  const getStatusText = status => (status === 'active' ? 'In Progress' : 'Completed');

  return (
    <LinearGradient
      colors={['#CFAD01', '#30204D', '#0B005F']}
      locations={[0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Image
                source={require('../../assets/lumivana.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={[styles.logoText, { fontFamily: 'Milonga' }]}>Lumivana</Text>
            </View>

            {/* Profile Icon Navigation */}
            <TouchableOpacity
              style={styles.profileIcon}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-circle-outline" size={36} color="#FFD700" />
            </TouchableOpacity>
          </View>

          {/* Page Title and Search Bar */}
          <View style={styles.headerBottom}>
            <Text style={styles.pageTitle}>ACCEPTED COMMISSIONS</Text>

            <View style={styles.searchRow}>
              <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search accepted"
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <View style={styles.rightIcons}>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="funnel-outline" size={24} color="#FFD700" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="menu-outline" size={24} color="#FFD700" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'active' && styles.activeTab]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.content}>
          {filteredCommissions.length > 0 ? (
            filteredCommissions.map(commission => (
              <View key={commission.id} style={styles.commissionCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                  style={styles.commissionGradient}
                >
                  <View style={styles.commissionHeader}>
                    <Text style={styles.commissionTitle}>{commission.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(commission.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(commission.status)}</Text>
                    </View>
                  </View>

                  <View style={styles.commissionDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="person-outline" size={16} color="#FFD700" />
                      <Text style={styles.detailText}>Client: {commission.client}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={16} color="#FFD700" />
                      <Text style={styles.detailText}>Deadline: {commission.deadline}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="pricetag-outline" size={16} color="#FFD700" />
                      <Text style={styles.detailText}>Price: {commission.price}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="folder-outline" size={16} color="#FFD700" />
                      <Text style={styles.detailText}>Category: {commission.category}</Text>
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
                    {commission.status === 'active' && (
                      <>
                        <TouchableOpacity style={styles.primaryButton}>
                          <Text style={styles.primaryButtonText}>Update Progress</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton}>
                          <Text style={styles.secondaryButtonText}>Mark Complete</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {commission.status === 'completed' && (
                      <TouchableOpacity style={styles.reviewButton}>
                        <Text style={styles.reviewButtonText}>View Review</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </LinearGradient>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="file-tray-outline" size={64} color="#FFD700" />
              <Text style={styles.emptyStateTitle}>No {activeTab} commissions</Text>
              <Text style={styles.emptyStateText}>
                {activeTab === 'active'
                  ? "You don't have any active commissions at the moment."
                  : "You haven't completed any commissions yet."}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="search-outline" size={22} color="#FFD700" />
            <Text style={styles.footerText}>Home Feed</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Commissions')}>
            <Ionicons name="briefcase-outline" size={22} color="#FFD700" />
            <Text style={styles.footerText}>Commissions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.footerItem, styles.activeFooterItem]}>
            <Ionicons name="pencil-outline" size={22} color="#FFD700" />
            <Text style={[styles.footerText, styles.activeFooterText]}>Accepted{"\n"}Commissions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('FAQs')}>
            <Ionicons name="question-mark-outline" size={22} color="#FFD700" />
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
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, marginRight: 8 },
  logoText: { fontSize: 28, color: '#fff' },
  profileIcon: {},
  headerBottom: {},
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    letterSpacing: 1,
  },
  searchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#333', padding: 0 },
  rightIcons: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { padding: 8, marginLeft: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 24, marginVertical: 16 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#FFD700' },
  tabText: { color: '#ccc', fontSize: 16, fontWeight: 'bold' },
  activeTabText: { color: '#FFD700' },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 20 },
  commissionCard: { borderRadius: 15, overflow: 'hidden', marginBottom: 16 },
  commissionGradient: { padding: 20, borderRadius: 15 },
  commissionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  commissionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', flex: 1, marginRight: 12 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  commissionDetails: { marginBottom: 16 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailText: { color: '#ccc', fontSize: 14 },
  actionButtons: { flexDirection: 'row', gap: 12 },
  primaryButton: { flex: 1, backgroundColor: '#FFD700', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  primaryButtonText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  secondaryButton: { flex: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#FFD700', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  secondaryButtonText: { color: '#FFD700', fontWeight: 'bold', fontSize: 14 },
  reviewButton: { flex: 1, backgroundColor: '#2196F3', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  reviewButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyStateTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFD700', marginTop: 16, marginBottom: 8 },
  emptyStateText: { fontSize: 16, color: '#ccc', textAlign: 'center', paddingHorizontal: 40 },
  footer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, paddingBottom: 40, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: 'rgba(0,0,0,0.2)' },
  footerItem: { alignItems: 'center' },
  activeFooterItem: { transform: [{ scale: 1.1 }] },
  footerText: { color: '#fff', fontSize: 12, marginTop: 2, textAlign: 'center' },
  activeFooterText: { color: '#FFD700', fontWeight: 'bold' },
});

export default AcceptedCommissionsScreen;
