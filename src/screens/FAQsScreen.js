import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const rotateValue = new Animated.Value(0);

const FAQsScreen = ({ navigation }) => {
  const { isDarkMode, colors, gradients } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const [userData, setUserData] = useState({
    name: 'Lumivana Vivistera',
    profileImage: null
  });

  // Continuous rotation loop (30s rotate, 30s rest)
  useEffect(() => {
    const startRotation = () => {
      // Reset rotation value
      rotateValue.setValue(0);
      
      // Rotate for 30 seconds
      Animated.timing(rotateValue, {
        toValue: 10,
        duration: 30000,
        useNativeDriver: true,
      }).start(() => {
        // After rotation completes, wait 30 seconds then restart
        setTimeout(() => {
          startRotation();
        }, 30000);
      });
    };

    // Start the loop
    startRotation();
    
    // Cleanup function
    return () => {
      rotateValue.stopAnimation();
    };
  }, []);

  // Interpolate rotation value
  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Animated style for logo
  const animatedLogoStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const faqs = [
    { id: 1, question: 'How do I accept a commission?', answer: 'Go to the Commissions tab, select a commission, and click Accept.' },
    { id: 2, question: 'How do I update my progress?', answer: 'In your Accepted Commissions, tap Update Progress on the commission card.' },
    { id: 3, question: 'How can I mark a commission complete?', answer: 'Tap Mark Complete on an active commission after finishing it.' },
    { id: 4, question: 'How do I contact support?', answer: 'Navigate to your Profile and tap the Support button to contact us.' },
  ];

  // Load user data from AsyncStorage
  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userProfileData');
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        setUserData(prevData => ({
          ...prevData,
          name: parsedData.name || 'Lumivana Vivistera',
          profileImage: parsedData.profileImage || null
        }));
      }

      // Also load profile image from AsyncStorage (in case it's stored separately)
      const savedProfileImage = await AsyncStorage.getItem('profileImage');
      if (savedProfileImage) {
        setUserData(prevData => ({
          ...prevData,
          profileImage: savedProfileImage
        }));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  // Set up focus listener to refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });

    return unsubscribe;
  }, [navigation]);

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={isDarkMode ? gradients.background : gradients.main}
      locations={isDarkMode ? [0, 1] : [0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "light-content"} translucent backgroundColor="transparent" />

        {/* HEADER - Same as HomeScreen */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Animated.Image
              source={require('../../assets/lumivana.png')}
              style={[styles.logo, animatedLogoStyle]}
              resizeMode="contain"
            />
            <Text style={[styles.logoText, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>Lumivana</Text>
          </View>
          
          {/* Updated Profile Icon - Same as HomeScreen */}
          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => navigation.navigate('Profile')}
          >
            {userData.profileImage ? (
              <Image 
                source={{ uri: userData.profileImage }} 
                style={[styles.profileImage, { borderColor: colors.primary }]} 
              />
            ) : (
              <Ionicons name="person-circle-outline" size={36} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* 🔍 SEARCH BAR - Removed filter button */}
        <View style={styles.searchBarContainer}>
          <View style={[styles.searchBar, { backgroundColor: isDarkMode ? colors.surface : 'rgba(255, 255, 255, 0.15)' }]}>
            <Ionicons name="search-outline" size={20} color={colors.primary} />
            <TextInput
              placeholder="Search FAQs..."
              placeholderTextColor={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.6)'}
              style={[styles.searchInput, { color: isDarkMode ? colors.text : '#FFFFFF' }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* FAQ List */}
        <ScrollView contentContainerStyle={styles.content}>
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map(faq => (
              <View key={faq.id} style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                >
                  <Text style={[styles.questionText, { color: colors.text }]}>{faq.question}</Text>
                  <Ionicons
                    name={expandedFAQ === faq.id ? 'chevron-up-outline' : 'chevron-down-outline'}
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
                {expandedFAQ === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={[styles.answerText, { color: colors.textSecondary }]}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="help-circle-outline" size={64} color={colors.primary} />
              <Text style={[styles.emptyText, { color: colors.primary }]}>No FAQs found</Text>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: isDarkMode ? colors.surface : 'rgba(255, 255, 255, 0.15)' }]}>
          <TouchableOpacity 
            style={styles.footerItem} 
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerItem}
            onPress={() => navigation.navigate('Search')}
          >
            <Ionicons name="search-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>Search</Text>
          </TouchableOpacity>

          {/* Plus Square Icon in Center */}
          <TouchableOpacity 
            style={styles.plusSquareButton}
            onPress={() => navigation.navigate('Request')}
          >
            <View style={[styles.plusSquareContainer, { borderColor: colors.primary }]}>
              <Ionicons name="add" size={30} color={colors.primary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerItem} 
            onPress={() => navigation.navigate('Commissions')}
          >
            <Ionicons name="briefcase-outline" size={24} color={isDarkMode ? colors.textMuted : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.footerText, { color: isDarkMode ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }]}>Commissions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem}>
            <Ionicons name="help-circle" size={24} color={colors.primary} />
            <Text style={[styles.footerText, styles.activeFooterText, { color: colors.primary }]}>FAQs</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // HEADER STYLES - Same as HomeScreen
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingTop: 50, 
    paddingHorizontal: 24, 
    paddingBottom: 16, 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20, 
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, marginRight: 8 },
  logoText: { fontSize: 28, fontFamily: 'Milonga' },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
  },

  // SEARCH BAR STYLES - Removed filter button
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 5,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 8, 
    fontSize: 14 
  },

  content: { 
    paddingHorizontal: 24, 
    paddingBottom: 20, 
    paddingTop: 20 
  },

  faqCard: { 
    borderRadius: 12, 
    marginBottom: 16, 
    borderWidth: 1,
    overflow: 'hidden' 
  },
  faqQuestion: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16,
  },
  questionText: { 
    fontWeight: 'bold', 
    fontSize: 16, 
    flex: 1, 
    marginRight: 8 
  },
  faqAnswer: { 
    paddingHorizontal: 16, 
    paddingBottom: 16 
  },
  answerText: { 
    fontSize: 14 
  },

  emptyState: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 60 
  },
  emptyText: { 
    fontSize: 18,
    marginTop: 16,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerItem: { 
    alignItems: 'center',
    flex: 1,
  },
  footerText: { 
    fontSize: 12, 
    marginTop: 2,
    textAlign: 'center',
  },
  activeFooterText: { 
    fontWeight: 'bold' 
  },
  // Plus Square Button
  plusSquareButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  plusSquareContainer: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default FAQsScreen;