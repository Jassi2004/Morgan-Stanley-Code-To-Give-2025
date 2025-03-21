import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Navbar from '../components/Navbar';

export default function PrimaryEducator() {
    const navigation = useNavigation();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const scrollViewRef = useRef(null);
    const inputRef = useRef(null);

    const handleRating = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleSubmitFeedback = () => {
        // Handle feedback submission
        console.log('Rating:', rating);
        console.log('Feedback:', feedback);
        // Reset form
        setRating(0);
        setFeedback('');
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
                            source={{ uri: "https://res.cloudinary.com/dh2gwea4g/image/upload/v1742526651/educator1_profile.jpg" }} 
                            style={styles.profileImage}
                        />
                    </View>

                    {/* Educator Details */}
                    <Text style={styles.sectionTitle}>Educator Details</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Name:</Text>
                        <Text style={styles.detailValue}>John Doe</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Email:</Text>
                        <Text style={styles.detailValue}>john.doe@educator.com</Text>
                    </View>

                    <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.detailLabel}>Phone:</Text>
                        <Text style={styles.detailValue}>+1 (555) 123-4567</Text>
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
});
