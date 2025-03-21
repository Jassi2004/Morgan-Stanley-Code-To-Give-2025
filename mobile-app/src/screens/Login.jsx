import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import { loginUser } from "../utils/api";
import { FontAwesome } from '@expo/vector-icons';
import { handleGoogleLogin } from "../utils/api";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage(""); // Clear previous errors
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    try {
      const response = await loginUser({ email, password });
      if (response.success) {
        navigation.navigate("Home");
      } else {
        setErrorMessage(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      

      {/* Email */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#666"
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrorMessage(""); // Clear error when user types
        }}
      />

      {/* Password */}
      <TextInput
        placeholder="Password"
        placeholderTextColor="#666"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrorMessage(""); // Clear error when user types
        }}
      />

      {/* Error Message */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* OR Divider */}
      <View style={styles.orContainer}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.orLine} />
      </View>

      {/* Social Login Buttons */}
      <View style={styles.socialButtonsContainer}>
        <Pressable 
          style={({ pressed }) => [
            styles.socialButton,
            pressed && styles.socialButtonPressed
          ]}
        >
          {({ pressed }) => (
            <FontAwesome 
              name="google" 
              size={24} 
              color={pressed ? '#001F3F' : '#666'} 
            />
          )}
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.socialButton,
            pressed && styles.socialButtonPressed
          ]}
        >
          {({ pressed }) => (
            <FontAwesome 
              name="facebook" 
              size={24} 
              color={pressed ? '#001F3F' : '#666'} 
            />
          )}
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.socialButton,
            pressed && styles.socialButtonPressed
          ]}
        >
          {({ pressed }) => (
            <FontAwesome 
              name="twitter" 
              size={24} 
              color={pressed ? '#001F3F' : '#666'} 
            />
          )}
        </Pressable>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Don't have an account? Sign Up */}
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
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#FFF",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
    width: "100%",
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
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 15,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 15,
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socialButtonPressed: {
    backgroundColor: '#F5F5F5',
    transform: [{ scale: 0.95 }],
  },
  forgotText: {
    marginTop: 10,
    fontSize: 16,
    color: "#001F3F",
    fontWeight: "bold",
  },
  signUpText: {
    marginTop: 15,
    fontSize: 16,
    color: "#001F3F",
    fontWeight: "bold",
  },
});
