import { View, Text, ScrollView, TouchableOpacity, StyleSheet, PanResponder, Animated, Linking, ActivityIndicator, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { fetchTranslation } from '../utils/translate';
import { useLanguage } from '../context/LanguageContext';
import { getUserData } from '../utils/api';

export default function Home() {
    const navigation = useNavigation();
    const [fontScale, setFontScale] = useState(1);
    const [controlsVisible, setControlsVisible] = useState(false);
    const [langSwitchVisible, setLangSwitchVisible] = useState(false);
    const pan = useRef(new Animated.ValueXY()).current;
    const { language, changeLanguage } = useLanguage();
    const [isTranslating, setIsTranslating] = useState(true);
    const [userData, setUserData] = useState(null);

    // Translation states
    const [translations, setTranslations] = useState({
        welcome: "Welcome Back",
        todaySchedule: "Today's Schedule",
        communicationClass: "Communication Class",
        paintingClass: "Painting Class",
        musicTherapy: "Music Therapy",
        duration: "Duration",
        checkAttendance: "Check My Attendance Report",
        upcomingEvents: "Upcoming Events",
        upcomingAppointments: "Upcoming Appointments",
        articles: "Articles",
        todayTopPicks: "Today's top Picks",
        loading: "Loading...",
        therapist: "Therapist",
        faculty: "Faculty",
        speechTherapy: "Speech Therapy",
        artEducation: "Art Education",
        occupationalTherapy: "Occupational Therapy"
    });

    // Fetch user data
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const data = await getUserData();
                setUserData(data);
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };
        loadUserData();
    }, []);

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

    const handleLanguageChange = (newLang) => {
        changeLanguage(newLang);
        setLangSwitchVisible(false);
    };

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
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    {/* Font Size Control Button */}
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => {
                            setControlsVisible(!controlsVisible);
                            setLangSwitchVisible(false);
                        }}
                    >
                        <FontAwesome name="text-height" size={24} color="#001F3F" />
                    </TouchableOpacity>

                    {/* Language Switch Button */}
                    <TouchableOpacity
                        style={[styles.headerButton, styles.languageButton]}
                        onPress={() => {
                            setLangSwitchVisible(!langSwitchVisible);
                            setControlsVisible(false);
                        }}
                    >
                        <FontAwesome name="language" size={20} color="#001F3F" />
                        <Text style={styles.languageButtonText}>
                            {language === 'en' ? 'English' : 'हिंदी'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Font Size Controls Popup */}
                {controlsVisible && (
                    <View style={[styles.popup, styles.fontControlsPopup]}>
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
                    </View>
                )}

                {/* Language Switch Popup */}
                {langSwitchVisible && (
                    <View style={[styles.popup, styles.langSwitchPopup]}>
                        <TouchableOpacity
                            style={[styles.langButton, language === 'en' && styles.langButtonActive]}
                            onPress={() => handleLanguageChange('en')}
                        >
                            <Text style={[styles.langButtonText, language === 'en' && styles.langButtonTextActive]}>English</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.langButton, language === 'hi' && styles.langButtonActive]}
                            onPress={() => handleLanguageChange('hi')}
                        >
                            <Text style={[styles.langButtonText, language === 'hi' && styles.langButtonTextActive]}>हिंदी</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity 
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('Notifications')}
                >
                    <FontAwesome name="bell" size={24} color="#001F3F" />
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={[
                    styles.scrollContent,
                    styles.scrollContentWithPadding
                ]} 
                showsVerticalScrollIndicator={false}
            >
                {/* Welcome Message */}
                <View style={styles.welcomeSection}>
                    <Text style={[styles.welcomeText, { fontSize: scaledFont(24) }]}>
                        {translations.welcome}, {userData?.firstName || ''}
                    </Text>
                </View>

                {/* Articles Section - Moved to top */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { fontSize: scaledFont(18) }]}>{translations.articles}</Text>
                    <Text style={[styles.sectionSubtitle, { fontSize: scaledFont(14) }]}>{translations.todayTopPicks}</Text>
                    <ScrollView 
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.articlesContainer}
                    >
                        <TouchableOpacity 
                            style={styles.articleCard}
                            onPress={() => Linking.openURL('https://medium.com/@maharshi11swati/understanding-neurodivergent-kids-their-strengths-and-challenges-31b90e266aa1')}
                        >
                            <Image 
                                source={{ uri: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500&auto=format&fit=crop&q=80' }}
                                style={styles.articleImage}
                            />
                            <View style={styles.articleContent}>
                                <Text style={[styles.articleTitle, { fontSize: scaledFont(14) }]}>Understanding Neurodivergent Children</Text>
                                <Text style={[styles.articlePreview, { fontSize: scaledFont(12) }]}>A comprehensive guide for parents and educators on supporting neurodivergent children...</Text>
                                <Text style={[styles.articleMeta, { fontSize: scaledFont(10) }]}>8 min read • Expert Guide</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.articleCard}
                            onPress={() => Linking.openURL('https://medium.com/invisible-illness/adhd-in-children-beyond-the-basics-understanding-executive-function-challenges-d2194c96af8b')}
                        >
                            <Image 
                                source={{ uri: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&auto=format&fit=crop&q=80' }}
                                style={styles.articleImage}
                                
                            />
                            <View style={styles.articleContent}>
                                <Text style={[styles.articleTitle, { fontSize: scaledFont(14) }]}>ADHD: Beyond the Basics</Text>
                                <Text style={[styles.articlePreview, { fontSize: scaledFont(12) }]}>Understanding executive function challenges and practical strategies for support...</Text>
                                <Text style={[styles.articleMeta, { fontSize: scaledFont(10) }]}>6 min read • Research Insights</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.articleCard}
                            onPress={() => Linking.openURL('https://medium.com/autism-parenting/sensory-processing-in-autism-creating-supportive-environments-7d842f5a1e9c')}
                        >
                            <Image 
                                source={{ uri: 'https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=500&auto=format&fit=crop&q=80' }}
                                style={styles.articleImage}
            
                            />
                            <View style={styles.articleContent}>
                                <Text style={[styles.articleTitle, { fontSize: scaledFont(14) }]}>Sensory Processing in Autism</Text>
                                <Text style={[styles.articlePreview, { fontSize: scaledFont(12) }]}>Creating supportive environments and understanding sensory needs...</Text>
                                <Text style={[styles.articleMeta, { fontSize: scaledFont(10) }]}>5 min read • Practical Guide</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.articleCard}
                            onPress={() => Linking.openURL('https://medium.com/education-innovation/inclusive-education-strategies-for-neurodivergent-learners-9c4e8d2b5f3a')}
                        >
                            <Image 
                                source={{ uri: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format&fit=crop&q=80' }}
                                style={styles.articleImage}
                                // defaultSource={require('../assets/placeholder.png')}
                            />
                            <View style={styles.articleContent}>
                                <Text style={[styles.articleTitle, { fontSize: scaledFont(14) }]}>Inclusive Education Strategies</Text>
                                <Text style={[styles.articlePreview, { fontSize: scaledFont(12) }]}>Effective teaching methods and accommodations for diverse learning needs...</Text>
                                <Text style={[styles.articleMeta, { fontSize: scaledFont(10) }]}>7 min read • Education Tips</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.articleCard}
                            onPress={() => Linking.openURL('https://medium.com/parenting-matters/building-social-skills-in-neurodivergent-children-through-play-3f9d2c8e4b5a')}
                        >
                            <Image 
                                source={{ uri: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format&fit=crop&q=80' }}
                                style={styles.articleImage}
                            />
                            <View style={styles.articleContent}>
                                <Text style={[styles.articleTitle, { fontSize: scaledFont(14) }]}>Social Skills Through Play</Text>
                                <Text style={[styles.articlePreview, { fontSize: scaledFont(12) }]}>Developing social connections and communication through structured play activities...</Text>
                                <Text style={[styles.articleMeta, { fontSize: scaledFont(10) }]}>6 min read • Activity Guide</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Schedule Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { fontSize: scaledFont(18) }]}>{translations.todaySchedule}</Text>
                    <View style={styles.timetableContainer}>
                        <View style={styles.timeSlot}>
                            <View style={styles.timeColumn}>
                                <Text style={[styles.timeText, { fontSize: scaledFont(14) }]}>10:00 - 11:30</Text>
                            </View>
                            <View style={[styles.classColumn, { backgroundColor: '#E3F2FD' }]}>
                                <FontAwesome name="comments" size={20} color="#1976D2" />
                                <Text style={[styles.classText, { fontSize: scaledFont(14) }]}>{translations.communicationClass}</Text>
                            </View>
                        </View>

                        <View style={styles.timeSlot}>
                            <View style={styles.timeColumn}>
                                <Text style={[styles.timeText, { fontSize: scaledFont(14) }]}>12:00 - 14:00</Text>
                            </View>
                            <View style={[styles.classColumn, { backgroundColor: '#F3E5F5' }]}>
                                <FontAwesome name="paint-brush" size={20} color="#7B1FA2" />
                                <Text style={[styles.classText, { fontSize: scaledFont(14) }]}>{translations.paintingClass}</Text>
                            </View>
                        </View>

                        <View style={styles.timeSlot}>
                            <View style={styles.timeColumn}>
                                <Text style={[styles.timeText, { fontSize: scaledFont(14) }]}>15:00 - 16:00</Text>
                            </View>
                            <View style={[styles.classColumn, { backgroundColor: '#E8F5E9' }]}>
                                <FontAwesome name="music" size={20} color="#388E3C" />
                                <Text style={[styles.classText, { fontSize: scaledFont(14) }]}>{translations.musicTherapy}</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={[styles.attendanceButton, { marginTop: 15 }]}
                        onPress={() => navigation.navigate('AttendanceReport')}
                    >
                        <FontAwesome name="calendar-check-o" size={20} color="#FFF" style={styles.attendanceIcon} />
                        <Text style={[styles.buttonText, { fontSize: scaledFont(16) }]}>{translations.checkAttendance}</Text>
                    </TouchableOpacity>
                </View>

                {/* Upcoming Appointments - Simplified */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { fontSize: scaledFont(18) }]}>{translations.upcomingAppointments}</Text>
                    <View style={styles.appointmentsContainer}>
                        <View style={styles.appointmentRow}>
                            <Text style={[styles.appointmentDate, { fontSize: scaledFont(14) }]}>May 16</Text>
                            <View style={styles.appointmentMiddle}>
                                <Text style={[styles.appointmentTime, { fontSize: scaledFont(14) }]}>10:30</Text>
                                <Text style={[styles.appointmentPerson, { fontSize: scaledFont(14) }]}>Dr. Sarah J.</Text>
                            </View>
                            <Text style={[styles.appointmentType, { color: '#1976D2' }]}>{translations.speechTherapy}</Text>
                        </View>

                        <View style={styles.appointmentRow}>
                            <Text style={[styles.appointmentDate, { fontSize: scaledFont(14) }]}>May 17</Text>
                            <View style={styles.appointmentMiddle}>
                                <Text style={[styles.appointmentTime, { fontSize: scaledFont(14) }]}>14:00</Text>
                                <Text style={[styles.appointmentPerson, { fontSize: scaledFont(14) }]}>Prof. Chen</Text>
                            </View>
                            <Text style={[styles.appointmentType, { color: '#7B1FA2' }]}>{translations.artEducation}</Text>
                        </View>

                        <View style={styles.appointmentRow}>
                            <Text style={[styles.appointmentDate, { fontSize: scaledFont(14) }]}>May 19</Text>
                            <View style={styles.appointmentMiddle}>
                                <Text style={[styles.appointmentTime, { fontSize: scaledFont(14) }]}>11:00</Text>
                                <Text style={[styles.appointmentPerson, { fontSize: scaledFont(14) }]}>Dr. Emily P.</Text>
                            </View>
                            <Text style={[styles.appointmentType, { color: '#388E3C' }]}>{translations.occupationalTherapy}</Text>
                        </View>
                    </View>
                </View>

                {/* Upcoming Events Timeline */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { fontSize: scaledFont(18) }]}>{translations.upcomingEvents}</Text>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingTop: 45,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        padding: 5,
        marginRight: 10,
    },
    menuButton: {
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
    timetableContainer: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        overflow: 'hidden',
    },
    timeSlot: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    timeColumn: {
        width: 100,
        padding: 12,
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
    },
    timeText: {
        color: '#666',
        fontWeight: '500',
    },
    classColumn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingLeft: 16,
    },
    classText: {
        marginLeft: 12,
        color: '#333',
        fontWeight: '500',
    },
    appointmentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    appointmentDate: {
        width: 60,
        color: '#666',
        fontWeight: '500',
    },
    appointmentMiddle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    appointmentTime: {
        color: '#333',
        marginRight: 10,
    },
    appointmentPerson: {
        color: '#333',
        fontWeight: '500',
    },
    appointmentType: {
        fontSize: 12,
        fontWeight: '600',
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
    popup: {
        position: 'absolute',
        top: 85,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
        zIndex: 1000,
    },
    fontControlsPopup: {
        left: 10,
        flexDirection: 'row',
    },
    langSwitchPopup: {
        left: 60,
    },
    langButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginVertical: 4,
        backgroundColor: '#F5F5F5',
    },
    langButtonActive: {
        backgroundColor: '#4CAF50',
    },
    langButtonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    langButtonTextActive: {
        color: '#FFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#F5F5F5",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600',
    },
    welcomeSection: {
        padding: 20,
        backgroundColor: '#FFF',
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#001F3F',
    },
    scrollContentWithPadding: {
        paddingTop: 10,
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
        height: 150,
        width: '100%',
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
    appointmentCard: undefined,
    appointmentTypeText: undefined,
    appointmentInfo: undefined,
    appointmentSpecialty: undefined,
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 15,
    },
    languageButtonText: {
        marginLeft: 5,
        fontSize: 14,
        fontWeight: '500',
        color: '#001F3F',
    },
});