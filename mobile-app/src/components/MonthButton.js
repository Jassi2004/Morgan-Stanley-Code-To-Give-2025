import React, { useState } from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MonthButton = ({ month, onPress, disabled = false, isActive = true }) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const [pressedValue] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    if (disabled) return;

    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.90, // More significant shrink
        useNativeDriver: true,
      }),
      Animated.timing(pressedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;

    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1, 
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(pressedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const shadowOpacityStyle = pressedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.05]
  });
  
  const translateYStyle = pressedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5]
  });

  // Generate a unique gradient based on the month
  const getMonthGradient = () => {
    if (!isActive) {
      return ['#BDBDBD', '#E0E0E0']; // Gray gradient for inactive months
    }

    const gradients = {
      'January': ['#FF6B6B', '#FF9999'],
      'February': ['#FF4081', '#FF80AB'],
      'March': ['#4CAF50', '#81C784'],
      'April': ['#2196F3', '#64B5F6'],
      'May': ['#9C27B0', '#BA68C8'],
      'June': ['#FFC107', '#FFD54F'],
      'July': ['#FF5722', '#FF8A50'],
      'August': ['#795548', '#A1887F'],
      'September': ['#9E9E9E', '#E0E0E0'],
      'October': ['#FF5722', '#FF8A50'],
      'November': ['#795548', '#A1887F'],
      'December': ['#3F51B5', '#7986CB']
    };
    return gradients[month] || ['#9C27B0', '#BA68C8'];
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => !disabled && onPress(month)}
    >
      <Animated.View 
        style={[
          styles.buttonContainer,
          { 
            transform: [
              { scale: scaleValue },
              { translateY: translateYStyle }
            ],
            shadowOpacity: shadowOpacityStyle,
            opacity: isActive ? 1 : 0.5
          }
        ]}
      >
        <View style={styles.shadowLayer}>
          <LinearGradient
            colors={getMonthGradient()}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.glareOverlay} />
            <View style={styles.innerHighlight} />
            <Text style={[
              styles.buttonText, 
              !isActive && styles.inactiveText
            ]}>{month}</Text>
          </LinearGradient>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 140,
    height: 140,
    marginVertical: 12,
  },
  shadowLayer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 80,
    transform: [{ translateY: 6 }],
  },
  button: {
    flex: 1,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    transform: [{ translateY: -6 }],
  },
  glareOverlay: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ rotate: '45deg' }],
  },
  innerHighlight: {
    position: 'absolute',
    top: '0%',
    left: '0%',
    right: '20%',
    width: 160,
    height: 160,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    zIndex: 10,
    letterSpacing: 1,
  },
  inactiveText: {
    color: '#757575', // Darker gray for inactive months
  },
});

export default MonthButton;