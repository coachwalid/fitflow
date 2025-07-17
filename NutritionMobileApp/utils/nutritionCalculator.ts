export type UserProfile = {
  sexe: "homme" | "femme";
  poids: number;
  taille: number;
  age: number;
  activite: "sédentaire" | "léger" | "modéré" | "élevé";
  estimatedBodyFat: number;
};

export type NutritionResult = {
  metabolismeBase: number;
  caloriesMaintien: number;
  caloriesObjectif: number;
  proteines: number;
  lipides: number;
  glucides: number;
  masseMaigre: number;
};

export function calculateMaintenanceNeeds(userProfile: UserProfile): NutritionResult {
  const { poids, taille, activite, estimatedBodyFat } = userProfile;

  // 1. Calculate lean body mass
  const masseMaigre = poids * (1 - estimatedBodyFat / 100);

  // 2. BMR using Katch-McArdle formula
  const metabolismeBase = 370 + (21.6 * masseMaigre);

  // 3. Activity factor for TDEE
  const facteurs = {
    "sédentaire": 1.2,
    "léger": 1.375,
    "modéré": 1.55,
    "élevé": 1.725,
  };
  const facteurActivite = facteurs[activite] || 1.2;
  const caloriesMaintien = metabolismeBase * facteurActivite;

  // 4. Calculate target weight for macronutrients
  const tailleEnMetres = taille / 100;
  const poidsObjectif = 23 * (tailleEnMetres * tailleEnMetres);

  // 5. Calculate proteins based on lean mass
  const proteines = masseMaigre * 2;

  // 6. Calculate fats based on target weight (minimum 50g)
  let lipides = Math.max(50, poidsObjectif * 1);

  // 7. Calculate carbs (remaining calories)
  const caloriesProteines = proteines * 4;
  const caloriesLipides = lipides * 9;
  const caloriesRestantes = caloriesMaintien - (caloriesProteines + caloriesLipides);
  const glucides = Math.max(0, caloriesRestantes / 4);

  return {
    metabolismeBase: Math.round(metabolismeBase),
    caloriesMaintien: Math.round(caloriesMaintien),
    caloriesObjectif: Math.round(caloriesMaintien), // Default to maintenance
    proteines: Math.round(proteines),
    lipides: Math.round(lipides),
    glucides: Math.round(glucides),
    masseMaigre: Math.round(masseMaigre * 10) / 10
  };
}

export function optimizeMacronutrientDistribution(
  baseResult: NutritionResult,
  objectif: "perte" | "maintien" | "prise",
  userProfile: UserProfile
): NutritionResult {
  const { poids, activite } = userProfile;
  let caloriesObjectif = baseResult.caloriesMaintien;
  
  // Adjust calories based on goal
  switch (objectif) {
    case "perte":
      caloriesObjectif = baseResult.caloriesMaintien - 300; // 300 calorie deficit
      break;
    case "prise":
      caloriesObjectif = baseResult.caloriesMaintien + 300; // 300 calorie surplus
      break;
    default:
      caloriesObjectif = baseResult.caloriesMaintien;
  }

  // Recalculate macros for new calorie target
  let proteines = baseResult.proteines; // Keep protein constant
  let lipides = baseResult.lipides; // Keep fats constant
  
  // Adjust carbs based on new calorie target
  const caloriesProteines = proteines * 4;
  const caloriesLipides = lipides * 9;
  const caloriesRestantes = caloriesObjectif - (caloriesProteines + caloriesLipides);
  let glucides = Math.max(0, caloriesRestantes / 4);

  // Special carb calculation for weight loss
  if (objectif === "perte") {
    const isHighActivity = activite === "élevé";
    glucides = Math.min(glucides, poids * (isHighActivity ? 2.5 : 2));
  }

  return {
    ...baseResult,
    caloriesObjectif: Math.round(caloriesObjectif),
    proteines: Math.round(proteines),
    lipides: Math.round(lipides),
    glucides: Math.round(glucides),
  };
}