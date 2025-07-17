import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Clock, Utensils, Coffee, Shield, ArrowLeft, CheckCircle2, Plus, Minus, Calculator, Zap, TrendingUp, TrendingDown, Minus as MinusIcon } from 'lucide-react';
import { useUserProfileStore } from '../stores/useUserProfileStore';
import { calculateMaintenanceNeeds, optimizeMacronutrientDistribution } from '../hooks/useNutritionCalculator';

interface GoalsData {
  objectifPrincipal: string;
  nombreRepas: number;
  nombreCollations: number;
  heurePremierRepas: string;
  restrictionsAlimentaires: string[];
  autreRestriction: string;
}

const initialGoalsData: GoalsData = {
  objectifPrincipal: '',
  nombreRepas: 3,
  nombreCollations: 1,
  heurePremierRepas: '08:00',
  restrictionsAlimentaires: [],
  autreRestriction: ''
};

export default function GoalsScreen() {
  const [goalsData, setGoalsData] = useState<GoalsData>(initialGoalsData);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [currentSection, setCurrentSection] = useState(0);
  const navigate = useNavigate();
  const { updateUserProfile, profile } = useUserProfileStore();

  if (!profile) {
    navigate('/profil');
    return null;
  }

  // Vérifier que le body fat est disponible
  if (!profile.estimatedBodyFat) {
    console.error('❌ Body fat manquant, redirection vers le profil');
    navigate('/profil');
    return null;
  }

  // Calculs nutritionnels de base
  const baseNutritionResults = calculateMaintenanceNeeds({
    sexe: profile.sexe,
    poids: profile.poids,
    taille: profile.taille,
    age: profile.age,
    activite: profile.activite,
    estimatedBodyFat: profile.estimatedBodyFat
  });

  // Calculs ajustés selon l'objectif
  const getAdjustedNutrition = (objectif: string) => {
    let caloriesTarget = baseNutritionResults.caloriesMaintien;
    let description = '';
    let icon = <Target size={24} />;
    let colorClass = 'from-blue-500 to-teal-500';

    switch (objectif) {
      case 'perte':
        caloriesTarget = Math.round(baseNutritionResults.caloriesMaintien * 0.85);
        description = 'Déficit calorique pour perdre du poids';
        icon = <TrendingDown size={24} />;
        colorClass = 'from-red-500 to-pink-500';
        break;
      case 'prise':
        caloriesTarget = Math.round(baseNutritionResults.caloriesMaintien * 1.1);
        description = 'Surplus calorique pour prendre de la masse';
        icon = <TrendingUp size={24} />;
        colorClass = 'from-green-500 to-emerald-500';
        break;
      case 'maintien':
        description = 'Maintien du poids actuel';
        icon = <Target size={24} />;
        colorClass = 'from-blue-500 to-teal-500';
        break;
    }

    // NOUVELLE LOGIQUE: Optimisation automatique des macronutriments
    const tailleEnMetres = profile.taille / 100;
    const poidsObjectif = 23 * (tailleEnMetres * tailleEnMetres);
    const masseMaigre = profile.poids * (1 - (profile.estimatedBodyFat || 20) / 100);

    // Utilisation de la fonction d'optimisation automatique
    const macrosOptimises = optimizeMacronutrientDistribution(
      caloriesTarget,
      masseMaigre,
      poidsObjectif,
      objectif as "perte" | "maintien" | "prise",
      profile.activite,
      profile.estimatedBodyFat || 20,
      profile.taille, // ANCIEN: nécessaire pour la nouvelle logique glucides perte de poids (poids objectif)
      profile.poids // NOUVEAU: nécessaire pour la nouvelle logique glucides perte de poids (poids actuel)
    );

    return {
      calories: caloriesTarget,
      proteines: macrosOptimises.proteines,
      glucides: macrosOptimises.glucides,
      lipides: macrosOptimises.lipides,
      description,
      icon,
      colorClass
    };
  };

  const sections = [
    { title: 'Vos besoins de base', key: 'besoins' },
    { title: 'Objectif principal', key: 'objectif' },
    { title: 'Votre plan personnalisé', key: 'plan' },
    { title: 'Structure des repas', key: 'repas' },
    { title: 'Premier repas', key: 'horaire' },
    { title: 'Restrictions', key: 'restrictions' }
  ];

  const objectifs = [
    { value: 'perte', label: 'Perte de poids', icon: '📉', description: 'Réduire votre poids corporel' },
    { value: 'prise', label: 'Prise de masse', icon: '💪', description: 'Augmenter votre masse musculaire' },
    { value: 'maintien', label: 'Maintien du poids', icon: '⚖️', description: 'Conserver votre poids actuel' }
  ];

  const restrictions = [
    { value: 'vegetarien', label: 'Végétarien', icon: '🥬' },
    { value: 'vegetalien', label: 'Végétalien', icon: '🌱' },
    { value: 'halal', label: 'Halal', icon: '☪️' },
    { value: 'sans-lactose', label: 'Sans lactose', icon: '🥛' },
    { value: 'sans-gluten', label: 'Sans gluten', icon: '🌾' }
  ];

  const validateCurrentSection = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (currentSection === 1 && !goalsData.objectifPrincipal) {
      newErrors.objectifPrincipal = 'Veuillez sélectionner un objectif principal';
    }

    if (currentSection === 4 && !goalsData.heurePremierRepas) {
      newErrors.heurePremierRepas = 'Veuillez indiquer l\'heure de votre premier repas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      if (currentSection < sections.length - 1) {
        setCurrentSection(prev => prev + 1);
      } else {
        // Sauvegarder les données d'objectifs dans le store
        updateUserProfile({
          objectif: goalsData.objectifPrincipal as "perte" | "maintien" | "prise",
          repasParJour: goalsData.nombreRepas,
          collationsParJour: goalsData.nombreCollations,
          heurePremierRepas: goalsData.heurePremierRepas,
          restrictionsAlimentaires: goalsData.restrictionsAlimentaires,
          autreRestriction: goalsData.autreRestriction
        });
        
        // Rediriger vers la page des repas
        navigate('/meals');
      }
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    } else {
      navigate('/profil');
    }
  };

  const handleObjectifChange = (objectif: string) => {
    setGoalsData(prev => ({ ...prev, objectifPrincipal: objectif }));
    if (errors.objectifPrincipal) {
      setErrors(prev => ({ ...prev, objectifPrincipal: '' }));
    }
  };

  const handleNombreRepasChange = (nombre: number) => {
    setGoalsData(prev => ({ ...prev, nombreRepas: nombre }));
  };

  const handleNombreCollationsChange = (nombre: number) => {
    setGoalsData(prev => ({ ...prev, nombreCollations: nombre }));
  };

  const handleHeurePremierRepasChange = (heure: string) => {
    setGoalsData(prev => ({ ...prev, heurePremierRepas: heure }));
    if (errors.heurePremierRepas) {
      setErrors(prev => ({ ...prev, heurePremierRepas: '' }));
    }
  };

  const handleRestrictionChange = (restriction: string) => {
    const newRestrictions = goalsData.restrictionsAlimentaires.includes(restriction)
      ? goalsData.restrictionsAlimentaires.filter(r => r !== restriction)
      : [...goalsData.restrictionsAlimentaires, restriction];
    
    setGoalsData(prev => ({ ...prev, restrictionsAlimentaires: newRestrictions }));
  };

  const getProgressPercentage = () => {
    return ((currentSection + 1) / sections.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-lg font-bold text-gray-800">
                Objectifs
              </h1>
              <p className="text-sm text-gray-500">
                Étape {currentSection + 1} sur {sections.length}
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
            {sections[currentSection].title}
          </h2>
          <p className="text-gray-600">
            {currentSection === 0 && 'Découvrez vos besoins nutritionnels de base'}
            {currentSection === 1 && 'Choisissez votre objectif principal'}
            {currentSection === 2 && 'Voici votre plan nutritionnel personnalisé'}
            {currentSection === 3 && 'Définissez la structure de vos repas'}
            {currentSection === 4 && 'Configurez vos horaires'}
            {currentSection === 5 && 'Précisez vos restrictions alimentaires'}
          </p>
        </div>

        <div className="space-y-6">
          {/* Section 0: Besoins de base */}
          {currentSection === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Bonjour {profile.prenom} ! 👋
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Voici vos besoins nutritionnels calculés selon votre composition corporelle (méthode Katch-McArdle)
                </p>
              </div>

              {/* Composition corporelle */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                    <span className="text-lg font-bold">💪</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Composition corporelle
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Masse grasse: {profile.estimatedBodyFat}% • Masse maigre: {baseNutritionResults.masseMaigre}kg
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-800">
                        Méthode Katch-McArdle
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        (basée sur la masse maigre)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Métabolisme de base */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white">
                    <Calculator size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Métabolisme de base (BMR)
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      BMR = 370 + (21.6 × masse maigre)
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-800">
                        {baseNutritionResults.metabolismeBase.toLocaleString()}
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        kcal/jour
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calories de maintien */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white">
                    <Zap size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Calories de maintien
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      TDEE = BMR × facteur d'activité ({profile.activite})
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-800">
                        {baseNutritionResults.caloriesMaintien.toLocaleString()}
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        kcal/jour
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">i</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Méthode Katch-McArdle
                    </h4>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      Cette méthode utilise votre composition corporelle (masse grasse vs masse maigre) 
                      pour un calcul plus précis de vos besoins énergétiques. Elle est considérée comme 
                      la plus fiable pour les personnes connaissant leur taux de masse grasse.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 1: Objectif Principal */}
          {currentSection === 1 && (
            <div className="space-y-4">
              {objectifs.map((objectif) => (
                <button
                  key={objectif.value}
                  onClick={() => handleObjectifChange(objectif.value)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left active:scale-95 ${
                    goalsData.objectifPrincipal === objectif.value
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white border-transparent shadow-lg'
                      : 'bg-white border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{objectif.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{objectif.label}</h3>
                      <p className={`text-sm ${
                        goalsData.objectifPrincipal === objectif.value ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {objectif.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              {errors.objectifPrincipal && (
                <p className="text-red-500 text-sm px-2">{errors.objectifPrincipal}</p>
              )}
            </div>
          )}

          {/* Section 2: Plan personnalisé */}
          {currentSection === 2 && goalsData.objectifPrincipal && (
            <div className="space-y-6">
              {(() => {
                const adjustedNutrition = getAdjustedNutrition(goalsData.objectifPrincipal);
                return (
                  <>
                    <div className="text-center mb-8">
                      <div className={`w-16 h-16 bg-gradient-to-r ${adjustedNutrition.colorClass} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        {adjustedNutrition.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Votre plan nutritionnel
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {adjustedNutrition.description}
                      </p>
                    </div>

                    {/* Calories ajustées */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${adjustedNutrition.colorClass} rounded-xl flex items-center justify-center text-white`}>
                          <Zap size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            Calories pour votre objectif
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            Calories quotidiennes recommandées
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-800">
                              {adjustedNutrition.calories.toLocaleString()}
                            </span>
                            <span className="text-sm font-medium text-gray-500">
                              kcal/jour
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Macronutriments */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800">
                        Répartition des macronutriments
                      </h4>
                      
                      {/* Protéines */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                            <span className="text-lg font-bold">P</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">
                              Protéines
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">
                              Construction et réparation musculaire
                            </p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-gray-800">
                                {adjustedNutrition.proteines}
                              </span>
                              <span className="text-sm font-medium text-gray-500">
                                g/jour
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Glucides */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                            <span className="text-lg font-bold">G</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">
                              Glucides
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">
                              Source d'énergie principale
                            </p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-gray-800">
                                {adjustedNutrition.glucides}
                              </span>
                              <span className="text-sm font-medium text-gray-500">
                                g/jour
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lipides */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white">
                            <span className="text-lg font-bold">L</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">
                              Lipides
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">
                              Hormones et absorption des vitamines
                            </p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-gray-800">
                                {adjustedNutrition.lipides}
                              </span>
                              <span className="text-sm font-medium text-gray-500">
                                g/jour
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 size={16} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">
                            Plan personnalisé
                          </h4>
                          <p className="text-green-700 text-sm leading-relaxed">
                            Ces valeurs sont calculées spécifiquement pour votre profil et votre objectif. 
                            Nous allons maintenant configurer vos repas pour atteindre ces objectifs.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Section 3: Structure des repas */}
          {currentSection === 3 && (
            <div className="space-y-8">
              {/* Nombre de repas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Utensils size={20} className="text-green-500" />
                  Nombre de repas par jour
                </h3>
                <div className="flex items-center justify-between bg-white rounded-2xl p-4 border-2 border-gray-200">
                  <button
                    onClick={() => handleNombreRepasChange(Math.max(1, goalsData.nombreRepas - 1))}
                    className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Minus size={20} className="text-gray-600" />
                  </button>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{goalsData.nombreRepas}</div>
                    <div className="text-sm text-gray-500">repas</div>
                  </div>
                  <button
                    onClick={() => handleNombreRepasChange(Math.min(4, goalsData.nombreRepas + 1))}
                    className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Plus size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Nombre de collations */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Coffee size={20} className="text-orange-500" />
                  Nombre de collations par jour
                </h3>
                <div className="flex items-center justify-between bg-white rounded-2xl p-4 border-2 border-gray-200">
                  <button
                    onClick={() => handleNombreCollationsChange(Math.max(0, goalsData.nombreCollations - 1))}
                    className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Minus size={20} className="text-gray-600" />
                  </button>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{goalsData.nombreCollations}</div>
                    <div className="text-sm text-gray-500">collations</div>
                  </div>
                  <button
                    onClick={() => handleNombreCollationsChange(Math.min(3, goalsData.nombreCollations + 1))}
                    className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Plus size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Premier repas */}
          {currentSection === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Clock size={20} className="text-purple-500" />
                À quelle heure prends-tu ton premier repas de la journée ?
              </h3>
              <p className="text-sm text-gray-600 px-2">
                Cette information nous aidera à estimer les horaires de tes autres repas
              </p>
              <input
                type="time"
                value={goalsData.heurePremierRepas}
                onChange={(e) => handleHeurePremierRepasChange(e.target.value)}
                className={`w-full p-4 border-2 rounded-2xl text-lg transition-all duration-200 focus:outline-none focus:border-blue-500 ${
                  errors.heurePremierRepas ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                }`}
              />
              {errors.heurePremierRepas && (
                <p className="text-red-500 text-sm px-2">{errors.heurePremierRepas}</p>
              )}
            </div>
          )}

          {/* Section 5: Restrictions */}
          {currentSection === 5 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Shield size={20} className="text-red-500" />
                  Restrictions alimentaires
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {restrictions.map((restriction) => (
                    <button
                      key={restriction.value}
                      onClick={() => handleRestrictionChange(restriction.value)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 text-center active:scale-95 ${
                        goalsData.restrictionsAlimentaires.includes(restriction.value)
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent shadow-lg'
                          : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="text-2xl mb-2">{restriction.icon}</div>
                      <div className="text-sm font-medium">{restriction.label}</div>
                    </button>
                  ))}
                </div>

                {/* Autre restriction */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 px-2">
                    Autre restriction (optionnel)
                  </label>
                  <input
                    type="text"
                    value={goalsData.autreRestriction}
                    onChange={(e) => setGoalsData(prev => ({ ...prev, autreRestriction: e.target.value }))}
                    placeholder="Précisez une autre restriction..."
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg transition-all duration-200 focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
        <button
          onClick={handleNext}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl font-semibold text-lg shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {currentSection === sections.length - 1 ? (
            <>
              <CheckCircle2 size={20} />
              Valider mon profil
            </>
          ) : (
            <>
              Continuer
              <ArrowLeft size={20} className="rotate-180" />
            </>
          )}
        </button>
      </div>

      {/* Bottom padding */}
      <div className="h-24"></div>
    </div>
  );
}