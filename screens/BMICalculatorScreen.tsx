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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  MetabolismCalculator: undefined;
  BMICalculator: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'BMICalculator'>;

interface BMIData {
  weight: string;
  height: string;
}

interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
  healthRange: string;
  recommendations: string[];
}

export default function BMICalculatorScreen({ navigation }: Props) {
  const [bmiData, setBmiData] = useState<BMIData>({
    weight: '',
    height: '',
  });

  const [result, setResult] = useState<BMIResult | null>(null);

  const getBMICategory = (bmi: number): { category: string; color: string } => {
    if (bmi < 18.5) {
      return { category: 'Insuffisance pondérale', color: '#3182ce' };
    } else if (bmi >= 18.5 && bmi < 25) {
      return { category: 'Poids normal', color: '#38a169' };
    } else if (bmi >= 25 && bmi < 30) {
      return { category: 'Surpoids', color: '#d69e2e' };
    } else {
      return { category: 'Obésité', color: '#e53e3e' };
    }
  };

  const getRecommendations = (bmi: number): string[] => {
    if (bmi < 18.5) {
      return [
        'Consultez un professionnel de santé',
        'Augmentez votre apport calorique de manière saine',
        'Privilégiez les aliments riches en nutriments',
        'Faites de la musculation pour prendre de la masse',
      ];
    } else if (bmi >= 18.5 && bmi < 25) {
      return [
        'Maintenez votre poids actuel',
        'Continuez une alimentation équilibrée',
        'Pratiquez une activité physique régulière',
        'Surveillez votre poids périodiquement',
      ];
    } else if (bmi >= 25 && bmi < 30) {
      return [
        'Adoptez une alimentation plus équilibrée',
        'Augmentez votre activité physique',
        'Réduisez les portions et les calories',
        'Privilégiez les légumes et protéines maigres',
      ];
    } else {
      return [
        'Consultez impérativement un médecin',
        'Suivez un programme de perte de poids supervisé',
        'Réduisez significativement votre apport calorique',
        'Pratiquez une activité physique adaptée',
      ];
    }
  };

  const calculateBMI = () => {
    if (!bmiData.weight || !bmiData.height) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const weight = parseFloat(bmiData.weight);
    const height = parseFloat(bmiData.height) / 100; // Convert cm to meters

    if (weight <= 0 || height <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer des valeurs valides');
      return;
    }

    const bmi = weight / (height * height);
    const { category, color } = getBMICategory(bmi);
    const recommendations = getRecommendations(bmi);

    const bmiResult: BMIResult = {
      bmi: Math.round(bmi * 10) / 10,
      category,
      categoryColor: color,
      healthRange: '18.5 - 24.9',
      recommendations,
    };

    setResult(bmiResult);
  };

  const resetCalculation = () => {
    setBmiData({
      weight: '',
      height: '',
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
          <Text style={styles.title}>Calculateur d'IMC</Text>
          <Text style={styles.subtitle}>
            Calculez votre Indice de Masse Corporelle et obtenez des recommandations
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Poids (kg)</Text>
            <TextInput
              style={styles.input}
              value={bmiData.weight}
              onChangeText={(text) => setBmiData({ ...bmiData, weight: text })}
              placeholder="Ex: 70"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Taille (cm)</Text>
            <TextInput
              style={styles.input}
              value={bmiData.height}
              onChangeText={(text) => setBmiData({ ...bmiData, height: text })}
              placeholder="Ex: 175"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.calculateButton} onPress={calculateBMI}>
              <Text style={styles.buttonText}>Calculer l'IMC</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={resetCalculation}>
              <Text style={styles.resetButtonText}>Réinitialiser</Text>
            </TouchableOpacity>
          </View>
        </View>

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Votre IMC</Text>
            
            <View style={styles.resultCard}>
              <Text style={styles.bmiValue}>{result.bmi}</Text>
              <Text style={[styles.bmiCategory, { color: result.categoryColor }]}>
                {result.category}
              </Text>
              <Text style={styles.healthRange}>
                Fourchette santé : {result.healthRange}
              </Text>
            </View>

            <View style={styles.scaleContainer}>
              <Text style={styles.scaleTitle}>Échelle IMC</Text>
              <View style={styles.scaleItem}>
                <View style={[styles.scaleColor, { backgroundColor: '#3182ce' }]} />
                <Text style={styles.scaleText}>Insuffisance pondérale (&lt; 18.5)</Text>
              </View>
              <View style={styles.scaleItem}>
                <View style={[styles.scaleColor, { backgroundColor: '#38a169' }]} />
                <Text style={styles.scaleText}>Poids normal (18.5 - 24.9)</Text>
              </View>
              <View style={styles.scaleItem}>
                <View style={[styles.scaleColor, { backgroundColor: '#d69e2e' }]} />
                <Text style={styles.scaleText}>Surpoids (25 - 29.9)</Text>
              </View>
              <View style={styles.scaleItem}>
                <View style={[styles.scaleColor, { backgroundColor: '#e53e3e' }]} />
                <Text style={styles.scaleText}>Obésité (&ge; 30)</Text>
              </View>
            </View>

            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationsTitle}>Recommandations</Text>
              {result.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
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
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4299e1',
    marginBottom: 8,
  },
  bmiCategory: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  healthRange: {
    fontSize: 14,
    color: '#718096',
  },
  scaleContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scaleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 12,
    textAlign: 'center',
  },
  scaleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scaleColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  scaleText: {
    fontSize: 14,
    color: '#718096',
  },
  recommendationsContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#4299e1',
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 14,
    color: '#718096',
    flex: 1,
    lineHeight: 20,
  },
});