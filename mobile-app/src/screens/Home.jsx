import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';

export default function Home() {
    const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Welcome Back, Soumya!</Text>
                <TouchableOpacity 
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('Menu')}
                >
                    <FontAwesome name="bars" size={24} color="#001F3F" />
                </TouchableOpacity>
            </View>

            
            {/* Footer Navigation */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.footerTab}
                    onPress={() => navigation.navigate('Home')}
                >
                    <FontAwesome name="home" size={24} color="#001F3F" />
                    <Text style={styles.footerText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.footerTab}
                    onPress={() => navigation.navigate('Messages')}
                >
                    <FontAwesome name="comments" size={24} color="#666" />
                    <Text style={styles.footerText}>Messages</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.footerTab}
                    onPress={() => navigation.navigate('Chatbot')}
                >
                    <FontAwesome name="robot" size={24} color="#666" />
                    <Text style={styles.footerText}>Chatbot</Text>
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
    scrollContainer: {
        padding: 20,
        paddingBottom: 80,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
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
