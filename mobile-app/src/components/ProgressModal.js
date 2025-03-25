import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, Star, TrendingUp } from 'lucide-react-native';

const ProgressModal = ({ visible, month, data, onClose }) => {
  // Default data with fallback values to prevent undefined errors
  const reportData = {
    reportDetails: {
      reportYear: data?.reportDetails?.reportYear || '2024',
      reportQuarter: data?.reportDetails?.reportQuarter || 'Q2'
    },
    programFeedback: {
      programName: data?.programFeedback?.programName || 'Shaale',
      programSkillsFeedback: data?.programFeedback?.programSkillsFeedback || [
        { skillName: 'Communication', skillScore: 85 },
        { skillName: 'Problem Solving', skillScore: 78 },
        { skillName: 'Creativity', skillScore: 90 }
      ]
    },
    feedback: {
      suggestions: data?.feedback?.suggestions || 'Keep up the great work!',
      teacherComments: data?.feedback?.teacherComments || 'Showing good progress in class.'
    },
    overallScore: data?.overallScore || 84
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={['#FFF1F3', '#FFD1DC']}
          style={styles.modalContainer}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.monthTitle}>{month} Report</Text>
            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <Award color="#FF4081" size={24} />
                <Text style={styles.statText}>{reportData.reportDetails.reportQuarter}</Text>
              </View>
              <View style={styles.statItem}>
                <Star color="#FF4081" size={24} />
                <Text style={styles.statText}>{reportData.overallScore}%</Text>
              </View>
            </View>
          </View>

          <ScrollView 
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Program Progress</Text>
              <Text style={styles.programName}>{reportData.programFeedback.programName}</Text>
              
              {reportData.programFeedback.programSkillsFeedback.map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <Text style={styles.skillName}>{skill.skillName}</Text>
                  <View style={styles.skillBarContainer}>
                    <View 
                      style={[
                        styles.skillBar, 
                        { width: `${skill.skillScore}%`, backgroundColor: getSkillColor(skill.skillScore) }
                      ]} 
                    />
                  </View>
                  <Text style={styles.skillScore}>{skill.skillScore}%</Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Teacher's Feedback</Text>
              <Text style={styles.feedbackText}>{reportData.feedback.teacherComments}</Text>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
};

// Helper function to get skill color based on score
const getSkillColor = (score) => {
  if (score < 50) return '#FF6B6B';
  if (score < 75) return '#FFD93D';
  return '#6BCB77';
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  headerContainer: {
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4081',
    textAlign: 'center',
    marginBottom: 10,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 16,
    color: '#5D4037',
  },
  contentContainer: {
    marginBottom: 15,
  },
  sectionContainer: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4081',
    marginBottom: 10,
  },
  programName: {
    fontSize: 16,
    color: '#5D4037',
    marginBottom: 10,
    textAlign: 'center',
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  skillName: {
    flex: 2,
    fontSize: 16,
    color: '#5D4037',
  },
  skillBarContainer: {
    flex: 3,
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  skillBar: {
    height: '100%',
    borderRadius: 5,
  },
  skillScore: {
    fontSize: 14,
    color: '#5D4037',
  },
  feedbackText: {
    fontSize: 16,
    color: '#5D4037',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#FF4081',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProgressModal;