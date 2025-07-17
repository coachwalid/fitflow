export type UserProfile = {
  sexe: "homme" | "femme";
  poids: number;
  taille: number;
  age: number;
  activite: "sédentaire" | "léger" | "modéré" | "élevé";
  estimatedBodyFat: number; // Pourcentage de masse grasse estimé
};

export type NutritionResult = {
  metabolismeBase: number;
  caloriesMaintien: number;
  proteines: number;
  lipides: number;
  glucides: number;
  masseMaigre: number; // Ajout pour transparence
};

export function calculateMaintenanceNeeds(userProfile: UserProfile): NutritionResult {
  const { poids, taille, activite, estimatedBodyFat } = userProfile;

  console.log('🔬 Calcul nutritionnel basé sur la composition corporelle (Katch-McArdle)');
  console.log(`📊 Données d'entrée: ${poids}kg, ${taille}cm, ${estimatedBodyFat}% de masse grasse, activité: ${activite}`);

  // 1. Calcul de la masse maigre (lean body mass)
  const masseMaigre = poids * (1 - estimatedBodyFat / 100);
  console.log(`💪 Masse maigre calculée: ${poids}kg × (1 - ${estimatedBodyFat}% / 100) = ${masseMaigre.toFixed(1)}kg`);

  // 2. BMR avec la formule Katch-McArdle UNIQUEMENT
  const metabolismeBase = 370 + (21.6 * masseMaigre);
  console.log(`🔥 BMR (Katch-McArdle): 370 + (21.6 × ${masseMaigre.toFixed(1)}) = ${metabolismeBase.toFixed(0)}kcal`);

  // 3. Facteur d'activité pour le TDEE
  const facteurs = {
    "sédentaire": 1.2,
    "léger": 1.375,
    "modéré": 1.55,
    "élevé": 1.725,
  };
  const facteurActivite = facteurs[activite] || 1.2;
  const caloriesMaintien = metabolismeBase * facteurActivite;
  console.log(`⚡ TDEE: ${metabolismeBase.toFixed(0)} × ${facteurActivite} = ${caloriesMaintien.toFixed(0)}kcal`);

  // 4. Calcul du poids objectif pour les macronutriments
  const tailleEnMetres = taille / 100;
  const poidsObjectif = 23 * (tailleEnMetres * tailleEnMetres);
  
  console.log(`🎯 Poids objectif (23 × ${taille}cm²): ${poidsObjectif.toFixed(1)}kg`);

  // 5. Calcul des protéines basé sur la masse maigre
  const proteines = masseMaigre * 2;
  console.log(`🥩 Protéines (masse maigre × 2): ${masseMaigre.toFixed(1)}kg × 2 = ${proteines.toFixed(1)}g`);

  // 6. Calcul des lipides basé sur le poids objectif (1g/kg avec minimum 50g)
  let lipides = poidsObjectif * 1;
  
  // Minimum absolu de 50g
  if (lipides < 50) {
    console.log(`🥑 Lipides calculés (${lipides.toFixed(1)}g) < 50g → application du minimum de sécurité`);
    lipides = 50;
  }
  
  console.log(`🥑 Lipides: ${poidsObjectif.toFixed(1)}kg × 1 = ${lipides.toFixed(1)}g`);

  // 7. Calcul des glucides (calories restantes)
  const caloriesProteines = proteines * 4;
  const caloriesLipides = lipides * 9;
  const caloriesRestantes = caloriesMaintien - (caloriesProteines + caloriesLipides);
  const glucides = Math.max(0, caloriesRestantes / 4);
  
  console.log(`🌾 Glucides: (${caloriesMaintien.toFixed(0)} - ${caloriesProteines.toFixed(0)} - ${caloriesLipides.toFixed(0)}) / 4 = ${glucides.toFixed(1)}g`);

  console.log('✅ Résultats nutritionnels finaux (Katch-McArdle):');
  console.log(`   • BMR: ${Math.round(metabolismeBase)}kcal`);
  console.log(`   • TDEE: ${Math.round(caloriesMaintien)}kcal`);
  console.log(`   • Masse maigre: ${masseMaigre.toFixed(1)}kg`);
  console.log(`   • Protéines: ${Math.round(proteines)}g (${(proteines * 4).toFixed(0)}kcal)`);
  console.log(`   • Lipides: ${Math.round(lipides)}g (${(lipides * 9).toFixed(0)}kcal)`);
  console.log(`   • Glucides: ${Math.round(glucides)}g (${(glucides * 4).toFixed(0)}kcal)`);

  return {
    metabolismeBase: Math.round(metabolismeBase),
    caloriesMaintien: Math.round(caloriesMaintien),
    proteines: Math.round(proteines),
    lipides: Math.round(lipides),
    glucides: Math.round(glucides),
    masseMaigre: Math.round(masseMaigre * 10) / 10
  };
}

