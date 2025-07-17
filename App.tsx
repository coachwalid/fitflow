import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import MetabolismCalculatorScreen from './screens/MetabolismCalculatorScreen';
import BMICalculatorScreen from './screens/BMICalculatorScreen';

export type RootStackParamList = {
  Home: undefined;
  MetabolismCalculator: undefined;
  BMICalculator: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4299e1',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'NutriFlow',
              headerShown: false, // Cache le header sur l'écran d'accueil pour un design plus propre
            }}
          />
          <Stack.Screen
            name="MetabolismCalculator"
            component={MetabolismCalculatorScreen}
            options={{
              title: 'Calculateur de Métabolisme',
            }}
          />
          <Stack.Screen
            name="BMICalculator"
            component={BMICalculatorScreen}
            options={{
              title: 'Calculateur d\'IMC',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}