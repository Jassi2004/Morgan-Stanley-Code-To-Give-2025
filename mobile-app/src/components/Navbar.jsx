import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Navbar() {
    const navigation = useNavigation();
    const route = useRoute();
    const currentRoute = route.name;

    const isRouteActive = (routeName) => {
        return currentRoute === routeName;
    };

    return (
        <View style={styles.footer}>
            <TouchableOpacity 
                style={styles.footerTab}
                onPress={() => navigation.navigate('Home')}
            >
                <FontAwesome 
                    name="home" 
                    size={24} 
                    color={isRouteActive('Home') ? '#001F3F' : '#666'} 
                />
                <Text style={[
                    styles.footerText, 
                    isRouteActive('Home') && styles.activeText
                ]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.footerTab}
                onPress={() => navigation.navigate('Report')}
            >
                <FontAwesome 
                    name="file-text" 
                    size={24} 
                    color={isRouteActive('Report') ? '#001F3F' : '#666'} 
                />
                <Text style={[
                    styles.footerText, 
                    isRouteActive('Report') && styles.activeText
                ]}>Report</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.footerTab}
                onPress={() => navigation.navigate('Profile')}
            >
                <FontAwesome 
                    name="user" 
                    size={24} 
                    color={isRouteActive('Profile') ? '#001F3F' : '#666'} 
                />
                <Text style={[
                    styles.footerText, 
                    isRouteActive('Profile') && styles.activeText
                ]}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.footerTab}
                onPress={() => navigation.navigate('Menu')}
            >
                <FontAwesome 
                    name="bars" 
                    size={24} 
                    color={isRouteActive('Menu') ? '#001F3F' : '#666'} 
                />
                <Text style={[
                    styles.footerText, 
                    isRouteActive('Menu') && styles.activeText
                ]}>Menu</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
    activeText: {
        color: '#001F3F',
    },
}); 