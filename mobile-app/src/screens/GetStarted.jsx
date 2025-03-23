import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, StatusBar } from "react-native";
import { Video } from 'expo-av';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import { fetchTranslation } from "../utils/translate";
import { useLanguage } from '../context/LanguageContext';
import * as Font from 'expo-font';

const { width, height } = Dimensions.get('window');

const GetStarted = () => {
  const navigation = useNavigation();
  const { language, changeLanguage } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;

  // Translation states
  const [buttonText, setButtonText] = useState("Student Login");
  const [toggleText, setToggleText] = useState("Switch to Hindi");
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  const taglines = [
    {
      title: "Empowering Every Mind",
      description: "Creating a world where every child's unique potential is celebrated"
    },
    {
      title: "Inclusive Education",
      description: "Breaking barriers in learning for neurodivergent children"
    },
    {
      title: "Building Bridges",
      description: "Connecting special educators with students who need them most"
    }
  ];

  const [translatedTaglines, setTranslatedTaglines] = useState(taglines);

  useEffect(() => {
    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Translate all content
    const translateContent = async () => {
      const [translatedButton, translatedToggle] = await Promise.all([
        fetchTranslation("Student Login", language),
        fetchTranslation(language === "en" ? "Switch to Hindi" : "Switch to English", language),
      ]);

      setButtonText(translatedButton);
      setToggleText(translatedToggle);

      // Translate taglines
      const newTaglines = await Promise.all(
        taglines.map(async (tagline) => ({
          title: await fetchTranslation(tagline.title, language),
          description: await fetchTranslation(tagline.description, language),
        }))
      );
      setTranslatedTaglines(newTaglines);
    };

    translateContent();
  }, [language]);

  // Auto-rotate taglines
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleLanguage = () => {
    changeLanguage(language === "en" ? "hi" : "en");
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      
      {/* Background Video */}
      <Video
        source={require("../../assets/video.mp4")}
        style={styles.backgroundVideo}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
      />
      
      {/* Overlay */}
      <View style={styles.overlay} />

      {/* Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        {/* Bottom Content Container */}
        <View style={styles.bottomContent}>
          {/* Taglines */}
          <View style={styles.taglineContainer}>
            <Animated.Text style={styles.taglineTitle}>
              {translatedTaglines[currentTaglineIndex].title}
            </Animated.Text>
            <Animated.Text style={styles.taglineDescription}>
              {translatedTaglines[currentTaglineIndex].description}
            </Animated.Text>

            {/* Dots */}
            <View style={styles.dotsContainer}>
              {taglines.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    { backgroundColor: index === currentTaglineIndex ? '#FFF' : 'rgba(255,255,255,0.3)' }
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.glassButton}
              activeOpacity={0.8}
            >
              <FontAwesome name="sign-in" size={20} color="#FFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleToggleLanguage} 
              style={styles.glassButton}
              activeOpacity={0.8}
            >
              <FontAwesome name="language" size={20} color="#FFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>{toggleText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', // Slightly less dark overlay
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end', // Align content to bottom
    paddingBottom: 40,
  },
  bottomContent: {
    paddingHorizontal: 30,
    gap: 30,
  },
  taglineContainer: {
    alignItems: 'flex-start', // Align to left
    width: '100%',
    maxWidth: 500,
  },
  taglineTitle: {
    fontSize: 36,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#FFF',
    textAlign: 'left',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  taglineDescription: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#FFF',
    textAlign: 'left',
    opacity: 0.9,
    lineHeight: 22,
    maxWidth: '90%',
    letterSpacing: 0.3,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  glassButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '80%',
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: "#FFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    backdropFilter: 'blur(10px)',
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.8,
    fontStyle: 'italic',
    opacity: 1,
  },
  toggleButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.8,
    fontStyle: 'italic',
    opacity: 1,
  },
});

export default GetStarted;
