import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import Navbar from '../components/Navbar';

export default function Menu() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Menu</Text>
                <TouchableOpacity 
                    style={styles.notificationButton}
                    onPress={() => navigation.navigate('Notifications')}
                >
                    <FontAwesome name="bell" size={24} color="#001F3F" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Menu Items */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.menuItem}>
                        <FontAwesome name="calendar" size={24} color="#4CAF50" />
                        <Text style={styles.menuItemText}>Attendance</Text>
                        <FontAwesome name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <FontAwesome name="book" size={24} color="#2196F3" />
                        <Text style={styles.menuItemText}>Courses</Text>
                        <FontAwesome name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <FontAwesome name="user-md" size={24} color="#9C27B0" />
                        <Text style={styles.menuItemText}>Therapists</Text>
                        <FontAwesome name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <FontAwesome name="cog" size={24} color="#FF9800" />
                        <Text style={styles.menuItemText}>Settings</Text>
                        <FontAwesome name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <FontAwesome name="question-circle" size={24} color="#607D8B" />
                        <Text style={styles.menuItemText}>Help & Support</Text>
                        <FontAwesome name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.menuItem, styles.logoutItem]}>
                        <FontAwesome name="sign-out" size={24} color="#F44336" />
                        <Text style={[styles.menuItemText, { color: '#F44336' }]}>Logout</Text>
                    </TouchableOpacity>
                </View>

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
    section: {
        backgroundColor: '#FFF',
        margin: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
        flex: 1,
    },
    logoutItem: {
        borderBottomWidth: 0,
    },
});
