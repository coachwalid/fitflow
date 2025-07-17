import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useUserProfileStore } from '../stores/useUserProfileStore';
import { useAuth } from '../hooks/useAuth';

export default function GoalsScreen() {
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [snacksPerDay, setSnacksPerDay] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigation = useNavigation();
  const { profile, updateUserProfile } = useUserProfileStore();
  const { user, saveUserProfile } = useAuth();

  const handleSave = async () => {
    if (!profile) {
      Alert.alert('Error', 'No profile found');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedProfile = {
        ...profile,
        repasParJour: mealsPerDay,
        collationsParJour: snacksPerDay,
        updatedAt: new Date().toISOString()
      };

      // Update local store
      updateUserProfile(updatedProfile);

      // Save to Firebase
      if (user) {
        await saveUserProfile(updatedProfile);
      }

      Alert.alert('Success', 'Preferences saved successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Meals' as never) }
      ]);

    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile || !profile.nutritionalResults) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>No nutrition data found. Please complete your profile first.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Profile' as never)}
          >
            <Text style={styles.buttonText}>Go to Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { nutritionalResults } = profile;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Nutrition Goals</Text>
          <Text style={styles.subtitle}>Based on your profile and goals</Text>
        </View>

        {/* Nutrition Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Nutrition Targets</Text>
          
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionCard}>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <Text style={styles.nutritionValue}>{nutritionalResults.caloriesObjectif}</Text>
              <Text style={styles.nutritionUnit}>kcal</Text>
            </View>
            
            <View style={styles.nutritionCard}>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>{nutritionalResults.proteines}</Text>
              <Text style={styles.nutritionUnit}>g</Text>
            </View>
            
            <View style={styles.nutritionCard}>
              <Text style={styles.nutritionLabel}>Carbs</Text>
              <Text style={styles.nutritionValue}>{nutritionalResults.glucides}</Text>
              <Text style={styles.nutritionUnit}>g</Text>
            </View>
            
            <View style={styles.nutritionCard}>
              <Text style={styles.nutritionLabel}>Fat</Text>
              <Text style={styles.nutritionValue}>{nutritionalResults.lipides}</Text>
              <Text style={styles.nutritionUnit}>g</Text>
            </View>
          </View>
        </View>

        {/* Meal Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Preferences</Text>
          
          <View style={styles.preferenceContainer}>
            <Text style={styles.preferenceLabel}>Meals per day</Text>
            <View style={styles.buttonGroup}>
              {[2, 3, 4, 5].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.optionButton,
                    mealsPerDay === num && styles.optionButtonSelected
                  ]}
                  onPress={() => setMealsPerDay(num)}
                >
                  <Text style={[
                    styles.optionText,
                    mealsPerDay === num && styles.optionTextSelected
                  ]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.preferenceContainer}>
            <Text style={styles.preferenceLabel}>Snacks per day</Text>
            <View style={styles.buttonGroup}>
              {[0, 1, 2, 3].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.optionButton,
                    snacksPerDay === num && styles.optionButtonSelected
                  ]}
                  onPress={() => setSnacksPerDay(num)}
                >
                  <Text style={[
                    styles.optionText,
                    snacksPerDay === num && styles.optionTextSelected
                  ]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Goal Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Goal</Text>
          <View style={styles.goalCard}>
            <Text style={styles.goalText}>
              {profile.objectif === 'perte' && '📉 Weight Loss'}
              {profile.objectif === 'maintien' && '⚖️ Weight Maintenance'}
              {profile.objectif === 'prise' && '💪 Muscle Gain'}
            </Text>
            <Text style={styles.goalDescription}>
              Your nutrition plan is optimized for your goal with {nutritionalResults.caloriesObjectif} calories per day.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSubmitting}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? 'Saving...' : 'Save Preferences & Continue'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  nutritionUnit: {
    fontSize: 12,
    color: '#6B7280',
  },
  preferenceContainer: {
    marginBottom: 20,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  optionButtonSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  optionText: {
    fontSize: 16,
    color: '#6B7280',
  },
  optionTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  goalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  saveButton: {
    margin: 20,
    padding: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});