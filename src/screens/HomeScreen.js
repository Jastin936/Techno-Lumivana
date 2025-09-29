import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [recentCommissions, setRecentCommissions] = useState([]);
  const [studentSpotlights, setStudentSpotlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Philippine-themed example commissions
        setRecentCommissions([
          { 
            id: 1, 
            title: 'Tourism Website', 
            subtitle: 'Promote Philippine destinations', 
            price: '₱15,000',
            deadline: '3 days',
            category: 'Creative',
            image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=300&h=200&fit=crop' 
          },
          { 
            id: 2, 
            title: 'Research Paper', 
            subtitle: 'Philippine History Topics', 
            price: '₱8,000',
            deadline: '5 days',
            category: 'Academic',
            image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=200&fit=crop' 
          },
          { 
            id: 3, 
            title: 'Logo Design', 
            subtitle: 'Filipino food business', 
            price: '₱5,000',
            deadline: '2 days',
            category: 'Creative',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop' 
          },
          { 
            id: 4, 
            title: 'Essay Writing', 
            subtitle: 'Filipino Culture & Traditions', 
            price: '₱3,000',
            deadline: '4 days',
            category: 'Academic',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop' 
          },
          { 
            id: 5, 
            title: 'Content Writing', 
            subtitle: 'Travel blog about PH islands', 
            price: '₱6,000',
            deadline: '6 days',
            category: 'Writing',
            image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=200&fit=crop' 
          },
          { 
            id: 6, 
            title: 'Mobile App UI', 
            subtitle: 'Filipino e-commerce app', 
            price: '₱12,000',
            deadline: '7 days',
            category: 'Creative',
            image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop' 
          }
        ]);

        // Filipino student spotlights
        setStudentSpotlights([
          { 
            id: 1, 
            title: 'Maria Santos', 
            subtitle: 'UP Diliman - BS Computer Science', 
            rating: '4.9/5',
            specialty: 'Web Development',
            completed: '28 projects',
            image: 'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=300&h=200&fit=crop&crop=face' 
          },
          { 
            id: 2, 
            title: 'Juan dela Cruz', 
            subtitle: 'Ateneo de Manila - AB Literature', 
            rating: '4.8/5',
            specialty: 'Academic Writing',
            completed: '35 essays',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=face' 
          },
          { 
            id: 3, 
            title: 'Sofia Reyes', 
            subtitle: 'DLSU - Fine Arts', 
            rating: '4.9/5',
            specialty: 'Graphic Design',
            completed: '42 designs',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=200&fit=crop&crop=face' 
          },
          { 
            id: 4, 
            title: 'Miguel Torres', 
            subtitle: 'Mapua University - IT', 
            rating: '5.0/5',
            specialty: 'Mobile App Dev',
            completed: '19 apps',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=200&fit=crop&crop=face' 
          },
          { 
            id: 5, 
            title: 'Isabel Garcia', 
            subtitle: 'UST - Journalism', 
            rating: '4.7/5',
            specialty: 'Content Writing',
            completed: '50 articles',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop&crop=face' 
          },
          { 
            id: 6, 
            title: 'Luis Mendoza', 
            subtitle: 'FEU - Multimedia Arts', 
            rating: '4.8/5',
            specialty: 'Video Editing',
            completed: '25 videos',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=200&fit=crop&crop=face' 
          }
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderCommissionItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <LinearGradient
        colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.6)']}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['transparent', 'rgba(255,215,0,0.4)']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}
      />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardCategory}>{item.category}</Text>
          <Text style={styles.cardPrice}>{item.price}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        <View style={styles.cardFooter}>
          <Ionicons name="time-outline" size={12} color="#FFD700" />
          <Text style={styles.cardDeadline}>{item.deadline} left</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSpotlightItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <LinearGradient
        colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.6)']}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['transparent', 'rgba(255,215,0,0.4)']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}
      />
      <View style={styles.cardContent}>
        <View style={styles.spotlightHeader}>
          <Text style={styles.spotlightRating}>{item.rating} ⭐</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        <View style={styles.specialtyContainer}>
          <Ionicons name="ribbon-outline" size={12} color="#FFD700" />
          <Text style={styles.specialtyText}>{item.specialty}</Text>
        </View>
        <View style={styles.completedContainer}>
          <Ionicons name="checkmark-circle-outline" size={10} color="#FFD700" />
          <Text style={styles.completedText}>{item.completed}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!fontsLoaded || loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFD700" />
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

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Recently Added Commissions</Text>
          <FlatList
            data={recentCommissions}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCommissionItem}
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 30 }}
          />

          <Text style={styles.sectionTitle}>Top Filipino Students</Text>
          <FlatList
            data={studentSpotlights}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderSpotlightItem}
            showsHorizontalScrollIndicator={false}
          />
        </ScrollView>

        {/* Footer */}
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

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, marginRight: 8 },
  logoText: { fontSize: 28, color: '#fff' },
  profileIcon: {},

  content: { paddingHorizontal: 24, paddingBottom: 20 },

  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 16,
    marginTop: 10,
  },

  card: {
    width: width * 0.65,
    marginRight: 16,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  cardImage: { 
    width: '100%', 
    height: 140,
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardCategory: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  cardPrice: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardTitle: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 2,
  },
  cardSubtitle: { 
    color: '#e0e0e0', 
    fontSize: 12, 
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardDeadline: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '500',
  },
  spotlightHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  spotlightRating: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  specialtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  specialtyText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '500',
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  completedText: {
    color: '#e0e0e0',
    fontSize: 10,
    fontStyle: 'italic',
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
  footerItem: { alignItems: 'center' },
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

export default HomeScreen;