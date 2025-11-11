import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';

const AcceptedCommissionInfoScreen = ({ navigation }) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Accepted Comms Info</Text>

      <View style={styles.photoContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.photo}
        />
        <View style={styles.statusTags}>
          <Text style={styles.status}>On Going</Text>
          <Text style={styles.spUnavailable}>SP Unavailable</Text>
        </View>
      </View>

      <Text style={styles.title}>Gold Earrings</Text>
      <Text style={styles.category}>Accessories</Text>

      <View style={styles.profileRow}>
        <Image
          source={{ uri: 'https://via.placeholder.com/40' }}
          style={styles.avatar}
        />
        <Text style={styles.profileName}>Caribert</Text>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>
        <Text style={styles.ellipsis}>⋮</Text>
      </View>

      <Text style={styles.sectionTitle}>Commission Details</Text>
      <Text style={styles.detail}>Description: A pair of giving gold earrings with a few diamonds.</Text>
      <Text style={styles.detail}>Contact Info: eniko@gmail.com</Text>

      <TouchableOpacity
        style={styles.statusButton}
        onPress={() => setShowStatusModal(true)}
      >
        <Text style={styles.statusButtonText}>View Status</Text>
      </TouchableOpacity>

      {/* Status Modal */}
      <Modal visible={showStatusModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Status</Text>
            <Text style={styles.modalText}>On Going</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.stopButton}
                onPress={() => {
                  setShowStatusModal(false);
                  setShowWarningModal(true);
                }}
              >
                <Text style={styles.buttonText}>Stop process</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.okButton}
                onPress={() => setShowStatusModal(false)}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Warning Modal */}
      <Modal visible={showWarningModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={[styles.modalTitle, { color: '#c62828' }]}>WARNING!</Text>
            <Text style={styles.modalText}>
              Once canceled, this work cannot be recovered. Are you sure?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.stopButton}
                onPress={() => {
                  setShowWarningModal(false);
                  navigation.navigate('CancelForm');
                }}
              >
                <Text style={styles.buttonText}>Yes, Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.okButton}
                onPress={() => setShowWarningModal(false)}
              >
                <Text style={styles.buttonText}>No, Keep it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#2c2c2c', flex: 1, padding: 20 },
  header: { color: '#ccc', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  photoContainer: { alignItems: 'center', marginBottom: 10 },
  photo: { width: 100, height: 100, backgroundColor: '#ccc', borderRadius: 8 },
  statusTags: { flexDirection: 'row', marginTop: 8, gap: 10 },
  status: { backgroundColor: '#4caf50', color: '#fff', padding: 6, borderRadius: 6 },
  spUnavailable: { backgroundColor: '#555', color: '#ccc', padding: 6, borderRadius: 6 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  category: { color: '#ccc', fontSize: 14, marginBottom: 20 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ddd' },
  profileName: { color: '#fff', marginLeft: 10, fontSize: 16, flex: 1 },
  followButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  followText: { color: '#fff', fontWeight: 'bold' },
  ellipsis: { color: '#ccc', fontSize: 20, marginLeft: 10 },
  sectionTitle: { color: '#fff', fontSize: 18, marginBottom: 10 },
  detail: { color: '#ccc', fontSize: 14, marginBottom: 5 },
  statusButton: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  statusButtonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 20 },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stopButton: {
    backgroundColor: '#c62828',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  okButton: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default AcceptedCommissionInfoScreen;