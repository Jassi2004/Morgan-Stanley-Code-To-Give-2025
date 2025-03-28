import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getNotifications } from '../utils/api';
import Navbar from '../components/Navbar';
import { fetchTranslation } from '../utils/translate';
import { useLanguage } from '../context/LanguageContext';
import * as Speech from 'expo-speech';

export default function Notifications() {
    const navigation = useNavigation();
    const { language } = useLanguage();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTranslating, setIsTranslating] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [speakingId, setSpeakingId] = useState(null);

    // Translation states
    const [translations, setTranslations] = useState({
        title: "Notifications",
        noNotifications: "No new notifications",
        loadingText: "Loading...",
        failedToLoad: "Failed to load notifications",
        tapToListen: "Tap to listen"
    });

    // Fetch translations for UI elements
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
            }
        };
        translateContent();
    }, [language]);

    // Stop speaking when component unmounts
    useEffect(() => {
        return () => {
            if (Speech.isSpeakingAsync()) {
                Speech.stop();
            }
        };
    }, []);

    // Translate notifications
    const translateNotifications = async (notifs) => {
        try {
            const translatedNotifications = await Promise.all(
                notifs.map(async (notification) => ({
                    ...notification,
                    message: await fetchTranslation(notification.message, language)
                }))
            );
            return translatedNotifications;
        } catch (error) {
            console.error('Error translating notifications:', error);
            return notifs;
        } finally {
            setIsTranslating(false);
        }
    };

    const loadNotifications = async () => {
        try {
            const result = await getNotifications();
            if (result.success) {
                const translatedNotifs = await translateNotifications(result.notifications);
                setNotifications(translatedNotifs);
                setError(null);
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError(translations.failedToLoad);
            console.error('Error loading notifications:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, [language]); // Reload when language changes

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadNotifications();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            // Today - show time
            return date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
        }
    };

    const speakNotification = (notification) => {
        // If already speaking, stop it
        if (Speech.isSpeakingAsync()) {
            Speech.stop();
            
            // If we're stopping the same notification, just reset state
            if (speakingId === notification._id) {
                setSpeakingId(null);
                return;
            }
        }

        // Speak the notification message
        setSpeakingId(notification._id);
        
        Speech.speak(notification.message, {
            language: language === 'hi' ? 'hi-IN' : 'en-US',
            rate: 0.9,
            pitch: 1.0,
            onDone: () => setSpeakingId(null),
            onError: () => setSpeakingId(null)
        });
    };

    const renderNotification = (notification) => {
        const isSpeaking = speakingId === notification._id;
        
        return (
            <View key={notification._id} style={styles.notificationCard}>
                <View style={styles.notificationHeader}>
                    <View style={styles.notificationDot} />
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <TouchableOpacity 
                        style={[styles.speakButton, isSpeaking && styles.speakButtonActive]}
                        onPress={() => speakNotification(notification)}
                        activeOpacity={0.7}
                    >
                        <FontAwesome 
                            name={isSpeaking ? "volume-up" : "volume-off"} 
                            size={16} 
                            color={isSpeaking ? "#FFFFFF" : "#555555"} 
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.notificationFooter}>
                    <Text style={styles.notificationTime}>
                        {formatDate(notification.createdAt)}
                    </Text>
                    {!isSpeaking && (
                        <Text style={styles.listenHint}>{translations.tapToListen}</Text>
                    )}
                </View>
            </View>
        );
    };

    if (isLoading || isTranslating) {
        return (
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <FontAwesome name="arrow-left" size={24} color="#001F3F" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{translations.title}</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>{translations.loadingText}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <FontAwesome name="arrow-left" size={24} color="#001F3F" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{translations.title}</Text>
            </View>

            <ScrollView 
                style={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {error ? (
                    <View style={styles.section}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : notifications.length > 0 ? (
                    <View style={styles.section}>
                        {notifications.map(renderNotification)}
                    </View>
                ) : (
                    <View style={styles.section}>
                        <Text style={styles.emptyText}>{translations.noNotifications}</Text>
                    </View>
                )}

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
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingTop: 45,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#001F3F',
        marginLeft: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        flex: 1,
    },
    section: {
        padding: 10,
        backgroundColor: 'transparent',
    },
    notificationCard: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    notificationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#007AFF',
        marginRight: 10,
    },
    notificationMessage: {
        fontSize: 15,
        color: '#333',
        flex: 1,
        lineHeight: 20,
    },
    notificationFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    notificationTime: {
        fontSize: 12,
        color: '#666',
    },
    listenHint: {
        fontSize: 11,
        color: '#888',
        fontStyle: 'italic',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#FF3B30',
        textAlign: 'center',
        marginTop: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600',
    },
    speakButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    speakButtonActive: {
        backgroundColor: '#4CAF50',
    },
});
