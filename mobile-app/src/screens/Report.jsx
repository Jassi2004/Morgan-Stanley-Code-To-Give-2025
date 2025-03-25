import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity,
    Animated,
    Dimensions,
    LayoutAnimation,
    Platform,
    UIManager,
    Image,
    ImageBackground
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';
import { BarChart } from "react-native-chart-kit";
import { BlurView } from 'expo-blur';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const { width } = Dimensions.get('window');

const MILESTONE_COLORS = {
    enrollment: ['#4CAF50', '#81C784'],
    progress: ['#2196F3', '#64B5F6'],
    achievement: ['#9C27B0', '#BA68C8'],
    promotion: ['#FF9800', '#FFB74D'],
    current: ['#F44336', '#E57373']
};



const SubjectCard = ({ icon, title, value }) => (
    <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.subjectCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
    >
        <FontAwesome5 name={icon} size={24} color="#4CAF50" />
        <Text style={styles.subjectTitle}>{title}</Text>
        <Text style={styles.subjectValue}>{value}</Text>
    </LinearGradient>
);

const Badge = ({ image, name }) => (
    <View style={styles.badgeContainer}>
        <Image 
            source={{ uri: image }} 
            style={styles.badgeImage}
        />
        <Text style={styles.badgeName}>{name}</Text>
    </View>
);

const SkillProgressChart = ({ skills, color }) => (
    <View style={styles.skillsContainer}>
        {skills.map((skill, index) => (
            <View key={index} style={styles.skillItem}>
                <View style={styles.skillHeader}>
                    <Text style={styles.skillName}>{skill.name}</Text>
                    <Text style={styles.skillValue}>{skill.value}%</Text>
                </View>
                <Progress.Bar 
                    progress={skill.value / 100}
                    width={null}
                    height={8}
                    color={color[0]}
                    unfilledColor="#E0E0E0"
                    borderWidth={0}
                    animated={true}
                />
            </View>
        ))}
    </View>
);

