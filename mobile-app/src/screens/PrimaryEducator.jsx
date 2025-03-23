import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getUserData, sendFeedbackToEducator, getReceivedFeedbacks } from '../utils/api';
import Navbar from '../components/Navbar';

const DEFAULT_EDUCATOR_IMAGE = "https://res.cloudinary.com/dh2gwea4g/image/upload/v1710834756/educator_default_kxoxyk.png";

export default function PrimaryEducator() {
    const navigation = useNavigation();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [educatorData, setEducatorData] = useState(null);
    const [receivedFeedbacks, setReceivedFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        loadEducatorData();
        loadReceivedFeedback();
    }, []);

    const loadEducatorData = async () => {
        try {
            const userData = await getUserData();
            if (userData?.educatorDetails?.primary) {
                setEducatorData(userData.educatorDetails.primary);
                console.log("Primary Educator Data:", userData.educatorDetails.primary);
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

            if (!educatorId) {
                console.error('Educator ID not found');
                return;
            }

            const response = await getReceivedFeedbacks(educatorId);
            if (response.statusCode === 200) {
                setReceivedFeedbacks(response.data);
            }
        } catch (error) {
            console.error('Error loading received feedback:', error);
            if (error.response?.status !== 404) { // Ignore 404 errors as they just mean no feedback yet
                Alert.alert('Error', 'Unable to load feedback. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRating = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleSubmitFeedback = async () => {
        try {
            if (!rating) {
                Alert.alert('Error', 'Please select a rating');
                return;
            }

            if (!feedback.trim()) {
                Alert.alert('Error', 'Please enter feedback message');
                return;
            }

            const userData = await getUserData();
            const studentId = userData?._id;
            const educatorId = userData?.educatorDetails?.primary?._id;

            if (!studentId || !educatorId) {
                Alert.alert('Error', 'Unable to submit feedback. Missing required information.');
                return;
            }

            const response = await sendFeedbackToEducator(studentId, educatorId, feedback, rating);

            if (response.statusCode === 201) {
                Alert.alert('Success', 'Feedback submitted successfully');
                // Reset form
                setRating(0);
                setFeedback('');
                // Refresh received feedback
                loadReceivedFeedback();
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Unable to submit feedback. Please try again.'
            );
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

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Primary Educator</Text>
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
                            source={{ uri: DEFAULT_EDUCATOR_IMAGE }} 
                            style={styles.profileImage}
                        />
                    </View>

                    {/* Educator Details */}
                    <Text style={styles.sectionTitle}>Educator Details</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Name:</Text>
                        <Text style={styles.detailValue}>{educatorData?.name || 'Not Assigned'}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Specialty:</Text>
                        <Text style={styles.detailValue}>{educatorData?.specialty || 'Special Education Specialist'}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Email:</Text>
                        <Text style={styles.detailValue}>{educatorData?.email || 'N/A'}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Phone:</Text>
                        <Text style={styles.detailValue}>{educatorData?.phone || 'N/A'}</Text>
                    </View>

                    <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.detailLabel}>Department:</Text>
                        <Text style={styles.detailValue}>{educatorData?.department || 'N/A'}</Text>
                    </View>
                </View>

                {/* Feedback Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Provide Feedback</Text>
                    
                    {/* Rating */}
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingLabel}>Rate your experience:</Text>
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
                        <Text style={styles.feedbackLabel}>Your feedback:</Text>
                        <TextInput
                            ref={inputRef}
                            style={styles.feedbackInput}
                            multiline
                            numberOfLines={4}
                            placeholder="Write your feedback here..."
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
                        <Text style={styles.buttonText}>Submit Feedback</Text>
                    </TouchableOpacity>
                </View>

                {/* Received Feedback Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Received Feedback</Text>
                    
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#4CAF50" />
                    ) : receivedFeedbacks.length > 0 ? (
                        <>
                            {/* Latest Feedback Card */}
                            {receivedFeedbacks.slice(0, 1).map((feedback) => (
                                <View key={feedback._id} style={styles.feedbackCard}>
                                    <View style={styles.feedbackHeader}>
                                        <Text style={styles.feedbackDate}>
                                            {new Date(feedback.createdAt).toLocaleDateString()}
                                        </Text>
                                        <View style={styles.feedbackRating}>
                                            {[...Array(feedback.rating)].map((_, index) => (
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
                                    <Text style={styles.feedbackAuthor}>
                                        - {feedback.senderId?.firstName} {feedback.senderId?.lastName}
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
                                <Text style={styles.viewAllText}>View All Feedback</Text>
                                <FontAwesome name="angle-right" size={20} color="#4CAF50" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <Text style={styles.noFeedbackText}>No feedback received yet</Text>
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
});
