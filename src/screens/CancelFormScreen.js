import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const CancelFormScreen = () => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    console.log('Cancellation reason:', reason);
    // Add submit logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cancel Form</Text>
      <Text style={styles.label}>Commission Name</Text>
      <Text style={styles.value}>Gold Earrings</Text>

      <Text style={styles.label}>Reason of Cancellation</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        placeholder="Please tell us why you're canceling this work..."
        placeholderTextColor="#888"
        value={reason}
        onChangeText={setReason}
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2c2c2c', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  label: { fontSize: 16, color: '#ccc', marginBottom: 5 },
  value: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default CancelFormScreen;