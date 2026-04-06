import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

export default function DonationRequest() {
  const router = useRouter();

  // States for form data
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });

  // Mock user data (Replace with your AuthContext)
  const user = { displayName: "Test User", email: "user@example.com" };

  const handleSubmit = () => {
    // Basic Validation
    if (!formData.recipientName || !formData.bloodGroup || !formData.recipientDistrict) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    console.log("Request Data:", { ...formData, requesterEmail: user.email });
    
    Alert.alert("Success", "Donation request created successfully!", [
      { text: "OK", onPress: () => router.push("/dashboard") }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🩸 Create Donation Request</Text>

      {/* Requester Info (Read Only) */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput style={[styles.input, styles.readOnly]} value={user.displayName} editable={false} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Your Email</Text>
        <TextInput style={[styles.input, styles.readOnly]} value={user.email} editable={false} />
      </View>

      {/* Recipient Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Recipient Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter recipient name"
          onChangeText={(text) => setFormData({ ...formData, recipientName: text })}
        />
      </View>

      {/* Blood Group Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Blood Group *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.bloodGroup}
            onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
          >
            <option label="Select Blood Group" value="" />
            <option label="A+" value="A+" />
            <option label="A-" value="A-" />
            <option label="B+" value="B+" />
            <option label="B-" value="B-" />
            <option label="AB+" value="AB+" />
            <option label="AB-" value="AB-" />
            <option label="O+" value="O+" />
            <option label="O-" value="O-" />
          </Picker>
        </View>
      </View>

      {/* Hospital Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Hospital Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Hospital name (e.g. Dhaka Medical)"
          onChangeText={(text) => setFormData({ ...formData, hospitalName: text })}
        />
      </View>

      {/* Full Address */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Street address, house no."
          onChangeText={(text) => setFormData({ ...formData, fullAddress: text })}
        />
      </View>

      {/* Message */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Request Message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Explain the emergency..."
          multiline
          numberOfLines={4}
          onChangeText={(text) => setFormData({ ...formData, requestMessage: text })}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Request</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  readOnly: {
    backgroundColor: "#e9ecef",
    color: "#6c757d",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#d32f2f",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});