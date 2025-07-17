import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from './hooks/useAuth';
import { useUserProfileStore } from './stores/useUserProfileStore';

// Import screens
import AuthScreen from './screens/AuthScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import GoalsScreen from './screens/GoalsScreen';
import MealsScreen from './screens/MealsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const { user, loading } = useAuth();
  const { profile, isProfileComplete } = useUserProfileStore();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  // If user is not authenticated, show auth screen
  if (!user) {
    return (
      <>
        <AuthScreen />
        <StatusBar style="auto" />
      </>
    );
  }

  // If user is authenticated, show main app with navigation
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Profile"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3B82F6',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Profile" 
          component={OnboardingScreen}
          options={{ title: 'Profile Setup' }}
        />
        <Stack.Screen 
          name="Goals" 
          component={GoalsScreen}
          options={{ title: 'Goals & Preferences' }}
        />
        <Stack.Screen 
          name="Meals" 
          component={MealsScreen}
          options={{ title: 'Meal Plan' }}
        />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
});