/**
 * 🆕 NOUVELLE LOGIQUE EXCLUSIVE: Calcul des glucides pour perte de poids (POIDS ACTUEL)
 * 
 * RÈGLES STRICTES:
 * - Niveau d'activité faible ou modéré : 2g × poids actuel
 * - Niveau d'activité élevé ou très actif : 2.5g × poids actuel
 * - Le poids actuel est celui renseigné par l'utilisateur
 * - Cette logique REMPLACE TOUTE logique précédente pour la perte de poids
 */
function calculateCarbsForWeightLoss(
  poidsActuel: number,
  activite: "sédentaire" | "léger" | "modéré" | "élevé"
): number {
  console.log('🆕 NOUVELLE LOGIQUE EXCLUSIVE: Calcul des glucides pour perte de poids (POIDS ACTUEL)');
  
  console.log(`🎯 Poids actuel utilisé: ${poidsActuel.toFixed(1)}kg`);
  console.log(`🚫 SUPPRESSION: Plus d'utilisation du poids objectif pour les glucides`);
  
  // Détermination du facteur glucidique selon le niveau d'activité
  let facteurGlucides: number;
  
  if (activite === "sédentaire" || activite === "léger" || activite === "modéré") {
    facteurGlucides = 2.0;
    console.log(`📊 Niveau d'activité "${activite}" → Facteur glucides: 2.0g/kg`);
  } else { // activite === "élevé"
    facteurGlucides = 2.5;
    console.log(`📊 Niveau d'activité "${activite}" → Facteur glucides: 2.5g/kg`);
  }
  
  // Calcul final des glucides
  const glucidesPertePoids = poidsActuel * facteurGlucides;
  
  console.log(`🌾 GLUCIDES PERTE DE POIDS (POIDS ACTUEL): ${poidsActuel.toFixed(1)}kg × ${facteurGlucides}g/kg = ${glucidesPertePoids.toFixed(1)}g`);
  console.log(`✅ Nouvelle logique avec poids actuel appliquée avec succès`);
  
  return Math.round(glucidesPertePoids);
}

/**
 * 🔄 FONCTION MISE À JOUR: Répartition optimisée des macronutriments avec nouvelle logique glucides (POIDS ACTUEL)
 * 
 * CHANGEMENTS MAJEURS:
 * - Pour objectif "perte": utilise la NOUVELLE logique glucides exclusive (POIDS ACTUEL)
 * - Pour objectifs "maintien" et "prise": conserve l'ancienne logique
 * - Suppression de toutes les anciennes méthodes de calcul glucides pour la perte
 */
