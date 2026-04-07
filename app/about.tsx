import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const stats = [
  {
    id: 1,
    icon: "user-plus",
    title: "Total Donors",
    count: "1,250",
  },
  {
    id: 2,
    icon: "heartbeat",
    title: "Active Requests",
    count: "87",
  },
  {
    id: 3,
    icon: "check-circle",
    title: "Successful Donations",
    count: "1,023",
  },
  {
    id: 4,
    icon: "hands-helping",
    title: "Volunteers",
    count: "540",
  },
];

const AboutScreen = () => {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.contentWrapper}>
        
        {/* Image Section */}
        <Image
          source={require("../assets/About (2).jpg")} 
          style={styles.image}
          resizeMode="cover"
        />

        {/* Text Section */}
        <View style={styles.textSection}>
          <Text style={styles.title}>Donate Blood, Save Lives ❤️</Text>
          <Text style={styles.description}>
            Blood donation is not just about giving; it’s about giving hope,
            life, and health. Join our growing community of donors and
            volunteers making a real difference in people’s lives.
          </Text>
          <Text style={styles.subDescription}>
            Every drop counts! Together, we can create a world where blood
            shortage is a thing of the past.
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <View key={item.id} style={styles.statCard}>
              <FontAwesome5 name={item.icon} size={30} color="#d32f2f" />
              <Text style={styles.statCount}>{item.count}</Text>
              <Text style={styles.statTitle}>{item.title}</Text>
            </View>
          ))}
        </View>

        {/* Call to Action Button */}
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/search-donor")}
        >
          <Text style={styles.buttonText}>Become a Donor</Text>
        </TouchableOpacity> */}
        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff5f5",
    paddingVertical: 20,
  },
  contentWrapper: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: width - 40,
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
    marginTop: 50,
  },
  textSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 10,
  },
  subDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  statCard: {
    backgroundColor: "white",
    width: "48%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statCount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#d32f2f",
    marginTop: 10,
  },
  statTitle: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginTop: 5,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#d32f2f",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#d32f2f",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AboutScreen;