import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';

const FAQsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const [fontsLoaded] = useFonts({
    Milonga: require('../../assets/fonts/Milonga-Regular.ttf'),
  });

  const faqs = [
    { id: 1, question: 'How do I accept a commission?', answer: 'Go to the Commissions tab, select a commission, and click Accept.' },
    { id: 2, question: 'How do I update my progress?', answer: 'In your Accepted Commissions, tap Update Progress on the commission card.' },
    { id: 3, question: 'How can I mark a commission complete?', answer: 'Tap Mark Complete on an active commission after finishing it.' },
    { id: 4, question: 'How do I contact support?', answer: 'Navigate to your Profile and tap the Support button to contact us.' },
  ];

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
      colors={['#CFAD01', '#30204D', '#0B005F']}
      locations={[0, 0.58, 0.84]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* Header with title and search bar */}
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

            <TouchableOpacity
              style={styles.profileIcon}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-circle-outline" size={36} color="#FFD700" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerBottom}>
            <Text style={[styles.pageTitle, { fontFamily: 'Milonga' }]}>FAQs</Text>

            <View style={styles.searchRow}>
              <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#999" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search FAQs"
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>
          </View>
        </View>

        {/* FAQ List */}
        <ScrollView contentContainerStyle={styles.content}>
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map(faq => (
              <View key={faq.id} style={styles.faqCard}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                >
                  <Text style={styles.questionText}>{faq.question}</Text>
                  <Ionicons
                    name={expandedFAQ === faq.id ? 'chevron-up-outline' : 'chevron-down-outline'}
                    size={20}
                    color="#FFD700"
                  />
                </TouchableOpacity>
                {expandedFAQ === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.answerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="help-circle-outline" size={64} color="#FFD700" />
              <Text style={styles.emptyText}>No FAQs found</Text>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="search-outline" size={24} color="#FFD700" />
            <Text style={[styles.footerText, styles.activeFooterText]}>Home Feed</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Commissions')}>
            <Ionicons name="briefcase-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Commissions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('AcceptedCommissions')}>
            <Ionicons name="pencil-outline" size={24} color="#FFD700" />
            <Text style={styles.footerText}>Accepted{"\n"}Commissions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.footerItem, { transform: [{ scale: 1.1 }] }]}>
            <MaterialCommunityIcons name="question-mark-outline" size={24} color="#FFD700" />
            <Text style={[styles.footerText, { fontWeight: 'bold', color: '#FFD700' }]}>FAQs</Text>
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
    marginBottom: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, marginRight: 8 },
  logoText: { fontSize: 28, color: '#fff' },
  profileIcon: {},
  headerBottom: { marginTop: 8 },
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
  searchRow: { flexDirection: 'row', alignItems: 'center' },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#333', padding: 0 },

  content: { paddingHorizontal: 24, paddingBottom: 20, paddingTop: 20 },

  faqCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 15, marginBottom: 16, overflow: 'hidden' },
  faqQuestion: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16,  },
  questionText: { color: '#FFD700', fontWeight: 'bold', fontSize: 16, flex: 1, marginRight: 8, fontFamily: 'Milonga' },
  faqAnswer: { paddingHorizontal: 16, paddingBottom: 16 },
  answerText: { color: '#ccc', fontSize: 14 },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyText: { color: '#FFD700', fontSize: 18 },

  footer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, paddingBottom: 40, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: 'rgba(0,0,0,0.2)' },
  footerItem: { alignItems: 'center' },
  footerText: { color: '#fff', fontSize: 12, marginTop: 2, textAlign: 'center' },
  activeFooterText: { color: '#FFD700', fontWeight: 'bold' },
});

export default FAQsScreen;
