import { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chatbot</Text>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate('Menu')}
        >
          <FontAwesome name="bars" size={24} color="#001F3F" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.contentContainer} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
            <FontAwesome name="paper-plane" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerTab}
          onPress={() => navigation.navigate('Home')}
        >
          <FontAwesome name="home" size={24} color="#666" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.footerTab}
          onPress={() => navigation.navigate('Feedback')}
        >
          <FontAwesome name="comments" size={24} color="#666" />
          <Text style={styles.footerText}>Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.footerTab}
        >
          <FontAwesome name="robot" size={24} color="#001F3F" />
          <Text style={[styles.footerText, { color: '#001F3F' }]}>Chatbot</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.footerTab}
          onPress={() => navigation.navigate('Profile')}
        >
          <FontAwesome name="user" size={24} color="#666" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 45,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#001F3F',
    flex: 1,
    textAlign: 'center',
  },
  menuButton: {
    position: 'absolute',
    right: 15,
    top: 45,
    padding: 5,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContainer: {
    flex: 1,
    marginVertical: 16,
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
    padding: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  userMessage: {
    backgroundColor: '#001F3F',
  },
  botMessage: {
    backgroundColor: '#FFF',
  },
  userMessageText: {
    color: '#FFF',
    fontSize: 16,
  },
  botMessageText: {
    color: '#333',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 24,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
  },
  footer: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 5,
  },
  footerTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  footerText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
});
