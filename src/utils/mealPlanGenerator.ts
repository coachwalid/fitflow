import { getPredefinedMeals } from '../data/predefinedMeals';

export interface MealPlanOptions {
  caloriesTarget: number;
  proteinesTarget: number;
  glucidesTarget: number;
  lipidesTarget: number;
  repasParJour: number;
  collationsParJour: number;
}

export interface Food {
  name: string;
  quantity: number;
  displayQuantity?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Meal {
  id: string;
  category: string;
  name: string;
  foods: Food[];
  totalCalories: number;
  totalProteines: number;
  totalGlucides: number;
  totalLipides: number;
}

export interface MealPlanResult {
  repas: Meal[];
  totalCalories: number;
  totalProteines: number;
  totalGlucides: number;
  totalLipides: number;
  success: boolean;
  validationMessage?: string;
}

// Valeurs nutritionnelles moyennes pour 100g
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

// Configuration des unités personnalisées pour l'affichage
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

// 🍎 RÈGLE OBLIGATOIRE: Limitation des fruits entiers (max 2 par repas)
const WHOLE_FRUITS = [
  'Pomme', 'Banane', 'Poire', 'Clémentine', 'Orange', 'Kiwi', 'Pêche', 'Abricot', 'Prune'
];

const MAX_FRUITS_PER_MEAL = 2;

// Classification des aliments par type nutritionnel pour les ajustements ciblés
const FOOD_CATEGORIES = {
  // Sources principales de glucides (à ajuster pour corriger les déséquilibres glucidiques)
  HIGH_CARB_FOODS: [
    'Pain complet', 'Pain de mie complet', 'Riz basmati cuit', 'Riz complet cuit',
    'Quinoa cuit', 'Patate douce cuite', 'Pomme de terre cuite', 'Flocons d\'avoine',
    'Sarrasin cuit', 'Orge perlé cuit', 'Lentilles cuites', 'Haricots rouges cuits',
    'Muesli sans sucre', 'Banane', 'Pomme', 'Compote sans sucre', 'Miel'
  ],
  
  // Sources principales de protéines (à ajuster pour corriger les déséquilibres protéiques)
  HIGH_PROTEIN_FOODS: [
    'Blanc de poulet', 'Blanc de dinde', 'Saumon', 'Thon', 'Cabillaud',
    'Bœuf maigre (5% MG)', 'Œufs entiers', 'Tofu ferme', 'Protéine en poudre',
    'Yaourt grec 0%', 'Skyr 0%', 'Fromage blanc 0%', 'Cottage cheese'
  ],
  
  // Sources principales de lipides (à ajuster pour corriger les déséquilibres lipidiques)
  HIGH_FAT_FOODS: [
    'Huile d\'olive', 'Avocat', 'Beurre de cacahuète', 'Amandes', 'Noix', 
    'Fruits secs mélangés', 'Saumon', 'Ricotta'
  ],
  
  // Légumes (à préserver autant que possible)
  VEGETABLES: [
    'Brocolis', 'Épinards', 'Haricots verts', 'Courgettes', 'Tomates'
  ]
};

function formatNutritionValue(value: number): number {
  return value < 100 ? Math.round(value * 10) / 10 : Math.round(value);
}

function roundQuantityTo5g(quantity: number): number {
  return Math.round(quantity / 5) * 5;
}

function formatFoodQuantity(foodName: string, quantity: number): string {
  const customUnit = CUSTOM_UNITS[foodName];
  
  if (!customUnit) {
    return `${quantity}g`;
  }
  
  if (foodName === "Avocat") {
    if (quantity <= 75) return "½ avocat";
    if (quantity <= 150) return "1 avocat";
    const units = Math.round(quantity / customUnit.gramsPerUnit);
    return `${units} ${units === 1 ? customUnit.singularUnit : customUnit.unit}`;
  }
  
  const units = Math.round(quantity / customUnit.gramsPerUnit);
  
  if (units === 0) {
    return `${quantity}g`;
  }
  
  // 🍎 VALIDATION FRUITS: Limiter à 2 unités maximum
  if (WHOLE_FRUITS.includes(foodName) && units > MAX_FRUITS_PER_MEAL) {
    console.warn(`🍎 LIMITATION FRUITS: ${foodName} réduit de ${units} à ${MAX_FRUITS_PER_MEAL} unités`);
    return `${MAX_FRUITS_PER_MEAL} ${MAX_FRUITS_PER_MEAL === 1 ? customUnit.singularUnit : customUnit.unit}`;
  }
  
  if (units === 1 && customUnit.singularUnit) {
    return `1 ${customUnit.singularUnit}`;
  } else {
    return `${units} ${customUnit.unit}`;
  }
}

function calculateFoodNutrition(food: Food): Food {
  const nutritionPer100g = NUTRITION_DATA[food.name];
  if (!nutritionPer100g) {
    console.warn(`Nutrition data not found for: ${food.name}`);
    return food;
  }
  
  let roundedQuantity = roundQuantityTo5g(food.quantity);
  
  // 🍎 RÈGLE OBLIGATOIRE: Limiter les fruits entiers à 2 unités maximum
  if (WHOLE_FRUITS.includes(food.name)) {
    const customUnit = CUSTOM_UNITS[food.name];
    if (customUnit) {
      const units = Math.round(roundedQuantity / customUnit.gramsPerUnit);
      if (units > MAX_FRUITS_PER_MEAL) {
        const limitedQuantity = MAX_FRUITS_PER_MEAL * customUnit.gramsPerUnit;
        console.warn(`🍎 LIMITATION APPLIQUÉE: ${food.name} ${roundedQuantity}g (${units} unités) → ${limitedQuantity}g (${MAX_FRUITS_PER_MEAL} unités max)`);
        roundedQuantity = limitedQuantity;
      }
    }
  }
  
  const factor = roundedQuantity / 100;
  
  return {
    ...food,
    quantity: roundedQuantity,
    displayQuantity: formatFoodQuantity(food.name, roundedQuantity),
    calories: formatNutritionValue(nutritionPer100g.calories * factor),
    protein: formatNutritionValue(nutritionPer100g.protein * factor),
    carbs: formatNutritionValue(nutritionPer100g.carbs * factor),
    fat: formatNutritionValue(nutritionPer100g.fat * factor),
    fiber: formatNutritionValue(nutritionPer100g.fiber * factor)
  };
}

function calculateMealTotals(foods: Food[]): { calories: number; protein: number; carbs: number; fat: number } {
  return foods.reduce((totals, food) => ({
    calories: totals.calories + food.calories,
    protein: totals.protein + food.protein,
    carbs: totals.carbs + food.carbs,
    fat: totals.fat + food.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

function scaleMealToTarget(meal: any, targetCalories: number): Meal {
  const updatedFoods = meal.foods.map((food: any) => calculateFoodNutrition(food));
  const currentTotals = calculateMealTotals(updatedFoods);
  
  if (currentTotals.calories === 0) {
    return {
      id: meal.id,
      category: meal.category,
      name: meal.name,
      foods: updatedFoods,
      totalCalories: 0,
      totalProteines: 0,
      totalGlucides: 0,
      totalLipides: 0
    };
  }
  
  const scaleFactor = targetCalories / currentTotals.calories;
  
  const scaledFoods = updatedFoods.map(food => {
    let newQuantity = roundQuantityTo5g(food.quantity * scaleFactor);
    
    // 🍎 RÈGLE OBLIGATOIRE: Vérifier la limitation des fruits
    if (WHOLE_FRUITS.includes(food.name)) {
      const customUnit = CUSTOM_UNITS[food.name];
      if (customUnit) {
        const units = Math.round(newQuantity / customUnit.gramsPerUnit);
        if (units > MAX_FRUITS_PER_MEAL) {
          const limitedQuantity = MAX_FRUITS_PER_MEAL * customUnit.gramsPerUnit;
          newQuantity = limitedQuantity;
        }
      }
    }
    
    return calculateFoodNutrition({ name: food.name, quantity: newQuantity });
  });
  
  const finalTotals = calculateMealTotals(scaledFoods);
  
  return {
    id: meal.id,
    category: meal.category,
    name: meal.name,
    foods: scaledFoods,
    totalCalories: formatNutritionValue(finalTotals.calories),
    totalProteines: formatNutritionValue(finalTotals.protein),
    totalGlucides: formatNutritionValue(finalTotals.carbs),
    totalLipides: formatNutritionValue(finalTotals.fat)
  };
}

/**
 * 🔒 VALIDATION STRICTE OBLIGATOIRE 90-110%
 * AUCUN MACRONUTRIMENT NE DOIT DÉPASSER 110% NI DESCENDRE SOUS 90%
 */
function validateMacronutrientsStrict(
  actual: { calories: number; proteines: number; glucides: number; lipides: number },
  targets: { caloriesTarget: number; proteinesTarget: number; glucidesTarget: number; lipidesTarget: number }
): { isValid: boolean; violations: string[]; scores: { [key: string]: number } } {
  
  const violations: string[] = [];
  const scores = {
    calories: (actual.calories / targets.caloriesTarget) * 100,
    proteines: (actual.proteines / targets.proteinesTarget) * 100,
    glucides: (actual.glucides / targets.glucidesTarget) * 100,
    lipides: (actual.lipides / targets.lipidesTarget) * 100
  };
  
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
  
  return {
    isValid: violations.length === 0,
    violations,
    scores
  };
}

/**
 * 🔍 Identifier le repas qui contribue le plus à un macronutriment déséquilibré
 */
function findMealWithMostMacro(meals: Meal[], macro: 'calories' | 'protein' | 'carbs' | 'fat'): { meal: Meal; index: number; amount: number } {
  let maxAmount = 0;
  let maxIndex = -1;
  let maxMeal: Meal | null = null;
  
  meals.forEach((meal, index) => {
    const amount = macro === 'calories' ? meal.totalCalories :
                   macro === 'protein' ? meal.totalProteines :
                   macro === 'carbs' ? meal.totalGlucides :
                   meal.totalLipides;
    
    if (amount > maxAmount) {
      maxAmount = amount;
      maxIndex = index;
      maxMeal = meal;
    }
  });
  
  return {
    meal: maxMeal!,
    index: maxIndex,
    amount: maxAmount
  };
}

/**
 * 🔍 Identifier le repas le plus pauvre dans un macronutriment
 */
function findMealWithLeastMacro(meals: Meal[], macro: 'protein' | 'carbs' | 'fat'): { meal: Meal; index: number; amount: number } {
  let minAmount = Infinity;
  let minIndex = -1;
  let minMeal: Meal | null = null;
  
  meals.forEach((meal, index) => {
    const amount = macro === 'protein' ? meal.totalProteines :
                   macro === 'carbs' ? meal.totalGlucides :
                   meal.totalLipides;
    
    if (amount < minAmount) {
      minAmount = amount;
      minIndex = index;
      minMeal = meal;
    }
  });
  
  return {
    meal: minMeal!,
    index: minIndex,
    amount: minAmount
  };
}

/**
 * 🔧 Ajuster intelligemment les quantités d'aliments dans un repas pour corriger un déséquilibre
 * Respecte les contraintes de cohérence (éviter 8 œufs ou 5 pommes)
 */
function adjustMealMacronutrient(
  meal: Meal,
  macro: 'protein' | 'carbs' | 'fat',
  targetChange: number, // positif pour augmenter, négatif pour réduire
  maxChangePercent: number = 0.3 // maximum 30% de changement pour éviter les portions irréalistes
): Meal {
  
  console.log(`🔧 Ajustement de ${macro} dans "${meal.name}": ${targetChange > 0 ? '+' : ''}${targetChange.toFixed(1)}g (max ${(maxChangePercent * 100).toFixed(0)}% de variation)`);
  
  const relevantFoods = macro === 'protein' ? FOOD_CATEGORIES.HIGH_PROTEIN_FOODS :
                       macro === 'carbs' ? FOOD_CATEGORIES.HIGH_CARB_FOODS :
                       FOOD_CATEGORIES.HIGH_FAT_FOODS;
  
  let updatedFoods = [...meal.foods];
  let currentChange = 0;
  
  // Trouver les aliments pertinents dans ce repas et les trier par impact
  const targetFoods = updatedFoods
    .map((food, index) => ({ 
      food, 
      index, 
      isRelevant: relevantFoods.includes(food.name),
      macroAmount: macro === 'protein' ? food.protein : macro === 'carbs' ? food.carbs : food.fat
    }))
    .filter(item => item.isRelevant && item.macroAmount > 0)
    .sort((a, b) => b.macroAmount - a.macroAmount); // Trier par ordre décroissant d'impact
  
  if (targetFoods.length === 0) {
    console.log(`❌ Aucun aliment pertinent pour ${macro} trouvé dans "${meal.name}"`);
    return meal;
  }
  
  console.log(`📋 ${targetFoods.length} aliment(s) pertinent(s) identifié(s) pour ${macro}:`);
  targetFoods.forEach((item, idx) => {
    console.log(`   ${idx + 1}. ${item.food.name}: ${item.macroAmount.toFixed(1)}g ${macro}`);
  });
  
  // Ajuster les quantités de manière progressive
  for (const { food, index } of targetFoods) {
    if (Math.abs(currentChange) >= Math.abs(targetChange) * 0.8) break; // 80% de l'objectif suffit
    
    const originalQuantity = food.quantity;
    const currentMacro = macro === 'protein' ? food.protein : macro === 'carbs' ? food.carbs : food.fat;
    
    if (currentMacro === 0) continue;
    
    // Calculer le changement de quantité nécessaire
    const remainingChange = targetChange - currentChange;
    const quantityChangeNeeded = (remainingChange / currentMacro) * originalQuantity;
    const maxQuantityChange = originalQuantity * maxChangePercent;
    
    // Limiter le changement pour éviter les portions irréalistes
    const actualQuantityChange = Math.sign(quantityChangeNeeded) * Math.min(
      Math.abs(quantityChangeNeeded),
      maxQuantityChange
    );
    
    let newQuantity = Math.max(10, roundQuantityTo5g(originalQuantity + actualQuantityChange));
    
    // 🍎 VÉRIFICATION SPÉCIALE POUR LES FRUITS (max 2 unités)
    if (WHOLE_FRUITS.includes(food.name)) {
      const customUnit = CUSTOM_UNITS[food.name];
      if (customUnit) {
        const newUnits = Math.round(newQuantity / customUnit.gramsPerUnit);
        if (newUnits > MAX_FRUITS_PER_MEAL) {
          newQuantity = MAX_FRUITS_PER_MEAL * customUnit.gramsPerUnit;
          console.log(`🍎 LIMITATION FRUITS: ${food.name} limité à ${MAX_FRUITS_PER_MEAL} unités (${newQuantity}g)`);
        }
        
        // Éviter les portions irréalistes pour les fruits (minimum 1 unité si présent)
        if (newUnits < 1 && originalQuantity >= customUnit.gramsPerUnit * 0.5) {
          newQuantity = customUnit.gramsPerUnit; // Au moins 1 unité
          console.log(`🍎 MINIMUM FRUITS: ${food.name} maintenu à 1 unité minimum (${newQuantity}g)`);
        }
      }
    }
    
    // Vérifications de cohérence pour éviter les portions irréalistes
    if (food.name === 'Œufs entiers') {
      const units = Math.round(newQuantity / 60); // 60g par œuf
      if (units > 4) { // Maximum 4 œufs par repas
        newQuantity = 4 * 60;
        console.log(`🥚 LIMITATION ŒUFS: Maximum 4 œufs par repas (${newQuantity}g)`);
      }
    }
    
    if (newQuantity !== originalQuantity) {
      const updatedFood = calculateFoodNutrition({ name: food.name, quantity: newQuantity });
      const actualMacroChange = (macro === 'protein' ? updatedFood.protein - food.protein :
                                macro === 'carbs' ? updatedFood.carbs - food.carbs :
                                updatedFood.fat - food.fat);
      
      updatedFoods[index] = updatedFood;
      currentChange += actualMacroChange;
      
      console.log(`✅ ${food.name}: ${originalQuantity}g → ${newQuantity}g (${actualMacroChange > 0 ? '+' : ''}${actualMacroChange.toFixed(1)}g ${macro})`);
    }
  }
  
  // Recalculer les totaux du repas
  const newTotals = calculateMealTotals(updatedFoods);
  
  const adjustedMeal = {
    ...meal,
    foods: updatedFoods,
    totalCalories: formatNutritionValue(newTotals.calories),
    totalProteines: formatNutritionValue(newTotals.protein),
    totalGlucides: formatNutritionValue(newTotals.carbs),
    totalLipides: formatNutritionValue(newTotals.fat)
  };
  
  console.log(`📊 Changement réel: ${currentChange.toFixed(1)}g ${macro} (objectif: ${targetChange.toFixed(1)}g) - Efficacité: ${((currentChange / targetChange) * 100).toFixed(0)}%`);
  
  return adjustedMeal;
}

/**
 * 🔄 Remplacer un repas par une alternative de la même catégorie
 */
function replaceMealWithAlternative(
  currentMeal: Meal,
  availableMeals: any[],
  usedMealIds: Set<string>
): Meal | null {
  
  console.log(`🔄 Recherche d'alternative pour "${currentMeal.name}" (${currentMeal.category})`);
  
  const candidates = availableMeals.filter(meal => 
    meal.category === currentMeal.category && 
    !usedMealIds.has(meal.id) &&
    meal.id !== currentMeal.id
  );
  
  if (candidates.length === 0) {
    console.log(`❌ Aucune alternative trouvée pour ${currentMeal.category}`);
    return null;
  }
  
  console.log(`📋 ${candidates.length} candidat(s) d'alternative trouvé(s)`);
  
  // Sélectionner une alternative aléatoire
  const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
  
  // Ajuster l'alternative aux mêmes calories que le repas original
  const adjustedMeal = scaleMealToTarget(randomCandidate, currentMeal.totalCalories);
  
  console.log(`✅ Alternative sélectionnée: "${currentMeal.name}" → "${adjustedMeal.name}"`);
  
  return adjustedMeal;
}

/**
 * 🚀 FONCTION PRINCIPALE RENFORCÉE avec validation stricte 90-110%
 * 
 * ÉTAPES STRICTES:
 * 1. Générer un plan alimentaire initial
 * 2. Calculer les apports totaux en calories, protéines, glucides et lipides
 * 3. Vérifier si chaque macro est entre 90% et 110% de sa cible
 * 4. Répéter les ajustements jusqu'à ce que les 3 macronutriments soient entre 90% et 110%
 * 5. Si après 5 itérations le plan reste déséquilibré, générer une alerte
 */
export function generateMealPlan(options: MealPlanOptions): MealPlanResult {
  console.log('🚀 GÉNÉRATION RENFORCÉE DE PLAN ALIMENTAIRE AVEC VALIDATION STRICTE 90-110%');
  console.log('🎯 Objectifs nutritionnels:', options);
  console.log('🔒 RÈGLES STRICTES:');
  console.log('   • Aucun macronutriment > 110%');
  console.log('   • Aucun macronutriment < 90%');
  console.log('   • Maximum 2 fruits entiers par repas');
  console.log('   • Portions cohérentes (éviter 8 œufs ou 5 pommes)');
  
  const { caloriesTarget, proteinesTarget, glucidesTarget, lipidesTarget, repasParJour, collationsParJour } = options;
  const predefinedMeals = getPredefinedMeals();
  
  // Répartition intelligente des calories
  const repasCaloriesBase = Math.round(caloriesTarget * 0.75 / repasParJour);
  const collationCaloriesBase = Math.round(caloriesTarget * 0.25 / Math.max(collationsParJour, 1));
  
  console.log(`📊 Répartition calorique: ${repasCaloriesBase}kcal/repas, ${collationCaloriesBase}kcal/collation`);
  
  const mealCategories = ['petit_dejeuner', 'dejeuner', 'diner', 'souper'];
  
  let bestPlan: MealPlanResult | null = null;
  let bestScore = 0;
  
  // BOUCLE PRINCIPALE: 5 tentatives maximum
  for (let mainAttempt = 1; mainAttempt <= 5; mainAttempt++) {
    console.log(`\n🔄 === TENTATIVE PRINCIPALE ${mainAttempt}/5 ===`);
    
    const usedMealIds = new Set<string>();
    let selectedMeals: Meal[] = [];
    
    try {
      // ÉTAPE 1: Génération du plan alimentaire initial
      console.log('📋 ÉTAPE 1: Génération du plan alimentaire initial');
      
      // Sélectionner les repas principaux
      for (let i = 0; i < repasParJour; i++) {
        const category = mealCategories[i];
        const availableMeals = predefinedMeals.filter(meal => 
          meal.category === category && !usedMealIds.has(meal.id)
        );
        
        if (availableMeals.length === 0) {
          throw new Error(`Aucun repas disponible pour ${category}`);
        }
        
        const randomMeal = availableMeals[Math.floor(Math.random() * availableMeals.length)];
        usedMealIds.add(randomMeal.id);
        
        const targetCalories = repasCaloriesBase + (Math.random() - 0.5) * repasCaloriesBase * 0.2;
        const scaledMeal = scaleMealToTarget(randomMeal, targetCalories);
        selectedMeals.push(scaledMeal);
        
        console.log(`   • ${category}: "${scaledMeal.name}" (${scaledMeal.totalCalories}kcal)`);
      }
      
      // Sélectionner les collations
      for (let i = 0; i < collationsParJour; i++) {
        const availableSnacks = predefinedMeals.filter(meal => 
          meal.category === 'collation' && !usedMealIds.has(meal.id)
        );
        
        if (availableSnacks.length === 0) {
          throw new Error('Aucune collation disponible');
        }
        
        const randomSnack = availableSnacks[Math.floor(Math.random() * availableSnacks.length)];
        usedMealIds.add(randomSnack.id);
        
        const targetCalories = collationCaloriesBase + (Math.random() - 0.5) * collationCaloriesBase * 0.3;
        const scaledSnack = scaleMealToTarget(randomSnack, targetCalories);
        selectedMeals.push(scaledSnack);
        
        console.log(`   • collation: "${scaledSnack.name}" (${scaledSnack.totalCalories}kcal)`);
      }
      
      // ÉTAPE 2: Calcul des apports totaux initiaux
      let currentTotals = {
        calories: selectedMeals.reduce((sum, meal) => sum + meal.totalCalories, 0),
        proteines: selectedMeals.reduce((sum, meal) => sum + meal.totalProteines, 0),
        glucides: selectedMeals.reduce((sum, meal) => sum + meal.totalGlucides, 0),
        lipides: selectedMeals.reduce((sum, meal) => sum + meal.totalLipides, 0)
      };
      
      console.log('📊 ÉTAPE 2: Apports totaux initiaux');
      console.log(`   • Calories: ${currentTotals.calories}kcal / ${caloriesTarget}kcal (${((currentTotals.calories / caloriesTarget) * 100).toFixed(1)}%)`);
      console.log(`   • Protéines: ${currentTotals.proteines}g / ${proteinesTarget}g (${((currentTotals.proteines / proteinesTarget) * 100).toFixed(1)}%)`);
      console.log(`   • Glucides: ${currentTotals.glucides}g / ${glucidesTarget}g (${((currentTotals.glucides / glucidesTarget) * 100).toFixed(1)}%)`);
      console.log(`   • Lipides: ${currentTotals.lipides}g / ${lipidesTarget}g (${((currentTotals.lipides / lipidesTarget) * 100).toFixed(1)}%)`);
      
      // ÉTAPE 3: Vérification et corrections itératives jusqu'à 90-110%
      console.log('🔧 ÉTAPE 3: Corrections itératives pour atteindre 90-110%');
      
      let correctedMeals = [...selectedMeals];
      let iterationCount = 0;
      const maxIterations = 5;
      
      while (iterationCount < maxIterations) {
        iterationCount++;
        console.log(`\n🔄 Itération ${iterationCount}/${maxIterations}`);
        
        // Recalculer les totaux
        currentTotals = {
          calories: correctedMeals.reduce((sum, meal) => sum + meal.totalCalories, 0),
          proteines: correctedMeals.reduce((sum, meal) => sum + meal.totalProteines, 0),
          glucides: correctedMeals.reduce((sum, meal) => sum + meal.totalGlucides, 0),
          lipides: correctedMeals.reduce((sum, meal) => sum + meal.totalLipides, 0)
        };
        
        // ÉTAPE 3a: Vérifier si chaque macro est entre 90% et 110% de sa cible
        const validation = validateMacronutrientsStrict(currentTotals, { caloriesTarget, proteinesTarget, glucidesTarget, lipidesTarget });
        
        if (validation.isValid) {
          console.log(`✅ PLAN VALIDÉ à l'itération ${iterationCount}! Tous les macronutriments sont dans la zone 90-110%`);
          break;
        }
        
        console.log(`❌ Violations détectées: ${validation.violations.join(', ')}`);
        
        // ÉTAPE 3b: Identifier et corriger les déséquilibres
        let correctionApplied = false;
        
        // Corriger les PROTÉINES
        if (validation.scores.proteines < 90) {
          // Si protéines < 90% : augmenter les sources de protéines
          const deficit = proteinesTarget * 0.95 - currentTotals.proteines;
          const poorestMeal = findMealWithLeastMacro(correctedMeals, 'protein');
          if (poorestMeal.index !== -1) {
            console.log(`🔧 PROTÉINES < 90%: Augmentation de +${deficit.toFixed(1)}g dans "${poorestMeal.meal.name}"`);
            correctedMeals[poorestMeal.index] = adjustMealMacronutrient(poorestMeal.meal, 'protein', deficit);
            correctionApplied = true;
          }
        } else if (validation.scores.proteines > 110) {
          // Si protéines > 110% : réduire les sources de protéines
          const excess = currentTotals.proteines - proteinesTarget * 1.05;
          const richestMeal = findMealWithMostMacro(correctedMeals, 'protein');
          if (richestMeal.index !== -1) {
            console.log(`🔧 PROTÉINES > 110%: Réduction de -${excess.toFixed(1)}g dans "${richestMeal.meal.name}"`);
            correctedMeals[richestMeal.index] = adjustMealMacronutrient(richestMeal.meal, 'protein', -excess);
            correctionApplied = true;
          }
        }
        
        // Corriger les GLUCIDES
        if (validation.scores.glucides < 90) {
          // Si glucides < 90% : augmenter les sources de glucides
          const deficit = glucidesTarget * 0.95 - currentTotals.glucides;
          const poorestMeal = findMealWithLeastMacro(correctedMeals, 'carbs');
          if (poorestMeal.index !== -1) {
            console.log(`🔧 GLUCIDES < 90%: Augmentation de +${deficit.toFixed(1)}g dans "${poorestMeal.meal.name}"`);
            correctedMeals[poorestMeal.index] = adjustMealMacronutrient(poorestMeal.meal, 'carbs', deficit);
            correctionApplied = true;
          }
        } else if (validation.scores.glucides > 110) {
          // Si glucides > 110% : réduire les sources de glucides
          const excess = currentTotals.glucides - glucidesTarget * 1.05;
          const richestMeal = findMealWithMostMacro(correctedMeals, 'carbs');
          if (richestMeal.index !== -1) {
            console.log(`🔧 GLUCIDES > 110%: Réduction de -${excess.toFixed(1)}g dans "${richestMeal.meal.name}"`);
            correctedMeals[richestMeal.index] = adjustMealMacronutrient(richestMeal.meal, 'carbs', -excess);
            correctionApplied = true;
          }
        }
        
        // Corriger les LIPIDES
        if (validation.scores.lipides < 90) {
          // Si lipides < 90% : augmenter les sources de lipides
          const deficit = lipidesTarget * 0.95 - currentTotals.lipides;
          const poorestMeal = findMealWithLeastMacro(correctedMeals, 'fat');
          if (poorestMeal.index !== -1) {
            console.log(`🔧 LIPIDES < 90%: Augmentation de +${deficit.toFixed(1)}g dans "${poorestMeal.meal.name}"`);
            correctedMeals[poorestMeal.index] = adjustMealMacronutrient(poorestMeal.meal, 'fat', deficit);
            correctionApplied = true;
          }
        } else if (validation.scores.lipides > 110) {
          // Si lipides > 110% : réduire les sources de lipides
          const excess = currentTotals.lipides - lipidesTarget * 1.05;
          const richestMeal = findMealWithMostMacro(correctedMeals, 'fat');
          if (richestMeal.index !== -1) {
            console.log(`🔧 LIPIDES > 110%: Réduction de -${excess.toFixed(1)}g dans "${richestMeal.meal.name}"`);
            correctedMeals[richestMeal.index] = adjustMealMacronutrient(richestMeal.meal, 'fat', -excess);
            correctionApplied = true;
          }
        }
        
        // ÉTAPE 3c: Si les ajustements ne suffisent pas, remplacer le repas le plus problématique
        if (!correctionApplied && iterationCount >= 3) {
          console.log('🔄 Les ajustements ne suffisent pas, tentative de remplacement de repas...');
          
          // Identifier le repas le plus problématique
          let mostProblematicMeal = { index: -1, score: 0 };
          
          correctedMeals.forEach((meal, index) => {
            // Calculer un score de problème basé sur les déviations
            const proteinDeviation = Math.abs((meal.totalProteines / (proteinesTarget / correctedMeals.length)) * 100 - 100);
            const carbsDeviation = Math.abs((meal.totalGlucides / (glucidesTarget / correctedMeals.length)) * 100 - 100);
            const fatDeviation = Math.abs((meal.totalLipides / (lipidesTarget / correctedMeals.length)) * 100 - 100);
            
            const problemScore = Math.max(proteinDeviation, carbsDeviation, fatDeviation);
            
            if (problemScore > mostProblematicMeal.score) {
              mostProblematicMeal = { index, score: problemScore };
            }
          });
          
          if (mostProblematicMeal.index !== -1) {
            const replacementMeal = replaceMealWithAlternative(
              correctedMeals[mostProblematicMeal.index],
              predefinedMeals,
              usedMealIds
            );
            
            if (replacementMeal) {
              console.log(`✅ Remplacement effectué: "${correctedMeals[mostProblematicMeal.index].name}" → "${replacementMeal.name}"`);
              usedMealIds.add(replacementMeal.id);
              correctedMeals[mostProblematicMeal.index] = replacementMeal;
              correctionApplied = true;
            }
          }
        }
        
        if (!correctionApplied) {
          console.log('⚠️ Aucune correction supplémentaire possible, arrêt des itérations');
          break;
        }
      }
      
      // ÉTAPE 4: Validation finale et calcul du score
      const finalTotals = {
        calories: correctedMeals.reduce((sum, meal) => sum + meal.totalCalories, 0),
        proteines: correctedMeals.reduce((sum, meal) => sum + meal.totalProteines, 0),
        glucides: correctedMeals.reduce((sum, meal) => sum + meal.totalGlucides, 0),
        lipides: correctedMeals.reduce((sum, meal) => sum + meal.totalLipides, 0)
      };
      
      const finalValidation = validateMacronutrientsStrict(finalTotals, { caloriesTarget, proteinesTarget, glucidesTarget, lipidesTarget });
      
      // Calcul du score de conformité (plus proche de 100% = meilleur score)
      const conformityScore = Object.values(finalValidation.scores).reduce((sum, score) => {
        const deviation = Math.abs(score - 100);
        return sum + Math.max(0, 100 - deviation * 2); // Pénaliser les déviations
      }, 0) / 4;
      
      const currentPlan = {
        repas: correctedMeals,
        totalCalories: formatNutritionValue(finalTotals.calories),
        totalProteines: formatNutritionValue(finalTotals.proteines),
        totalGlucides: formatNutritionValue(finalTotals.glucides),
        totalLipides: formatNutritionValue(finalTotals.lipides),
        success: finalValidation.isValid,
        validationMessage: finalValidation.isValid 
          ? '✅ Plan conforme aux objectifs nutritionnels (90-110%)'
          : `❌ Plan non conforme après ${maxIterations} itérations. Violations: ${finalValidation.violations.join(', ')}`
      };
      
      console.log(`🎯 Score de conformité: ${conformityScore.toFixed(1)}%`);
      console.log('📊 Résultats finaux:');
      console.log(`   • Calories: ${finalValidation.scores.calories.toFixed(1)}% ${finalValidation.scores.calories >= 90 && finalValidation.scores.calories <= 110 ? '✅' : '❌'}`);
      console.log(`   • Protéines: ${finalValidation.scores.proteines.toFixed(1)}% ${finalValidation.scores.proteines >= 90 && finalValidation.scores.proteines <= 110 ? '✅' : '❌'}`);
      console.log(`   • Glucides: ${finalValidation.scores.glucides.toFixed(1)}% ${finalValidation.scores.glucides >= 90 && finalValidation.scores.glucides <= 110 ? '✅' : '❌'}`);
      console.log(`   • Lipides: ${finalValidation.scores.lipides.toFixed(1)}% ${finalValidation.scores.lipides >= 90 && finalValidation.scores.lipides <= 110 ? '✅' : '❌'}`);
      
      // Si le plan est parfaitement conforme, le retourner immédiatement
      if (finalValidation.isValid) {
        console.log(`🎉 PLAN PARFAITEMENT CONFORME TROUVÉ! Tous les macronutriments respectent la zone 90-110%`);
        return currentPlan;
      }
      
      // Garder le meilleur plan trouvé
      if (conformityScore > bestScore) {
        bestScore = conformityScore;
        bestPlan = currentPlan;
        console.log(`🏆 Nouveau meilleur plan: ${bestScore.toFixed(1)}%`);
      }
      
    } catch (error) {
      console.warn(`❌ Tentative ${mainAttempt} échouée:`, error);
      continue;
    }
  }
  
  // ÉTAPE 5: Retourner le meilleur plan ou générer une alerte
  if (bestPlan) {
    if (bestPlan.success) {
      console.log(`🎯 Plan conforme retourné avec un score de ${bestScore.toFixed(1)}%`);
    } else {
      console.warn(`⚠️ ALERTE: Impossible de générer un plan cohérent avec les options actuelles après 5 tentatives`);
      console.warn(`📊 Meilleur plan disponible (score: ${bestScore.toFixed(1)}%) mais non conforme à 90-110%`);
      bestPlan.validationMessage = `⚠️ ALERTE: Impossible de générer un plan cohérent avec les options actuelles. Meilleur résultat obtenu mais non conforme aux contraintes 90-110%.`;
    }
    return bestPlan;
  }
  
  // Plan de secours si aucun plan n'a pu être généré
  console.error('❌ ÉCHEC TOTAL: Impossible de générer le moindre plan de repas après 5 tentatives');
  return {
    repas: [],
    totalCalories: 0,
    totalProteines: 0,
    totalGlucides: 0,
    totalLipides: 0,
    success: false,
    validationMessage: '❌ ÉCHEC: Impossible de générer un plan cohérent avec les options actuelles après 5 tentatives. Les objectifs nutritionnels sont peut-être incompatibles avec les repas disponibles.'
  };
}