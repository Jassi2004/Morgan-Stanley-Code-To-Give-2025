import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import { fetchTranslation } from '../utils/translate';
import { useLanguage } from '../context/LanguageContext';

export default function Menu({ onClose }) {
    const navigation = useNavigation();
    const { language } = useLanguage();
    const [isTranslating, setIsTranslating] = useState(true);

    // Translation states
    const [translations, setTranslations] = useState({
        menu: "Menu",
        attendance: "Attendance",
        courses: "Courses",
        therapists: "Therapists",
        settings: "Settings",
        helpSupport: "Help & Support",
        logout: "Logout",
        loading: "Loading..."
    });

    // Fetch translations when language changes
    useEffect(() => {
        const translateContent = async () => {
            setIsTranslating(true);
            try {
                const translatedContent = {};
                for (const [key, value] of Object.entries(translations)) {
                    translatedContent[key] = await fetchTranslation(value, language);
                }
                setTranslations(translatedContent);
            } catch (error) {
                console.error('Error translating content:', error);
            } finally {
                setIsTranslating(false);
            }
        };

        translateContent();
    }, [language]);

    if (isTranslating) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>{translations.loading}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Close Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <FontAwesome name="times" size={24} color="#001F3F" />
                </TouchableOpacity>
            </View>

            {/* Menu Items Container */}
            <View style={styles.menuItemsContainer}>
                <TouchableOpacity style={styles.menuItem}>
                    <FontAwesome name="calendar" size={24} color="#4CAF50" />
                    <Text style={styles.menuItemText}>{translations.attendance}</Text>
                    <FontAwesome name="chevron-right" size={20} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <FontAwesome name="book" size={24} color="#2196F3" />
                    <Text style={styles.menuItemText}>{translations.courses}</Text>
                    <FontAwesome name="chevron-right" size={20} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <FontAwesome name="user-md" size={24} color="#9C27B0" />
                    <Text style={styles.menuItemText}>{translations.therapists}</Text>
                    <FontAwesome name="chevron-right" size={20} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <FontAwesome name="cog" size={24} color="#FF9800" />
                    <Text style={styles.menuItemText}>{translations.settings}</Text>
                    <FontAwesome name="chevron-right" size={20} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <FontAwesome name="question-circle" size={24} color="#607D8B" />
                    <Text style={styles.menuItemText}>{translations.helpSupport}</Text>
                    <FontAwesome name="chevron-right" size={20} color="#666" />
                </TouchableOpacity>
            </View>

            {/* Logout Section - Fixed at Bottom */}
            <TouchableOpacity style={styles.logoutButton}>
                <FontAwesome name="sign-out" size={24} color="#F44336" />
                <Text style={styles.logoutText}>{translations.logout}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    closeButton: {
        padding: 5,
        alignSelf: 'flex-end',
    },
    menuItemsContainer: {
        flex: 1,
        paddingTop: 20,
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
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#FFF',
    },
    logoutText: {
        fontSize: 16,
        color: '#F44336',
        marginLeft: 15,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#FFF",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600',
    },
});
