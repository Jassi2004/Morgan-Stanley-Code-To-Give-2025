import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import { handleLogin } from "../utils/api";
import { FontAwesome } from '@expo/vector-icons';

export default function Login({ navigation }) {
  const [studentEmail, setStudentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = async () => {
    setErrorMessage(""); // Clear previous errors
    setIsLoading(true);

    // Basic validation
    if (!studentEmail || !password) {
      setErrorMessage("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentEmail)) {
      setErrorMessage("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const result = await handleLogin(studentEmail, password);
      console.log("Login result:", result); // Debug log
      
      if (result.success) {
        navigation.navigate("Home");
      } else {
        setErrorMessage(result.message || "Incorrect email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Unable to connect. Please check your internet connection and try again.");
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
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <View style={[styles.inputContainer, errorMessage && !studentEmail && styles.inputContainerError]}>
        <FontAwesome name="envelope" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          value={studentEmail}
          onChangeText={(text) => handleInputChange('email', text)}
        />
      </View>

      <View style={[styles.inputContainer, errorMessage && !password && styles.inputContainerError]}>
        <FontAwesome name="lock" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={(text) => handleInputChange('password', text)}
        />
      </View>

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-circle" size={16} color="#FF0000" />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={onLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#001F3F",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputContainerError: {
    borderColor: "#FF0000",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE8E8",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    width: "100%",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  button: {
    backgroundColor: "#001F3F",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: "#666",
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpText: {
    marginTop: 15,
    fontSize: 16,
    color: "#001F3F",
    fontWeight: "bold",
  },
});
