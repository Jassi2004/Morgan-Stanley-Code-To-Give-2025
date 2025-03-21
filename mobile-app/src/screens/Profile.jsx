import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function Profile() {
    return (
        <View style={styles.container}>
            {/* Profile Picture */}
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: "https://res.cloudinary.com/dh2gwea4g/image/upload/t_Banner 9:16/v1742526651/ishanya5_xkgnk4.webp" }} 
                    style={styles.profileImage}
                />
            </View>

            {/* Student Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>Student Details</Text>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>Soumya</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>soumya@student.edu</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Gender:</Text>
                    <Text style={styles.detailValue}>Female</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Primary Diagnosis:</Text>
                    <Text style={styles.detailValue}>Autism</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Enrollment Year:</Text>
                    <Text style={styles.detailValue}>2023</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Primary Educator:</Text>
                    <Text style={styles.detailValue}>John Doe</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Secondary Educator:</Text>
                    <Text style={styles.detailValue}>Jane Smith</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Program Enrolled:</Text>
                    <Text style={styles.detailValue}>Samiti</Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Privacy Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.logoutButton]}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        paddingTop: 70, // Lowered the profile image
    },
    imageContainer: {
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
        elevation: 8, // Android shadow
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    detailsContainer: {
        width: "90%",
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        marginBottom: 20,
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#001F3F",
        marginBottom: 15,
        textAlign: "center",
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
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
    buttonContainer: {
        width: "90%",
        alignItems: "center",
    },
    button: {
        width: "100%",
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: "600",
    },
    logoutButton: {
        backgroundColor: "#FF3B30",
    },
    logoutText: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: "600",
    },
});
