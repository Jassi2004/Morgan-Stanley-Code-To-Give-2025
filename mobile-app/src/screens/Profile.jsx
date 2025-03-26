import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Animated } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getUserData, handleLogout } from '../utils/api';
import Navbar from '../components/Navbar';
import { fetchTranslation } from '../utils/translate';
import { useLanguage } from '../context/LanguageContext';
import { staticTranslations } from '../utils/translations';
import Menu from './Menu';

const DEFAULT_PROFILE_IMAGE = "https://res.cloudinary.com/dh2gwea4g/image/upload/t_Banner 9:16/v1742526651/ishanya5_xkgnk4.webp";

export default function Profile() {
    const navigation = useNavigation();
    const { language, changeLanguage } = useLanguage();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTranslating, setIsTranslating] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [langSwitchVisible, setLangSwitchVisible] = useState(false);
    const menuAnimation = useRef(new Animated.Value(-300)).current;

    // Get static translations based on current language
    const translations = staticTranslations[language];

    const toggleMenu = () => {
        const toValue = isMenuOpen ? -300 : 0;
        Animated.spring(menuAnimation, {
            toValue,
            useNativeDriver: true,
            bounciness: 0,
        }).start();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLanguageChange = (newLang) => {
        changeLanguage(newLang);
        setLangSwitchVisible(false);
    };

    // Translate only dynamic user data
    const translateUserData = async (data) => {
        if (!data) return null;
        
        try {
            const translatedData = {
                ...data,
                firstName: await fetchTranslation(data.firstName || '', language),
                lastName: await fetchTranslation(data.lastName || '', language),
                gender: await fetchTranslation(data.gender || '', language),
                primaryDiagnosis: await fetchTranslation(data.primaryDiagnosis || '', language)
            };

            // Translate educator details if they exist
            if (data.educatorDetails) {
                translatedData.educatorDetails = {
                    primary: data.educatorDetails.primary ? {
                        ...data.educatorDetails.primary,
                        name: await fetchTranslation(data.educatorDetails.primary.name || '', language),
                        specialty: await fetchTranslation(data.educatorDetails.primary.specialty || translations.specialEducationSpecialist, language)
                    } : null,
                    secondary: data.educatorDetails.secondary ? {
                        ...data.educatorDetails.secondary,
                        name: await fetchTranslation(data.educatorDetails.secondary.name || '', language),
                        specialty: await fetchTranslation(data.educatorDetails.secondary.specialty || translations.behavioralTherapist, language)
                    } : null
                };
            }

            return translatedData;
        } catch (error) {
            console.error('Error translating user data:', error);
            return data;
        }
    };

    // Only translate user data when language changes
    useEffect(() => {
        const translateContent = async () => {
            setIsTranslating(true);
            try {
                // Only translate existing user data if available
                if (userData) {
                    const translatedUserData = await translateUserData(userData);
                    setUserData(translatedUserData);
                }
            } catch (error) {
                console.error('Error translating content:', error);
            } finally {
                setIsTranslating(false);
            }
        };

        translateContent();
    }, [language]);

    const loadUserData = async () => {
        try {
            const data = await getUserData();
            if (data) {
                const translatedData = await translateUserData(data);
                setUserData(translatedData);
            } else {
                console.log("No user data loaded");
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    const onLogout = async () => {
        try {
            await handleLogout();
            navigation.replace("Login");
        } catch (error) {
            console.error("Logout error:", error);
        }
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
                <Text style={styles.loadingText}>{translations.loading}</Text>
            </View>
        );
    }

    // Early return if no user data
    if (!userData) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{translations.error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={toggleMenu}
                >
                    <FontAwesome name="bars" size={24} color="#001F3F" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{translations.profile}</Text>
                <View style={styles.headerRight}>
                    {/* Language Switch Button */}
                    <TouchableOpacity
                        style={[styles.headerButton, styles.languageButton]}
                        onPress={() => {
                            setLangSwitchVisible(!langSwitchVisible);
                            setIsMenuOpen(false);
                        }}
                    >
                        <FontAwesome name="language" size={20} color="#001F3F" />
                        <Text style={styles.languageButtonText}>
                            {language === 'en' ? 'English' : 'हिंदी'}
                        </Text>
                    </TouchableOpacity>

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
                        style={styles.notificationButton}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <FontAwesome name="bell" size={24} color="#001F3F" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Menu Drawer */}
            <Animated.View style={[
                styles.menuDrawer,
                {
                    transform: [{ translateX: menuAnimation }]
                }
            ]}>
                <Menu onClose={toggleMenu} />
            </Animated.View>

            {/* Overlay when menu is open */}
            {isMenuOpen && (
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={toggleMenu}
                />
            )}

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
                    <Text style={styles.sectionTitle}>{translations.studentDetails}</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{translations.name}:</Text>
                        <Text style={styles.detailValue}>
                            {`${userData.firstName || ''} ${userData.lastName || ''}`}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{translations.email}:</Text>
                        <Text style={styles.detailValue}>
                            {userData.studentEmail || 'N/A'}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{translations.gender}:</Text>
                        <Text style={styles.detailValue}>
                            {userData.gender || 'N/A'}
                        </Text>
                    </View>

                    <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.detailLabel}>{translations.primaryDiagnosis}:</Text>
                        <Text style={styles.detailValue}>
                            {userData.primaryDiagnosis || 'N/A'}
                        </Text>
                    </View>
                </View>

                {/* Educators Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{translations.myEducators}</Text>
                    
                    <TouchableOpacity 
                        style={styles.educatorCard}
                        onPress={() => navigation.navigate('PrimaryEducator')}
                    >
                        <View style={styles.educatorInfo}>
                            <Text style={styles.educatorTitle}>{translations.primaryEducator}</Text>
                            <Text style={styles.educatorName}>
                                {userData?.educatorDetails?.primary?.name || translations.notAssigned}
                            </Text>
                            <Text style={styles.educatorSpecialty}>
                                {userData?.educatorDetails?.primary?.specialty || translations.specialEducationSpecialist}
                            </Text>
                        </View>
                        <FontAwesome name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.educatorCard, { borderBottomWidth: 0 }]}
                        onPress={() => navigation.navigate('SecondaryEducator')}
                    >
                        <View style={styles.educatorInfo}>
                            <Text style={styles.educatorTitle}>{translations.secondaryEducator}</Text>
                            <Text style={styles.educatorName}>
                                {userData?.educatorDetails?.secondary?.name || translations.notAssigned}
                            </Text>
                            <Text style={styles.educatorSpecialty}>
                                {userData?.educatorDetails?.secondary?.specialty || translations.behavioralTherapist}
                            </Text>
                        </View>
                        <FontAwesome name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Action Buttons Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{translations.accountSettings}</Text>
                    <TouchableOpacity style={styles.actionButton}>
                        <FontAwesome name="lock" size={20} color="#FFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>{translations.changePassword}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <FontAwesome name="edit" size={20} color="#FFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>{translations.editProfile}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.actionButton, styles.logoutButton]}
                        onPress={onLogout}
                    >
                        <FontAwesome name="sign-out" size={20} color="#FFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>{translations.logout}</Text>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingTop: 45,
    },
    menuButton: {
        padding: 5,
    },
    notificationButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#001F3F',
    },
    menuDrawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 300,
        backgroundColor: '#FFF',
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999,
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#F5F5F5",
    },
    errorText: {
        color: "#FF3B30",
        fontSize: 16,
        fontWeight: "bold",
    },
    loadingText: {
        color: "#001F3F",
        fontSize: 16,
        fontWeight: "bold",
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        padding: 5,
        marginRight: 10,
    },
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
    popup: {
        position: 'absolute',
        top: 45,
        right: 10,
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
    langSwitchPopup: {
        right: 45,
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
});
