import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getNotifications } from '../utils/api';
import Navbar from '../components/Navbar';

export default function Notifications() {
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const loadNotifications = async () => {
        try {
            const result = await getNotifications();
            if (result.success) {
                setNotifications(result.notifications);
                setError(null);
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Failed to load notifications');
            console.error('Error loading notifications:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

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

    const renderNotification = (notification) => (
        <View key={notification._id} style={styles.notificationCard}>
            <View style={styles.notificationHeader}>
                <View style={styles.notificationDot} />
                <Text style={styles.notificationMessage}>{notification.message}</Text>
            </View>
            <Text style={styles.notificationTime}>
                {formatDate(notification.createdAt)}
            </Text>
        </View>
    );

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
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#001F3F" />
                </View>
            ) : (
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
                            <Text style={styles.emptyText}>No new notifications</Text>
                        </View>
                    )}

                    {/* Add padding at bottom to ensure content is visible above footer */}
                    <View style={{ height: 80 }} />
                </ScrollView>
            )}

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
    notificationTime: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
        alignSelf: 'flex-end',
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
});
