import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image
} from 'react-native';

const AgreementFormScreen = () => {
  const [form, setForm] = useState({
    commissionName: '',
    description: '',
    deadline: '',
    category: '',
    price: '',
    contact: '',
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleConfirm = () => {
    // Add your submit logic here
    console.log('Form submitted:', form);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agreement Form</Text>

      <TextInput
        style={styles.input}
        placeholder="Commission Name"
        value={form.commissionName}
        onChangeText={(text) => handleChange('commissionName', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={form.description}
        onChangeText={(text) => handleChange('description', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Deadline (MM/DD/YY)"
        value={form.deadline}
        onChangeText={(text) => handleChange('deadline', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Category"
        value={form.category}
        onChangeText={(text) => handleChange('category', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Agreed Price"
        keyboardType="numeric"
        value={form.price}
        onChangeText={(text) => handleChange('price', text)}
      />

      <View style={styles.photoPlaceholder}>
        <Text style={styles.photoText}>Reference Photo</Text>
        <Image
          source={require('../../assets/Reference.png')}
          style={styles.photo}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Contact Information"
        value={form.contact}
        onChangeText={(text) => handleChange('contact', text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  photoPlaceholder: {
    alignItems: 'center',
    marginBottom: 15,
  },
  photoText: {
    marginBottom: 5,
    fontSize: 16,
  },
  photo: {
    width: 100,
    height: 100,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AgreementFormScreen;