import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getUserData, handleLogout } from '../utils/api';
import Navbar from '../components/Navbar';

const DEFAULT_PROFILE_IMAGE = "https://res.cloudinary.com/dh2gwea4g/image/upload/t_Banner 9:16/v1742526651/ishanya5_xkgnk4.webp";

export default function Profile() {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const data = await getUserData();
            console.log("Loaded user data:", data); // Debug log
            setUserData(data);
            
            // Additional debug logs
            if (data) {
                console.log("First Name:", data.firstName);
                console.log("Last Name:", data.lastName);
                console.log("Full user object:", JSON.stringify(data, null, 2));
            } else {
                console.log("No user data loaded");
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Debug log when userData changes
    useEffect(() => {
        console.log("userData state updated:", userData);
    }, [userData]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#001F3F" />
            </View>
        );
    }

    // Early return if no user data
    if (!userData) {
        return (
            <View style={styles.loadingContainer}>
                <Text>No user data available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity 
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('Notifications')}
                >
                    <FontAwesome name="bell" size={24} color="#001F3F" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <View style={styles.section}>
                    <View style={styles.imageContainer}>
                        <Image 
                            source={{ uri: userData?.avatar?.secure_url || DEFAULT_PROFILE_IMAGE }}
                            style={styles.profileImage}
                        />
                    </View>

                    {/* Student Details */}
                    <Text style={styles.sectionTitle}>Student Details</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Name:</Text>
                        <Text style={styles.detailValue}>
                            {`${userData.firstName || ''} ${userData.lastName || ''}`}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Email:</Text>
                        <Text style={styles.detailValue}>
                            {userData.studentEmail || 'N/A'}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Gender:</Text>
                        <Text style={styles.detailValue}>
                            {userData.gender || 'N/A'}
                        </Text>
                    </View>

                    <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.detailLabel}>Primary Diagnosis:</Text>
                        <Text style={styles.detailValue}>
                            {userData.primaryDiagnosis || 'N/A'}
                        </Text>
                    </View>
                </View>

                {/* Educators Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My Educators</Text>
                    
                    <TouchableOpacity 
                        style={styles.educatorCard}
                        onPress={() => navigation.navigate('PrimaryEducator')}
                    >
                        <View style={styles.educatorInfo}>
                            <Text style={styles.educatorTitle}>Primary Educator</Text>
                            <Text style={styles.educatorName}>
                                {userData?.educator?.primary?.name || 'Not Assigned'}
                            </Text>
                            <Text style={styles.educatorSpecialty}>
                                {userData?.educator?.primary?.specialty || 'Special Education Specialist'}
                            </Text>
                        </View>
                        <FontAwesome name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.educatorCard, { borderBottomWidth: 0 }]}
                        onPress={() => navigation.navigate('SecondaryEducator')}
                    >
                        <View style={styles.educatorInfo}>
                            <Text style={styles.educatorTitle}>Secondary Educator</Text>
                            <Text style={styles.educatorName}>
                                {userData?.educator?.secondary?.name || 'Not Assigned'}
                            </Text>
                            <Text style={styles.educatorSpecialty}>
                                {userData?.educator?.secondary?.specialty || 'Behavioral Therapist'}
                            </Text>
                        </View>
                        <FontAwesome name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Action Buttons Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <TouchableOpacity style={styles.actionButton}>
                        <FontAwesome name="lock" size={20} color="#FFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Change Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <FontAwesome name="shield" size={20} color="#FFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Privacy Settings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.actionButton, styles.logoutButton]}
                        onPress={async () => {
                            try {
                                const result = await handleLogout();
                                if (result.success) {
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Login' }],
                                    });
                                } else {
                                    Alert.alert('Logout Failed', 'Unable to logout. Please try again.');
                                }
                            } catch (error) {
                                console.error('Error during logout:', error);
                                Alert.alert('Error', 'An error occurred while logging out.');
                            }
                        }}
                    >
                        <FontAwesome name="sign-out" size={20} color="#FFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Logout</Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#F5F5F5",
    },
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
    scrollContent: {
        flex: 1,
    },
    section: {
        padding: 20,
        backgroundColor: '#FFF',
        margin: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    imageContainer: {
        alignSelf: 'center',
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#001F3F",
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    detailValue: {
        fontSize: 16,
        color: "#555",
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 10,
    },
    buttonIcon: {
        marginRight: 10,
    },
    buttonText: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: "600",
    },
    logoutButton: {
        backgroundColor: "#FF3B30",
        marginTop: 10,
    },
    educatorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    educatorInfo: {
        flex: 1,
    },
    educatorTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    educatorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    educatorSpecialty: {
        fontSize: 14,
        color: '#4CAF50',
        fontStyle: 'italic',
    },
});
