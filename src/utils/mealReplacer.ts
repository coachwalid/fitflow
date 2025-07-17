import { getPredefinedMeals, PredefinedMeal } from '../data/predefinedMeals';
import { Meal, Food } from './mealPlanGenerator';
import { getManualAlternatives, selectRandomManualAlternative, MealAlternative, MANUAL_ALTERNATIVES } from '../data/mealAlternatives';

// Valeurs nutritionnelles moyennes pour 100g (approximatives) - Version complète
const NUTRITION_DATA: { [key: string]: { calories: number; protein: number; carbs: number; fat: number; fiber: number } } = {
  // Protéines
  "Blanc de poulet": { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  "Blanc de dinde": { calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0 },
  "Saumon": { calories: 208, protein: 25, carbs: 0, fat: 12, fiber: 0 },
  "Thon": { calories: 144, protein: 30, carbs: 0, fat: 1, fiber: 0 },
  "Cabillaud": { calories: 82, protein: 18, carbs: 0, fat: 0.7, fiber: 0 },
  "Bœuf maigre (5% MG)": { calories: 158, protein: 26, carbs: 0, fat: 5, fiber: 0 },
  "Œufs entiers": { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
  "Tofu ferme": { calories: 144, protein: 15, carbs: 4, fat: 9, fiber: 2 },
  
  // Glucides
  "Riz basmati cuit": { calories: 121, protein: 2.5, carbs: 25, fat: 0.4, fiber: 0.4 },
  "Riz complet cuit": { calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8 },
  "Quinoa cuit": { calories: 120, protein: 4.4, carbs: 22, fat: 1.9, fiber: 2.8 },
  "Patate douce cuite": { calories: 76, protein: 1.4, carbs: 17, fat: 0.1, fiber: 2.5 },
  "Pomme de terre cuite": { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
  "Flocons d'avoine": { calories: 389, protein: 16.9, carbs: 66, fat: 6.9, fiber: 10.6 },
  "Pain complet": { calories: 247, protein: 13, carbs: 41, fat: 4.2, fiber: 7 },
  "Pain de mie complet": { calories: 259, protein: 9, carbs: 43, fat: 4.2, fiber: 6 },
  "Sarrasin cuit": { calories: 92, protein: 3.4, carbs: 20, fat: 0.6, fiber: 2.7 },
  "Orge perlé cuit": { calories: 123, protein: 2.3, carbs: 28, fat: 0.4, fiber: 3.8 },
  "Lentilles cuites": { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9 },
  "Haricots rouges cuits": { calories: 127, protein: 8.7, carbs: 23, fat: 0.5, fiber: 6.4 },
  "Muesli sans sucre": { calories: 325, protein: 8.2, carbs: 72, fat: 3.3, fiber: 7.3 },
  
  // Légumes
  "Brocolis": { calories: 25, protein: 3, carbs: 4, fat: 0.4, fiber: 3 },
  "Épinards": { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
  "Haricots verts": { calories: 31, protein: 1.8, carbs: 7, fat: 0.1, fiber: 3.4 },
  "Courgettes": { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1 },
  "Tomates": { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
  
  // Lipides
  "Avocat": { calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7 },
  "Huile d'olive": { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  "Beurre de cacahuète": { calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 8 },
  "Amandes": { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12 },
  "Noix": { calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 7 },
  "Fruits secs mélangés": { calories: 512, protein: 15, carbs: 44, fat: 32, fiber: 9 },
  
  // Produits laitiers
  "Yaourt grec 0%": { calories: 59, protein: 10, carbs: 4, fat: 0.4, fiber: 0 },
  "Skyr 0%": { calories: 57, protein: 11, carbs: 4, fat: 0.2, fiber: 0 },
  "Fromage blanc 0%": { calories: 47, protein: 8, carbs: 4, fat: 0.2, fiber: 0 },
  "Cottage cheese": { calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0 },
  "Ricotta": { calories: 174, protein: 11, carbs: 3, fat: 13, fiber: 0 },
  "Lait végétal": { calories: 24, protein: 0.4, carbs: 4.2, fat: 1.1, fiber: 0.4 },
  
  // Fruits
  "Banane": { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 },
  "Pomme": { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
  "Compote sans sucre": { calories: 42, protein: 0.1, carbs: 11, fat: 0.1, fiber: 1.2 },
  
  // Autres
  "Protéine en poudre": { calories: 412, protein: 82, carbs: 8, fat: 8, fiber: 0 },
  "Barres protéinées": { calories: 375, protein: 30, carbs: 35, fat: 12, fiber: 5 },
  "Miel": { calories: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 },
  "Chocolat noir 70%": { calories: 546, protein: 7.8, carbs: 45, fat: 31, fiber: 11 },
  "Yaourt aux fruits 0%": { calories: 56, protein: 4.3, carbs: 7.7, fat: 0.1, fiber: 0 }
};

// Configuration des unités personnalisées pour l'affichage - Version complète
const CUSTOM_UNITS: { [key: string]: { unit: string; gramsPerUnit: number; singularUnit?: string } } = {
  "Pain complet": { unit: "tranches de pain complet", gramsPerUnit: 35, singularUnit: "tranche de pain complet" },
  "Pain de mie complet": { unit: "tranches de pain de mie", gramsPerUnit: 35, singularUnit: "tranche de pain de mie" },
  "Œufs entiers": { unit: "œufs", gramsPerUnit: 60, singularUnit: "œuf" },
  "Œuf entier": { unit: "œufs", gramsPerUnit: 60, singularUnit: "œuf" },
  "Pomme": { unit: "pommes", gramsPerUnit: 120, singularUnit: "pomme" },
  "Banane": { unit: "bananes", gramsPerUnit: 120, singularUnit: "banane" },
  "Poire": { unit: "poires", gramsPerUnit: 120, singularUnit: "poire" },
  "Clémentine": { unit: "clémentines", gramsPerUnit: 120, singularUnit: "clémentine" },
  "Orange": { unit: "oranges", gramsPerUnit: 120, singularUnit: "orange" },
  "Kiwi": { unit: "kiwis", gramsPerUnit: 120, singularUnit: "kiwi" },
  "Avocat": { unit: "avocats", gramsPerUnit: 150, singularUnit: "avocat" }
};

// 🍎 RÈGLE OBLIGATOIRE: Limitation des fruits entiers (synchronisé avec mealPlanGenerator)
const WHOLE_FRUITS = [
  'Pomme', 'Banane', 'Poire', 'Clémentine', 'Orange', 'Kiwi', 'Pêche', 'Abricot', 'Prune'
];

const MAX_FRUITS_PER_MEAL = 2; // Maximum 2 fruits entiers par repas/collation

// Classification des aliments par type nutritionnel
const FOOD_CATEGORIES = {
  // Sources principales de lipides (à réduire en priorité si excès de lipides)
  HIGH_FAT_FOODS: [
    'Huile d\'olive', 'Avocat', 'Beurre de cacahuète', 'Amandes', 'Noix', 
    'Fruits secs mélangés', 'Saumon', 'Ricotta'
  ],
  
  // Sources principales de glucides (à réduire en priorité si excès de glucides)
  HIGH_CARB_FOODS: [
    'Pain complet', 'Pain de mie complet', 'Riz basmati cuit', 'Riz complet cuit',
    'Quinoa cuit', 'Patate douce cuite', 'Pomme de terre cuite', 'Flocons d\'avoine',
    'Sarrasin cuit', 'Orge perlé cuit', 'Lentilles cuites', 'Haricots rouges cuits',
    'Muesli sans sucre', 'Banane', 'Pomme', 'Compote sans sucre', 'Miel'
  ],
  
  // Sources de protéines (à ne jamais supprimer)
  PROTEIN_SOURCES: [
    'Blanc de poulet', 'Blanc de dinde', 'Saumon', 'Thon', 'Cabillaud',
    'Bœuf maigre (5% MG)', 'Œufs entiers', 'Tofu ferme', 'Protéine en poudre',
    'Yaourt grec 0%', 'Skyr 0%', 'Fromage blanc 0%', 'Cottage cheese'
  ],
  
  // Légumes (à ne jamais supprimer)
  VEGETABLES: [
    'Brocolis', 'Épinards', 'Haricots verts', 'Courgettes', 'Tomates'
  ],
  
  // Aliments non essentiels (peuvent être supprimés si nécessaire)
  NON_ESSENTIAL: [
    'Huile d\'olive', 'Avocat', 'Miel', 'Chocolat noir 70%'
  ]
};

function roundQuantityTo5g(quantity: number): number {
  return Math.round(quantity / 5) * 5;
}

function formatNutritionValue(value: number): number {
  return value < 100 ? Math.round(value * 10) / 10 : Math.round(value);
}

function formatFoodQuantity(foodName: string, quantity: number): string {
  const custom = CUSTOM_UNITS[foodName];
  if (!custom) return `${quantity}g`;

  if (foodName === "Avocat") {
    if (quantity <= 75) return "½ avocat";
    if (quantity <= 150) return "1 avocat";
    const units = Math.round(quantity / custom.gramsPerUnit);
    return `${units} ${units === 1 ? custom.singularUnit : custom.unit}`;
  }

  const units = Math.round(quantity / custom.gramsPerUnit);
  if (units === 0) {
    return `${quantity}g`; // Fallback en grammes si trop petit
  }
  
  // 🍎 VALIDATION FRUITS: Limiter à 2 unités maximum (synchronisé avec mealPlanGenerator)
  if (WHOLE_FRUITS.includes(foodName) && units > MAX_FRUITS_PER_MEAL) {
    console.warn(`⚠️ LIMITATION FRUITS: ${foodName} réduit de ${units} à ${MAX_FRUITS_PER_MEAL} unités`);
    return `${MAX_FRUITS_PER_MEAL} ${MAX_FRUITS_PER_MEAL === 1 ? custom.singularUnit : custom.unit}`;
  }
  
  if (units === 1 && custom.singularUnit) {
    return `1 ${custom.singularUnit}`;
  }
  return `${units} ${custom.unit}`;
}

function calculateFoodNutrition(food: { name: string; quantity: number }): Food {
  const data = NUTRITION_DATA[food.name];
  if (!data) {
    console.warn(`Nutrition data not found for: ${food.name}`);
    return {
      name: food.name,
      quantity: food.quantity,
      displayQuantity: formatFoodQuantity(food.name, food.quantity),
      calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0
    };
  }

  let qty = roundQuantityTo5g(food.quantity);
  
  // 🍎 RÈGLE OBLIGATOIRE: Limiter les fruits entiers à 2 unités maximum (synchronisé avec mealPlanGenerator)
  if (WHOLE_FRUITS.includes(food.name)) {
    const customUnit = CUSTOM_UNITS[food.name];
    if (customUnit) {
      const units = Math.round(qty / customUnit.gramsPerUnit);
      if (units > MAX_FRUITS_PER_MEAL) {
        const limitedQuantity = MAX_FRUITS_PER_MEAL * customUnit.gramsPerUnit;
        console.warn(`🍎 LIMITATION APPLIQUÉE: ${food.name} ${qty}g (${units} unités) → ${limitedQuantity}g (${MAX_FRUITS_PER_MEAL} unités max)`);
        qty = limitedQuantity;
      }
    }
  }
  
  const factor = qty / 100;

  return {
    name: food.name,
    quantity: qty,
    displayQuantity: formatFoodQuantity(food.name, qty),
    calories: formatNutritionValue(data.calories * factor),
    protein: formatNutritionValue(data.protein * factor),
    carbs: formatNutritionValue(data.carbs * factor),
    fat: formatNutritionValue(data.fat * factor),
    fiber: formatNutritionValue(data.fiber * factor)
  };
}

function calculateMealTotals(foods: Food[]) {
  return foods.reduce((totals, f) => ({
    calories: totals.calories + f.calories,
    protein: totals.protein + f.protein,
    carbs: totals.carbs + f.carbs,
    fat: totals.fat + f.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

/**
 * 🔒 VALIDATION STRICTE OBLIGATOIRE 90-110% (synchronisé avec mealPlanGenerator)
 * AUCUN REPAS NE PEUT ÊTRE VALIDÉ SI UN SEUL MACRO SORT DE CETTE FOURCHETTE
 */
function validateMacronutrientsStrict(
  actual: { calories: number; proteines: number; glucides: number; lipides: number },
  targets: { caloriesTarget: number; proteinesTarget: number; glucidesTarget: number; lipidesTarget: number }
): { isValid: boolean; violations: string[]; scores: { [key: string]: number } } {
  
  console.log('🔒 VALIDATION STRICTE OBLIGATOIRE 90-110% (mealReplacer)');
  
  const violations: string[] = [];
  const scores = {
    calories: (actual.calories / targets.caloriesTarget) * 100,
    proteines: (actual.proteines / targets.proteinesTarget) * 100,
    glucides: (actual.glucides / targets.glucidesTarget) * 100,
    lipides: (actual.lipides / targets.lipidesTarget) * 100
  };
  
  console.log('📊 Scores calculés (mealReplacer):');
  console.log(`   • Calories: ${scores.calories.toFixed(1)}% (objectif: 90-110%)`);
  console.log(`   • Protéines: ${scores.proteines.toFixed(1)}% (objectif: 90-110%)`);
  console.log(`   • Glucides: ${scores.glucides.toFixed(1)}% (objectif: 90-110%)`);
  console.log(`   • Lipides: ${scores.lipides.toFixed(1)}% (objectif: 90-110%)`);
  
  // VÉRIFICATION STRICTE: AUCUN MACRO NE PEUT SORTIR DE 90-110%
  if (scores.calories < 90 || scores.calories > 110) {
    violations.push(`Calories: ${scores.calories.toFixed(1)}% (HORS ZONE 90-110%)`);
  }
  
  if (scores.proteines < 90 || scores.proteines > 110) {
    violations.push(`Protéines: ${scores.proteines.toFixed(1)}% (HORS ZONE 90-110%)`);
  }
  
  if (scores.glucides < 90 || scores.glucides > 110) {
    violations.push(`Glucides: ${scores.glucides.toFixed(1)}% (HORS ZONE 90-110%)`);
  }
  
  if (scores.lipides < 90 || scores.lipides > 110) {
    violations.push(`Lipides: ${scores.lipides.toFixed(1)}% (HORS ZONE 90-110%)`);
  }
  
  const isValid = violations.length === 0;
  
  if (isValid) {
    console.log('✅ REPAS VALIDÉ: Tous les macronutriments sont dans la zone 90-110%');
  } else {
    console.log(`❌ REPAS REJETÉ: ${violations.length} violation(s) détectée(s)`);
    violations.forEach(violation => console.log(`   • ${violation}`));
  }
  
  return {
    isValid,
    violations,
    scores
  };
}

/**
 * 🔒 VALIDATION FLEXIBLE 85-115% pour les alternatives manuelles
 */
function validateMacronutrientsFlexible(
  actual: { calories: number; proteines: number; glucides: number; lipides: number },
  targets: { caloriesTarget: number; proteinesTarget: number; glucidesTarget: number; lipidesTarget: number }
): { isValid: boolean; violations: string[]; scores: { [key: string]: number } } {
  
  console.log('🔒 VALIDATION FLEXIBLE 85-115% (mealReplacer)');
  
  const violations: string[] = [];
  const scores = {
    calories: (actual.calories / targets.caloriesTarget) * 100,
    proteines: (actual.proteines / targets.proteinesTarget) * 100,
    glucides: (actual.glucides / targets.glucidesTarget) * 100,
    lipides: (actual.lipides / targets.lipidesTarget) * 100
  };
  
  console.log('📊 Scores calculés (mealReplacer flexible):');
  console.log(`   • Calories: ${scores.calories.toFixed(1)}% (objectif: 85-115%)`);
  console.log(`   • Protéines: ${scores.proteines.toFixed(1)}% (objectif: 85-115%)`);
  console.log(`   • Glucides: ${scores.glucides.toFixed(1)}% (objectif: 85-115%)`);
  console.log(`   • Lipides: ${scores.lipides.toFixed(1)}% (objectif: 85-115%)`);
  
  // VÉRIFICATION FLEXIBLE: AUCUN MACRO NE PEUT SORTIR DE 85-115%
  if (scores.calories < 85 || scores.calories > 115) {
    violations.push(`Calories: ${scores.calories.toFixed(1)}% (HORS ZONE 85-115%)`);
  }
  
  if (scores.proteines < 85 || scores.proteines > 115) {
    violations.push(`Protéines: ${scores.proteines.toFixed(1)}% (HORS ZONE 85-115%)`);
  }
  
  if (scores.glucides < 85 || scores.glucides > 115) {
    violations.push(`Glucides: ${scores.glucides.toFixed(1)}% (HORS ZONE 85-115%)`);
  }
  
  if (scores.lipides < 85 || scores.lipides > 115) {
    violations.push(`Lipides: ${scores.lipides.toFixed(1)}% (HORS ZONE 85-115%)`);
  }
  
  const isValid = violations.length === 0;
  
  if (isValid) {
    console.log('✅ REPAS VALIDÉ: Tous les macronutriments sont dans la zone 85-115%');
  } else {
    console.log(`❌ REPAS REJETÉ: ${violations.length} violation(s) détectée(s)`);
    violations.forEach(violation => console.log(`   • ${violation}`));
  }
  
  return {
    isValid,
    violations,
    scores
  };
}

/**
 * Optimise intelligemment un repas pour respecter les contraintes nutritionnelles
 * en réduisant ou supprimant les aliments sources d'excès
 */
function optimizeMealForConstraints(
  foods: Food[],
  targetCalories: number,
  targetProtein: number,
  targetCarbs: number,
  targetFat: number
): Food[] {
  console.log('🔧 Optimisation intelligente du repas pour respecter les contraintes...');
  
  let optimizedFoods = [...foods];
  let currentTotals = calculateMealTotals(optimizedFoods);
  
  console.log(`📊 Valeurs initiales: ${currentTotals.calories}kcal, ${currentTotals.protein}g prot, ${currentTotals.carbs}g gluc, ${currentTotals.fat}g lip`);
  console.log(`🎯 Objectifs: ${targetCalories}kcal, ${targetProtein}g prot, ${targetCarbs}g gluc, ${targetFat}g lip`);
  
  // Vérifier les dépassements (seuil de 110%)
  const carbsExcess = currentTotals.carbs > targetCarbs * 1.1;
  const fatExcess = currentTotals.fat > targetFat * 1.1;
  
  if (!carbsExcess && !fatExcess) {
    console.log('✅ Aucun dépassement détecté, pas d\'optimisation nécessaire');
    return optimizedFoods;
  }
  
  console.log(`⚠️ Dépassements détectés: glucides=${carbsExcess}, lipides=${fatExcess}`);
  
  // ÉTAPE 1: Réduction progressive des aliments sources d'excès
  if (carbsExcess) {
    console.log('🔄 Réduction des sources de glucides...');
    optimizedFoods = reduceNutrientSources(optimizedFoods, 'carbs', targetCarbs * 1.1, FOOD_CATEGORIES.HIGH_CARB_FOODS);
  }
  
  if (fatExcess) {
    console.log('🔄 Réduction des sources de lipides...');
    optimizedFoods = reduceNutrientSources(optimizedFoods, 'fat', targetFat * 1.1, FOOD_CATEGORIES.HIGH_FAT_FOODS);
  }
  
  currentTotals = calculateMealTotals(optimizedFoods);
  
  // ÉTAPE 2: Suppression d'aliments non essentiels si nécessaire
  if (currentTotals.carbs > targetCarbs * 1.1 || currentTotals.fat > targetFat * 1.1) {
    console.log('🔄 Suppression d\'aliments non essentiels...');
    optimizedFoods = removeNonEssentialFoods(optimizedFoods, targetCarbs * 1.1, targetFat * 1.1);
  }
  
  const finalTotals = calculateMealTotals(optimizedFoods);
  console.log(`📊 Valeurs finales: ${finalTotals.calories}kcal, ${finalTotals.protein}g prot, ${finalTotals.carbs}g gluc, ${finalTotals.fat}g lip`);
  
  return optimizedFoods;
}

/**
 * Réduit progressivement les quantités des aliments sources d'un nutriment spécifique
 */
function reduceNutrientSources(
  foods: Food[],
  nutrient: 'carbs' | 'fat',
  maxTarget: number,
  sourceFoods: string[]
): Food[] {
  let reducedFoods = [...foods];
  let currentTotal = calculateMealTotals(reducedFoods);
  let currentNutrient = nutrient === 'carbs' ? currentTotal.carbs : currentTotal.fat;
  
  // Trier les aliments sources par ordre de priorité de réduction
  const sourceIndices = reducedFoods
    .map((food, index) => ({ food, index, isSource: sourceFoods.includes(food.name) }))
    .filter(item => item.isSource)
    .sort((a, b) => {
      // Prioriser les aliments non essentiels
      const aIsNonEssential = FOOD_CATEGORIES.NON_ESSENTIAL.includes(a.food.name);
      const bIsNonEssential = FOOD_CATEGORIES.NON_ESSENTIAL.includes(b.food.name);
      
      if (aIsNonEssential && !bIsNonEssential) return -1;
      if (!aIsNonEssential && bIsNonEssential) return 1;
      
      // Puis par quantité du nutriment (réduire d'abord les plus riches)
      const aNutrient = nutrient === 'carbs' ? a.food.carbs : a.food.fat;
      const bNutrient = nutrient === 'carbs' ? b.food.carbs : b.food.fat;
      return bNutrient - aNutrient;
    });
  
  console.log(`📋 ${sourceIndices.length} sources de ${nutrient} identifiées pour réduction`);
  
  // Réduire progressivement chaque aliment source
  for (const { index } of sourceIndices) {
    if (currentNutrient <= maxTarget) break;
    
    const food = reducedFoods[index];
    const originalQuantity = food.quantity;
    
    // Essayer différents niveaux de réduction (20%, 40%, 60%, 80%)
    for (const reductionPercent of [0.2, 0.4, 0.6, 0.8]) {
      const newQuantity = roundQuantityTo5g(originalQuantity * (1 - reductionPercent));
      
      if (newQuantity < 10) continue; // Ne pas descendre en dessous de 10g
      
      // Tester la réduction
      const testFood = calculateFoodNutrition({ name: food.name, quantity: newQuantity });
      const testFoods = [...reducedFoods];
      testFoods[index] = testFood;
      
      const testTotals = calculateMealTotals(testFoods);
      const testNutrient = nutrient === 'carbs' ? testTotals.carbs : testTotals.fat;
      
      if (testNutrient <= maxTarget) {
        console.log(`✅ ${food.name}: ${originalQuantity}g → ${newQuantity}g (réduction ${(reductionPercent * 100).toFixed(0)}%)`);
        reducedFoods[index] = testFood;
        currentTotal = testTotals;
        currentNutrient = testNutrient;
        break;
      }
    }
  }
  
  return reducedFoods;
}

/**
 * Supprime complètement les aliments non essentiels si les contraintes ne sont toujours pas respectées
 */
function removeNonEssentialFoods(
  foods: Food[],
  maxCarbs: number,
  maxFat: number
): Food[] {
  let filteredFoods = [...foods];
  let currentTotals = calculateMealTotals(filteredFoods);
  
  console.log('🗑️ Suppression d\'aliments non essentiels...');
  
  // Trier les aliments non essentiels par impact nutritionnel
  const nonEssentialIndices = filteredFoods
    .map((food, index) => ({ 
      food, 
      index, 
      isNonEssential: FOOD_CATEGORIES.NON_ESSENTIAL.includes(food.name),
      carbsImpact: food.carbs,
      fatImpact: food.fat
    }))
    .filter(item => item.isNonEssential)
    .sort((a, b) => {
      // Prioriser la suppression des aliments qui contribuent le plus aux excès
      const aImpact = (currentTotals.carbs > maxCarbs ? a.carbsImpact : 0) + 
                     (currentTotals.fat > maxFat ? a.fatImpact : 0);
      const bImpact = (currentTotals.carbs > maxCarbs ? b.carbsImpact : 0) + 
                     (currentTotals.fat > maxFat ? b.fatImpact : 0);
      return bImpact - aImpact;
    });
  
  // Supprimer les aliments un par un jusqu'à respecter les contraintes
  for (const { index, food } of nonEssentialIndices) {
    if (currentTotals.carbs <= maxCarbs && currentTotals.fat <= maxFat) break;
    
    console.log(`🗑️ Suppression de: ${food.name} (${food.carbs}g gluc, ${food.fat}g lip)`);
    
    // Supprimer l'aliment
    filteredFoods = filteredFoods.filter((_, i) => i !== index);
    currentTotals = calculateMealTotals(filteredFoods);
    
    // Réajuster les indices pour les suppressions suivantes
    nonEssentialIndices.forEach(item => {
      if (item.index > index) item.index--;
    });
  }
  
  return filteredFoods;
}

/**
 * Ajuste intelligemment les quantités d'un repas alternatif pour respecter 
 * au moins 90% des valeurs nutritionnelles du repas initial, avec contraintes strictes 90-110%
 */
function adjustMealToTargetNutrition(
  predefinedMeal: PredefinedMeal, 
  targetCalories: number, 
  targetProtein: number, 
  targetCarbs: number, 
  targetFat: number
): Meal | null {
  console.log(`🔄 Ajustement du repas: ${predefinedMeal.name}`);
  console.log(`📊 Objectifs: ${targetCalories}kcal, ${targetProtein}g prot, ${targetCarbs}g gluc, ${targetFat}g lip`);
  
  // Calculer les valeurs nutritionnelles de base du repas alternatif
  const baseFoods = predefinedMeal.foods.map(f => calculateFoodNutrition(f));
  const baseTotals = calculateMealTotals(baseFoods);
  
  if (baseTotals.calories === 0) {
    console.warn(`❌ Repas sans calories: ${predefinedMeal.name}`);
    return null;
  }
  
  console.log(`📈 Valeurs de base: ${baseTotals.calories}kcal, ${baseTotals.protein}g prot, ${baseTotals.carbs}g gluc, ${baseTotals.fat}g lip`);
  
  // Essayer différentes stratégies d'ajustement
  const strategies = [
    // Stratégie 1: Ajustement basé sur les calories (priorité principale)
    { factor: targetCalories / baseTotals.calories, name: "calories" },
    
    // Stratégie 2: Ajustement basé sur les protéines (important pour la satiété)
    { factor: targetProtein / baseTotals.protein, name: "protéines" },
    
    // Stratégie 3: Moyenne pondérée des facteurs
    { 
      factor: (
        (targetCalories / baseTotals.calories) * 0.4 +
        (targetProtein / baseTotals.protein) * 0.3 +
        (targetCarbs / baseTotals.carbs) * 0.15 +
        (targetFat / baseTotals.fat) * 0.15
      ), 
      name: "moyenne pondérée" 
    }
  ];
  
  for (const strategy of strategies) {
    // Limiter le facteur d'ajustement pour éviter des portions irréalistes
    const adjustmentFactor = Math.max(0.5, Math.min(2.0, strategy.factor));
    
    console.log(`🎯 Test stratégie "${strategy.name}" avec facteur ${adjustmentFactor.toFixed(2)}`);
    
    // Appliquer l'ajustement initial
    let adjustedFoods = baseFoods.map(food => {
      const newQuantity = roundQuantityTo5g(food.quantity * adjustmentFactor);
      return calculateFoodNutrition({ name: food.name, quantity: newQuantity });
    });
    
    let adjustedTotals = calculateMealTotals(adjustedFoods);
    
    console.log(`📊 Après ajustement initial: ${adjustedTotals.calories}kcal, ${adjustedTotals.protein}g prot, ${adjustedTotals.carbs}g gluc, ${adjustedTotals.fat}g lip`);
    
    // NOUVELLE ÉTAPE: Optimisation pour respecter les contraintes de 110%
    const carbsExcess = adjustedTotals.carbs > targetCarbs * 1.1;
    const fatExcess = adjustedTotals.fat > targetFat * 1.1;
    
    if (carbsExcess || fatExcess) {
      console.log(`⚠️ Dépassements détectés après ajustement: glucides=${carbsExcess ? 'OUI' : 'NON'}, lipides=${fatExcess ? 'OUI' : 'NON'}`);
      
      // Appliquer l'optimisation intelligente
      adjustedFoods = optimizeMealForConstraints(
        adjustedFoods,
        targetCalories,
        targetProtein,
        targetCarbs,
        targetFat
      );
      
      adjustedTotals = calculateMealTotals(adjustedFoods);
      console.log(`📊 Après optimisation: ${adjustedTotals.calories}kcal, ${adjustedTotals.protein}g prot, ${adjustedTotals.carbs}g gluc, ${adjustedTotals.fat}g lip`);
    }
    
    // 🔒 VALIDATION STRICTE OBLIGATOIRE 90-110% (remplace l'ancienne logique)
    const validation = validateMacronutrientsStrict(
      {
        calories: adjustedTotals.calories,
        proteines: adjustedTotals.protein,
        glucides: adjustedTotals.carbs,
        lipides: adjustedTotals.fat
      },
      {
        caloriesTarget: targetCalories,
        proteinesTarget: targetProtein,
        glucidesTarget: targetCarbs,
        lipidesTarget: targetFat
      }
    );
    
    console.log(`📈 Validation stricte: ${validation.isValid ? 'VALIDÉ' : 'REJETÉ'}`);
    if (!validation.isValid) {
      console.log(`❌ Violations: ${validation.violations.join(', ')}`);
    }
    
    // Accepter UNIQUEMENT si la validation stricte est respectée
    if (validation.isValid) {
      console.log(`✅ Repas ajusté avec succès avec la stratégie "${strategy.name}"`);
      
      return {
        id: predefinedMeal.id,
        category: predefinedMeal.category,
        name: predefinedMeal.name,
        foods: adjustedFoods,
        totalCalories: formatNutritionValue(adjustedTotals.calories),
        totalProteines: formatNutritionValue(adjustedTotals.protein),
        totalGlucides: formatNutritionValue(adjustedTotals.carbs),
        totalLipides: formatNutritionValue(adjustedTotals.fat)
      };
    } else {
      console.log(`❌ Stratégie "${strategy.name}" rejetée: validation stricte échouée`);
    }
  }
  
  console.log(`❌ Impossible d'ajuster le repas ${predefinedMeal.name} aux objectifs nutritionnels avec les contraintes strictes 90-110%`);
  return null;
}

/**
 * 🔄 NOUVELLE LOGIQUE: Convertit une alternative manuelle en repas avec calculs nutritionnels
 */
function convertManualAlternativeToMeal(alternative: MealAlternative): Meal {
  console.log(`🔄 Conversion de l'alternative manuelle: ${alternative.name}`);
  
  const foods = alternative.foods.map(food => calculateFoodNutrition(food));
  const totals = calculateMealTotals(foods);
  
  return {
    id: alternative.id,
    category: alternative.category,
    name: alternative.name,
    foods: foods,
    totalCalories: formatNutritionValue(totals.calories),
    totalProteines: formatNutritionValue(totals.protein),
    totalGlucides: formatNutritionValue(totals.carbs),
    totalLipides: formatNutritionValue(totals.fat)
  };
}

/**
 * 🔧 FONCTION UTILITAIRE: Ajuste une alternative manuelle aux objectifs nutritionnels
 * Identique à adjustMealToTargetNutrition mais adaptée pour les alternatives manuelles
 */
function adjustManualAlternativeToTargetNutritionFlexible(
  manualAlternative: MealAlternative,
  targetCalories: number,
  targetProtein: number,
  targetCarbs: number,
  targetFat: number
): Meal | null {
  console.log(`🔄 Ajustement FLEXIBLE de l'alternative manuelle: ${manualAlternative.name}`);
  console.log(`📊 Objectifs: ${targetCalories}kcal, ${targetProtein}g prot, ${targetCarbs}g gluc, ${targetFat}g lip`);
  
  // Calculer les valeurs nutritionnelles de base de l'alternative
  const baseFoods = manualAlternative.foods.map(f => calculateFoodNutrition(f));
  const baseTotals = calculateMealTotals(baseFoods);
  
  if (baseTotals.calories === 0) {
    console.warn(`❌ Alternative sans calories: ${manualAlternative.name}`);
    return null;
  }
  
  console.log(`📈 Valeurs de base: ${baseTotals.calories}kcal, ${baseTotals.protein}g prot, ${baseTotals.carbs}g gluc, ${baseTotals.fat}g lip`);
  
  // Essayer différentes stratégies d'ajustement avec plus de flexibilité
  const strategies = [
    // Stratégie 1: Ajustement basé sur les calories (priorité principale)
    { factor: targetCalories / baseTotals.calories, name: "calories" },
    
    // Stratégie 2: Ajustement basé sur les protéines (important pour la satiété)
    { factor: targetProtein / baseTotals.protein, name: "protéines" },
    
    // Stratégie 3: Moyenne pondérée des facteurs
    { 
      factor: (
        (targetCalories / baseTotals.calories) * 0.4 +
        (targetProtein / baseTotals.protein) * 0.3 +
        (targetCarbs / baseTotals.carbs) * 0.15 +
        (targetFat / baseTotals.fat) * 0.15
      ), 
      name: "moyenne pondérée" 
    },
    
    // Stratégie 4: Facteur conservateur (80% de l'ajustement optimal)
    { factor: (targetCalories / baseTotals.calories) * 0.8, name: "conservateur" },
    
    // Stratégie 5: Facteur progressif (120% de l'ajustement optimal)
    { factor: (targetCalories / baseTotals.calories) * 1.2, name: "progressif" }
  ];
  
  for (const strategy of strategies) {
    // Limiter le facteur d'ajustement avec plus de flexibilité
    const adjustmentFactor = Math.max(0.3, Math.min(3.0, strategy.factor));
    
    console.log(`🎯 Test stratégie "${strategy.name}" avec facteur ${adjustmentFactor.toFixed(2)}`);
    
    // Appliquer l'ajustement initial
    let adjustedFoods = baseFoods.map(food => {
      const newQuantity = roundQuantityTo5g(food.quantity * adjustmentFactor);
      return calculateFoodNutrition({ name: food.name, quantity: newQuantity });
    });
    
    let adjustedTotals = calculateMealTotals(adjustedFoods);
    
    console.log(`📊 Après ajustement initial: ${adjustedTotals.calories}kcal, ${adjustedTotals.protein}g prot, ${adjustedTotals.carbs}g gluc, ${adjustedTotals.fat}g lip`);
    
    // ÉTAPE D'OPTIMISATION: Respecter les contraintes avec plus de tolérance
    const carbsExcess = adjustedTotals.carbs > targetCarbs * 1.15; // 115% au lieu de 110%
    const fatExcess = adjustedTotals.fat > targetFat * 1.15; // 115% au lieu de 110%
    
    if (carbsExcess || fatExcess) {
      console.log(`⚠️ Dépassements détectés après ajustement: glucides=${carbsExcess ? 'OUI' : 'NON'}, lipides=${fatExcess ? 'OUI' : 'NON'}`);
      
      // Appliquer l'optimisation intelligente
      adjustedFoods = optimizeMealForConstraints(
        adjustedFoods,
        targetCalories,
        targetProtein,
        targetCarbs,
        targetFat
      );
      
      adjustedTotals = calculateMealTotals(adjustedFoods);
      console.log(`📊 Après optimisation: ${adjustedTotals.calories}kcal, ${adjustedTotals.protein}g prot, ${adjustedTotals.carbs}g gluc, ${adjustedTotals.fat}g lip`);
    }
    
    // 🔒 VALIDATION FLEXIBLE 85-115% pour les alternatives manuelles
    const validation = validateMacronutrientsFlexible(
      {
        calories: adjustedTotals.calories,
        proteines: adjustedTotals.protein,
        glucides: adjustedTotals.carbs,
        lipides: adjustedTotals.fat
      },
      {
        caloriesTarget: targetCalories,
        proteinesTarget: targetProtein,
        glucidesTarget: targetCarbs,
        lipidesTarget: targetFat
      }
    );
    
    console.log(`📈 Validation flexible: ${validation.isValid ? 'VALIDÉ' : 'REJETÉ'}`);
    if (!validation.isValid) {
      console.log(`❌ Violations: ${validation.violations.join(', ')}`);
    }
    
    // Accepter si la validation flexible est respectée
    if (validation.isValid) {
      console.log(`✅ Alternative manuelle ajustée avec succès avec la stratégie "${strategy.name}"`);
      
      return {
        id: manualAlternative.id,
        category: manualAlternative.category,
        name: manualAlternative.name,
        foods: adjustedFoods,
        totalCalories: formatNutritionValue(adjustedTotals.calories),
        totalProteines: formatNutritionValue(adjustedTotals.protein),
        totalGlucides: formatNutritionValue(adjustedTotals.carbs),
        totalLipides: formatNutritionValue(adjustedTotals.fat)
      };
    } else {
      console.log(`❌ Stratégie "${strategy.name}" rejetée: validation flexible échouée`);
    }
  }
  
  console.log(`❌ Impossible d'ajuster l'alternative manuelle ${manualAlternative.name} aux objectifs nutritionnels avec les contraintes flexibles 85-115%`);
  return null;
}

/**
 * 🎯 NOUVELLE LOGIQUE PRIORITAIRE: Remplacement avec alternatives manuelles validées
 * 
 * ORDRE DE PRIORITÉ:
 * 1. Alternatives manuelles validées (CSV)
 * 2. Repas de la base standard (ancien système)
 * 3. Génération sur mesure (dernier recours)
 * 
 * ⚠️ IMPORTANT: Utilise les objectifs nutritionnels du repas actuel comme référence
 * (qui sont déjà basés sur les objectifs finaux post-objectif choisi)
 */
export function replaceMeal(currentMeal: Meal, allMeals?: PredefinedMeal[]): Meal | null {
  console.log(`🔄 REMPLACEMENT AVEC LOGIQUE PRIORITAIRE pour: ${currentMeal.name} (${currentMeal.category})`);
  console.log(`🎯 Objectifs nutritionnels: ${currentMeal.totalCalories}kcal, ${currentMeal.totalProteines}g prot, ${currentMeal.totalGlucides}g gluc, ${currentMeal.totalLipides}g lip`);
  console.log(`📌 NOTE: Ces objectifs sont déjà basés sur les objectifs finaux (post-objectif choisi)`);
  
  // 🔍 LOGGING DÉTAILLÉ POUR DIAGNOSTIC
  console.log(`📋 DIAGNOSTIC DÉTAILLÉ:`);
  console.log(`   • Nom exact du repas: "${currentMeal.name}"`);
  console.log(`   • Catégorie: "${currentMeal.category}"`);
  console.log(`   • ID: "${currentMeal.id}"`);
  
  // Vérifier si ce nom existe dans les alternatives manuelles
  const availableManualMeals = Object.keys(MANUAL_ALTERNATIVES);
  console.log(`📚 Repas avec alternatives manuelles disponibles (${availableManualMeals.length}):`);
  availableManualMeals.forEach((mealName, index) => {
    const isExactMatch = mealName === currentMeal.name;
    console.log(`   ${index + 1}. "${mealName}" ${isExactMatch ? '✅ MATCH EXACT' : ''}`);
  });
  
  // Vérification de correspondance exacte
  const hasExactMatch = availableManualMeals.includes(currentMeal.name);
  console.log(`🔍 Correspondance exacte trouvée: ${hasExactMatch ? 'OUI ✅' : 'NON ❌'}`);
  
  if (!hasExactMatch) {
    console.log(`⚠️ PROBLÈME DÉTECTÉ: Le nom "${currentMeal.name}" ne correspond à aucune clé dans MANUAL_ALTERNATIVES`);
    console.log(`💡 Vérifiez que le nom dans predefinedMeals.ts correspond exactement à la clé dans mealAlternatives.ts`);
  }
  
  // 🥇 PRIORITÉ 1: Alternatives manuelles validées
  console.log('🥇 PRIORITÉ 1: Recherche d\'alternatives manuelles validées...');
  const manualAlternatives = getManualAlternatives(currentMeal.name);
  
  if (manualAlternatives.length > 0) {
    console.log(`✅ ${manualAlternatives.length} alternative(s) manuelle(s) trouvée(s)`);
    console.log(`📋 Alternatives disponibles:`);
    manualAlternatives.forEach((alt, index) => {
      console.log(`   ${index + 1}. "${alt.name}" (ID: ${alt.id})`);
    });
    
    // Essayer chaque alternative manuelle avec des stratégies d'ajustement plus flexibles
    for (let attempt = 0; attempt < manualAlternatives.length; attempt++) {
      const selectedAlternative = selectRandomManualAlternative(currentMeal.name);
      
      if (selectedAlternative) {
        console.log(`🧪 Test de l'alternative manuelle: ${selectedAlternative.name}`);
        
        // Convertir l'alternative en repas
        const baseMeal = convertManualAlternativeToMeal(selectedAlternative);
        
        // Ajuster les quantités pour respecter les objectifs nutritionnels avec stratégies flexibles
        const adjustedMeal = adjustManualAlternativeToTargetNutritionFlexible(
          selectedAlternative,
          currentMeal.totalCalories,
          currentMeal.totalProteines,
          currentMeal.totalGlucides,
          currentMeal.totalLipides
        );
        
        if (adjustedMeal) {
          console.log(`✅ SUCCÈS avec alternative manuelle: ${currentMeal.name} → ${adjustedMeal.name}`);
          console.log(`📊 Nouvelles valeurs: ${adjustedMeal.totalCalories}kcal, ${adjustedMeal.totalProteines}g prot, ${adjustedMeal.totalGlucides}g gluc, ${adjustedMeal.totalLipides}g lip`);
          return adjustedMeal;
        } else {
          console.log(`❌ Alternative manuelle "${selectedAlternative.name}" ne respecte pas les contraintes 90-110%`);
        }
      }
    }
    
    console.log(`⚠️ Aucune alternative manuelle n'a pu être ajustée aux contraintes 90-110%`);
  } else {
    console.log(`❌ Aucune alternative manuelle trouvée pour "${currentMeal.name}"`);
    console.log(`💡 SUGGESTIONS DE DÉBOGAGE:`);
    console.log(`   • Vérifiez l'orthographe exacte du nom dans predefinedMeals.ts`);
    console.log(`   • Vérifiez que la clé existe dans MANUAL_ALTERNATIVES`);
    console.log(`   • Vérifiez les espaces, accents et caractères spéciaux`);
  }
  
  // 🥈 PRIORITÉ 2: Repas de la base standard (ancien système)
  console.log('🥈 PRIORITÉ 2: Recherche dans la base de repas standard...');
  const standardReplacement = replaceMealWithStandardBase(currentMeal, allMeals);
  
  if (standardReplacement) {
    console.log(`✅ SUCCÈS avec repas standard: ${currentMeal.name} → ${standardReplacement.name}`);
    return standardReplacement;
  }
  
  // 🥉 PRIORITÉ 3: Génération sur mesure (dernier recours)
  console.log('🥉 PRIORITÉ 3: Génération sur mesure (dernier recours)...');
  console.warn(`❌ ÉCHEC TOTAL: Aucun remplacement trouvé pour "${currentMeal.name}" avec toutes les méthodes`);
  
  return null;
}

/**
 * 🔄 ANCIEN SYSTÈME: Remplacement avec la base de repas standard
 * Remplace un repas par un repas alternatif de la même catégorie
 * en ajustant automatiquement les quantités pour respecter les objectifs nutritionnels
 * et les contraintes strictes de 90-110% pour tous les macronutriments
 */
function replaceMealWithStandardBase(currentMeal: Meal, allMeals?: PredefinedMeal[]): Meal | null {
  console.log(`🔄 Remplacement avec base standard pour: ${currentMeal.name} (${currentMeal.category})`);
  console.log(`🎯 Objectifs nutritionnels: ${currentMeal.totalCalories}kcal, ${currentMeal.totalProteines}g prot, ${currentMeal.totalGlucides}g gluc, ${currentMeal.totalLipides}g lip`);
  
  const predefinedMeals = allMeals || getPredefinedMeals();
  
  // Filtrer les candidats de remplacement (même catégorie, différent ID)
  const candidates = predefinedMeals.filter(
    m => m.category === currentMeal.category && m.id !== currentMeal.id
  );
  
  console.log(`📋 ${candidates.length} candidats trouvés pour la catégorie ${currentMeal.category}`);
  
  if (candidates.length === 0) {
    console.warn(`❌ Aucun candidat de remplacement trouvé pour ${currentMeal.category}`);
    return null;
  }
  
  // Mélanger les candidats pour avoir de la variété
  const shuffledCandidates = candidates.sort(() => Math.random() - 0.5);
  
  // Essayer chaque candidat jusqu'à trouver un qui fonctionne
  for (let i = 0; i < shuffledCandidates.length; i++) {
    const candidate = shuffledCandidates[i];
    console.log(`🧪 Test du candidat ${i + 1}/${shuffledCandidates.length}: ${candidate.name}`);
    
    const adjustedMeal = adjustMealToTargetNutrition(
      candidate,
      currentMeal.totalCalories,
      currentMeal.totalProteines,
      currentMeal.totalGlucides,
      currentMeal.totalLipides
    );
    
    if (adjustedMeal) {
      console.log(`✅ Remplacement réussi: ${currentMeal.name} → ${adjustedMeal.name}`);
      
      // La validation stricte est déjà effectuée dans adjustMealToTargetNutrition
      // Plus besoin de vérifications supplémentaires
      return adjustedMeal;
    }
  }
  
  console.warn(`❌ Aucun remplacement standard satisfaisant trouvé pour: ${currentMeal.name} (${currentMeal.category}) avec les contraintes strictes 90-110%`);
  return null;
}