import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Weight, Ruler, Activity, Briefcase, Moon, Pill, ArrowRight, ArrowLeft, Eye, Target } from 'lucide-react';
import { useUserProfileStore } from '../stores/useUserProfileStore';
import { useAuth } from '../hooks/useAuth';
import { calculateMaintenanceNeeds, optimizeMacronutrientDistribution } from '../hooks/useNutritionCalculator';
import { generateMealPlan, MealPlanOptions } from '../utils/mealPlanGenerator';

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
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const { updateUserProfile, profile } = useUserProfileStore();
  const { user, saveUserProfile, saveDiet } = useAuth();

  // Vérifier si l'utilisateur a déjà un profil complet
  useEffect(() => {
    if (profile && isProfileComplete(profile)) {
      console.log('✅ Profil complet détecté, redirection vers les repas');
      navigate('/meals');
    }
  }, [profile, navigate]);

  const steps = [
    { title: 'Informations personnelles', fields: ['prenom', 'age', 'sexe'] },
    { title: 'Caractéristiques physiques', fields: ['poids', 'taille'] },
    { title: 'Composition corporelle', fields: ['estimatedBodyFat'] },
    { title: 'Style de vie', fields: ['activitePhysique', 'typeTravail'] },
    { title: 'Santé et bien-être', fields: ['qualiteSommeil', 'medicaments'] },
    { title: 'Votre objectif', fields: ['objectif'] }
  ];

  const objectifs = [
    { value: 'perte', label: 'Perte de poids', icon: '📉', description: 'Réduire votre poids corporel' },
    { value: 'prise', label: 'Prise de masse', icon: '💪', description: 'Augmenter votre masse musculaire' },
    { value: 'maintien', label: 'Maintien du poids', icon: '⚖️', description: 'Conserver votre poids actuel' }
  ];

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'prenom':
        return value.trim() === '' ? 'Le prénom est requis' : '';
      case 'age':
        const age = parseInt(value);
        return !value || age < 16 || age > 120 ? 'Âge invalide (16-120 ans)' : '';
      case 'poids':
        const poids = parseFloat(value);
        return !value || poids < 30 || poids > 300 ? 'Poids invalide (30-300 kg)' : '';
      case 'taille':
        const taille = parseInt(value);
        return !value || taille < 120 || taille > 250 ? 'Taille invalide (120-250 cm)' : '';
      case 'estimatedBodyFat':
        return value === '' ? 'Veuillez sélectionner votre taux de masse grasse estimé' : '';
      case 'objectif':
        return value === '' ? 'Veuillez sélectionner votre objectif' : '';
      default:
        return value === '' ? 'Ce champ est requis' : '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const currentFields = steps[currentStep].fields;
    const newErrors: {[key: string]: string} = {};
    
    currentFields.forEach(field => {
      const error = validateField(field, formData[field as keyof OnboardingData]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateNutritionalResults = () => {
    const userProfile = {
      sexe: formData.sexe as "homme" | "femme",
      poids: parseFloat(formData.poids),
      taille: parseFloat(formData.taille),
      age: parseInt(formData.age),
      activite: mapActivitePhysique(formData.activitePhysique),
      estimatedBodyFat: parseInt(formData.estimatedBodyFat)
    };

    // Calcul des besoins de base
    const baseResults = calculateMaintenanceNeeds(userProfile);

    // Calcul des objectifs selon l'objectif choisi
    let caloriesTarget = baseResults.caloriesMaintien;
    if (formData.objectif === 'perte') {
      caloriesTarget = Math.round(caloriesTarget * 0.85);
    } else if (formData.objectif === 'prise') {
      caloriesTarget = Math.round(caloriesTarget * 1.1);
    }

    // Calcul des macronutriments optimisés
    const tailleEnMetres = userProfile.taille / 100;
    const poidsObjectif = 23 * (tailleEnMetres * tailleEnMetres);
    const masseMaigre = userProfile.poids * (1 - userProfile.estimatedBodyFat / 100);

    const macrosOptimises = optimizeMacronutrientDistribution(
      caloriesTarget,
      masseMaigre,
      poidsObjectif,
      formData.objectif as "perte" | "maintien" | "prise",
      userProfile.activite,
      userProfile.estimatedBodyFat,
      userProfile.taille,
      userProfile.poids
    );

    return {
      metabolismeBase: baseResults.metabolismeBase,
      caloriesMaintien: baseResults.caloriesMaintien,
      caloriesObjectif: caloriesTarget,
      proteines: macrosOptimises.proteines,
      glucides: macrosOptimises.glucides,
      lipides: macrosOptimises.lipides,
      masseMaigre: baseResults.masseMaigre
    };
  };

  const handleNext = async () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Dernière étape - sauvegarder le profil complet
        setIsSubmitting(true);
        
        try {
          // Calculer les résultats nutritionnels
          const nutritionalResults = calculateNutritionalResults();
          
          console.log('🍽️ Génération automatique de la diète personnalisée...');
          
          // Générer automatiquement la diète personnalisée
          const dietOptions: MealPlanOptions = {
            caloriesTarget: nutritionalResults.caloriesObjectif,
            proteinesTarget: nutritionalResults.proteines,
            glucidesTarget: nutritionalResults.glucides,
            lipidesTarget: nutritionalResults.lipides,
            repasParJour: 3, // Valeur par défaut
            collationsParJour: 1 // Valeur par défaut
          };
          
          const generatedDiet = generateMealPlan(dietOptions);
          
          if (!generatedDiet.success) {
            console.warn('⚠️ Génération de diète partiellement réussie:', generatedDiet.validationMessage);
          } else {
            console.log('✅ Diète générée avec succès');
          }
          
          // Créer le profil complet
          const completeProfile = {
            // Informations de base
            prenom: formData.prenom,
            age: parseInt(formData.age),
            sexe: formData.sexe as "homme" | "femme",
            poids: parseFloat(formData.poids),
            taille: parseFloat(formData.taille),
            activite: mapActivitePhysique(formData.activitePhysique),
            travail: formData.typeTravail as "sédentaire" | "actif",
            sommeil: parseInt(formData.qualiteSommeil),
            medicaments: formData.medicaments === 'Oui',
            estimatedBodyFat: parseInt(formData.estimatedBodyFat),
            objectif: formData.objectif as "perte" | "maintien" | "prise",
            
            // Configuration par défaut des repas
            repasParJour: 3,
            collationsParJour: 1,
            heurePremierRepas: '08:00',
            restrictionsAlimentaires: [],
            autreRestriction: '',
            
            // Résultats nutritionnels calculés
            nutritionalResults: nutritionalResults,
            
            // Diète générée automatiquement
            generatedDiet: {
              repas: generatedDiet.repas,
              totalCalories: generatedDiet.totalCalories,
              totalProteines: generatedDiet.totalProteines,
              totalGlucides: generatedDiet.totalGlucides,
              totalLipides: generatedDiet.totalLipides,
              success: generatedDiet.success,
              validationMessage: generatedDiet.validationMessage,
              generatedAt: new Date().toISOString(),
              repasParJour: 3,
              collationsParJour: 1
            },
            
            // Métadonnées
            profileCompleted: true,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          console.log('💾 Sauvegarde du profil complet:', completeProfile);

          // Sauvegarder dans le store local
          updateUserProfile(completeProfile);
          
          // Sauvegarder dans Firebase
          if (user) {
            // Sauvegarder la diète séparément dans Firestore
            await saveDietToFirestore(generatedDiet);
            
            console.log('✅ Profil sauvegardé dans Firebase');
          }

          // Rediriger vers la page des repas
          navigate('/meals');
          
        } catch (error) {
          console.error('❌ Erreur lors de la sauvegarde du profil:', error);
          setErrors({ submit: 'Erreur lors de la sauvegarde. Veuillez réessayer.' });
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const saveDietToFirestore = async (diet: any) => {
    if (!user) return;
    
    try {
      // Sauvegarder la diète séparément
      await saveDiet({
        repas: diet.repas,
        totalCalories: diet.totalCalories,
        totalProteines: diet.totalProteines,
        totalGlucides: diet.totalGlucides,
        totalLipides: diet.totalLipides,
        success: diet.success,
        validationMessage: diet.validationMessage,
        repasParJour: 3,
        collationsParJour: 1,
        generatedAt: new Date().toISOString(),
        autoGenerated: true
      });
      
      console.log('✅ Diète sauvegardée dans Firestore sous /users/{userId}/diet');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de la diète:', error);
      // Ne pas faire échouer le processus si la sauvegarde de la diète échoue
    }
  };

  const mapActivitePhysique = (activite: string): "sédentaire" | "léger" | "modéré" | "élevé" => {
    const mapping: { [key: string]: "sédentaire" | "léger" | "modéré" | "élevé" } = {
      'Sédentaire': 'sédentaire',
      'Légèrement actif': 'léger',
      'Modérément actif': 'modéré',
      'Très actif': 'élevé',
      'Extrêmement actif': 'élevé'
    };
    return mapping[activite] || 'sédentaire';
  };

  const bodyFatOptions = [
    { value: '11', label: '10–12 %', description: 'Très défini, abdominaux très visibles' },
    { value: '14', label: '13–15 %', description: 'Défini, abdominaux visibles' },
    { value: '18', label: '16–20 %', description: 'Légèrement défini, forme athlétique' },
    { value: '26', label: '21–30 %', description: 'Forme moyenne, léger surplus' },
    { value: '35', label: '+30 %', description: 'Surplus important' }
  ];

  const bodyFatOptionsFemale = [
    { value: '17', label: '15–18 %', description: 'Très athlétique, définition musculaire visible' },
    { value: '20', label: '19–22 %', description: 'Athlétique, forme tonique' },
    { value: '25', label: '23–27 %', description: 'Forme normale, légèrement tonique' },
    { value: '32', label: '28–35 %', description: 'Forme moyenne, surplus modéré' },
    { value: '38', label: '+35 %', description: 'Surplus important' }
  ];

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  const isProfileComplete = (profile: any): boolean => {
    return !!(
      profile?.prenom &&
      profile?.age &&
      profile?.sexe &&
      profile?.poids &&
      profile?.taille &&
      profile?.activite &&
      profile?.travail &&
      profile?.sommeil &&
      profile?.estimatedBodyFat &&
      profile?.objectif &&
      profile?.profileCompleted
    );
  };

  const renderField = (field: string, icon: React.ReactNode, label: string, type: string = 'text', options?: string[]) => {
    const value = formData[field as keyof OnboardingData];
    const error = errors[field];
    
    return (
      <div className="space-y-3">
        <label className="flex items-center gap-3 text-base font-semibold text-gray-800">
          <div className="w-6 h-6 text-blue-600">
            {icon}
          </div>
          {label}
        </label>
        
        {options ? (
          <div className="space-y-3">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleInputChange(field, option)}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left font-medium active:scale-95 ${
                  value === option
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white border-transparent shadow-lg'
                    : 'bg-white border-gray-200 text-gray-700 active:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        ) : field === 'qualiteSommeil' ? (
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => handleInputChange(field, rating.toString())}
                className={`flex-1 h-14 rounded-xl border-2 font-bold text-lg transition-all duration-200 active:scale-95 ${
                  value === rating.toString()
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white border-transparent shadow-lg'
                    : 'bg-white border-gray-200 text-gray-700 active:bg-gray-50'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={`w-full p-4 border-2 rounded-2xl text-lg transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500 ${
              error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
            }`}
            placeholder={`Entrez votre ${label.toLowerCase()}`}
          />
        )}
        
        {error && (
          <p className="text-red-500 text-sm mt-2 px-2">
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
            )}
            <div className="flex-1 text-center">
              <h1 className="text-lg font-bold text-gray-800">
                Configuration du profil
              </h1>
              <p className="text-sm text-gray-500">
                Étape {currentStep + 1} sur {steps.length}
              </p>
            </div>
            <div className="w-10" />
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600">
            {currentStep === 0 && 'Renseignez vos informations personnelles'}
            {currentStep === 1 && 'Indiquez vos caractéristiques physiques'}
            {currentStep === 2 && 'Estimez votre composition corporelle'}
            {currentStep === 3 && 'Décrivez votre style de vie'}
            {currentStep === 4 && 'Informations sur votre santé'}
            {currentStep === 5 && 'Choisissez votre objectif principal'}
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 0: Personal Information */}
          {currentStep === 0 && (
            <>
              {renderField('prenom', <User size={20} />, 'Prénom')}
              {renderField('age', <Calendar size={20} />, 'Âge', 'number')}
              {renderField('sexe', <User size={20} />, 'Sexe', 'text', ['Homme', 'Femme'])}
            </>
          )}

          {/* Step 1: Physical Characteristics */}
          {currentStep === 1 && (
            <>
              {renderField('poids', <Weight size={20} />, 'Poids (kg)', 'number')}
              {renderField('taille', <Ruler size={20} />, 'Taille (cm)', 'number')}
            </>
          )}

          {/* Step 2: Body Composition */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-base font-semibold text-gray-800">
                  <div className="w-6 h-6 text-blue-600">
                    <Eye size={20} />
                  </div>
                  Quel est votre taux de masse grasse estimé ?
                </label>
                <p className="text-sm text-gray-600 px-9">
                  Choisissez la silhouette qui vous correspond le mieux
                </p>
              </div>

              {/* Image des silhouettes */}
              <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
                <img 
                  src={formData.sexe === 'Femme' 
                    ? "/assets/images/assets_task_01jzmwzjcqentbw9k140rdber8_1751974491_img_0.webp"
                    : "/assets/images/assets_task_01jzmwbr4qfn3tnr9p746j0ety_1751973820_img_0.webp"
                  } 
                  alt={`Silhouettes ${formData.sexe === 'Femme' ? 'féminines' : 'masculines'} représentant différents taux de masse grasse`}
                  className="w-full h-auto rounded-xl"
                />
              </div>

              {/* Boutons de sélection */}
              <div className="space-y-3">
                {(formData.sexe === 'Femme' ? bodyFatOptionsFemale : bodyFatOptions).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('estimatedBodyFat', option.value)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left font-medium active:scale-95 ${
                      formData.estimatedBodyFat === option.value
                        ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white border-transparent shadow-lg'
                        : 'bg-white border-gray-200 text-gray-700 active:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg mb-1">{option.label}</div>
                        <div className={`text-sm ${
                          formData.estimatedBodyFat === option.value ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {option.description}
                        </div>
                      </div>
                      {formData.estimatedBodyFat === option.value && (
                        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {errors.estimatedBodyFat && (
                <p className="text-red-500 text-sm px-2">
                  {errors.estimatedBodyFat}
                </p>
              )}
            </div>
          )}

          {/* Step 3: Lifestyle */}
          {currentStep === 3 && (
            <>
              {renderField('activitePhysique', <Activity size={20} />, 'Niveau d\'activité physique', 'text', [
                'Sédentaire',
                'Légèrement actif',
                'Modérément actif',
                'Très actif',
                'Extrêmement actif'
              ])}
              {renderField('typeTravail', <Briefcase size={20} />, 'Type de travail', 'text', ['Sédentaire', 'Actif'])}
            </>
          )}

          {/* Step 4: Health and Wellness */}
          {currentStep === 4 && (
            <>
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-base font-semibold text-gray-800">
                  <div className="w-6 h-6 text-blue-600">
                    <Moon size={20} />
                  </div>
                  Qualité du sommeil
                </label>
                <p className="text-sm text-gray-600 px-9">
                  1 = Très mauvaise, 5 = Excellente
                </p>
                {renderField('qualiteSommeil', <Moon size={20} />, 'Qualité du sommeil')}
              </div>
              {renderField('medicaments', <Pill size={20} />, 'Utilisation de médicaments', 'text', ['Oui', 'Non'])}
            </>
          )}

          {/* Step 5: Objectif */}
          {currentStep === 5 && (
            <div className="space-y-4">
              {objectifs.map((objectif) => (
                <button
                  key={objectif.value}
                  onClick={() => handleInputChange('objectif', objectif.value)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left active:scale-95 ${
                    formData.objectif === objectif.value
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white border-transparent shadow-lg'
                      : 'bg-white border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{objectif.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{objectif.label}</h3>
                      <p className={`text-sm ${
                        formData.objectif === objectif.value ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {objectif.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              {errors.objectif && (
                <p className="text-red-500 text-sm px-2">{errors.objectif}</p>
              )}
            </div>
          )}

          {/* Error de soumission */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-2xl font-semibold text-lg shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sauvegarde...
            </>
          ) : currentStep === steps.length - 1 ? (
            <>
              <Target size={20} />
              Créer mon profil
            </>
          ) : (
            <>
              Continuer
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>

      {/* Bottom padding */}
      <div className="h-24"></div>
    </div>
  );
}