import React, { useState, useEffect, useRef } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Animated, Text, Dimensions, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import { fetchTranslation } from "../utils/translate";
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

const GetStarted = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const { language, changeLanguage } = useLanguage();
  const [buttonText, setButtonText] = useState("Student Login");
  const [toggleText, setToggleText] = useState("Switch to Hindi");
  const [welcomeText, setWelcomeText] = useState("Welcome to Ishanya");
  const [descriptionText, setDescriptionText] = useState("Your journey to inclusive education starts here");

  useEffect(() => {
    // Animate components on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 15,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 20000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Fetch translations
    const translateTexts = async () => {
      const [translatedButton, translatedToggle, translatedWelcome, translatedDesc] = await Promise.all([
        fetchTranslation("Student Login", language),
        fetchTranslation(language === "en" ? "Switch to Hindi" : "Switch to English", language),
        fetchTranslation("Welcome to Ishanya", language),
        fetchTranslation("Your journey to inclusive education starts here", language),
      ]);

      setButtonText(translatedButton);
      setToggleText(translatedToggle);
      setWelcomeText(translatedWelcome);
      setDescriptionText(translatedDesc);
    };

    translateTexts();
  }, [language]);

  const handleToggleLanguage = () => {
    changeLanguage(language === "en" ? "hi" : "en");
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['rgba(76, 175, 80, 0.95)', 'rgba(46, 125, 50, 0.95)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Decorative elements */}
        <Animated.View style={[styles.decorativeCircle, styles.circle1, { transform: [{ rotate: spin }] }]} />
        <Animated.View style={[styles.decorativeCircle, styles.circle2, { transform: [{ rotate: spin }] }]} />
        <View style={styles.overlay} />
        
        <View style={styles.contentContainer}>
          {/* Logo Section */}
          <Animated.View 
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Image
              source={{ uri: "https://res.cloudinary.com/dh2gwea4g/image/upload/v1742526359/Ishanya_logo-768x801_be7iki.png" }}
              style={styles.logo}
            />
          </Animated.View>

          {/* Welcome Text */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.welcomeText}>{welcomeText}</Text>
            <Text style={styles.descriptionText}>{descriptionText}</Text>

            {/* Features Section */}
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <FontAwesome name="graduation-cap" size={20} color="#4CAF50" />
                </View>
                <Text style={styles.featureText}>Personalized Learning Path</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <FontAwesome name="users" size={20} color="#4CAF50" />
                </View>
                <Text style={styles.featureText}>Expert Educators Support</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <FontAwesome name="star" size={20} color="#4CAF50" />
                </View>
                <Text style={styles.featureText}>Interactive Learning Experience</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Fixed Button Container */}
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.loginButton}
            activeOpacity={0.8}
          >
            <FontAwesome name="sign-in" size={20} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleToggleLanguage} 
            style={styles.toggleButton}
            activeOpacity={0.8}
          >
            <FontAwesome name="language" size={20} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.toggleButtonText}>{toggleText}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    position: 'relative',
    paddingTop: StatusBar.currentHeight + 10,
  },
  decorativeCircle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1000,
  },
  circle1: {
    width: width * 1.5,
    height: width * 1.5,
    top: -width * 0.25,
    left: -width * 0.25,
  },
  circle2: {
    width: width,
    height: width,
    bottom: -width * 0.25,
    right: -width * 0.25,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)',
    backgroundSize: '50px 50px',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: "contain",
  },
  textContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 12,
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  descriptionText: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    opacity: 0.9,
    maxWidth: '90%',
    lineHeight: 24,
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  featuresList: {
    width: '100%',
    marginTop: 15,
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
  },
  fixedButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    gap: 15,
  },
  loginButton: {
    backgroundColor: "#388E3C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  toggleButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    backdropFilter: 'blur(10px)',
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  toggleButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default GetStarted;
