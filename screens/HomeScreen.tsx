import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  MetabolismCalculator: undefined;
  BMICalculator: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const handleMetabolismCalculator = () => {
    navigation.navigate('MetabolismCalculator');
  };

  const handleBMICalculator = () => {
    navigation.navigate('BMICalculator');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenue sur NutriFlow</Text>
        <Text style={styles.subtitle}>
          Votre compagnon pour calculer votre métabolisme, IMC et optimiser votre alimentation
        </Text>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleMetabolismCalculator}>
            <Text style={styles.primaryButtonText}>Calculateur de Métabolisme</Text>
            <Text style={styles.buttonSubtext}>BMR et calories de maintien</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleBMICalculator}>
            <Text style={styles.secondaryButtonText}>Calculateur d'IMC</Text>
            <Text style={styles.buttonSubtext}>Indice de masse corporelle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Fonctionnalités :</Text>
          <Text style={styles.infoText}>• Calcul du métabolisme de base (BMR)</Text>
          <Text style={styles.infoText}>• Estimation des calories de maintien</Text>
          <Text style={styles.infoText}>• Calcul de l'Indice de Masse Corporelle (IMC)</Text>
          <Text style={styles.infoText}>• Recommandations personnalisées</Text>
          <Text style={styles.infoText}>• Prise en compte du niveau d'activité</Text>
          <Text style={styles.infoText}>• Interface moderne et intuitive</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 350,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#4299e1',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 16,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#38a169',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonSubtext: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.9,
  },
  infoContainer: {
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
    elevation: 3,
    maxWidth: 350,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 6,
    lineHeight: 20,
  },
});