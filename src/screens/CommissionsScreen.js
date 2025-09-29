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

const CommissionsScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const commissionCategories = [
    {
      id: 'creative',
      title: 'CREATIVE/ART COMMISSIONS',
      icon: '🎨',
      description: 'Art, design, and creative projects'
    },
    {
      id: 'academic',
      title: 'ACADEMIC COMMISSIONS',
      icon: '📚',
      description: 'Academic writing and research'
    },
    {
      id: 'writing',
      title: 'WRITING/EDITING',
      icon: '✍️',
      description: 'Content writing and editing services'
    }
  ];

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }

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
            <Text style={styles.pageTitle}>COMMISSIONS</Text>
            
            {/* Search Bar with Icons */}
            <View style={styles.searchRow}>
              <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              
              {/* Right Icons */}
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

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.content}>
          {/* Commission Categories */}
          <View style={styles.categoriesContainer}>
            {commissionCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  activeCategory === category.id && styles.activeCategoryCard
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                <LinearGradient
                  colors={activeCategory === category.id ? 
                    ['#FFD700', '#CFAD01'] : 
                    ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                  style={styles.categoryGradient}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryTitle,
                    activeCategory === category.id && styles.activeCategoryTitle
                  ]}>
                    {category.title}
                  </Text>
                  <Text style={[
                    styles.categoryDescription,
                    activeCategory === category.id && styles.activeCategoryDescription
                  ]}>
                    {category.description}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Additional Content Placeholder */}
          <View style={styles.commissionsList}>
            <Text style={styles.commissionsTitle}>
              Available Commissions ({commissionCategories.find(cat => cat.id === activeCategory)?.title || 'ALL'})
            </Text>
            <View style={styles.commissionItem}>
              <Text style={styles.commissionItemText}>No commissions available</Text>
              <Text style={styles.commissionItemSubtext}>
                Check back later for new opportunities
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="search-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Home Feed</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.footerItem, styles.activeFooterItem]}>
            <Ionicons name="briefcase-outline" size={24} color="#FFD700" />
            <Text style={[styles.footerText, styles.activeFooterText]}>Commissions</Text>
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
            <Ionicons name="question-mark-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>FAQs</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
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
  headerLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  logo: { 
    width: 40, 
    height: 40, 
    marginRight: 8 
  },
  logoText: { 
    fontSize: 28, 
    color: '#fff' 
  },
  profileIcon: {},
  headerBottom: {
    // Contains the title and search bar
  },
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  content: { 
    flex: 1,
    paddingHorizontal: 24, 
    paddingBottom: 20,
    paddingTop: 20,
  },
  categoriesContainer: {
    marginBottom: 30,
  },
  categoryCard: {
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  activeCategoryCard: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  categoryGradient: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  activeCategoryTitle: {
    color: '#000',
    fontWeight: '900',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  activeCategoryDescription: {
    color: '#333',
    fontWeight: '600',
  },
  commissionsList: {
    flex: 1,
  },
  commissionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  commissionItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  commissionItemText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  commissionItemSubtext: {
    color: '#ccc',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  footerItem: { 
    alignItems: 'center'
  },
  activeFooterItem: {
    transform: [{ scale: 1.1 }],
  },
  footerText: { 
    color: '#fff', 
    fontSize: 12, 
    marginTop: 2,
    textAlign: 'center',
  },
  activeFooterText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});

export default CommissionsScreen;