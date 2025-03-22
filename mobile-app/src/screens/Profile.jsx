import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Navbar from '../components/Navbar';

export default function Profile() {
    const navigation = useNavigation();

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
                            source={{ uri: "https://res.cloudinary.com/dh2gwea4g/image/upload/t_Banner 9:16/v1742526651/ishanya5_xkgnk4.webp" }} 
                            style={styles.profileImage}
                        />
                    </View>

                    {/* Student Details */}
                    <Text style={styles.sectionTitle}>Student Details</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Name:</Text>
                        <Text style={styles.detailValue}>Soumya</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Email:</Text>
                        <Text style={styles.detailValue}>soumya@student.edu</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Gender:</Text>
                        <Text style={styles.detailValue}>Female</Text>
                    </View>

                    <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.detailLabel}>Primary Diagnosis:</Text>
                        <Text style={styles.detailValue}>Autism</Text>
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
                            <Text style={styles.educatorName}>John Doe</Text>
                            <Text style={styles.educatorSpecialty}>Special Education Specialist</Text>
                        </View>
                        <FontAwesome name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.educatorCard, { borderBottomWidth: 0 }]}
                        onPress={() => navigation.navigate('SecondaryEducator')}
                    >
                        <View style={styles.educatorInfo}>
                            <Text style={styles.educatorTitle}>Secondary Educator</Text>
                            <Text style={styles.educatorName}>Jane Smith</Text>
                            <Text style={styles.educatorSpecialty}>Behavioral Therapist</Text>
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

                    <TouchableOpacity style={[styles.actionButton, styles.logoutButton]}>
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