export default function Report() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('performance');
    const [activePhase, setActivePhase] = useState(null);
    const [progressAnimation] = useState(new Animated.Value(0));
    const scrollViewRef = useRef(null);

    const studentLifecycle = [
        {
            id: 1,
            phase: 'Initial Assessment',
            date: 'Jan 2023',
            type: 'enrollment',
            icon: 'clipboard-list',
            description: 'Initial evaluation of cognitive abilities and learning patterns',
            details: [
                'Communication Skills: Developing',
                'Social Interaction: Needs Support',
                'Motor Skills: Above Average'
            ],
            skills: [
                { name: 'Aptitude', value: 30 },
                { name: 'Social Skills', value: 25 },
                { name: 'Motor Skills', value: 70 }
            ]
        },
        {
            id: 2,
            phase: 'Early Intervention',
            date: 'Mar 2023',
            type: 'progress',
            icon: 'baby',
            description: 'Foundational skill development program showing promising results',
            details: [
                'Speech Therapy Progress',
                'Basic Motor Skill Improvement',
                'Social Interaction Development'
            ],
            skills: [
                { name: 'Communication', value: 45 },
                { name: 'Social Skills', value: 40 },
                { name: 'Motor Skills', value: 80 }
            ]
        },
        {
            id: 3,
            phase: 'Major Milestone',
            date: 'Jun 2023',
            type: 'achievement',
            icon: 'star',
            description: 'Significant breakthroughs in multiple development areas',
            details: [
                'Complete Sentence Formation',
                'Improved Eye Contact Duration',
                'Enhanced Emotional Control'
            ],
            skills: [
                { name: 'Communication', value: 65 },
                { name: 'Social Skills', value: 60 },
                { name: 'Motor Skills', value: 85 }
            ]
        },
        {
            id: 4,
            phase: 'Program Advancement',
            date: 'Sep 2023',
            type: 'promotion',
            icon: 'level-up-alt',
            description: 'Ready for advanced learning modules and group activities',
            details: [
                'Advanced Communication',
                'Group Activity Leadership',
                'Academic Skills Progress'
            ],
            skills: [
                { name: 'Communication', value: 80 },
                { name: 'Social Skills', value: 75 },
                { name: 'Motor Skills', value: 90 }
            ]
        },
        {
            id: 5,
            phase: 'Current Status',
            date: 'Present',
            type: 'current',
            icon: 'flag-checkered',
            description: 'Consistently exceeding expectations across all areas',
            details: [
                'Active Class Participation',
                'Peer Interaction Leadership',
                'Independent Task Completion'
            ],
            skills: [
                { name: 'Communication', value: 90 },
                { name: 'Social Skills', value: 85 },
                { name: 'Motor Skills', value: 95 }
            ]
        }
    ];

    const performanceData = {
        labels: ["Cognition", "Aptitude", "Logic", "Reasoning"],
        datasets: [{
            data: [85, 78, 92, 88]
        }]
    };

    useEffect(() => {
        startAnimation();
    }, []);

    const startAnimation = () => {
        Animated.timing(progressAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false
        }).start();
    };

    const handlePhasePress = (id, index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActivePhase(activePhase === id ? null : id);
        
        // Scroll to the pressed item
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                y: index * 150,
                animated: true
            });
        }
    };

    const renderTimelineItem = (item, index) => {
        const isActive = activePhase === item.id;
        const isLast = index === studentLifecycle.length - 1;

        return (
            <View key={item.id} style={styles.timelineItemWrapper}>
                <TouchableOpacity 
                    style={[
                        styles.timelineItem,
                        isActive && styles.timelineItemActive,
                        { transform: [{ scale: isActive ? 1.02 : 1 }] }
                    ]}
                    onPress={() => handlePhasePress(item.id, index)}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={MILESTONE_COLORS[item.type]}
                        style={styles.timelineIcon}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <FontAwesome5 name={item.icon} size={20} color="white" />
                    </LinearGradient>
                    
                    <View style={styles.timelineContent}>
                        <View style={styles.timelineHeader}>
                            <Text style={styles.timelineDate}>{item.date}</Text>
                            <Text style={styles.timelinePhase}>{item.phase}</Text>
                        </View>
                        <Text style={styles.timelineDescription}>{item.description}</Text>
                        
                        {isActive && (
                            <Animated.View 
                                style={[
                                    styles.expandedContent,
                                    { opacity: progressAnimation }
                                ]}
                            >
                                <View style={styles.detailsContainer}>
                                    {item.details.map((detail, idx) => (
                                        <View key={idx} style={styles.detailItem}>
                                            <MaterialCommunityIcons 
                                                name="checkbox-marked-circle" 
                                                size={16} 
                                                color={MILESTONE_COLORS[item.type][0]} 
                                            />
                                            <Text style={styles.detailText}>{detail}</Text>
                                        </View>
                                    ))}
                                </View>
                                
                                <SkillProgressChart 
                                    skills={item.skills} 
                                    color={MILESTONE_COLORS[item.type]} 
                                />
                            </Animated.View>
                        )}
                    </View>
                </TouchableOpacity>
                
                {!isLast && (
                    <View style={[
                        styles.timelineConnector,
                        { backgroundColor: MILESTONE_COLORS[item.type][0] }
                    ]} />
                )}
            </View>
        );
    };

    const renderPerformanceTab = () => (
        <ScrollView style={styles.tabContent}>
            <View style={styles.statsContainer}>
                <SubjectCard 
                    icon="book-reader" 
                    title="Subjects Enrolled" 
                    value="5" 
                />
                <SubjectCard 
                    icon="graduation-cap" 
                    title="Program" 
                    value="SPUHA" 
                />
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.sectionTitle}>Quarterly Learning Progress</Text>
                <BarChart
                    data={performanceData}
                    width={width - 40}
                    height={220}
                    yAxisSuffix=""
                    yAxisLabel=""
                    withInnerLines={false}
                    showValuesOnTopOfBars={true}
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                        style: {
                            borderRadius: 30,
                        },
                        barPercentage: 0.7,
                        propsForLabels: {
                            fontSize: 12
                        },
                        yLabelsOffset: -20,
                        formatYLabel: () => '',
                    }}
                    style={[styles.chart, { paddingLeft: 0, marginLeft: -20 }]}
                    fromZero={true}
                />
            </View>

            <TouchableOpacity style={styles.downloadButton}>
                <FontAwesome5 name="download" size={18} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.downloadText}>Download Report</Text>
            </TouchableOpacity>

        </ScrollView>
    );

    const renderProgressTab = () => (
        <ScrollView 
            ref={scrollViewRef}
            style={styles.tabContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.timelineContainer}>
                {studentLifecycle.map((item, index) => renderTimelineItem(item, index))}
            </View>
            <View style={{ height: 80 }} />
        </ScrollView>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#FFFFFF', '#F5F5F5']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}> </Text>
                <TouchableOpacity 
                    style={styles.notificationButton}
                    onPress={() => navigation.navigate('Notifications')}
                >
                    {/* <FontAwesome5 name="bell" size={24} color="#001F3F" /> */}
                </TouchableOpacity>
            </LinearGradient>

            <View style={styles.tabsContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'performance' && styles.activeTab]}
                    onPress={() => setActiveTab('performance')}
                >
                    <Text style={[styles.tabText, activeTab === 'performance' && styles.activeTabText]}>
                        Performance
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'progress' && styles.activeTab]}
                    onPress={() => setActiveTab('progress')}
                >
                    <Text style={[styles.tabText, activeTab === 'progress' && styles.activeTabText]}>
                        Progress
                    </Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'performance' ? renderPerformanceTab() : renderProgressTab()}

            <Navbar />
        </View>
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
        paddingTop: 45,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#001F3F',
        flex: 1,
        textAlign: 'center',
    },
    notificationButton: {
        position: 'absolute',
        right: 15,
        top: 45,
        padding: 5,
    },
    tabsContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#4CAF50',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    tabContent: {
        flex: 1,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    subjectCard: {
        width: (width - 50) / 2,
        padding: 15,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    subjectTitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
    },
    subjectValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#001F3F',
        marginTop: 4,
    },
    chartContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        margin: 20,
        marginTop: 0,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#001F3F',
        marginBottom: 15,
    },
    downloadButton: {
        flexDirection: 'row',
        backgroundColor: 'rgba(76, 175, 80, 0.75)',
        padding: 12,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 80,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    downloadText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    badgeContainer: {
        alignItems: 'center',
        marginRight: 20,
    },
    badgeImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
    },
    badgeName: {
        fontSize: 14,
        color: '#001F3F',
        fontWeight: '600',
        textAlign: 'center',
    },
    timelineContainer: {
        paddingHorizontal: 20,
    },
    timelineItemWrapper: {
        marginBottom: 25,
        alignItems: 'center',
    },
    timelineConnector: {
        width: 2,
        height: 40,
        backgroundColor: '#4CAF50',
        marginVertical: 5,
    },
    timelineItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        width: width - 40,
    },
    timelineItemActive: {
        borderWidth: 2,
        borderColor: '#4CAF50',
        transform: [{ scale: 1.02 }],
    },
    timelineIcon: {
        width: 45,
        height: 45,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    timelineContent: {
        flex: 1,
    },
    timelineHeader: {
        marginBottom: 8,
    },
    timelineDate: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        fontWeight: '600',
    },
    timelinePhase: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#001F3F',
        marginBottom: 4,
    },
    timelineDescription: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
    expandedContent: {
        marginTop: 15,
    },
    detailsContainer: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    detailText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#555',
        flex: 1,
    },
    skillsContainer: {
        marginTop: 10,
    },
    skillItem: {
        marginBottom: 12,
    },
    skillHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    skillName: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    skillValue: {
        fontSize: 12,
        color: '#444',
        fontWeight: 'bold',
    }
}); 