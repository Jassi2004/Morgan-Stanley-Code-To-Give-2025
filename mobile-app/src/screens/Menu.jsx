import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome, MaterialIcons, Ionicons, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Menu() {
    const navigation = useNavigation();

    const MenuItem = ({ icon, title, screen }) => (
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate(screen)}>
            <View style={styles.menuLeft}>
                {icon}
                <Text style={styles.menuText}>{title}</Text>
            </View>
            <Entypo name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
            {/* Attendance */}
            <Text style={styles.sectionTitle}>Attendance</Text>
            <MenuItem 
                icon={<MaterialIcons name="assignment" size={24} color="#001F3F" />} 
                title="Subject-wise Attendance" 
                screen="Attendance"
            />

            {/* Program Progress */}
            <Text style={styles.sectionTitle}>Program</Text>
            <MenuItem 
                icon={<Ionicons name="stats-chart" size={24} color="#001F3F" />} 
                title="Program Progress" 
                screen="ProgramProgress"
            />

            {/* Faculty Members */}
            <Text style={styles.sectionTitle}>Faculty</Text>
            <MenuItem 
                icon={<FontAwesome name="user" size={24} color="#001F3F" />} 
                title="Assigned Faculty" 
                screen="Faculty"
            />

            {/* Subjects & Grades */}
            <Text style={styles.sectionTitle}>Academics</Text>
            <MenuItem 
                icon={<FontAwesome name="book" size={24} color="#001F3F" />} 
                title="Subjects" 
                screen="Subjects"
            />
            <MenuItem 
                icon={<MaterialIcons name="grade" size={24} color="#001F3F" />} 
                title="Subject Grades" 
                screen="Grades"
            />

            {/* Reports */}
            <Text style={styles.sectionTitle}>Reports</Text>
            <MenuItem 
                icon={<FontAwesome name="file-text" size={24} color="#001F3F" />} 
                title="Quarterly Report" 
                screen="QuarterlyReport"
            />
            <MenuItem 
                icon={<FontAwesome name="calendar" size={24} color="#001F3F" />} 
                title="Weekly Report" 
                screen="WeeklyReport"
            />

            {/* Events */}
            <Text style={styles.sectionTitle}>Events</Text>
            <MenuItem 
                icon={<MaterialIcons name="event" size={24} color="#001F3F" />} 
                title="Upcoming Events" 
                screen="Events"
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 50,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#001F3F",
        marginTop: 20,
        marginBottom: 10,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    menuLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    menuText: {
        fontSize: 16,
        marginLeft: 10,
        color: "#333",
    },
});
