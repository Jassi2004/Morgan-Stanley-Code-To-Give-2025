import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';

export default function Feedback() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Feedback Hub</Text>
                <TouchableOpacity 
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('Menu')}
                >
                    <FontAwesome name="bars" size={24} color="#001F3F" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Student Feedback Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Feedback from Parent</Text>
                    <TouchableOpacity style={styles.feedbackCard}>
                        <View style={[styles.feedbackType, { backgroundColor: '#E3F2FD' }]}>
                            <FontAwesome name="star" size={20} color="#1976D2" />
                        </View>
                        <View style={styles.feedbackContent}>
                            <Text style={styles.feedbackDate}>May 15th, 2024</Text>
                            <Text style={styles.feedbackTitle}>Communication Class</Text>
                            <Text style={styles.feedbackText}>
                                The visual aids really helped me understand better. I felt comfortable during the session.
                            </Text>
                            <Text style={styles.feedbackMeta}>Submitted to: Ms. Rachel Green</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.feedbackCard}>
                        <View style={[styles.feedbackType, { backgroundColor: '#F3E5F5' }]}>
                            <FontAwesome name="star" size={20} color="#7B1FA2" />
                        </View>
                        <View style={styles.feedbackContent}>
                            <Text style={styles.feedbackDate}>May 14th, 2024</Text>
                            <Text style={styles.feedbackTitle}>Art Therapy</Text>
                            <Text style={styles.feedbackText}>
                                I enjoyed using different colors today. The quiet room helped me focus.
                            </Text>
                            <Text style={styles.feedbackMeta}>Submitted to: Dr. Emily Parker</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Faculty Feedback Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Feedback from Faculty</Text>
                    <TouchableOpacity style={styles.feedbackCard}>
                        <View style={[styles.feedbackType, { backgroundColor: '#E8F5E9' }]}>
                            <FontAwesome name="comment" size={20} color="#388E3C" />
                        </View>
                        <View style={styles.feedbackContent}>
                            <Text style={styles.feedbackDate}>May 15th, 2024</Text>
                            <Text style={styles.feedbackTitle}>Progress Report</Text>
                            <Text style={styles.feedbackText}>
                                Great improvement in social interaction during group activities. Shows increased comfort in expressing needs.
                            </Text>
                            <Text style={styles.feedbackMeta}>From: Dr. Sarah Johnson</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.feedbackCard}>
                        <View style={[styles.feedbackType, { backgroundColor: '#FFF3E0' }]}>
                            <FontAwesome name="comment" size={20} color="#F57C00" />
                        </View>
                        <View style={styles.feedbackContent}>
                            <Text style={styles.feedbackDate}>May 13th, 2024</Text>
                            <Text style={styles.feedbackTitle}>Weekly Assessment</Text>
                            <Text style={styles.feedbackText}>
                                Demonstrated excellent focus during painting activities. Successfully used new communication tools.
                            </Text>
                            <Text style={styles.feedbackMeta}>From: Prof. Michael Chen</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Add padding at bottom to ensure content is visible above footer */}
                <View style={{ height: 80 }} />
            </ScrollView>

            {/* Floating Action Button (Plus Sign) */}
            <TouchableOpacity 
                style={styles.floatingButton}
                onPress={() => navigation.navigate('NewFeedback')}
            >
                <FontAwesome name="plus" size={24} color="#FFF" />
            </TouchableOpacity>

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
                    <FontAwesome name="comments" size={24} color="#001F3F" />
                    <Text style={styles.footerText}>Feedback</Text>
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
    menuButton: {
        position: 'absolute',
        right: 15,
        top: 45,
        padding: 5,
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    feedbackCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    feedbackType: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    feedbackContent: {
        flex: 1,
    },
    feedbackDate: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    feedbackTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    feedbackText: {
        fontSize: 14,
        color: '#444',
        marginBottom: 8,
        lineHeight: 20,
    },
    feedbackMeta: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    floatingButton: {
        position: 'absolute',
        right: 20,
        bottom: 90,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
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
