import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { handleSignup } from '../utils/api';
import { fetchTranslation } from '../utils/translate';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

const SignUp = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Translation states
  const [translations, setTranslations] = useState({
    title: "Sign Up",
    basicInfo: "Basic Information",
    medicalInfo: "Medical Information",
    guardianInfo: "Guardian Information",
    firstName: "First Name",
    lastName: "Last Name",
    studentEmail: "Student Email",
    password: "Password",
    gender: "Select Gender",
    dateOfBirth: "Date of Birth",
    primaryDiagnosis: "Primary Diagnosis",
    allergies: "Allergies (if any)",
    medicalHistory: "Medical History",
    deviceAccess: "Device Access",
    guardianDetails: "Guardian Details",
    guardianContact: "Guardian Contact Number",
    parentEmail: "Parent Email",
    address: "Address",
    transportRequired: "Transport Required?",
    yes: "Yes",
    no: "No",
    next: "Next",
    back: "Back",
    submit: "Submit",
    profileSubmitted: "Profile Submitted!",
    submissionMessage: "Your profile has been submitted for approval. Further information would be sent via email.",
    goToLogin: "Go to Login",
  });

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentEmail: '',
    password: '',
    gender: '',
    dateOfBirth: new Date(),
    primaryDiagnosis: '',
    guardianDetails: '',
    guardianContact: '',
    allergies: '',
    transportRequired: false,
    address: '',
    parentEmail: '',
    medicalHistory: '',
    deviceAccess: '',
  });

  // Dropdown states
  const [genderOpen, setGenderOpen] = useState(false);
  const [diagnosisOpen, setDiagnosisOpen] = useState(false);
  const [deviceOpen, setDeviceOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Gender options with translations
  const [genderOptions, setGenderOptions] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ]);

  // Diagnosis options with translations
  const [diagnosisOptions, setDiagnosisOptions] = useState([
    { label: 'Autism', value: 'Autism' },
    { label: 'ADHD', value: 'ADHD' },
    { label: 'Cerebral Palsy', value: 'Cerebral Palsy' },
    { label: 'Down Syndrome', value: 'Down Syndrome' },
    { label: 'Others', value: 'Others' },
  ]);

  // Device options with translations
  const [deviceOptions, setDeviceOptions] = useState([
    { label: 'Tablet', value: 'tablet' },
    { label: 'Laptop', value: 'laptop' },
    { label: 'Smartphone', value: 'smartphone' },
    { label: 'Hearing Aid', value: 'hearing_aid' },
    { label: 'Braille Device', value: 'braille_device' },
  ]);

  // Fetch translations when language changes
  useEffect(() => {
    const translateContent = async () => {
      const translatedContent = {};
      for (const [key, value] of Object.entries(translations)) {
        translatedContent[key] = await fetchTranslation(value, language);
      }
      setTranslations(translatedContent);

      // Translate gender options
      const translatedGenderOptions = await Promise.all(
        genderOptions.map(async (option) => ({
          ...option,
          label: await fetchTranslation(option.label, language),
        }))
      );
      setGenderOptions(translatedGenderOptions);

      // Translate diagnosis options
      const translatedDiagnosisOptions = await Promise.all(
        diagnosisOptions.map(async (option) => ({
          ...option,
          label: await fetchTranslation(option.label, language),
        }))
      );
      setDiagnosisOptions(translatedDiagnosisOptions);

      // Translate device options
      const translatedDeviceOptions = await Promise.all(
        deviceOptions.map(async (option) => ({
          ...option,
          label: await fetchTranslation(option.label, language),
        }))
      );
      setDeviceOptions(translatedDeviceOptions);
    };

    translateContent();
  }, [language]);

  const formSections = [
    {
      title: translations.basicInfo,
      fields: (
        <View style={styles.sectionContent}>
          <TextInput
            style={styles.input}
            placeholder={translations.firstName}
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder={translations.lastName}
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder={translations.studentEmail}
            keyboardType="email-address"
            value={formData.studentEmail}
            onChangeText={(text) => setFormData({ ...formData, studentEmail: text })}
          />
          <TextInput
            style={styles.input}
            placeholder={translations.password}
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />
          <DropDownPicker
            open={genderOpen}
            value={formData.gender}
            items={genderOptions}
            setOpen={setGenderOpen}
            setValue={(callback) => {
              setFormData({ ...formData, gender: callback(formData.gender) });
            }}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            placeholder={translations.gender}
          />
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {formData.dateOfBirth.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.dateOfBirth}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setFormData({ ...formData, dateOfBirth: selectedDate });
                }
              }}
            />
          )}
        </View>
      ),
    },
    {
      title: translations.medicalInfo,
      fields: (
        <View style={styles.sectionContent}>
          <DropDownPicker
            open={diagnosisOpen}
            value={formData.primaryDiagnosis}
            items={diagnosisOptions}
            setOpen={setDiagnosisOpen}
            setValue={(callback) => {
              setFormData({ ...formData, primaryDiagnosis: callback(formData.primaryDiagnosis) });
            }}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            placeholder={translations.primaryDiagnosis}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={translations.allergies}
            multiline
            numberOfLines={3}
            value={formData.allergies}
            onChangeText={(text) => setFormData({ ...formData, allergies: text })}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={translations.medicalHistory}
            multiline
            numberOfLines={3}
            value={formData.medicalHistory}
            onChangeText={(text) => setFormData({ ...formData, medicalHistory: text })}
          />
          <DropDownPicker
            open={deviceOpen}
            value={formData.deviceAccess}
            items={deviceOptions}
            setOpen={setDeviceOpen}
            setValue={(callback) => {
              setFormData({ ...formData, deviceAccess: callback(formData.deviceAccess) });
            }}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            placeholder={translations.deviceAccess}
          />
        </View>
      ),
    },
    {
      title: translations.guardianInfo,
      fields: (
        <View style={styles.sectionContent}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={translations.guardianDetails}
            multiline
            numberOfLines={3}
            value={formData.guardianDetails}
            onChangeText={(text) => setFormData({ ...formData, guardianDetails: text })}
          />
          <TextInput
            style={styles.input}
            placeholder={translations.guardianContact}
            keyboardType="phone-pad"
            value={formData.guardianContact}
            onChangeText={(text) => setFormData({ ...formData, guardianContact: text })}
          />
          <TextInput
            style={styles.input}
            placeholder={translations.parentEmail}
            keyboardType="email-address"
            value={formData.parentEmail}
            onChangeText={(text) => setFormData({ ...formData, parentEmail: text })}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={translations.address}
            multiline
            numberOfLines={3}
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
          />
          <View style={styles.transportContainer}>
            <Text style={styles.transportLabel}>{translations.transportRequired}</Text>
            <TouchableOpacity
              style={[
                styles.transportButton,
                formData.transportRequired && styles.transportButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, transportRequired: !formData.transportRequired })}
            >
              <Text style={[
                styles.transportButtonText,
                formData.transportRequired && styles.transportButtonTextActive,
              ]}>
                {formData.transportRequired ? translations.yes : translations.no}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ),
    },
  ];

  const validateForm = () => {
    // Basic validation
    if (!formData.firstName.trim()) return "First name is required";
    if (!formData.lastName.trim()) return "Last name is required";
    if (!formData.studentEmail.trim()) return "Student email is required";
    if (!formData.password.trim()) return "Password is required";
    if (formData.password.length < 8) return "Password must be at least 8 characters";
    if (!formData.gender) return "Gender is required";
    if (!formData.primaryDiagnosis) return "Primary diagnosis is required";
    if (!formData.guardianDetails.trim()) return "Guardian details are required";
    if (!formData.guardianContact.trim()) return "Guardian contact is required";
    if (!formData.parentEmail.trim()) return "Parent email is required";
    if (!formData.address.trim()) return "Address is required";
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.studentEmail)) return "Invalid student email format";
    if (!emailRegex.test(formData.parentEmail)) return "Invalid parent email format";
    
    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.guardianContact)) return "Invalid contact number";
    
    return null;
  };

  const handleNext = async () => {
    if (currentStep < formSections.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({
        x: width * (currentStep + 1),
        animated: true,
      });
    } else {
      // Form submission
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        setTimeout(() => setError(''), 3000);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const response = await handleSignup(formData);
        if (response.success) {
          setShowSuccess(true);
        } else {
          setError(response.message || 'Registration failed. Please try again.');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
        console.error('Signup error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({
        x: width * (currentStep - 1),
        animated: true,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{translations.title}</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>{formSections[currentStep].title}</Text>
          
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
          
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            style={styles.scrollView}
          >
            {formSections.map((section, index) => (
              <View key={index} style={styles.page}>
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  {section.fields}
                </ScrollView>
              </View>
            ))}
          </ScrollView>

          <View style={styles.bottomContainer}>
            <View style={styles.dotsContainer}>
              {formSections.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentStep === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>

            <View style={styles.buttonContainer}>
              {currentStep > 0 && (
                <TouchableOpacity
                  style={[styles.button, styles.backBtn]}
                  onPress={handleBack}
                  disabled={isLoading}
                >
                  <Text style={[styles.buttonText, { color: '#666' }]}>{translations.back}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.nextBtn]}
                onPress={handleNext}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>
                    {currentStep === formSections.length - 1 ? translations.submit : translations.next}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal
          visible={showSuccess}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSuccess(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.successIconContainer}>
                <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
              </View>
              <Text style={styles.successTitle}>{translations.profileSubmitted}</Text>
              <Text style={styles.successMessage}>
                {translations.submissionMessage}
              </Text>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.replace('Login')}
              >
                <Text style={styles.loginButtonText}>{translations.goToLogin}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width: width,
    paddingHorizontal: 20,
  },
  sectionContent: {
    gap: 15,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    borderColor: '#E0E0E0',
    marginTop: 5,
  },
  dropdownContainer: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    borderRadius: 10,
  },
  dateButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  transportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  transportLabel: {
    fontSize: 16,
    color: '#333',
  },
  transportButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  transportButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  transportButtonText: {
    fontSize: 16,
    color: '#666',
  },
  transportButtonTextActive: {
    color: '#FFF',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#4CAF50',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    backgroundColor: '#F5F5F5',
  },
  nextBtn: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bottomContainer: {
    backgroundColor: '#FFF',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
});

export default SignUp;
