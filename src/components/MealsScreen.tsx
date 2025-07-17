import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Utensils, Coffee, Clock, Zap, Beef, Droplets, Wheat, RotateCcw, Trash2 } from 'lucide-react';
import { useUserProfileStore } from '../stores/useUserProfileStore';
import { useAuth } from '../hooks/useAuth';
import { calculateMaintenanceNeeds, optimizeMacronutrientDistribution } from '../hooks/useNutritionCalculator';
import { generateMealPlan, MealPlanResult, MealPlanOptions } from '../utils/mealPlanGenerator';
import { replaceMeal } from '../utils/mealReplacer';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

export default function MealsScreen() {
  const navigate = useNavigate();
  const { profile, currentDiet, setCurrentDiet, clearCurrentDiet } = useUserProfileStore();
  const { user, loadDiet, saveDiet, deleteDiet } = useAuth();
  const [mealPlan, setMealPlan] = useState<MealPlanResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [replacingMealIndex, setReplacingMealIndex] = useState<number | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (profile && user) {
      loadExistingDietOrGenerate();
    }
  }, [profile, user]);

  const loadExistingDietOrGenerate = async () => {
    console.log('🔍 Vérification de l\'existence d\'une diète sauvegardée...');
    
    try {
      // Vérifier d'abord le store local
      if (currentDiet && !currentDiet.deleted) {
        console.log('✅ Diète trouvée dans le store local');
        setMealPlan(currentDiet);
        return;
      }
      
      // Charger depuis Firestore
      const existingDiet = await loadDiet(user.uid);
      
      if (existingDiet && !existingDiet.deleted) {
        console.log('✅ Diète existante chargée depuis Firestore');
        setCurrentDiet(existingDiet);
        setMealPlan(existingDiet);
      } else {
        console.log('ℹ️ Aucune diète existante, génération automatique...');
        await generateInitialMealPlan();
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement de la diète:', error);
      // En cas d'erreur, générer une nouvelle diète
      await generateInitialMealPlan();
    }
  };

  if (!profile) {
    navigate('/profil');
    return null;
  }

  const handleBack = () => {
    navigate('/preferences');
  };

  const nutritionResults = calculateMaintenanceNeeds({
    sexe: profile.sexe,
    poids: profile.poids,
    taille: profile.taille,
    age: profile.age,
    activite: profile.activite,
    estimatedBodyFat: profile.estimatedBodyFat || 20 // Fallback si manquant
  });

  // 🎯 CALCUL DES OBJECTIFS NUTRITIONNELS FINAUX (post-objectif choisi)
  const getFinalNutritionalTargets = () => {
    let caloriesTarget = nutritionResults.caloriesMaintien;
    
    // Ajustement des calories selon l'objectif
    if (profile.objectif === 'perte') {
      caloriesTarget = Math.round(caloriesTarget * 0.85);
    } else if (profile.objectif === 'prise') {
      caloriesTarget = Math.round(caloriesTarget * 1.1);
    }
    
    // Calcul des macronutriments optimisés selon l'objectif
    const tailleEnMetres = profile.taille / 100;
    const poidsObjectif = 23 * (tailleEnMetres * tailleEnMetres);
    const masseMaigre = profile.poids * (1 - (profile.estimatedBodyFat || 20) / 100);
    
    const macrosOptimises = optimizeMacronutrientDistribution(
      caloriesTarget,
      masseMaigre,
      poidsObjectif,
      profile.objectif as "perte" | "maintien" | "prise",
      profile.activite,
      profile.estimatedBodyFat || 20,
      profile.taille,
      profile.poids // NOUVEAU: nécessaire pour la nouvelle logique glucides perte de poids (poids actuel)
    );
    
    return {
      calories: caloriesTarget,
      proteines: macrosOptimises.proteines,
      glucides: macrosOptimises.glucides,
      lipides: macrosOptimises.lipides
    };
  };

  const generateInitialMealPlan = async () => {
    setIsGenerating(true);

    // 🎯 UTILISATION EXCLUSIVE DES OBJECTIFS NUTRITIONNELS FINAUX
    const finalTargets = getFinalNutritionalTargets();
    
    console.log('🎯 OBJECTIFS NUTRITIONNELS FINAUX (post-objectif choisi):');
    console.log(`   • Objectif: ${profile.objectif}`);
    console.log(`   • Calories: ${finalTargets.calories}kcal`);
    console.log(`   • Protéines: ${finalTargets.proteines}g`);
    console.log(`   • Glucides: ${finalTargets.glucides}g`);
    console.log(`   • Lipides: ${finalTargets.lipides}g`);
    console.log('🚫 SUPPRESSION: Plus d\'utilisation des besoins de maintien pour la génération');

    // ✅ NOUVELLE LOGIQUE: Génération basée sur les objectifs finaux uniquement
    const options: MealPlanOptions = {
      caloriesTarget: finalTargets.calories,
      proteinesTarget: finalTargets.proteines,
      glucidesTarget: finalTargets.glucides,
      lipidesTarget: finalTargets.lipides,
      repasParJour: profile.repasParJour,
      collationsParJour: profile.collationsParJour
    };

    await new Promise(resolve => setTimeout(resolve, 2000)); // Plus de temps pour l'optimisation
    const result = generateMealPlan(options);
    
    // 📊 VALIDATION: Vérification du respect des objectifs finaux
    console.log('📊 RÉSULTATS DE GÉNÉRATION (objectifs finaux):');
    console.log({
      success: result.success,
      methode: 'Objectifs finaux post-choix',
      validationMessage: result.validationMessage,
      objectif: profile.objectif,
      calories: `${result.totalCalories}/${finalTargets.calories} (${Math.round((result.totalCalories / finalTargets.calories) * 100)}%)`,
      proteines: `${result.totalProteines}/${finalTargets.proteines} (${Math.round((result.totalProteines / finalTargets.proteines) * 100)}%)`,
      glucides: `${result.totalGlucides}/${finalTargets.glucides} (${Math.round((result.totalGlucides / finalTargets.glucides) * 100)}%)`,
      lipides: `${result.totalLipides}/${finalTargets.lipides} (${Math.round((result.totalLipides / finalTargets.lipides) * 100)}%)`
    });
    
    // ✅ VALIDATION STRICTE: Vérifier que les résultats respectent 90-110% des objectifs finaux
    const conformityChecks = {
      calories: (result.totalCalories / finalTargets.calories) * 100,
      proteines: (result.totalProteines / finalTargets.proteines) * 100,
      glucides: (result.totalGlucides / finalTargets.glucides) * 100,
      lipides: (result.totalLipides / finalTargets.lipides) * 100
    };
    
    const isFullyCompliant = Object.values(conformityChecks).every(score => score >= 90 && score <= 110);
    
    console.log('🔍 CONFORMITÉ AUX OBJECTIFS FINAUX:');
    Object.entries(conformityChecks).forEach(([macro, score]) => {
      const status = score >= 90 && score <= 110 ? '✅' : '❌';
      console.log(`   • ${macro}: ${score.toFixed(1)}% ${status}`);
    });
    console.log(`📊 Plan globalement conforme: ${isFullyCompliant ? '✅ OUI' : '❌ NON'}`);
    
    // Afficher un message d'information si le plan n'est pas parfaitement conforme
    if (!result.success && result.validationMessage) {
      console.info(`ℹ️ Information sur le plan généré: ${result.validationMessage}`);
    }
    
    setMealPlan(result);
    setIsGenerating(false);
    
    // Sauvegarder automatiquement la nouvelle diète
    if (user && result.success) {
      try {
        const dietToSave = {
          ...result,
          repasParJour: profile.repasParJour,
          collationsParJour: profile.collationsParJour,
          generatedAt: new Date().toISOString(),
          autoGenerated: false // Générée manuellement par l'utilisateur
        };
        
        await saveDiet(dietToSave);
        setCurrentDiet(dietToSave);
        console.log('✅ Nouvelle diète sauvegardée automatiquement');
      } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde de la diète:', error);
        // Ne pas faire échouer l'affichage si la sauvegarde échoue
      }
    }
  };

  const handleRegenerateDiet = async () => {
    console.log('🔄 Régénération de la diète demandée par l\'utilisateur');
    setIsRegenerating(true);
    
    try {
      // Supprimer l'ancienne diète
      await deleteDiet();
      clearCurrentDiet();
      
      console.log('🗑️ Ancienne diète supprimée');
      
      // Générer une nouvelle diète
      await generateInitialMealPlan();
      
      console.log('✅ Nouvelle diète générée et sauvegardée');
    } catch (error) {
      console.error('❌ Erreur lors de la régénération de la diète:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleReplaceMeal = async (mealIndex: number) => {
    if (!mealPlan) return;
    setReplacingMealIndex(mealIndex);
    const currentMeal = mealPlan.repas[mealIndex];
    const newMeal = replaceMeal(currentMeal);

    if (newMeal) {
      const newRepas = [...mealPlan.repas];
      newRepas[mealIndex] = newMeal;

      const totalCalories = newRepas.reduce((sum, meal) => sum + meal.totalCalories, 0);
      const totalProteines = newRepas.reduce((sum, meal) => sum + meal.totalProteines, 0);
      const totalGlucides = newRepas.reduce((sum, meal) => sum + meal.totalGlucides, 0);
      const totalLipides = newRepas.reduce((sum, meal) => sum + meal.totalLipides, 0);

      setMealPlan({
        ...mealPlan,
        repas: newRepas,
        totalCalories: Math.round(totalCalories * 10) / 10,
        totalProteines: Math.round(totalProteines * 10) / 10,
        totalGlucides: Math.round(totalGlucides * 10) / 10,
        totalLipides: Math.round(totalLipides * 10) / 10
      });
      
      // Sauvegarder automatiquement les modifications
      if (user) {
        try {
          const updatedDiet = {
            ...mealPlan,
            repas: newRepas,
            totalCalories: Math.round(totalCalories * 10) / 10,
            totalProteines: Math.round(totalProteines * 10) / 10,
            totalGlucides: Math.round(totalGlucides * 10) / 10,
            totalLipides: Math.round(totalLipides * 10) / 10,
            updatedAt: new Date().toISOString()
          };
          
          await saveDiet(updatedDiet);
          setCurrentDiet(updatedDiet);
          console.log('✅ Modification de repas sauvegardée automatiquement');
        } catch (error) {
          console.error('❌ Erreur lors de la sauvegarde de la modification:', error);
          // Ne pas faire échouer l'affichage si la sauvegarde échoue
        }
      }
    }

    setTimeout(() => {
      setReplacingMealIndex(null);
    }, 500);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'petit_dejeuner':
        return <Coffee size={20} className="text-orange-500" />;
      case 'dejeuner':
        return <Utensils size={20} className="text-green-500" />;
      case 'diner':
        return <Utensils size={20} className="text-blue-500" />;
      case 'souper':
        return <Utensils size={20} className="text-purple-500" />;
      case 'collation':
        return <Coffee size={20} className="text-pink-500" />;
      default:
        return <Utensils size={20} className="text-gray-500" />;
    }
  };

  const data = [
    {
      name: 'Calories',
      uv: mealPlan?.totalCalories || 0,
      fill: '#22c55e',
    },
  ];

  const percentage = mealPlan?.totalCalories && nutritionResults.caloriesMaintien
    ? Math.min(Math.round((mealPlan.totalCalories / getFinalNutritionalTargets().calories) * 100), 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      {/* Header avec bouton retour */}
      <div className="bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform hover:bg-gray-200"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">
                Votre plan alimentaire
              </h1>
              <p className="text-sm text-gray-500">
                Plan personnalisé pour votre objectif: {profile.objectif}
              </p>
            </div>
            
            {/* Bouton de régénération */}
            <button
              onClick={handleRegenerateDiet}
              disabled={isRegenerating || isGenerating}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium text-sm shadow-lg active:scale-95 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Régénérer une nouvelle diète"
            >
              {isRegenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Régénérer
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        {mealPlan && (
          <div className="flex flex-col items-center mb-6">
            <RadialBarChart
              width={180}
              height={180}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              barSize={10}
              data={data}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis type="number" domain={[0, getFinalNutritionalTargets().calories]} tick={false} />
              <RadialBar background clockWise dataKey="uv" />
            </RadialBarChart>
            <div className="text-center -mt-12">
              <h3 className="text-3xl font-bold text-gray-800">{mealPlan.totalCalories}</h3>
              <p className="text-gray-500 text-sm">KCAL</p>
            </div>
            <div className="flex justify-around w-full mt-4 text-sm">
              <div className="text-center">
                <p className="text-gray-400">Glucides</p>
                <p className="text-black font-semibold">{mealPlan.totalGlucides}g</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400">Protéines</p>
                <p className="text-black font-semibold">{mealPlan.totalProteines}g</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400">Lipides</p>
                <p className="text-black font-semibold">{mealPlan.totalLipides}g</p>
              </div>
            </div>
          </div>
        )}

        {/* Macronutrients Progress */}
        {mealPlan && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Objectifs nutritionnels
            </h3>
            
            {/* Informations sur la diète */}
            <div className="mb-4 p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700 font-medium">
                  {currentDiet?.autoGenerated ? '🤖 Diète générée automatiquement' : '👤 Diète personnalisée'}
                </span>
                <span className="text-blue-600">
                  {currentDiet?.generatedAt ? 
                    new Date(currentDiet.generatedAt).toLocaleDateString('fr-FR') : 
                    'Aujourd\'hui'
                  }
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              {(() => {
                const finalTargets = getFinalNutritionalTargets();
                return (
                  <>
              {/* Glucides */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <span className="text-gray-600 font-medium">Glucides : </span>
                  <span className="text-gray-800 font-semibold">{mealPlan.totalGlucides}g</span>
                      <span className="text-gray-500"> / {finalTargets.glucides}g</span>
                  <span className="text-blue-600 font-medium ml-2">
                        • {Math.round((mealPlan.totalGlucides / finalTargets.glucides) * 100)}%
                  </span>
                </div>
              </div>
              
              {/* Protéines */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <span className="text-gray-600 font-medium">Protéines : </span>
                  <span className="text-gray-800 font-semibold">{mealPlan.totalProteines}g</span>
                      <span className="text-gray-500"> / {finalTargets.proteines}g</span>
                  <span className="text-red-600 font-medium ml-2">
                        • {Math.round((mealPlan.totalProteines / finalTargets.proteines) * 100)}%
                  </span>
                </div>
              </div>
              
              {/* Lipides */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <span className="text-gray-600 font-medium">Lipides : </span>
                  <span className="text-gray-800 font-semibold">{mealPlan.totalLipides}g</span>
                      <span className="text-gray-500"> / {finalTargets.lipides}g</span>
                  <span className="text-yellow-600 font-medium ml-2">
                        • {Math.round((mealPlan.totalLipides / finalTargets.lipides) * 100)}%
                  </span>
                </div>
              </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {mealPlan && mealPlan.repas && mealPlan.repas.map((meal, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-4">
            <div className="flex items-center gap-3 mb-4">
              {getCategoryIcon(meal.category)}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {meal.category}
                </h3>
                <p className="text-gray-600 text-sm">{meal.name}</p>
              </div>
              <button
                onClick={() => handleReplaceMeal(index)}
                disabled={replacingMealIndex === index}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors active:scale-95 disabled:opacity-50"
                title="Remplacer ce repas"
              >
                <RotateCcw
                  size={16}
                  className={`text-gray-600 hover:text-blue-600 transition-colors ${replacingMealIndex === index ? 'animate-spin' : ''}`}
                />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              {meal.foods.map((food, foodIndex) => (
                <div key={foodIndex} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">{food.name}</span>
                    <div className="text-sm text-gray-500">
                      {food.displayQuantity || `${food.quantity}g`} • {food.calories} kcal
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>P: {food.protein}g</div>
                    <div>G: {food.carbs}g • L: {food.fat}g</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}