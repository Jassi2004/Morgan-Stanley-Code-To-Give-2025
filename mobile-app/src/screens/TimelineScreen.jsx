import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text, ImageBackground, TouchableWithoutFeedback, Dimensions, Animated, Easing } from 'react-native';
import MonthButton from '../components/MonthButton';
import ProgressModal from '../components/ProgressModal';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TimelineScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const scrollViewRef = useRef(null);

  // Animation values
  const headerAnim = useRef(new Animated.Value(-50)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const welcomeScale = useRef(new Animated.Value(0.9)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const yearScale = useRef(new Animated.Value(0.9)).current;
  const yearOpacity = useRef(new Animated.Value(0)).current;

  // Expanded progress data including previous year
  const progressData = {
    2023: {
      'January': { 
        overall: 3.8, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4, date: '2023-01-10', notes: 'Good problem-solving skills, improving memory tasks' },
          { id: 2, title: 'Communication', score: 3.5, date: '2023-01-20', notes: 'Responds well in one-on-one sessions, needs support in groups' },
          { id: 3, title: 'Attention', score: 3, date: '2023-01-15', notes: 'Can focus for 25 minutes, still easily distracted' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2023-01-25', notes: 'Shows positive behaviors, follows classroom rules consistently' },
          { id: 5, title: 'Others', score: 4, date: '2023-01-30', notes: 'Good social interaction with peers' }
        ]
      },
      'February': { 
        overall: 4.0, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4.5, date: '2023-02-10', notes: 'Excellent pattern recognition, cognitive flexibility improving' },
          { id: 2, title: 'Communication', score: 3.5, date: '2023-02-15', notes: 'Better verbal expression, still working on non-verbal cues' },
          { id: 3, title: 'Attention', score: 3.5, date: '2023-02-12', notes: 'Focus duration increasing, responds well to timers' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2023-02-20', notes: 'Consistent positive behavior across settings' },
          { id: 5, title: 'Others', score: 4, date: '2023-02-25', notes: 'More engaged in group activities' }
        ]
      },
      'March': { 
        overall: 4.1, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4.5, date: '2023-03-08', notes: 'Strong logical reasoning, excelling in puzzle tasks' },
          { id: 2, title: 'Communication', score: 4, date: '2023-03-18', notes: 'Significant improvement in verbal communication' },
          { id: 3, title: 'Attention', score: 3.5, date: '2023-03-15', notes: 'Can maintain focus for 30 minutes now' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2023-03-20', notes: 'Very good self-regulation skills' },
          { id: 5, title: 'Others', score: 4, date: '2023-03-25', notes: 'Showing leadership qualities in group activities' }
        ]
      },
      'April': { 
        overall: 3.9, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4, date: '2023-04-12', notes: 'Good abstract thinking, working on sequential tasks' },
          { id: 2, title: 'Communication', score: 4, date: '2023-04-22', notes: 'Improved narrative skills, better turn-taking in conversations' },
          { id: 3, title: 'Attention', score: 3, date: '2023-04-18', notes: 'Some regression in attention span, possibly due to schedule changes' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2023-04-25', notes: 'Maintains positive behavior despite challenges' },
          { id: 5, title: 'Others', score: 4, date: '2023-04-28', notes: 'Adapting well to new classroom routines' }
        ]
      },
      'May': { 
        overall: 4.2, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4.5, date: '2023-05-10', notes: 'Strong analytical skills, thriving with complex tasks' },
          { id: 2, title: 'Communication', score: 4, date: '2023-05-20', notes: 'Using more complex sentences, better listening skills' },
          { id: 3, title: 'Attention', score: 3.5, date: '2023-05-15', notes: 'Improved focus, especially in preferred activities' },
          { id: 4, title: 'Behavior', score: 5, date: '2023-05-22', notes: 'Excellent behavior, helping peers with regulation' },
          { id: 5, title: 'Others', score: 4, date: '2023-05-25', notes: 'Strong participation in extracurricular activities' }
        ]
      },
      'June': { 
        overall: 4.3, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4.5, date: '2023-06-10', notes: 'Excellent final project showing high cognitive skills' },
          { id: 2, title: 'Communication', score: 4.5, date: '2023-06-20', notes: 'Great progress in communication skills this semester' },
          { id: 3, title: 'Attention', score: 4, date: '2023-06-15', notes: 'Significant improvement in sustained attention' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2023-06-25', notes: 'Consistent positive behavior throughout the term' },
          { id: 5, title: 'Others', score: 4, date: '2023-06-28', notes: 'Good end-of-year social adaptation' }
        ]
      },
      'July': { 
        overall: 0, 
        assessments: [] 
      }, // Summer break
      'August': { 
        overall: 0, 
        assessments: [] 
      }, // Summer break
      'September': { 
        overall: 3.8, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4, date: '2023-09-10', notes: 'Good return from summer, retaining concepts well' },
          { id: 2, title: 'Communication', score: 3.5, date: '2023-09-15', notes: 'Some regression in communication after break' },
          { id: 3, title: 'Attention', score: 3.5, date: '2023-09-12', notes: 'Working on rebuilding attention stamina' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2023-09-20', notes: 'Excellent behavior transition back to school' },
          { id: 5, title: 'Others', score: 3.5, date: '2023-09-25', notes: 'Readjusting to school social environment' }
        ]
      },
      'October': { 
        overall: 4.0, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4.5, date: '2023-10-10', notes: 'Excelling in new cognitive challenges' },
          { id: 2, title: 'Communication', score: 4, date: '2023-10-20', notes: 'Communication back to pre-summer levels' },
          { id: 3, title: 'Attention', score: 3.5, date: '2023-10-15', notes: 'Steady improvement in focus duration' },
          { id: 4, title: 'Behavior', score: 4, date: '2023-10-25', notes: 'Good behavioral consistency' },
          { id: 5, title: 'Others', score: 4, date: '2023-10-28', notes: 'Engaging well with peers in collaborative work' }
        ]
      },
      'November': { 
        overall: 4.1, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4.5, date: '2023-11-10', notes: 'Strong performance in mid-term assessments' },
          { id: 2, title: 'Communication', score: 4, date: '2023-11-15', notes: 'Excellent presentations, good questioning skills' },
          { id: 3, title: 'Attention', score: 3.5, date: '2023-11-12', notes: 'Consistent attention in most classroom settings' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2023-11-20', notes: 'Positive behavior even during challenging units' },
          { id: 5, title: 'Others', score: 4, date: '2023-11-25', notes: 'Contributing well to class discussions' }
        ]
      },
      'December': { 
        overall: 4.2, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4.5, date: '2023-12-10', notes: 'Excellent end-of-term cognitive assessment' },
          { id: 2, title: 'Communication', score: 4, date: '2023-12-15', notes: 'Strong verbal and written communication skills' },
          { id: 3, title: 'Attention', score: 4, date: '2023-12-12', notes: 'Improved attention despite holiday excitement' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2023-12-20', notes: 'Maintaining excellent behavior standards' },
          { id: 5, title: 'Others', score: 4, date: '2023-12-22', notes: 'Great participation in holiday activities' }
        ]
      },
    },
    2024: {
      'January': { 
        overall: 4.0, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4.5, date: '2024-01-10', notes: 'Strong start to new year, excellent cognitive flexibility' },
          { id: 2, title: 'Communication', score: 4, date: '2024-01-20', notes: 'Better expressive language, still working on receptive' },
          { id: 3, title: 'Attention', score: 3.5, date: '2024-01-15', notes: 'Can focus for longer periods with fewer breaks' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2024-01-25', notes: 'Excellent self-regulation, good transition skills' },
          { id: 5, title: 'Others', score: 3.5, date: '2024-01-30', notes: 'Forming new peer relationships well' }
        ]
      },
      'February': { 
        overall: 4.1, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4.5, date: '2024-02-10', notes: 'Excellent critical thinking in new units' },
          { id: 2, title: 'Communication', score: 4, date: '2024-02-15', notes: 'Good progress in conversation skills' },
          { id: 3, title: 'Attention', score: 3.5, date: '2024-02-12', notes: 'Continues to show improvement in sustained attention' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2024-02-20', notes: 'Very good emotional regulation during challenges' },
          { id: 5, title: 'Others', score: 4, date: '2024-02-25', notes: 'Showing interest in helping younger students' }
        ]
      },
      'March': { 
        overall: 4.2, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4.5, date: '2024-03-08', notes: 'High performance in analytical thinking tasks' },
          { id: 2, title: 'Communication', score: 4, date: '2024-03-18', notes: 'Excellent presentation on self-chosen topic' },
          { id: 3, title: 'Attention', score: 4, date: '2024-03-15', notes: 'New strategies for attention management working well' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2024-03-20', notes: 'Consistently positive behavior in all settings' },
          { id: 5, title: 'Others', score: 4, date: '2024-03-25', notes: 'Taking on more responsibilities in class' }
        ]
      },
      'April': { 
        overall: 4.3, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4.5, date: '2024-04-12', notes: 'Excelling in complex problem-solving activities' },
          { id: 2, title: 'Communication', score: 4.5, date: '2024-04-22', notes: 'Great improvement in group discussion skills' },
          { id: 3, title: 'Attention', score: 4, date: '2024-04-18', notes: 'Good focus even during high-energy activities' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2024-04-25', notes: 'Excellent behavior, helping peers with regulation' },
          { id: 5, title: 'Others', score: 4, date: '2024-04-28', notes: 'Showing leadership in collaborative projects' }
        ]
      },
      'May': { 
        overall: 4.4, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 5, date: '2024-05-10', notes: 'Outstanding performance in final cognitive assessment' },
          { id: 2, title: 'Communication', score: 4.5, date: '2024-05-20', notes: 'Excellent communication across all contexts' },
          { id: 3, title: 'Attention', score: 4, date: '2024-05-15', notes: 'Very good attention management, using tools independently' },
          { id: 4, title: 'Behavior', score: 5, date: '2024-05-22', notes: 'Role model behavior for other students' },
          { id: 5, title: 'Others', score: 3.5, date: '2024-05-25', notes: 'Some challenges with end-of-year transitions' }
        ]
      },
      'June': { 
        overall: 4.5, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 5, date: '2024-06-10', notes: 'Exceptional year-end project showing cognitive growth' },
          { id: 2, title: 'Communication', score: 4.5, date: '2024-06-20', notes: 'Significant progress in all communication areas' },
          { id: 3, title: 'Attention', score: 4, date: '2024-06-15', notes: 'Consistent attention throughout the day' },
          { id: 4, title: 'Behavior', score: 5, date: '2024-06-25', notes: 'Exemplary behavior throughout the school year' },
          { id: 5, title: 'Others', score: 4, date: '2024-06-28', notes: 'Well prepared for next academic level' }
        ]
      },
      'July': { 
        overall: 0, 
        assessments: [] 
      }, // Summer break
      'August': { 
        overall: 0, 
        assessments: [] 
      }, // Summer break
      'September': { 
        overall: 4.1, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4.5, date: '2024-09-10', notes: 'Strong cognitive retention over summer break' },
          { id: 2, title: 'Communication', score: 4, date: '2024-09-15', notes: 'Good communication skills maintained' },
          { id: 3, title: 'Attention', score: 3.5, date: '2024-09-12', notes: 'Reestablishing attention routines after break' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2024-09-20', notes: 'Excellent behavior transition to new grade' },
          { id: 5, title: 'Others', score: 4, date: '2024-09-25', notes: 'Adapting well to new classroom structure' }
        ]
      },
      'October': { 
        overall: 4.2, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4.5, date: '2024-10-10', notes: 'Excellent performance in first unit assessments' },
          { id: 2, title: 'Communication', score: 4, date: '2024-10-20', notes: 'Strong communication with new peer group' },
          { id: 3, title: 'Attention', score: 4, date: '2024-10-15', notes: 'Good focus in new, more demanding curriculum' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2024-10-25', notes: 'Very good self-regulation in challenging activities' },
          { id: 5, title: 'Others', score: 4, date: '2024-10-28', notes: 'Contributing positively to classroom community' }
        ]
      },
      'November': { 
        overall: 4.3, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4.5, date: '2024-11-10', notes: 'Excellent mid-term assessment results' },
          { id: 2, title: 'Communication', score: 4.5, date: '2024-11-15', notes: 'Great progress in presentation skills' },
          { id: 3, title: 'Attention', score: 4, date: '2024-11-12', notes: 'Good sustained attention even during complex tasks' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2024-11-20', notes: 'Consistently positive behavior across all settings' },
          { id: 5, title: 'Others', score: 4, date: '2024-11-25', notes: 'Shows excellent teamwork skills' }
        ]
      },
      'December': { 
        overall: 4.4, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 5, date: '2024-12-10', notes: 'Outstanding end-of-term assessment performance' },
          { id: 2, title: 'Communication', score: 4.5, date: '2024-12-15', notes: 'Excellent verbal and written expression' },
          { id: 3, title: 'Attention', score: 4, date: '2024-12-12', notes: 'Great focus despite holiday activities' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2024-12-20', notes: 'Excellent behavior throughout the term' },
          { id: 5, title: 'Others', score: 4, date: '2024-12-22', notes: 'Great participation in all school events' }
        ]
      },
    },
    2025: {
      'January': { 
        overall: 4.3, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 4.5, date: '2025-01-10', notes: 'Excellent start to the new year, mastering new concepts quickly' },
          { id: 2, title: 'Communication', score: 4.5, date: '2025-01-20', notes: 'Great communication skills in new project-based learning' },
          { id: 3, title: 'Attention', score: 4, date: '2025-01-15', notes: 'Very good focus with minimal prompting needed' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2025-01-25', notes: 'Excellent self-management in all contexts' },
          { id: 5, title: 'Others', score: 4, date: '2025-01-30', notes: 'Taking on mentor role with younger students' }
        ]
      },
      'February': { 
        overall: 4.4, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 5, date: '2025-02-10', notes: 'Outstanding problem-solving in STEM project' },
          { id: 2, title: 'Communication', score: 4.5, date: '2025-02-15', notes: 'Excellent debate participation and persuasive skills' },
          { id: 3, title: 'Attention', score: 4, date: '2025-02-12', notes: 'Consistent attention span across all subjects' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2025-02-20', notes: 'Very good emotional regulation during challenging work' },
          { id: 5, title: 'Others', score: 4, date: '2025-02-25', notes: 'Shows great organization and planning skills' }
        ]
      },
      'March': { 
        overall: 4.5, 
        assessments: [
          { id: 1, title: 'Cognitive', score: 5, date: '2025-03-08', notes: 'Exceptional analytical thinking in research project' },
          { id: 2, title: 'Communication', score: 4.5, date: '2025-03-18', notes: 'Outstanding presentation to school assembly' },
          { id: 3, title: 'Attention', score: 4.5, date: '2025-03-15', notes: 'Excellent task persistence even with distractions' },
          { id: 4, title: 'Behavior', score: 4.5, date: '2025-03-20', notes: 'Consistent positive behavior in all environments' },
          { id: 5, title: 'Others', score: 4, date: '2025-03-25', notes: 'Taking initiative in community service projects' }
        ]
      },
      // Other months can be added as they progress
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  // Determine which months are active based on current date
  const activeMonths = useMemo(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-based index

    // Function to check if a month is active
    const isMonthActive = (monthIndex, year) => {
      if (year < currentYear) return true; // All months in previous years are active
      if (year > currentYear) return false; // Future years are inactive
      return monthIndex <= currentMonth; // In current year, only months up to current month
    };

    // Create an object mapping months to their active status
    const activeMonthsObj = {};
    
    // Add current and previous years
    [currentYear, currentYear - 1, currentYear - 2].forEach(year => {
      activeMonthsObj[year] = months.reduce((acc, month, index) => {
        acc[month] = {
          active: isMonthActive(index, year),
          year: year
        };
        return acc;
      }, {});
    });

    return activeMonthsObj;
  }, []);

  useEffect(() => {
    // Get current date details
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-based index
  
    // Find index of current month in the selected year
    const yearIndex = Object.keys(progressData).indexOf(currentYear.toString());
    if (yearIndex === -1) return; // Year not found in progressData
  
    // Calculate scroll position based on year and month
    setTimeout(() => {
      if (scrollViewRef.current) {
        const monthIndex = months.indexOf(Object.keys(progressData[currentYear])[currentMonth]);
        if (monthIndex !== -1) {
          scrollViewRef.current.scrollTo({
            y: (yearIndex * 12 + monthIndex) * 160, // Adjusted for year & month
            animated: true,
          });
        }
      }
    }, 1000); // Small delay to ensure layout is ready
  }, []);
  

  useEffect(() => {
    // Animate header
    Animated.parallel([
      Animated.spring(headerAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 15,
      }),
      Animated.spring(headerOpacity, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
      }),
    ]).start();

    // Animate welcome overlay if visible
    if (welcomeVisible) {
      Animated.parallel([
        Animated.spring(welcomeScale, {
          toValue: 1,
          useNativeDriver: true,
          damping: 15,
        }),
        Animated.spring(welcomeOpacity, {
          toValue: 1,
          useNativeDriver: true,
          damping: 15,
        }),
      ]).start();
    }
  }, []);

  const handleWelcomeDismiss = () => {
    Animated.parallel([
      Animated.timing(welcomeScale, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(welcomeOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setWelcomeVisible(false);
    });
  };

  // Enhanced month press handler with animations
  const handleMonthPress = (month) => {
    if (welcomeVisible) {
      setWelcomeVisible(false);
    }

    const currentDate = new Date();
    const years = [currentDate.getFullYear(), currentDate.getFullYear() - 1, currentDate.getFullYear() - 2];
    const validYear = years.find(year => 
      progressData[year] && progressData[year][month]
    );

    if (validYear && activeMonths[validYear][month].active) {
      setCurrentYear(validYear);
      setSelectedMonth(month);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Render years in descending order
  const yearsToRender = [currentYear - 2, currentYear - 1, currentYear]
    .filter(year => progressData[year]);

  // Welcome overlay
  const WelcomeOverlay = () => (
    <Animated.View 
      style={[
        styles.welcomeOverlay,
        {
          opacity: welcomeOpacity,
        }
      ]}
    >
      <TouchableWithoutFeedback onPress={handleWelcomeDismiss}>
        <Animated.View 
          style={[
            styles.welcomeContent,
            {
              transform: [{ scale: welcomeScale }],
            }
          ]}
        >
          <Text style={styles.welcomeTitle}>Welcome to Your Academic Journey!</Text>
          <Text style={styles.welcomeSubtitle}>Tap anywhere to explore your progress</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );

  // Header
  const Header = () => (
    <Animated.View 
      style={[
        styles.header,
        {
          transform: [{ translateY: headerAnim }],
          opacity: headerOpacity,
        }
      ]}
    >
      <Text style={styles.headerTitle}>Student Timeline</Text>
      <Text style={styles.headerSubtitle}>View your progress by month</Text>
    </Animated.View>
  );

  // Year container
  const YearContainer = ({ year, children, index }) => {
    useEffect(() => {
      const delay = index * 200;
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.spring(yearScale, {
            toValue: 1,
            useNativeDriver: true,
            damping: 15,
          }),
          Animated.spring(yearOpacity, {
            toValue: 1,
            useNativeDriver: true,
            damping: 15,
          }),
        ]),
      ]).start();
    }, []);

    return (
      <Animated.View 
        style={[
          styles.yearContainer,
          {
            transform: [{ scale: yearScale }],
            opacity: yearOpacity,
          }
        ]}
      >
        <Text style={styles.yearTitle}>{year} Academic Year</Text>
        {children}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        source={require('../../assets/bgApp.jpg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.7)', 'rgba(119, 119, 119, 0.9)']}
          style={StyleSheet.absoluteFillObject}
        />
        
        {welcomeVisible && <WelcomeOverlay />}
        <Header />
        
        <View style={styles.timelineContainer}>
          <ScrollView 
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={160}
            snapToAlignment="center"
          >
            {yearsToRender.map((year, yearIndex) => (
              <YearContainer key={year} year={year} index={yearIndex}>
                {months.map((month, index) => {
                  let horizontalOffset = 0;
                  const quarterSize = Math.ceil(months.length / 4);
                  
                  if (index < quarterSize) {
                    horizontalOffset = -60 * (quarterSize - index);
                  } else if (index < quarterSize * 2) {
                    horizontalOffset = 60 * (index - quarterSize);
                  } else if (index < quarterSize * 3) {
                    horizontalOffset = -60 * (index - 2 * quarterSize + 1);
                  } else {
                    horizontalOffset = -60 * (4 * quarterSize - index);
                  }
                  
                  return (
                    <View 
                      key={month}
                      style={[
                        styles.monthButtonContainer,
                        {
                          marginLeft: horizontalOffset,
                          opacity: activeMonths[year][month].active ? 1 : 0.3
                        }
                      ]}
                    >
                      <MonthButton 
                        month={month} 
                        onPress={handleMonthPress} 
                        disabled={!activeMonths[year][month].active}
                        isActive={activeMonths[year][month].active}
                      />
                    </View>
                  );
                })}
              </YearContainer>
            ))}
          </ScrollView>
        </View>
        
        <ProgressModal 
          visible={modalVisible} 
          month={selectedMonth} 
          data={selectedMonth ? progressData[currentYear][selectedMonth] : null}
          onClose={closeModal} 
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  welcomeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10,
  },
  welcomeContent: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(187, 222, 251, 0.8)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#1976D2',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  timelineContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  yearContainer: {
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  yearTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1565C0',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
  monthButtonContainer: {
    alignSelf: 'center',
    marginVertical: 5,
  },
});

export default TimelineScreen;