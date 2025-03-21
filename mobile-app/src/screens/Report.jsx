import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import Navbar from '../components/Navbar';

export default function Report() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Report</Text>
                <TouchableOpacity 
                    style={styles.notificationButton}
                    onPress={() => navigation.navigate('Notifications')}
                >
                    <FontAwesome name="bell" size={24} color="#001F3F" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Report content will go here */}
                
                {/* Add padding at bottom to ensure content is visible above footer */}
                <View style={{ height: 80 }} />
            </ScrollView>

            {/* Footer Navigation */}
            <Navbar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    scrollContent: {
        flex: 1,
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
    notificationButton: {
        position: 'absolute',
        right: 15,
        top: 45,
        padding: 5,
    },
}); 