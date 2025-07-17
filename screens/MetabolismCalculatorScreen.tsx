import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  MetabolismCalculator: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'MetabolismCalculator'>;

interface UserData {
  age: string;
  gender: 'male' | 'female';
  weight: string;
  height: string;
  activityLevel: string;
}

interface CalculationResult {
  bmr: number;
  maintenanceCalories: number;
  weightLoss: number;
  weightGain: number;
}

export default function MetabolismCalculatorScreen({ navigation }: Props) {
  const [userData, setUserData] = useState<UserData>({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: '1.2',
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  const activityLevels = [
    { label: 'Sédentaire (peu ou pas d\'exercice)', value: '1.2' },
    { label: 'Légèrement actif (exercice léger 1-3 jours/semaine)', value: '1.375' },
    { label: 'Modérément actif (exercice modéré 3-5 jours/semaine)', value: '1.55' },
    { label: 'Très actif (exercice intense 6-7 jours/semaine)', value: '1.725' },
    { label: 'Extrêmement actif (exercice très intense, travail physique)', value: '1.9' },
  ];

  const calculateBMR = (): number => {
    const age = parseInt(userData.age);
    const weight = parseFloat(userData.weight);
    const height = parseFloat(userData.height);

    if (userData.gender === 'male') {
      // Mifflin-St Jeor Equation for men
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      // Mifflin-St Jeor Equation for women
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  const calculateMetabolism = () => {
    if (!userData.age || !userData.weight || !userData.height) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const age = parseInt(userData.age);
    const weight = parseFloat(userData.weight);
    const height = parseFloat(userData.height);

    if (age <= 0 || weight <= 0 || height <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer des valeurs valides');
      return;
    }

    const bmr = calculateBMR();
    const activityMultiplier = parseFloat(userData.activityLevel);
    const maintenanceCalories = bmr * activityMultiplier;

    const calculationResult: CalculationResult = {
      bmr: Math.round(bmr),
      maintenanceCalories: Math.round(maintenanceCalories),
      weightLoss: Math.round(maintenanceCalories - 500), // 500 cal deficit for weight loss
      weightGain: Math.round(maintenanceCalories + 500), // 500 cal surplus for weight gain
    };

    setResult(calculationResult);
  };

  const resetCalculation = () => {
    setUserData({
      age: '',
      gender: 'male',
      weight: '',
      height: '',
      activityLevel: '1.2',
    });
    setResult(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Calculateur de Métabolisme</Text>
          <Text style={styles.subtitle}>
            Calculez vos calories de maintien et votre métabolisme de base
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Âge (années)</Text>
            <TextInput
              style={styles.input}
              value={userData.age}
              onChangeText={(text) => setUserData({ ...userData, age: text })}
              placeholder="Ex: 25"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sexe</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={userData.gender}
                onValueChange={(value) => setUserData({ ...userData, gender: value })}
                style={styles.picker}
              >
                <Picker.Item label="Homme" value="male" />
                <Picker.Item label="Femme" value="female" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Poids (kg)</Text>
            <TextInput
              style={styles.input}
              value={userData.weight}
              onChangeText={(text) => setUserData({ ...userData, weight: text })}
              placeholder="Ex: 70"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Taille (cm)</Text>
            <TextInput
              style={styles.input}
              value={userData.height}
              onChangeText={(text) => setUserData({ ...userData, height: text })}
              placeholder="Ex: 175"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Niveau d'activité</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={userData.activityLevel}
                onValueChange={(value) => setUserData({ ...userData, activityLevel: value })}
                style={styles.picker}
              >
                {activityLevels.map((level) => (
                  <Picker.Item
                    key={level.value}
                    label={level.label}
                    value={level.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.calculateButton} onPress={calculateMetabolism}>
              <Text style={styles.buttonText}>Calculer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={resetCalculation}>
              <Text style={styles.resetButtonText}>Réinitialiser</Text>
            </TouchableOpacity>
          </View>
        </View>

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Vos Résultats</Text>
            
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Métabolisme de Base (BMR)</Text>
              <Text style={styles.resultValue}>{result.bmr} calories/jour</Text>
              <Text style={styles.resultDescription}>
                Calories nécessaires au repos pour maintenir les fonctions vitales
              </Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Calories de Maintien</Text>
              <Text style={styles.resultValue}>{result.maintenanceCalories} calories/jour</Text>
              <Text style={styles.resultDescription}>
                Calories nécessaires pour maintenir votre poids actuel
              </Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Perte de Poids</Text>
              <Text style={[styles.resultValue, styles.weightLoss]}>{result.weightLoss} calories/jour</Text>
              <Text style={styles.resultDescription}>
                Déficit de 500 calories pour perdre ~0.5 kg/semaine
              </Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Prise de Poids</Text>
              <Text style={[styles.resultValue, styles.weightGain]}>{result.weightGain} calories/jour</Text>
              <Text style={styles.resultDescription}>
                Surplus de 500 calories pour prendre ~0.5 kg/semaine
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f7fafc',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f7fafc',
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  calculateButton: {
    backgroundColor: '#4299e1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButtonText: {
    color: '#4299e1',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4299e1',
    marginBottom: 4,
  },
  weightLoss: {
    color: '#e53e3e',
  },
  weightGain: {
    color: '#38a169',
  },
  resultDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 18,
  },
});