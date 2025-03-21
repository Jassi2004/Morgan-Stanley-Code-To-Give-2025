import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Messages() {
    const navigation = useNavigation();

    const MessageItem = ({ sender, content }) => (
        <View style={styles.messageItem}>
            <Text style={styles.sender}>{sender}</Text>
            <Text style={styles.messageText}>{content}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <FontAwesome name="arrow-left" size={24} color="#001F3F" />
                    </TouchableOpacity>

                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        {/* Messages from Faculty */}
                        <Text style={styles.sectionTitle}>Messages from Faculty</Text>
                        <MessageItem sender="Prof. Sharma" content="Reminder: Complete your assignment by Monday." />
                        <MessageItem sender="Ms. Ahuja" content="Class is rescheduled to 3 PM tomorrow." />

                        {/* Messages from Admin */}
                        <Text style={styles.sectionTitle}>Messages from Admin</Text>
                        <MessageItem sender="Admin Office" content="Upcoming holiday notice: School will be closed on Friday." />
                        <MessageItem sender="Admin Team" content="New timetable has been uploaded to the portal." />
                    </ScrollView>

                    {/* Floating "+" Button */}
                    <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("NewMessage")}>
                        <MaterialIcons name="add" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    inner: {
        flex: 1,
        paddingTop: 40, // Added space to prevent top overflow
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 100, // To prevent overlap with the floating button
    },
    backButton: {
        position: "absolute",
        top: 10,
        left: 10,
        padding: 10,
        zIndex: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#001F3F",
        marginTop: 20,
        marginBottom: 10,
    },
    messageItem: {
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sender: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    messageText: {
        fontSize: 14,
        color: "#555",
        marginTop: 5,
    },
    fab: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#001F3F",
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});
