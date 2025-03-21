import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, Animated, Text } from "react-native";
import { useRef } from "react";
import { useNavigation } from "@react-navigation/native";

const imageUris = [
  "https://res.cloudinary.com/dh2gwea4g/image/upload/t_Banner 9:16/v1742526651/ishanya5_xkgnk4.webp",
  "https://res.cloudinary.com/dh2gwea4g/image/upload/t_Banner 9:16/v1742526651/ishanya6_zh8acx.jpg",
  "https://res.cloudinary.com/dh2gwea4g/image/upload/t_Banner 9:16/v1742526651/ishanya4_emd8bb.jpg",
  "https://res.cloudinary.com/dh2gwea4g/image/upload/t_Banner 9:16/v1742526651/ishanya1_pmbcfv.webp",
  "https://res.cloudinary.com/dh2gwea4g/image/upload/t_Banner 9:16/v1742526652/ishanya3_rm8bwe.jpg",
  "https://res.cloudinary.com/dh2gwea4g/image/upload/t_Banner 9:16/v1742526652/ishanya2_z6dyep.jpg",
];

const GetStarted = () => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Top Half */}
      <View style={styles.topHalf}>
        <View style={styles.imageGrid}>
          {imageUris.map((uri, index) => (
            <Image key={index} source={{ uri }} style={[styles.profileImage, index % 2 === 0 ? styles.largeImage : styles.smallImage]} />
          ))}
        </View>
      </View>

      {/* Bottom Half */}
      <View style={styles.bottomHalf}>
        {/* App Logo */}
        <Image
          source={{ uri: "https://res.cloudinary.com/dh2gwea4g/image/upload/v1742526359/Ishanya_logo-768x801_be7iki.png" }}
          style={styles.logo}
        />
        
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            onPressIn={handlePressIn} 
            onPressOut={handlePressOut} 
            style={styles.button}
          >
            <Text style={styles.buttonText}>Student Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topHalf: {
    flex: 0.65, // Increased size of green section
    backgroundColor: "#3B8A4E",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "90%",
    marginBottom: 10,
  },
  profileImage: {
    borderRadius: 50,
    margin: 5,
  },
  largeImage: {
    width: "45%",
    height: 200,
  },
  smallImage: {
    width: "30%",
    height: 150,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 20,
  },
  bottomHalf: {
    flex: 0.35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FF9900",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GetStarted;
