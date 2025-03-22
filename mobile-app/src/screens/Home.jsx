import { View, Text, ScrollView, TouchableOpacity, StyleSheet, PanResponder, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';

export default function Home() {
    const navigation = useNavigation();
    const [fontScale, setFontScale] = useState(1);
    const [controlsVisible, setControlsVisible] = useState(true);
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([
                null,
                { dx: pan.x, dy: pan.y }
            ], { useNativeDriver: false }),
            onPanResponderRelease: () => {
                pan.extractOffset();
            }
        })
    ).current;

    const increaseFontSize = () => {
        setFontScale(prev => Math.min(prev + 0.1, 1.5));
    };

    const decreaseFontSize = () => {
        setFontScale(prev => Math.max(prev - 0.1, 0.8));
    };

    // Helper function to scale font sizes
    const scaledFont = (size) => size * fontScale;

    // Toggle button to show controls
    const showControls = () => {
        setControlsVisible(true);
    };
    
    return (
        <View style={styles.container}>
            {/* Show Controls Button (only visible when controls are hidden) */}
            {!controlsVisible && (
                <TouchableOpacity
                    style={styles.showControlsButton}
                    onPress={showControls}
                >
                    <FontAwesome name="text-height" size={20} color="#FFF" />
                </TouchableOpacity>
            )}

            {/* Font Size Controls */}
            {controlsVisible && (
                <Animated.View
                    style={[
                        styles.fontControls,
                        { transform: [{ translateX: pan.x }, { translateY: pan.y }] }
                    ]}
                    {...panResponder.panHandlers}
                >
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setControlsVisible(false)}
                    >
                        <FontAwesome name="times" size={16} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.fontButton}
                        onPress={decreaseFontSize}
                    >
                        <Text style={styles.fontButtonText}>A-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.fontButton}
                        onPress={increaseFontSize}
                    >
                        <Text style={styles.fontButtonText}>A+</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { fontSize: scaledFont(20) }]}>Welcome Back, Soumya</Text>
                <TouchableOpacity 
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('Notifications')}
                >
                    <FontAwesome name="bell" size={24} color="#001F3F" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Schedule Section */}
            <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { fontSize: scaledFont(18) }]}>Hmmm, you seem tightly packed! Let's go through your schedule:</Text>
                    <TouchableOpacity style={styles.classSection}>
                        <View style={[styles.classIconContainer, { backgroundColor: '#E3F2FD' }]}>
                            <FontAwesome name="comments" size={24} color="#1976D2" />
                        </View>
                        <View style={styles.classInfo}>
                            <Text style={[styles.className, { fontSize: scaledFont(16) }]}>Communication Class</Text>
                            <Text style={[styles.classTime, { fontSize: scaledFont(14) }]}>10:00 AM</Text>
                            <Text style={[styles.classDuration, { fontSize: scaledFont(12) }]}>Duration: 1h 30m</Text>
                        </View>
                        <FontAwesome name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.classSection}>
                        <View style={[styles.classIconContainer, { backgroundColor: '#F3E5F5' }]}>
                            <FontAwesome name="paint-brush" size={24} color="#7B1FA2" />
                        </View>
                        <View style={styles.classInfo}>
                            <Text style={[styles.className, { fontSize: scaledFont(16) }]}>Painting Class</Text>
                            <Text style={[styles.classTime, { fontSize: scaledFont(14) }]}>12:00 PM</Text>
                            <Text style={[styles.classDuration, { fontSize: scaledFont(12) }]}>Duration: 2h</Text>
                        </View>
                        <FontAwesome name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.classSection}>
                        <View style={[styles.classIconContainer, { backgroundColor: '#E8F5E9' }]}>
                            <FontAwesome name="music" size={24} color="#388E3C" />
                        </View>
                        <View style={styles.classInfo}>
                            <Text style={[styles.className, { fontSize: scaledFont(16) }]}>Music Therapy</Text>
                            <Text style={[styles.classTime, { fontSize: scaledFont(14) }]}>3:00 PM</Text>
                            <Text style={[styles.classDuration, { fontSize: scaledFont(12) }]}>Duration: 1h</Text>
                        </View>
                        <FontAwesome name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.attendanceButton, { marginTop: 15 }]}
                        onPress={() => navigation.navigate('AttendanceReport')}
                    >
                        <FontAwesome name="calendar-check-o" size={20} color="#FFF" style={styles.attendanceIcon} />
                        <Text style={[styles.buttonText, { fontSize: scaledFont(16) }]}>Check My Attendance Report</Text>
                    </TouchableOpacity>
                </View>

                {/* Upcoming Events Timeline */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { fontSize: scaledFont(18) }]}>Upcoming Events</Text>
                    <View style={styles.timeline}>
                        <View style={styles.timelineEvent}>
                            <View style={[styles.timelineDot, { backgroundColor: '#4CAF50' }]} />
                            <View style={styles.timelineLine} />
                            <View style={styles.timelineContent}>
                                <Text style={[styles.timelineDate, { fontSize: scaledFont(14) }]}>May 15th</Text>
                                <Text style={[styles.timelineTitle, { fontSize: scaledFont(16) }]}>Sensory-Friendly Movie Screening</Text>
                                <Text style={[styles.timelineDescription, { fontSize: scaledFont(12) }]}>
                                    Special screening with adjusted sound and lighting. Bring your comfort items!
                                </Text>
                            </View>
                        </View>

                        <View style={styles.timelineEvent}>
                            <View style={[styles.timelineDot, { backgroundColor: '#2196F3' }]} />
                            <View style={styles.timelineLine} />
                            <View style={styles.timelineContent}>
                                <Text style={[styles.timelineDate, { fontSize: scaledFont(14) }]}>May 18th</Text>
                                <Text style={[styles.timelineTitle, { fontSize: scaledFont(16) }]}>Social Skills Workshop</Text>
                                <Text style={[styles.timelineDescription, { fontSize: scaledFont(12) }]}>
                                    Interactive group session focusing on friendship and communication.
                                </Text>
                </View>
            </View>

                        <View style={styles.timelineEvent}>
                            <View style={[styles.timelineDot, { backgroundColor: '#9C27B0' }]} />
                            <View style={styles.timelineLine} />
                            <View style={styles.timelineContent}>
                                <Text style={[styles.timelineDate, { fontSize: scaledFont(14) }]}>May 22nd</Text>
                                <Text style={[styles.timelineTitle, { fontSize: scaledFont(16) }]}>Art Therapy Exhibition</Text>
                                <Text style={[styles.timelineDescription, { fontSize: scaledFont(12) }]}>
                                    Showcase your artwork and meet other young artists. Quiet room available.
                                </Text>
                </View>
            </View>

                        <View style={styles.timelineEvent}>
                            <View style={[styles.timelineDot, { backgroundColor: '#FF9800' }]} />
                            <View style={styles.timelineContent}>
                                <Text style={[styles.timelineDate, { fontSize: scaledFont(14) }]}>May 25th</Text>
                                <Text style={[styles.timelineTitle, { fontSize: scaledFont(16) }]}>Music & Movement Day</Text>
                                <Text style={[styles.timelineDescription, { fontSize: scaledFont(12) }]}>
                                    Fun rhythmic activities and music therapy. Noise-canceling headphones provided.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Upcoming Appointments */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { fontSize: scaledFont(18) }]}>Upcoming Appointments</Text>
                    <View style={styles.appointmentsContainer}>
                        <TouchableOpacity style={styles.appointmentCard}>
                            <View style={[styles.appointmentType, { backgroundColor: '#E3F2FD' }]}>
                                <Text style={[styles.appointmentTypeText, { color: '#1976D2' }]}>Therapist</Text>
                            </View>
                            <View style={styles.appointmentInfo}>
                                <Text style={[styles.appointmentDate, { fontSize: scaledFont(14) }]}>May 16th, 2024</Text>
                                <Text style={[styles.appointmentTime, { fontSize: scaledFont(14) }]}>10:30 AM</Text>
                                <Text style={[styles.appointmentPerson, { fontSize: scaledFont(16) }]}>Dr. Sarah Johnson</Text>
                                <Text style={[styles.appointmentSpecialty, { fontSize: scaledFont(12) }]}>Speech Therapy</Text>
                            </View>
                            <FontAwesome name="chevron-right" size={20} color="#666" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.appointmentCard}>
                            <View style={[styles.appointmentType, { backgroundColor: '#F3E5F5' }]}>
                                <Text style={[styles.appointmentTypeText, { color: '#7B1FA2' }]}>Faculty</Text>
                            </View>
                            <View style={styles.appointmentInfo}>
                                <Text style={[styles.appointmentDate, { fontSize: scaledFont(14) }]}>May 17th, 2024</Text>
                                <Text style={[styles.appointmentTime, { fontSize: scaledFont(14) }]}>2:00 PM</Text>
                                <Text style={[styles.appointmentPerson, { fontSize: scaledFont(16) }]}>Prof. Michael Chen</Text>
                                <Text style={[styles.appointmentSpecialty, { fontSize: scaledFont(12) }]}>Art Education</Text>
                            </View>
                            <FontAwesome name="chevron-right" size={20} color="#666" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.appointmentCard}>
                            <View style={[styles.appointmentType, { backgroundColor: '#E8F5E9' }]}>
                                <Text style={[styles.appointmentTypeText, { color: '#388E3C' }]}>Therapist</Text>
                            </View>
                            <View style={styles.appointmentInfo}>
                                <Text style={[styles.appointmentDate, { fontSize: scaledFont(14) }]}>May 19th, 2024</Text>
                                <Text style={[styles.appointmentTime, { fontSize: scaledFont(14) }]}>11:00 AM</Text>
                                <Text style={[styles.appointmentPerson, { fontSize: scaledFont(16) }]}>Dr. Emily Parker</Text>
                                <Text style={[styles.appointmentSpecialty, { fontSize: scaledFont(12) }]}>Occupational Therapy</Text>
                            </View>
                            <FontAwesome name="chevron-right" size={20} color="#666" />
                        </TouchableOpacity>
                </View>
            </View>

                {/* Articles Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { fontSize: scaledFont(18) }]}>Articles</Text>
                    <Text style={[styles.sectionSubtitle, { fontSize: scaledFont(14) }]}>Today's Top Picks For You</Text>
                    <ScrollView 
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.articlesContainer}
                    >
                        <TouchableOpacity style={styles.articleCard}>
                            <View style={[styles.articleImage, { backgroundColor: '#E3F2FD' }]}>
                                <FontAwesome name="book" size={24} color="#1976D2" />
                            </View>
                            <View style={styles.articleContent}>
                                <Text style={[styles.articleTitle, { fontSize: scaledFont(14) }]}>Understanding Sensory Processing</Text>
                                <Text style={[styles.articlePreview, { fontSize: scaledFont(12) }]}>Learn about sensory challenges and effective coping strategies...</Text>
                                <Text style={[styles.articleMeta, { fontSize: scaledFont(10) }]}>5 min read • Expert Article</Text>
                            </View>
                </TouchableOpacity>

                        <TouchableOpacity style={styles.articleCard}>
                            <View style={[styles.articleImage, { backgroundColor: '#F3E5F5' }]}>
                                <FontAwesome name="heart" size={24} color="#7B1FA2" />
                            </View>
                            <View style={styles.articleContent}>
                                <Text style={[styles.articleTitle, { fontSize: scaledFont(14) }]}>Building Social Connections</Text>
                                <Text style={[styles.articlePreview, { fontSize: scaledFont(12) }]}>Tips for helping your child develop meaningful friendships...</Text>
                                <Text style={[styles.articleMeta, { fontSize: scaledFont(10) }]}>7 min read • Parent Guide</Text>
                            </View>
                </TouchableOpacity>

                        <TouchableOpacity style={styles.articleCard}>
                            <View style={[styles.articleImage, { backgroundColor: '#E8F5E9' }]}>
                                <FontAwesome name="lightbulb-o" size={24} color="#388E3C" />
                            </View>
                            <View style={styles.articleContent}>
                                <Text style={[styles.articleTitle, { fontSize: scaledFont(14) }]}>Creative Expression Through Art</Text>
                                <Text style={[styles.articlePreview, { fontSize: scaledFont(12) }]}>How art therapy can help with emotional expression...</Text>
                                <Text style={[styles.articleMeta, { fontSize: scaledFont(10) }]}>4 min read • Therapy Insights</Text>
                            </View>
                </TouchableOpacity>

                        <TouchableOpacity style={styles.articleCard}>
                            <View style={[styles.articleImage, { backgroundColor: '#FFF3E0' }]}>
                                <FontAwesome name="star" size={24} color="#F57C00" />
                            </View>
                            <View style={styles.articleContent}>
                                <Text style={[styles.articleTitle, { fontSize: scaledFont(14) }]}>Success Stories</Text>
                                <Text style={[styles.articlePreview, { fontSize: scaledFont(12) }]}>Inspiring journeys of children who overcame challenges...</Text>
                                <Text style={[styles.articleMeta, { fontSize: scaledFont(10) }]}>6 min read • Community Stories</Text>
                            </View>
                </TouchableOpacity>
                    </ScrollView>
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
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    classSection: {
        flexDirection: 'row',
        alignItems: 'center',
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
    classIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    classInfo: {
        flex: 1,
    },
    className: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    classTime: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    classDuration: {
        fontSize: 12,
        color: '#888',
    },
    timeline: {
        paddingLeft: 20,
        marginTop: 15,
    },
    timelineEvent: {
        position: 'relative',
        marginBottom: 25,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        position: 'absolute',
        left: -6,
        top: 5,
    },
    timelineLine: {
        position: 'absolute',
        left: 0,
        top: 15,
        bottom: -15,
        width: 2,
        backgroundColor: '#E0E0E0',
    },
    timelineContent: {
        marginLeft: 20,
        backgroundColor: '#F8F9FA',
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    timelineDate: {
        color: '#666',
        marginBottom: 5,
        fontWeight: '500',
    },
    timelineTitle: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    timelineDescription: {
        color: '#666',
        lineHeight: 18,
    },
    sectionSubtitle: {
        color: '#666',
        marginBottom: 15,
    },
    articlesContainer: {
        paddingRight: 20,
    },
    articleCard: {
        width: 250,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginLeft: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    articleImage: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    articleContent: {
        padding: 15,
    },
    articleTitle: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    articlePreview: {
        color: '#666',
        marginBottom: 8,
        lineHeight: 18,
    },
    articleMeta: {
        color: '#888',
        fontStyle: 'italic',
    },
    appointmentsContainer: {
        marginTop: 10,
    },
    appointmentCard: {
        flexDirection: 'row',
        alignItems: 'center',
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
    appointmentType: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 15,
    },
    appointmentTypeText: {
        fontWeight: '600',
        fontSize: 12,
    },
    appointmentInfo: {
        flex: 1,
    },
    appointmentDate: {
        color: '#333',
        fontWeight: '500',
        marginBottom: 2,
    },
    appointmentTime: {
        color: '#666',
        marginBottom: 4,
    },
    appointmentPerson: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    appointmentSpecialty: {
        color: '#666',
        fontStyle: 'italic',
    },
    attendanceButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    attendanceIcon: {
        marginRight: 10,
    },
    fontControls: {
        position: 'absolute',
        right: 15,
        top: 100,
        zIndex: 999,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        padding: 8,
        flexDirection: 'column',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 5,
        marginBottom: 5,
    },
    showControlsButton: {
        position: 'absolute',
        right: 15,
        top: 100,
        zIndex: 999,
        backgroundColor: '#4CAF50',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    fontButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        marginVertical: 5,
    },
    fontButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});