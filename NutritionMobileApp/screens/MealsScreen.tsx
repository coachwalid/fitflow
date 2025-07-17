import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useUserProfileStore } from '../stores/useUserProfileStore';
import { useAuth } from '../hooks/useAuth';

export default function MealsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { profile } = useUserProfileStore();
  const { logout } = useAuth();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
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
  const mealsCount = profile.repasParJour || 3;
  const snacksCount = profile.collationsParJour || 1;

  // Calculate calories per meal
  const caloriesPerMeal = Math.round(nutritionalResults.caloriesObjectif / (mealsCount + snacksCount * 0.5));
  const caloriesPerSnack = Math.round(caloriesPerMeal * 0.5);

  // Sample meal plan structure
  const sampleMeals = [
    { name: 'Breakfast', emoji: '🍳', calories: caloriesPerMeal },
    { name: 'Lunch', emoji: '🥗', calories: caloriesPerMeal },
    { name: 'Dinner', emoji: '🍽️', calories: caloriesPerMeal },
  ];

  if (mealsCount > 3) {
    sampleMeals.splice(2, 0, { name: 'Afternoon Meal', emoji: '🥪', calories: caloriesPerMeal });
  }
  if (mealsCount > 4) {
    sampleMeals.splice(1, 0, { name: 'Mid-Morning', emoji: '🥐', calories: caloriesPerMeal });
  }

  const sampleSnacks = Array.from({ length: snacksCount }, (_, i) => ({
    name: `Snack ${i + 1}`,
    emoji: '🍎',
    calories: caloriesPerSnack
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {profile.prenom}! 👋</Text>
            <Text style={styles.subtitle}>Here's your nutrition plan</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Targets</Text>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{nutritionalResults.caloriesObjectif}</Text>
              <Text style={styles.summaryLabel}>Calories</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '0%' }]} />
              </View>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{nutritionalResults.proteines}g</Text>
              <Text style={styles.summaryLabel}>Protein</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '0%' }]} />
              </View>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{nutritionalResults.glucides}g</Text>
              <Text style={styles.summaryLabel}>Carbs</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '0%' }]} />
              </View>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{nutritionalResults.lipides}g</Text>
              <Text style={styles.summaryLabel}>Fat</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '0%' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Meals</Text>
          
          {sampleMeals.map((meal, index) => (
            <TouchableOpacity key={index} style={styles.mealCard}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealEmoji}>{meal.emoji}</Text>
                <View style={styles.mealDetails}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                </View>
              </View>
              <View style={styles.mealStatus}>
                <Text style={styles.mealStatusText}>Plan meal</Text>
                <Text style={styles.arrow}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
          
          {sampleSnacks.map((snack, index) => (
            <TouchableOpacity key={`snack-${index}`} style={styles.snackCard}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealEmoji}>{snack.emoji}</Text>
                <View style={styles.mealDetails}>
                  <Text style={styles.snackName}>{snack.name}</Text>
                  <Text style={styles.snackCalories}>{snack.calories} kcal</Text>
                </View>
              </View>
              <View style={styles.mealStatus}>
                <Text style={styles.snackStatusText}>Add snack</Text>
                <Text style={styles.arrow}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Goal Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goal Progress</Text>
          
          <View style={styles.goalCard}>
            <Text style={styles.goalEmoji}>
              {profile.objectif === 'perte' && '📉'}
              {profile.objectif === 'maintien' && '⚖️'}
              {profile.objectif === 'prise' && '💪'}
            </Text>
            <Text style={styles.goalText}>
              {profile.objectif === 'perte' && 'Weight Loss Journey'}
              {profile.objectif === 'maintien' && 'Maintenance Mode'}
              {profile.objectif === 'prise' && 'Muscle Building'}
            </Text>
            <Text style={styles.goalDescription}>
              Stay consistent with your nutrition plan to reach your goals!
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionEmoji}>📊</Text>
              <Text style={styles.actionText}>View Stats</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Goals' as never)}
            >
              <Text style={styles.actionEmoji}>⚙️</Text>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Profile' as never)}
            >
              <Text style={styles.actionEmoji}>👤</Text>
              <Text style={styles.actionText}>Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionEmoji}>💡</Text>
              <Text style={styles.actionText}>Tips</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  mealCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  snackCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mealEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  mealDetails: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  mealCalories: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  snackName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  snackCalories: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  mealStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealStatusText: {
    fontSize: 14,
    color: '#3B82F6',
    marginRight: 8,
  },
  snackStatusText: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
  arrow: {
    fontSize: 16,
    color: '#6B7280',
  },
  goalCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalEmoji: {
    fontSize: 32,
    marginBottom: 8,
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
    textAlign: 'center',
    lineHeight: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
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