import { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigation = useNavigation(); 

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "user" }, { text: "Sorry, I am still in development phase", sender: "bot" }]);
    setInput("");
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <View 
            key={index} 
            style={[
              styles.messageWrapper,
              msg.sender === "user" ? styles.userMessageWrapper : styles.botMessageWrapper
            ]}
          >
            <View style={[
              styles.message,
              msg.sender === "user" ? styles.userMessage : styles.botMessage
            ]}>
              <Text style={msg.sender === "user" ? styles.userMessageText : styles.botMessageText}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // Added top padding
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#001F3F",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 8,
  },
  messageWrapper: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  botMessageWrapper: {
    justifyContent: 'flex-start',
  },
  message: {
    maxWidth: '70%',
    padding: 8,
    borderRadius: 12,
  },
  userMessage: {
    backgroundColor: '#001F3F',
  },
  botMessage: {
    backgroundColor: '#E8E8E8',
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 16,
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  sendButton: {
    backgroundColor: '#001F3F',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
