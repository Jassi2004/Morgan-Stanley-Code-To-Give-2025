import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getUserData, sendFeedbackToEducator, getReceivedFeedbacks } from '../utils/api';
import Navbar from '../components/Navbar';
import { fetchTranslation } from '../utils/translate';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_EDUCATOR_IMAGE = "https://res.cloudinary.com/dh2gwea4g/image/upload/v1710834756/educator_default_kxoxyk.png";

export default function PrimaryEducator() {
    const navigation = useNavigation();
    const { language } = useLanguage();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [educatorData, setEducatorData] = useState(null);
    const [receivedFeedbacks, setReceivedFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTranslating, setIsTranslating] = useState(true);
    const scrollViewRef = useRef(null);
    const inputRef = useRef(null);

    // Translation states
    const [translations, setTranslations] = useState({
        primaryEducator: "Primary Educator",
        educatorDetails: "Educator Details",
        name: "Name",
        specialty: "Specialty",
        email: "Email",
        phone: "Phone",
        department: "Department",
        notAssigned: "Not Assigned",
        specialistDefault: "Special Education Specialist",
        provideFeedback: "Provide Feedback",
        rateExperience: "Rate your experience:",
        yourFeedback: "Your feedback:",
        feedbackPlaceholder: "Write your feedback here...",
        submitFeedback: "Submit Feedback",
        receivedFeedback: "Received Feedback",
        viewAllFeedback: "View All Feedback",
        noFeedbackYet: "No feedback received yet",
        errorSelectRating: "Please select a rating",
        errorEnterFeedback: "Please enter feedback message",
        errorSubmitFeedback: "Unable to submit feedback. Missing required information.",
        successFeedback: "Feedback submitted successfully",
        errorGeneric: "Unable to submit feedback. Please try again.",
        na: "N/A",
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

    useEffect(() => {
        loadEducatorData();
        loadReceivedFeedback();
    }, []);

    const loadEducatorData = async () => {
        try {
            const userData = await getUserData();
            if (userData?.educatorDetails?.primary) {
                const translatedEducator = {
                    ...userData.educatorDetails.primary,
                    name: await fetchTranslation(userData.educatorDetails.primary.name || '', language),
                    specialty: await fetchTranslation(userData.educatorDetails.primary.specialty || translations.specialistDefault, language),
                    department: await fetchTranslation(userData.educatorDetails.primary.department || '', language)
                };
                setEducatorData(translatedEducator);
            }
        } catch (error) {
            console.error("Error loading educator data:", error);
        }
    };

    const loadReceivedFeedback = async () => {
        try {
            setIsLoading(true);
            const userData = await getUserData();
            const educatorId = userData?.educatorDetails?.primary?._id;
            const studentId = userData?._id;

            if (!educatorId || !studentId) {
                console.error('Educator ID or Student ID not found:', { educatorId, studentId });
                return;
            }

            const response = await getReceivedFeedbacks(educatorId, studentId);

            if (response.success) {
                // Translate feedback content
                const translatedFeedbacks = await Promise.all(response.data.map(async (feedback) => ({
                    ...feedback,
                    content: await fetchTranslation(feedback.content || '', language)
                })));
                setReceivedFeedbacks(translatedFeedbacks || []);
            } else {
                console.log('No feedbacks found or error:', response.message);
                setReceivedFeedbacks([]);
            }
        } catch (error) {
            console.error('Error loading received feedback:', error);
            setReceivedFeedbacks([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Update loadEducatorData and loadReceivedFeedback when language changes
    useEffect(() => {
        if (educatorData) {
            loadEducatorData();
        }
        if (receivedFeedbacks.length > 0) {
            loadReceivedFeedback();
        }
    }, [language]);

    const handleRating = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleSubmitFeedback = async () => {
        try {
            if (!rating) {
                Alert.alert('Error', translations.errorSelectRating);
                return;
            }

            if (!feedback.trim()) {
                Alert.alert('Error', translations.errorEnterFeedback);
                return;
            }

            const userData = await getUserData();
            const studentId = userData?._id;
            const educatorId = userData?.educatorDetails?.primary?._id;

            if (!studentId || !educatorId) {
                Alert.alert('Error', translations.errorSubmitFeedback);
                return;
            }

            setIsLoading(true);
            // Translate feedback before sending
            const translatedFeedback = await fetchTranslation(feedback, language);
            const response = await sendFeedbackToEducator(studentId, educatorId, translatedFeedback, rating);

            if (response.success) {
                Alert.alert('Success', translations.successFeedback);
                setRating(0);
                setFeedback('');
                await loadReceivedFeedback();
            } else {
                Alert.alert('Error', response.message || translations.errorGeneric);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            Alert.alert('Error', error.response?.data?.message || translations.errorGeneric);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFocus = () => {
        // Wait for keyboard to show up before scrolling
        setTimeout(() => {
            inputRef.current?.measure((x, y, width, height, pageX, pageY) => {
                scrollViewRef.current?.scrollTo({
                    y: pageY - 100,
                    animated: true
                });
            });
        }, 100);
    };

    // Get the profile image URL
    const getProfileImageUrl = () => {
        if (educatorData?.avatar?.secure_url) {
            return educatorData.avatar.secure_url;
            console.log(educatorData.avatar.secure_url);
        }
        return DEFAULT_EDUCATOR_IMAGE;
    };

    if (isTranslating) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>{translations.loading}</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>{translations.loading}</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{translations.primaryEducator}</Text>
                <TouchableOpacity 
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('Notifications')}
                >
                    <FontAwesome name="bell" size={24} color="#001F3F" />
                </TouchableOpacity>
            </View>

            <ScrollView 
                ref={scrollViewRef}
                style={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContentContainer}
            >
                {/* Educator Profile Section */}
                <View style={styles.section}>
                    <View style={styles.imageContainer}>
                        <Image 
                            source={{ uri: getProfileImageUrl() }} 
                            style={styles.profileImage}
                            defaultSource={{ uri: DEFAULT_EDUCATOR_IMAGE }}
                        />
                    </View>

                    {/* Educator Details */}
                    <Text style={styles.sectionTitle}>{translations.educatorDetails}</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{translations.name}:</Text>
                        <Text style={styles.detailValue}>{educatorData?.name || translations.notAssigned}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{translations.specialty}:</Text>
                        <Text style={styles.detailValue}>{educatorData?.specialty || translations.specialistDefault}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{translations.email}:</Text>
                        <Text style={styles.detailValue}>{educatorData?.email || translations.na}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{translations.phone}:</Text>
                        <Text style={styles.detailValue}>{educatorData?.phone || translations.na}</Text>
                    </View>

                    <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.detailLabel}>{translations.department}:</Text>
                        <Text style={styles.detailValue}>{educatorData?.department || translations.na}</Text>
                    </View>
                </View>

                {/* Feedback Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{translations.provideFeedback}</Text>
                    
                    {/* Rating */}
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingLabel}>{translations.rateExperience}</Text>
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => handleRating(star)}
                                >
                                    <FontAwesome
                                        name={star <= rating ? "star" : "star-o"}
                                        size={30}
                                        color={star <= rating ? "#FFD700" : "#666"}
                                        style={styles.star}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Feedback Text Input */}
                    <View style={styles.feedbackContainer}>
                        <Text style={styles.feedbackLabel}>{translations.yourFeedback}</Text>
                        <TextInput
                            ref={inputRef}
                            style={styles.feedbackInput}
                            multiline
                            numberOfLines={4}
                            placeholder={translations.feedbackPlaceholder}
                            value={feedback}
                            onChangeText={setFeedback}
                            onFocus={handleFocus}
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity 
                        style={styles.submitButton}
                        onPress={handleSubmitFeedback}
                    >
                        <FontAwesome name="paper-plane" size={20} color="#FFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>{translations.submitFeedback}</Text>
                    </TouchableOpacity>
                </View>

                {/* Received Feedback Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{translations.receivedFeedback}</Text>
                    
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#4CAF50" />
                    ) : receivedFeedbacks && receivedFeedbacks.length > 0 ? (
                        <>
                            {/* Latest Feedback Card */}
                            {receivedFeedbacks.slice(0, 1).map((feedback) => (
                                <View key={feedback._id} style={styles.feedbackCard}>
                                    <View style={styles.feedbackHeader}>
                                        <Text style={styles.feedbackDate}>
                                            {new Date(feedback.createdAt).toLocaleDateString()}
                                        </Text>
                                        <View style={styles.feedbackRating}>
                                            {[...Array(parseInt(feedback.rating))].map((_, index) => (
                                                <FontAwesome
                                                    key={index}
                                                    name="star"
                                                    size={16}
                                                    color="#FFD700"
                                                    style={styles.smallStar}
                                                />
                                            ))}
                                        </View>
                                    </View>
                                    <Text style={styles.feedbackText}>
                                        "{feedback.content}"
                                    </Text>
                                    
                                </View>
                            ))}

                            {/* View All Button */}
                            <TouchableOpacity 
                                style={styles.viewAllButton}
                                onPress={() => navigation.navigate('FeedbackHistory', { 
                                    educatorId: educatorData?._id,
                                    educatorName: educatorData?.name
                                })}
                            >
                                <Text style={styles.viewAllText}>{translations.viewAllFeedback}</Text>
                                <FontAwesome name="angle-right" size={20} color="#4CAF50" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <Text style={styles.noFeedbackText}>{translations.noFeedbackYet}</Text>
                    )}
                </View>

                {/* Add padding at bottom to ensure content is visible above footer */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Footer Navigation */}
            <Navbar />
        </KeyboardAvoidingView>
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
    scrollContentContainer: {
        flexGrow: 1,
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
    ratingContainer: {
        marginBottom: 20,
    },
    ratingLabel: {
        fontSize: 16,
        color: "#333",
        marginBottom: 10,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    star: {
        marginHorizontal: 5,
    },
    feedbackContainer: {
        marginBottom: 20,
    },
    feedbackLabel: {
        fontSize: 16,
        color: "#333",
        marginBottom: 10,
    },
    feedbackInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        textAlignVertical: 'top',
        minHeight: 100,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonIcon: {
        marginRight: 10,
    },
    buttonText: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: "600",
    },
    feedbackCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    feedbackHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    feedbackDate: {
        fontSize: 14,
        color: '#666',
    },
    feedbackRating: {
        flexDirection: 'row',
    },
    smallStar: {
        marginLeft: 2,
    },
    feedbackText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
        fontStyle: 'italic',
        marginBottom: 10,
    },
    feedbackAuthor: {
        fontSize: 14,
        color: '#666',
        textAlign: 'right',
        fontWeight: '500',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginTop: 10,
    },
    viewAllText: {
        fontSize: 16,
        color: '#4CAF50',
        marginRight: 10,
        fontWeight: '600',
    },
    noFeedbackText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
        marginVertical: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600',
    },
});
