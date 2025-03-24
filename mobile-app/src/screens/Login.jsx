import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { handleLogin } from "../utils/api";
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchTranslation } from '../utils/translate';
import { useLanguage } from '../context/LanguageContext';

export default function Login({ navigation }) {
  const { language } = useLanguage();
  const [studentEmail, setStudentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Translation states
  const [translations, setTranslations] = useState({
    welcomeBack: "Welcome Back!",
    signInContinue: "Sign in to continue your learning journey",
    email: "Email",
    password: "Password",
    login: "Login",
    forgotPassword: "Forgot Password?",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
    or: "OR",
    fillFields: "Please fill in all fields",
    invalidEmail: "Please enter a valid email address",
    connectionError: "Unable to connect. Please check your internet connection and try again.",
  });

  // Fetch translations when language changes
  useEffect(() => {
    const translateContent = async () => {
      const translatedContent = {};
      for (const [key, value] of Object.entries(translations)) {
        translatedContent[key] = await fetchTranslation(value, language);
      }
      setTranslations(translatedContent);
    };

    translateContent();
  }, [language]);

  const onLogin = async () => {
    setErrorMessage(""); // Clear previous errors
    setIsLoading(true);

    // Basic validation
    if (!studentEmail || !password) {
      setErrorMessage(translations.fillFields);
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentEmail)) {
      setErrorMessage(translations.invalidEmail);
      setIsLoading(false);
      return;
    }

    try {
      const result = await handleLogin(studentEmail, password);
      
      if (result.success) {
        navigation.navigate("Home");
      } else {
        setErrorMessage(result.message || translations.connectionError);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(translations.connectionError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (type, value) => {
    setErrorMessage(""); // Clear error message on input change
    if (type === 'email') {
      setStudentEmail(value.trim()); // Remove any accidental spaces
    } else {
      setPassword(value);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo and Welcome Section */}
        <View style={styles.welcomeSection}>
          <Image
            source={{ uri: "https://res.cloudinary.com/dh2gwea4g/image/upload/v1710834756/logo_dark_d7fvxw.png" }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>{translations.welcomeBack}</Text>
          <Text style={styles.subtitle}>{translations.signInContinue}</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={[styles.inputContainer, errorMessage && !studentEmail && styles.inputContainerError]}>
            <View style={styles.iconContainer}>
              <FontAwesome name="envelope" size={20} color="#666" />
            </View>
            <TextInput
              placeholder={translations.email}
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              value={studentEmail}
              onChangeText={(text) => handleInputChange('email', text)}
            />
          </View>

          {/* Password Input */}
          <View style={[styles.inputContainer, errorMessage && !password && styles.inputContainerError]}>
            <View style={styles.iconContainer}>
              <FontAwesome name="lock" size={20} color="#666" />
            </View>
            <TextInput
              placeholder={translations.password}
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              style={styles.input}
              value={password}
              onChangeText={(text) => handleInputChange('password', text)}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome 
                name={showPassword ? "eye" : "eye-slash"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <FontAwesome name="exclamation-circle" size={16} color="#FF3B30" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={onLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <FontAwesome name="sign-in" size={20} color="#FFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>{translations.login}</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>{translations.forgotPassword}</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>{translations.noAccount}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.signUpLink}>{translations.signUp}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Login Section */}
        <View style={styles.socialLoginContainer}>
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>{translations.or}</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="google" size={20} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="facebook" size={20} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="apple" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#001F3F",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 15,
    height: 55,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: "#FF3B30",
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE8E8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    height: 55,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#A5D6A7",
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotPasswordButton: {
    alignSelf: "center",
    marginTop: 16,
    padding: 4,
  },
  forgotPasswordText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: "#666",
  },
  signUpLink: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
  },
  socialLoginContainer: {
    marginTop: 40,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    color: "#666",
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: "500",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});