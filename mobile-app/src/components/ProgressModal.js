import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, Star, TrendingUp } from 'lucide-react-native';

const ProgressModal = ({ visible, month, data, onClose }) => {
  if (!data) {
    return null;
  }

  const { overall, assessments } = data;

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
                <Star color="#FF4081" size={24} />
                <Text style={styles.statText}>Overall: {overall}/5</Text>
              </View>
            </View>
          </View>

          <ScrollView 
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Development Assessment</Text>
              
              {assessments && assessments.map((assessment, index) => (
                <View key={index} style={styles.assessmentItem}>
                  <View style={styles.assessmentHeader}>
                    <Text style={styles.assessmentTitle}>{assessment.title}</Text>
                    <View style={styles.scoreContainer}>
                      <Text style={[
                        styles.assessmentScore, 
                        { color: getScoreColor(assessment.score) }
                      ]}>
                        {assessment.score}/5
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.skillBarContainer}>
                    <View 
                      style={[
                        styles.skillBar, 
                        { 
                          width: `${(assessment.score / 5) * 100}%`, 
                          backgroundColor: getScoreColor(assessment.score) 
                        }
                      ]} 
                    />
                  </View>
                  
                  <Text style={styles.assessmentNotes}>{assessment.notes}</Text>
                </View>
              ))}
            </View>

            {assessments && assessments.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Teacher's Notes</Text>
                <Text style={styles.feedbackText}>
                  Overall, {month}'s assessment shows {getOverallFeedback(overall)} progress in the key developmental areas. 
                  Notable strengths are in {getStrengthAreas(assessments)} with opportunities for growth in {getGrowthAreas(assessments)}.
                </Text>
              </View>
            )}
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

// Helper function to get score color based on score out of 5
const getScoreColor = (score) => {
  if (score < 2.5) return '#FF6B6B';
  if (score < 3.5) return '#FFD93D';
  if (score < 4.5) return '#4CAF50';
  return '#1E88E5';
};

// Helper function to determine overall feedback
const getOverallFeedback = (overall) => {
  if (overall < 2.5) return 'concerning';
  if (overall < 3.5) return 'satisfactory';
  if (overall < 4.5) return 'good';
  return 'excellent';
};

// Helper function to find strengths
const getStrengthAreas = (assessments) => {
  const sortedAssessments = [...assessments].sort((a, b) => b.score - a.score);
  const topTwo = sortedAssessments.slice(0, 2);
  return topTwo.map(a => a.title).join(' and ');
};

// Helper function to find growth areas
const getGrowthAreas = (assessments) => {
  const sortedAssessments = [...assessments].sort((a, b) => a.score - b.score);
  const lowestTwo = sortedAssessments.slice(0, 2);
  return lowestTwo.map(a => a.title).join(' and ');
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
    fontSize: 18,
    fontWeight: 'bold',
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
    marginBottom: 15,
    textAlign: 'center',
  },
  assessmentItem: {
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    padding: 12,
  },
  assessmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assessmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  scoreContainer: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  assessmentScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  skillBarContainer: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  skillBar: {
    height: '100%',
    borderRadius: 5,
  },
  assessmentNotes: {
    fontSize: 14,
    color: '#5D4037',
    fontStyle: 'italic',
  },
  feedbackText: {
    fontSize: 16,
    color: '#5D4037',
    lineHeight: 22,
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