import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const TypeWriterText = ({ sequence }: { sequence: string[] }) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const currentFullText = sequence[loopIndex % sequence.length];
      
      if (!isDeleting) {
        setDisplayText(currentFullText.substring(0, displayText.length + 1));
        setTypingSpeed(150);

        if (displayText === currentFullText) {
          setTypingSpeed(2000); // পুরো লেখা শেষ হলে ২ সেকেন্ড থামবে
          setIsDeleting(true);
        }
      } else {
        setDisplayText(currentFullText.substring(0, displayText.length - 1));
        setTypingSpeed(50);

        if (displayText === "") {
          setIsDeleting(false);
          setLoopIndex(loopIndex + 1);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopIndex, typingSpeed]);

  return <Text style={styles.typeText}>{displayText}</Text>;
};

const Banner = () => {
  const router = useRouter();

//   const handleJoin = () => {
//     router.push("/registration"); 
//   };

//   const handleSearch = () => {
//     router.push("/search-page");
//   };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Animation Section (Top) */}
      <View style={styles.animationContainer}>
        <LottieView
          source={require("../assets/Lotties/bannerAnimation_1.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.headline}>
          Be a Hero,{"\n"}
          <TypeWriterText 
            sequence={["Save a Life!", "Give Hope!", "Act Now!", "Be a Donor"]} 
          />
        </Text>

        <Text style={styles.description}>
          Join our Blood Donation community and make a difference today. Whether
          you're donating or searching, we're here to help.
        </Text>

        {/* Buttons */}
        {/* <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.joinBtn} onPress={handleJoin}>
            <Text style={styles.joinBtnText}>Join as a Donor</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>Search Donors</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#ffcdd2",
    alignItems: "center",
    paddingBottom: 40,
  },
  animationContainer: {
    width: width,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  content: {
    paddingHorizontal: 25,
    alignItems: "center",
  },
  headline: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  typeText: {
    color: "#d32f2f",
    fontSize: 32,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  buttonGroup: {
    width: "100%",
    gap: 15,
  },
  joinBtn: {
    backgroundColor: "#d32f2f",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  joinBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchBtn: {
    backgroundColor: "transparent",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d32f2f",
  },
  searchBtnText: {
    color: "#d32f2f",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Banner;