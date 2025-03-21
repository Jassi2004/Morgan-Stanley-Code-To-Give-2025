import { View, Text, ScrollView, TouchableOpacity, StyleSheet, PanResponder, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import { BarChart, Grid } from 'react-native-svg-charts';
import React, { useState, useRef } from 'react';

export default function Home() {
    const navigation = useNavigation();
    const [fontScale, setFontScale] = useState(1);
    const [controlsVisible, setControlsVisible] = useState(true);
    const pan = useRef(new Animated.ValueXY()).current;
    
    // Updated data with new categories
    const data = [
        {
            value: 85,
            label: 'Painting Skills',
            svg: { fill: '#4CAF50' }
        },
        {
            value: 78,
            label: 'Cognitive Dev.',
            svg: { fill: '#2196F3' }
        },
        {
            value: 90,
            label: 'Motor Skills',
            svg: { fill: '#9C27B0' }
        },
        {
            value: 82,
            label: 'Academics',
            svg: { fill: '#FF9800' }
        }
    ];

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
                    onPress={() => navigation.navigate('Menu')}
                >
                    <FontAwesome name="bars" size={24} color="#001F3F" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Progress Report */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { fontSize: scaledFont(18) }]}>Here is your Monthly Progress Chart</Text>
                    <View style={styles.chartContainer}>
                        <BarChart 
                            style={{ height: 200 }}
                            data={data.map(item => item.value)}
                            svg={{ fill: '#4CAF50' }}
                            contentInset={{ top: 20, bottom: 20, left: 10, right: 10 }}
                        >
                            <Grid />
                        </BarChart>
                        <View style={styles.labelContainer}>
                            {data.map((item, index) => (
                                <View key={index} style={styles.labelItem}>
                                    <View style={[styles.labelDot, { backgroundColor: item.svg.fill }]} />
                                    <Text style={[styles.labelText, { fontSize: scaledFont(12) }]}>
                                        {item.label}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <Text style={[styles.progressText, { fontSize: scaledFont(14) }]}>This was 10% better than last month. Way to go!</Text>
                    <View style={styles.analysisButtons}>
                        <TouchableOpacity style={styles.analysisButton}>
                            <Text style={[styles.buttonText, { fontSize: scaledFont(16) }]}>Check Daily Analysis</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.analysisButton}>
                            <Text style={[styles.buttonText, { fontSize: scaledFont(16) }]}>Check Weekly Analysis</Text>
                        </TouchableOpacity>
                    </View>
                </View>

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
                </View>
                
                {/* Add padding at bottom to ensure content is visible above footer */}
                <View style={{ height: 80 }} />
            </ScrollView>

            {/* Footer Navigation */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.footerTab}
                    onPress={() => navigation.navigate('Home')}
                >
                    <FontAwesome name="home" size={24} color="#001F3F" />
                    <Text style={styles.footerText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.footerTab}
                    onPress={() => navigation.navigate('Messages')}
                >
                    <FontAwesome name="comments" size={24} color="#666" />
                    <Text style={styles.footerText}>Messages</Text>
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
        marginBottom: 10,
    },
    progressText: {
        fontSize: 14,
        color: '#4CAF50',
        marginTop: 10,
        textAlign: 'center',
    },
    analysisButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
        paddingHorizontal: 10,
    },
    analysisButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        width: '45%',
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
    chartContainer: {
        marginVertical: 10,
    },
    labelContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        marginTop: 15,
    },
    labelItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 5,
    },
    labelDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    labelText: {
        color: '#666',
        fontSize: 12,
    },
});