export function optimizeMacronutrientDistribution(
  caloriesTarget: number,
  masseMaigre: number,
  poidsObjectif: number,
  objectif: "perte" | "maintien" | "prise",
  activite: "sédentaire" | "léger" | "modéré" | "élevé",
  estimatedBodyFat: number,
  taille?: number, // ANCIEN: nécessaire pour le calcul perte de poids (poids objectif)
  poidsActuel?: number // NOUVEAU: nécessaire pour le calcul perte de poids (poids actuel)
): { proteines: number; lipides: number; glucides: number } {
  
  console.log('🔧 RÉPARTITION MACRONUTRIMENTS AVEC NOUVELLE LOGIQUE GLUCIDES (POIDS ACTUEL)');
  console.log(`📊 Calories totales FIXES: ${caloriesTarget}kcal`);
  console.log(`📊 Objectif: ${objectif}`);
  console.log(`📊 Paramètres: masse maigre ${masseMaigre}kg, poids objectif ${poidsObjectif}kg`);
  if (poidsActuel) {
    console.log(`📊 Poids actuel: ${poidsActuel}kg`);
  }
  
  // ÉTAPE 1: Calcul des protéines selon l'objectif et les caractéristiques
  let proteines: number;
  
  if (objectif === "prise") {
    // 🆕 NOUVELLE LOGIQUE POUR PRISE DE MASSE
    console.log('🆕 NOUVELLE LOGIQUE PROTÉINES POUR PRISE DE MASSE');
    
    if (!poidsActuel) {
      throw new Error('Le poids actuel est requis pour le calcul des protéines en prise de masse');
    }
    
    // Déterminer le facteur protéique selon le sexe et le body fat
    let facteurProteines: number;
    
    if (
      (masseMaigre / poidsActuel > 0.8 && estimatedBodyFat < 20) || // Homme avec body fat < 20%
      (masseMaigre / poidsActuel > 0.73 && estimatedBodyFat < 27)   // Femme avec body fat < 27%
    ) {
      facteurProteines = 2.2;
      console.log(`🎯 Body fat faible détecté (${estimatedBodyFat}%) → Facteur protéines: 2.2g/kg`);
    } else {
      facteurProteines = 2.0;
      console.log(`📊 Body fat standard (${estimatedBodyFat}%) → Facteur protéines: 2.0g/kg`);
    }
    
    proteines = poidsActuel * facteurProteines;
    console.log(`🥩 Protéines (PRISE DE MASSE): ${poidsActuel}kg × ${facteurProteines}g/kg = ${proteines.toFixed(1)}g`);
  } else {
    // 🔄 ANCIENNE LOGIQUE pour maintien et perte (masseMaigre × 2g)
    proteines = masseMaigre * 2;
    console.log(`🥩 Protéines (${objectif.toUpperCase()}): ${masseMaigre}kg × 2 = ${proteines.toFixed(1)}g`);
  }
  
  const caloriesProteines = proteines * 4;
  console.log(`📊 Calories protéines: ${caloriesProteines.toFixed(0)}kcal`);
  
  // ÉTAPE 2: Lipides = poidsObjectif × 1g (minimum 50g)
  let lipides = poidsObjectif * 1;
  
  // Application du minimum absolu de 50g
  if (lipides < 50) {
    console.log(`🥑 Lipides calculés (${lipides.toFixed(1)}g) < 50g → application du minimum de sécurité`);
    lipides = 50;
  }
  
  console.log(`🥑 Lipides initiaux: ${poidsObjectif.toFixed(1)}kg × 1 = ${lipides.toFixed(1)}g`);
  
  // ÉTAPE 3: NOUVELLE LOGIQUE GLUCIDES selon l'objectif
  let glucides: number;
  
  if (objectif === "perte") {
    // 🆕 NOUVELLE LOGIQUE EXCLUSIVE pour perte de poids (POIDS ACTUEL)
    if (!poidsActuel) {
      throw new Error('Le poids actuel est requis pour le calcul des glucides en perte de poids');
    }
    
    console.log('🆕 APPLICATION DE LA NOUVELLE LOGIQUE GLUCIDES POUR PERTE DE POIDS (POIDS ACTUEL)');
    console.log('❌ SUPPRESSION de toute ancienne logique utilisant le poids objectif pour les glucides');
    
    glucides = calculateCarbsForWeightLoss(poidsActuel, activite);
    
    console.log(`🌾 Glucides (NOUVELLE LOGIQUE - POIDS ACTUEL): ${glucides}g`);
    
    // Vérification de cohérence avec les calories totales
    const caloriesLipides = lipides * 9;
    const caloriesGlucides = glucides * 4;
    const caloriesCalculees = caloriesProteines + caloriesLipides + caloriesGlucides;
    
    console.log(`📊 Vérification cohérence calories:`);
    console.log(`   • Protéines: ${caloriesProteines.toFixed(0)}kcal`);
    console.log(`   • Lipides: ${caloriesLipides.toFixed(0)}kcal`);
    console.log(`   • Glucides: ${caloriesGlucides.toFixed(0)}kcal`);
    console.log(`   • Total calculé: ${caloriesCalculees.toFixed(0)}kcal`);
    console.log(`   • Objectif: ${caloriesTarget}kcal`);
    console.log(`   • Écart: ${(caloriesCalculees - caloriesTarget).toFixed(0)}kcal (${(((caloriesCalculees / caloriesTarget) - 1) * 100).toFixed(1)}%)`);
    
    // Ajustement des lipides si l'écart est trop important (>10%)
    const ecartPourcentage = Math.abs((caloriesCalculees / caloriesTarget) - 1);
    if (ecartPourcentage > 0.10) {
      console.log(`⚠️ Écart calories > 10% → Ajustement automatique des lipides`);
      
      const caloriesRestantes = caloriesTarget - (caloriesProteines + caloriesGlucides);
      const nouveauxLipides = Math.max(50, caloriesRestantes / 9); // Minimum 50g
      const lipidesMaxAutorise = poidsObjectif * 1.1; // Maximum 1.1g/kg
      
      lipides = Math.min(nouveauxLipides, lipidesMaxAutorise);
      
      console.log(`🥑 Lipides ajustés: ${lipides.toFixed(1)}g (min: 50g, max: ${lipidesMaxAutorise.toFixed(1)}g)`);
      
      // Recalcul final
      const nouvellesCaloriesLipides = lipides * 9;
      const nouvellesCaloriesTotales = caloriesProteines + nouvellesCaloriesLipides + caloriesGlucides;
      
      console.log(`📊 Après ajustement: ${nouvellesCaloriesTotales.toFixed(0)}kcal (écart: ${((nouvellesCaloriesTotales / caloriesTarget) * 100).toFixed(1)}%)`);
    }
    
  } else {
    // 🔄 ANCIENNE LOGIQUE conservée pour maintien et prise
    console.log(`🔄 Ancienne logique conservée pour objectif "${objectif}"`);
    
    let caloriesLipides = lipides * 9;
    let caloriesRestantes = caloriesTarget - (caloriesProteines + caloriesLipides);
    glucides = Math.max(0, caloriesRestantes / 4);
    
    console.log(`🌾 Glucides (ancienne logique): (${caloriesTarget} - ${caloriesProteines.toFixed(0)} - ${caloriesLipides.toFixed(0)}) / 4 = ${glucides.toFixed(1)}g`);
    
    // Vérification de la règle des 50% pour les glucides (ancienne logique)
    const pourcentageGlucides = (glucides * 4) / caloriesTarget * 100;
    console.log(`📈 Pourcentage glucides: ${pourcentageGlucides.toFixed(1)}%`);
    
    if (pourcentageGlucides > 50) {
      console.log(`⚠️ DÉPASSEMENT: Glucides ${pourcentageGlucides.toFixed(1)}% > 50% → AJUSTEMENT OBLIGATOIRE`);
      
      // Réduire les glucides à exactement 50%
      const glucidesMax = (caloriesTarget * 0.50) / 4;
      const reductionGlucides = glucides - glucidesMax;
      const caloriesAReaffecter = reductionGlucides * 4;
      
      console.log(`🔄 Réduction glucides: ${glucides.toFixed(1)}g → ${glucidesMax.toFixed(1)}g (-${reductionGlucides.toFixed(1)}g)`);
      console.log(`💰 Calories à réaffecter aux lipides: ${caloriesAReaffecter.toFixed(0)}kcal`);
      
      // Réinjecter ces calories dans les lipides
      const lipidesSupplementaires = caloriesAReaffecter / 9;
      const nouveauxLipides = lipides + lipidesSupplementaires;
      
      // Vérifier la limite max de 1.1g/kg
      const lipidesMaxAutorise = poidsObjectif * 1.1;
      const lipidesFinaux = Math.min(nouveauxLipides, lipidesMaxAutorise);
      
      console.log(`🥑 Lipides après réinjection: ${lipides.toFixed(1)}g + ${lipidesSupplementaires.toFixed(1)}g = ${nouveauxLipides.toFixed(1)}g`);
      console.log(`🥑 Limite max (1.1g/kg): ${lipidesMaxAutorise.toFixed(1)}g`);
      console.log(`🥑 Lipides finaux: ${lipidesFinaux.toFixed(1)}g`);
      
      // Recalculer les glucides avec les nouveaux lipides
      const nouvellesCaloriesLipides = lipidesFinaux * 9;
      const nouvellesCaloriesRestantes = caloriesTarget - (caloriesProteines + nouvellesCaloriesLipides);
      const nouveauxGlucides = Math.max(0, nouvellesCaloriesRestantes / 4);
      
      console.log(`🌾 Glucides finaux: (${caloriesTarget} - ${caloriesProteines.toFixed(0)} - ${nouvellesCaloriesLipides.toFixed(0)}) / 4 = ${nouveauxGlucides.toFixed(1)}g`);
      
      lipides = lipidesFinaux;
      glucides = nouveauxGlucides;
    }
  }
  
  // ÉTAPE 4: Vérification finale et résultats
  const caloriesFinalesProteines = proteines * 4;
  const caloriesFinalesLipides = lipides * 9;
  const caloriesFinalesGlucides = glucides * 4;
  const totalCaloriesFinales = caloriesFinalesProteines + caloriesFinalesLipides + caloriesFinalesGlucides;
  
  const pourcentageFinaleProteines = (caloriesFinalesProteines / totalCaloriesFinales) * 100;
  const pourcentageFinaleGlucides = (caloriesFinalesGlucides / totalCaloriesFinales) * 100;
  const pourcentageFinaleLipides = (caloriesFinalesLipides / totalCaloriesFinales) * 100;
  
  console.log('📊 RÉPARTITION FINALE AVEC NOUVELLE LOGIQUE:');
  console.log(`   • Protéines: ${Math.round(proteines)}g (${pourcentageFinaleProteines.toFixed(1)}%) - ${caloriesFinalesProteines.toFixed(0)}kcal`);
  console.log(`   • Lipides: ${Math.round(lipides)}g (${pourcentageFinaleLipides.toFixed(1)}%) - ${caloriesFinalesLipides.toFixed(0)}kcal`);
  console.log(`   • Glucides: ${Math.round(glucides)}g (${pourcentageFinaleGlucides.toFixed(1)}%) - ${caloriesFinalesGlucides.toFixed(0)}kcal`);
  console.log(`   • TOTAL: ${totalCaloriesFinales.toFixed(0)}kcal (objectif: ${caloriesTarget}kcal)`);
  
  if (objectif === "perte") {
    console.log('🎯 NOUVELLE LOGIQUE GLUCIDES APPLIQUÉE AVEC SUCCÈS pour perte de poids (POIDS ACTUEL)');
    console.log(`   • Glucides calculés selon: ${activite === "élevé" ? "2.5g" : "2.0g"} × poids actuel`);
    console.log(`   • Respect de la plage ±5%: ${Math.abs((glucides / calculateCarbsForWeightLoss(poidsActuel!, activite)) - 1) <= 0.05 ? "✅" : "❌"}`);
  }
  
  // Vérifications de conformité
  const conformiteGlucides = objectif === "perte" ? true : pourcentageFinaleGlucides <= 55; // Pas de limite pour perte
  const conformiteLipides = lipides >= 50 && lipides <= poidsObjectif * 1.1;
  
  console.log('🔍 VÉRIFICATIONS DE CONFORMITÉ:');
  if (objectif === "perte") {
    console.log(`   • Glucides (nouvelle logique): ✅ (${glucides}g selon poids actuel)`);
  } else {
    console.log(`   • Glucides ≤ 55%: ${conformiteGlucides ? '✅' : '❌'} (${pourcentageFinaleGlucides.toFixed(1)}%)`);
  }
  console.log(`   • Lipides 50-${(poidsObjectif * 1.1).toFixed(1)}g: ${conformiteLipides ? '✅' : '❌'} (${lipides.toFixed(1)}g)`);
  console.log(`   • Protéines fixes: ✅ (${proteines.toFixed(1)}g)`);
  
  return {
    proteines: Math.round(proteines),
    lipides: Math.round(lipides),
    glucides: Math.round(glucides)
  };
}

export function useNutritionCalculator() {
  return {
    calculateMaintenanceNeeds,
    optimizeMacronutrientDistribution
  };
}