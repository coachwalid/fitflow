import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Picker,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useUserProfileStore } from '../stores/useUserProfileStore';
import { useAuth } from '../hooks/useAuth';
import { calculateMaintenanceNeeds, optimizeMacronutrientDistribution } from '../utils/nutritionCalculator';

interface OnboardingData {
  prenom: string;
  age: string;
  sexe: string;
  poids: string;
  taille: string;
  activitePhysique: string;
  typeTravail: string;
  qualiteSommeil: string;
  medicaments: string;
  estimatedBodyFat: string;
  objectif: string;
}

const initialData: OnboardingData = {
  prenom: '',
  age: '',
  sexe: '',
  poids: '',
  taille: '',
  activitePhysique: '',
  typeTravail: '',
  qualiteSommeil: '',
  medicaments: '',
  estimatedBodyFat: '',
  objectif: ''
};

export default function OnboardingScreen() {
  const [formData, setFormData] = useState<OnboardingData>(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();
  
  const { updateUserProfile, profile } = useUserProfileStore();
  const { user, saveUserProfile } = useAuth();

  // Check if user has complete profile and redirect
  useEffect(() => {
    if (profile && isProfileComplete(profile)) {
      navigation.navigate('Meals' as never);
    }
  }, [profile, navigation]);

  const steps = [
    { title: 'Personal Info', fields: ['prenom', 'age', 'sexe'] },
    { title: 'Physical Stats', fields: ['poids', 'taille'] },
    { title: 'Body Composition', fields: ['estimatedBodyFat'] },
    { title: 'Lifestyle', fields: ['activitePhysique', 'typeTravail'] },
    { title: 'Health & Wellness', fields: ['qualiteSommeil', 'medicaments'] },
    { title: 'Your Goal', fields: ['objectif'] }
  ];

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'prenom':
        return value.trim() === '' ? 'Name is required' : '';
      case 'age':
        const age = parseInt(value);
        return !value || age < 16 || age > 120 ? 'Invalid age (16-120)' : '';
      case 'poids':
        const poids = parseFloat(value);
        return !value || poids < 30 || poids > 300 ? 'Invalid weight (30-300 kg)' : '';
      case 'taille':
        const taille = parseInt(value);
        return !value || taille < 120 || taille > 250 ? 'Invalid height (120-250 cm)' : '';
      case 'estimatedBodyFat':
        return value === '' ? 'Please select your estimated body fat' : '';
      case 'objectif':
        return value === '' ? 'Please select your goal' : '';
      default:
        return value === '' ? 'This field is required' : '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateCurrentStep = (): boolean => {
    const currentFields = steps[currentStep].fields;
    for (const field of currentFields) {
      const error = validateField(field, formData[field]);
      if (error) {
        Alert.alert('Validation Error', error);
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    
    try {
      const profileData = {
        prenom: formData.prenom,
        age: parseInt(formData.age),
        sexe: formData.sexe as "homme" | "femme",
        poids: parseFloat(formData.poids),
        taille: parseInt(formData.taille),
        activite: formData.activitePhysique as "sédentaire" | "léger" | "modéré" | "élevé",
        travail: formData.typeTravail as "sédentaire" | "actif",
        sommeil: parseInt(formData.qualiteSommeil),
        medicaments: formData.medicaments === 'true',
        estimatedBodyFat: parseFloat(formData.estimatedBodyFat),
        objectif: formData.objectif as "perte" | "maintien" | "prise",
        repasParJour: 3,
        collationsParJour: 1,
        profileCompleted: true,
        completedAt: new Date().toISOString()
      };

      // Calculate nutrition results
      const nutritionProfile = {
        sexe: profileData.sexe,
        poids: profileData.poids,
        taille: profileData.taille,
        age: profileData.age,
        activite: profileData.activite,
        estimatedBodyFat: profileData.estimatedBodyFat
      };

      const maintenanceResults = calculateMaintenanceNeeds(nutritionProfile);
      const finalResults = optimizeMacronutrientDistribution(
        maintenanceResults,
        profileData.objectif,
        nutritionProfile
      );

      const completeProfile = {
        ...profileData,
        nutritionalResults: finalResults
      };

      // Save to store
      updateUserProfile(completeProfile);
      
      // Save to Firebase
      if (user) {
        await saveUserProfile(completeProfile);
      }

      Alert.alert('Success', 'Profile completed successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Goals' as never) }
      ]);

    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={formData.prenom}
                onChangeText={(value) => handleInputChange('prenom', value)}
                placeholder="Enter your first name"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(value) => handleInputChange('age', value)}
                placeholder="Enter your age"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={[styles.radioButton, formData.sexe === 'homme' && styles.radioButtonSelected]}
                  onPress={() => handleInputChange('sexe', 'homme')}
                >
                  <Text style={[styles.radioText, formData.sexe === 'homme' && styles.radioTextSelected]}>
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.radioButton, formData.sexe === 'femme' && styles.radioButtonSelected]}
                  onPress={() => handleInputChange('sexe', 'femme')}
                >
                  <Text style={[styles.radioText, formData.sexe === 'femme' && styles.radioTextSelected]}>
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      
      case 1:
        return (
          <View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={formData.poids}
                onChangeText={(value) => handleInputChange('poids', value)}
                placeholder="Enter your weight"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                value={formData.taille}
                onChangeText={(value) => handleInputChange('taille', value)}
                placeholder="Enter your height"
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Estimated Body Fat %</Text>
              <View style={styles.optionContainer}>
                {['10', '15', '20', '25', '30'].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.optionButton,
                      formData.estimatedBodyFat === value && styles.optionButtonSelected
                    ]}
                    onPress={() => handleInputChange('estimatedBodyFat', value)}
                  >
                    <Text style={[
                      styles.optionText,
                      formData.estimatedBodyFat === value && styles.optionTextSelected
                    ]}>
                      {value}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Physical Activity Level</Text>
              <View style={styles.optionContainer}>
                {[
                  { value: 'sédentaire', label: 'Sedentary' },
                  { value: 'léger', label: 'Light' },
                  { value: 'modéré', label: 'Moderate' },
                  { value: 'élevé', label: 'High' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      formData.activitePhysique === option.value && styles.optionButtonSelected
                    ]}
                    onPress={() => handleInputChange('activitePhysique', option.value)}
                  >
                    <Text style={[
                      styles.optionText,
                      formData.activitePhysique === option.value && styles.optionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Work Type</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={[styles.radioButton, formData.typeTravail === 'sédentaire' && styles.radioButtonSelected]}
                  onPress={() => handleInputChange('typeTravail', 'sédentaire')}
                >
                  <Text style={[styles.radioText, formData.typeTravail === 'sédentaire' && styles.radioTextSelected]}>
                    Sedentary
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.radioButton, formData.typeTravail === 'actif' && styles.radioButtonSelected]}
                  onPress={() => handleInputChange('typeTravail', 'actif')}
                >
                  <Text style={[styles.radioText, formData.typeTravail === 'actif' && styles.radioTextSelected]}>
                    Active
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sleep Quality (1-5)</Text>
              <View style={styles.optionContainer}>
                {['1', '2', '3', '4', '5'].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.optionButton,
                      formData.qualiteSommeil === value && styles.optionButtonSelected
                    ]}
                    onPress={() => handleInputChange('qualiteSommeil', value)}
                  >
                    <Text style={[
                      styles.optionText,
                      formData.qualiteSommeil === value && styles.optionTextSelected
                    ]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Taking Medications?</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={[styles.radioButton, formData.medicaments === 'false' && styles.radioButtonSelected]}
                  onPress={() => handleInputChange('medicaments', 'false')}
                >
                  <Text style={[styles.radioText, formData.medicaments === 'false' && styles.radioTextSelected]}>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.radioButton, formData.medicaments === 'true' && styles.radioButtonSelected]}
                  onPress={() => handleInputChange('medicaments', 'true')}
                >
                  <Text style={[styles.radioText, formData.medicaments === 'true' && styles.radioTextSelected]}>
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 5:
        return (
          <View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Goal</Text>
              <View style={styles.optionContainer}>
                {[
                  { value: 'perte', label: '📉 Weight Loss', description: 'Reduce body weight' },
                  { value: 'maintien', label: '⚖️ Maintenance', description: 'Maintain current weight' },
                  { value: 'prise', label: '💪 Muscle Gain', description: 'Increase muscle mass' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.goalOption,
                      formData.objectif === option.value && styles.goalOptionSelected
                    ]}
                    onPress={() => handleInputChange('objectif', option.value)}
                  >
                    <Text style={[
                      styles.goalLabel,
                      formData.objectif === option.value && styles.goalLabelSelected
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={[
                      styles.goalDescription,
                      formData.objectif === option.value && styles.goalDescriptionSelected
                    ]}>
                      {option.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{steps[currentStep].title}</Text>
          <Text style={styles.stepIndicator}>
            Step {currentStep + 1} of {steps.length}
          </Text>
        </View>

        <View style={styles.content}>
          {renderStepContent()}
        </View>

        <View style={styles.buttonContainer}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.secondaryButton} onPress={previousStep}>
              <Text style={styles.secondaryButtonText}>Previous</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
            onPress={nextStep}
            disabled={isSubmitting}
          >
            <Text style={styles.primaryButtonText}>
              {isSubmitting
                ? 'Saving...'
                : currentStep === steps.length - 1
                ? 'Complete Profile'
                : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function isProfileComplete(profile: any): boolean {
  return !!(
    profile.prenom &&
    profile.age > 0 &&
    profile.sexe &&
    profile.poids > 0 &&
    profile.taille > 0 &&
    profile.activite &&
    profile.travail &&
    profile.sommeil > 0 &&
    profile.estimatedBodyFat &&
    profile.objectif &&
    profile.profileCompleted
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  stepIndicator: {
    fontSize: 14,
    color: '#6B7280',
  },
  content: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  radioContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioButtonSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  radioText: {
    fontSize: 14,
    color: '#6B7280',
  },
  radioTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  optionContainer: {
    gap: 8,
  },
  optionButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  optionButtonSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  optionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  optionTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  goalOption: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  goalOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  goalLabelSelected: {
    color: '#3B82F6',
  },
  goalDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  goalDescriptionSelected: {
    color: '#3B82F6',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  primaryButton: {
    flex: 2,
    padding: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});