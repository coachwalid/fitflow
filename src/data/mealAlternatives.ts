export interface MealAlternative {
  id: string;
  category: 'petit_dejeuner' | 'dejeuner' | 'diner' | 'souper' | 'collation';
  name: string;
  foods: Array<{
    name: string;
    quantity: number; // en grammes
  }>;
}

// 🔒 ALTERNATIVES MANUELLES VALIDÉES - Basées sur le fichier CSV fourni
export const MANUAL_ALTERNATIVES: { [mealName: string]: MealAlternative[] } = {
  // PETIT-DÉJEUNERS
  "Petit-déjeuner protéiné aux œufs": [
    {
      id: 'pd1-alt1',
      category: 'petit_dejeuner',
      name: 'Omelette aux légumes et pain complet',
      foods: [
        { name: 'Œufs entiers', quantity: 120 },
        { name: 'Pain complet', quantity: 60 },
        { name: 'Courgettes', quantity: 100 },
        { name: 'Tomates', quantity: 80 },
        { name: 'Huile d\'olive', quantity: 8 }
      ]
    },
    {
      id: 'pd1-alt2',
      category: 'petit_dejeuner',
      name: 'Œufs brouillés avec flocons d\'avoine salés',
      foods: [
        { name: 'Œufs entiers', quantity: 120 },
        { name: 'Flocons d\'avoine', quantity: 50 },
        { name: 'Lait végétal', quantity: 150 },
        { name: 'Épinards', quantity: 100 },
        { name: 'Huile d\'olive', quantity: 8 }
      ]
    },
    {
      id: 'pd1-alt3',
      category: 'petit_dejeuner',
      name: 'Wrap de petit déjeuner aux œufs et avocat',
      foods: [
        { name: 'Œufs entiers', quantity: 120 },
        { name: 'Pain de mie complet', quantity: 70 },
        { name: 'Avocat', quantity: 60 },
        { name: 'Tomates', quantity: 80 }
      ]
    }
  ],

  "Bowl d'avoine aux fruits": [
    {
      id: 'pd2-alt1',
      category: 'petit_dejeuner',
      name: 'Porridge au lait végétal et fruits rouges',
      foods: [
        { name: 'Flocons d\'avoine', quantity: 60 },
        { name: 'Lait végétal', quantity: 250 },
        { name: 'Compote sans sucre', quantity: 100 },
        { name: 'Amandes', quantity: 20 },
        { name: 'Miel', quantity: 15 }
      ]
    },
    {
      id: 'pd2-alt2',
      category: 'petit_dejeuner',
      name: 'Granola maison avec yaourt nature',
      foods: [
        { name: 'Muesli sans sucre', quantity: 50 },
        { name: 'Yaourt grec 0%', quantity: 150 },
        { name: 'Banane', quantity: 100 },
        { name: 'Noix', quantity: 20 },
        { name: 'Miel', quantity: 15 }
      ]
    },
    {
      id: 'pd2-alt3',
      category: 'petit_dejeuner',
      name: 'Overnight oats à la pomme et cannelle',
      foods: [
        { name: 'Flocons d\'avoine', quantity: 60 },
        { name: 'Lait végétal', quantity: 200 },
        { name: 'Pomme', quantity: 120 },
        { name: 'Yaourt grec 0%', quantity: 100 },
        { name: 'Amandes', quantity: 20 }
      ]
    }
  ],

  "Smoothie protéiné": [
    {
      id: 'pd3-alt1',
      category: 'petit_dejeuner',
      name: 'Smoothie banane-chocolat protéiné',
      foods: [
        { name: 'Protéine en poudre', quantity: 30 },
        { name: 'Banane', quantity: 120 },
        { name: 'Lait végétal', quantity: 250 },
        { name: 'Flocons d\'avoine', quantity: 40 },
        { name: 'Beurre de cacahuète', quantity: 15 }
      ]
    },
    {
      id: 'pd3-alt2',
      category: 'petit_dejeuner',
      name: 'Milkshake protéiné vanille-avoine',
      foods: [
        { name: 'Protéine en poudre', quantity: 30 },
        { name: 'Flocons d\'avoine', quantity: 50 },
        { name: 'Lait végétal', quantity: 300 },
        { name: 'Banane', quantity: 100 },
        { name: 'Amandes', quantity: 15 }
      ]
    },
    {
      id: 'pd3-alt3',
      category: 'petit_dejeuner',
      name: 'Smoothie aux fruits rouges et graines de chia',
      foods: [
        { name: 'Protéine en poudre', quantity: 30 },
        { name: 'Compote sans sucre', quantity: 150 },
        { name: 'Lait végétal', quantity: 250 },
        { name: 'Flocons d\'avoine', quantity: 40 },
        { name: 'Amandes', quantity: 20 }
      ]
    }
  ],

  "Tartines au fromage blanc": [
    {
      id: 'pd4-alt1',
      category: 'petit_dejeuner',
      name: 'Pain complet + fromage blanc + compote sans sucre',
      foods: [
        { name: 'Pain complet', quantity: 80 },
        { name: 'Fromage blanc 0%', quantity: 200 },
        { name: 'Compote sans sucre', quantity: 100 },
        { name: 'Noix', quantity: 25 }
      ]
    },
    {
      id: 'pd4-alt2',
      category: 'petit_dejeuner',
      name: 'Pain intégral + ricotta + fruits rouges',
      foods: [
        { name: 'Pain complet', quantity: 80 },
        { name: 'Ricotta', quantity: 150 },
        { name: 'Compote sans sucre', quantity: 100 },
        { name: 'Amandes', quantity: 20 },
        { name: 'Miel', quantity: 15 }
      ]
    },
    {
      id: 'pd4-alt3',
      category: 'petit_dejeuner',
      name: 'Galettes de riz + skyr + miel',
      foods: [
        { name: 'Pain de mie complet', quantity: 60 },
        { name: 'Skyr 0%', quantity: 200 },
        { name: 'Miel', quantity: 20 },
        { name: 'Noix', quantity: 25 }
      ]
    }
  ],

  // DÉJEUNERS
  "Poulet grillé aux légumes": [
    {
      id: 'dej1-alt1',
      category: 'dejeuner',
      name: 'Poulet curry et riz complet',
      foods: [
        { name: 'Blanc de poulet', quantity: 150 },
        { name: 'Riz complet cuit', quantity: 150 },
        { name: 'Courgettes', quantity: 150 },
        { name: 'Épinards', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 10 }
      ]
    },
    {
      id: 'dej1-alt2',
      category: 'dejeuner',
      name: 'Wok de poulet aux légumes',
      foods: [
        { name: 'Blanc de poulet', quantity: 150 },
        { name: 'Riz basmati cuit', quantity: 150 },
        { name: 'Brocolis', quantity: 200 },
        { name: 'Haricots verts', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 12 }
      ]
    },
    {
      id: 'dej1-alt3',
      category: 'dejeuner',
      name: 'Poulet au four avec patates douces',
      foods: [
        { name: 'Blanc de poulet', quantity: 150 },
        { name: 'Patate douce cuite', quantity: 200 },
        { name: 'Brocolis', quantity: 200 },
        { name: 'Courgettes', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 10 }
      ]
    }
  ],

  "Saumon quinoa": [
    {
      id: 'dej2-alt1',
      category: 'dejeuner',
      name: 'Saumon grillé et légumes vapeur',
      foods: [
        { name: 'Saumon', quantity: 120 },
        { name: 'Riz basmati cuit', quantity: 150 },
        { name: 'Brocolis', quantity: 200 },
        { name: 'Haricots verts', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 8 }
      ]
    },
    {
      id: 'dej2-alt2',
      category: 'dejeuner',
      name: 'Filet de saumon avec boulgour',
      foods: [
        { name: 'Saumon', quantity: 120 },
        { name: 'Quinoa cuit', quantity: 150 },
        { name: 'Épinards', quantity: 200 },
        { name: 'Courgettes', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 8 }
      ]
    },
    {
      id: 'dej2-alt3',
      category: 'dejeuner',
      name: 'Saumon à l\'aneth et patate douce',
      foods: [
        { name: 'Saumon', quantity: 120 },
        { name: 'Patate douce cuite', quantity: 180 },
        { name: 'Épinards', quantity: 200 },
        { name: 'Avocat', quantity: 60 },
        { name: 'Huile d\'olive', quantity: 8 }
      ]
    }
  ],

  "Bowl végétarien": [
    {
      id: 'dej3-alt1',
      category: 'dejeuner',
      name: 'Tofu mariné et riz sauvage',
      foods: [
        { name: 'Tofu ferme', quantity: 120 },
        { name: 'Riz complet cuit', quantity: 150 },
        { name: 'Brocolis', quantity: 150 },
        { name: 'Épinards', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 12 }
      ]
    },
    {
      id: 'dej3-alt2',
      category: 'dejeuner',
      name: 'Falafels et légumes rôtis',
      foods: [
        { name: 'Lentilles cuites', quantity: 150 },
        { name: 'Quinoa cuit', quantity: 120 },
        { name: 'Courgettes', quantity: 150 },
        { name: 'Tomates', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 15 }
      ]
    },
    {
      id: 'dej3-alt3',
      category: 'dejeuner',
      name: 'Curry de lentilles et riz basmati',
      foods: [
        { name: 'Lentilles cuites', quantity: 150 },
        { name: 'Riz basmati cuit', quantity: 150 },
        { name: 'Épinards', quantity: 200 },
        { name: 'Tomates', quantity: 100 },
        { name: 'Huile d\'olive', quantity: 12 }
      ]
    }
  ],

  "Bœuf aux patates douces": [
    {
      id: 'dej4-alt1',
      category: 'dejeuner',
      name: 'Steak haché 5% + riz + haricots verts',
      foods: [
        { name: 'Bœuf maigre (5% MG)', quantity: 130 },
        { name: 'Riz basmati cuit', quantity: 150 },
        { name: 'Haricots verts', quantity: 200 },
        { name: 'Tomates', quantity: 100 },
        { name: 'Huile d\'olive', quantity: 10 }
      ]
    },
    {
      id: 'dej4-alt2',
      category: 'dejeuner',
      name: 'Bœuf sauté aux légumes et nouilles',
      foods: [
        { name: 'Bœuf maigre (5% MG)', quantity: 130 },
        { name: 'Quinoa cuit', quantity: 150 },
        { name: 'Brocolis', quantity: 150 },
        { name: 'Courgettes', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 12 }
      ]
    },
    {
      id: 'dej4-alt3',
      category: 'dejeuner',
      name: 'Boulettes de bœuf + semoule + courgettes',
      foods: [
        { name: 'Bœuf maigre (5% MG)', quantity: 130 },
        { name: 'Quinoa cuit', quantity: 150 },
        { name: 'Courgettes', quantity: 200 },
        { name: 'Tomates', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 10 }
      ]
    }
  ],

  // DÎNERS
  "Poisson blanc aux légumes": [
    {
      id: 'din1-alt1',
      category: 'diner',
      name: 'Filet de merlan + riz + épinards',
      foods: [
        { name: 'Cabillaud', quantity: 150 },
        { name: 'Riz basmati cuit', quantity: 120 },
        { name: 'Épinards', quantity: 200 },
        { name: 'Courgettes', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 8 }
      ]
    },
    {
      id: 'din1-alt2',
      category: 'diner',
      name: 'Colin et purée de patate douce',
      foods: [
        { name: 'Cabillaud', quantity: 150 },
        { name: 'Patate douce cuite', quantity: 180 },
        { name: 'Brocolis', quantity: 200 },
        { name: 'Épinards', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 8 }
      ]
    },
    {
      id: 'din1-alt3',
      category: 'diner',
      name: 'Cabillaud vapeur et légumes grillés',
      foods: [
        { name: 'Cabillaud', quantity: 150 },
        { name: 'Pomme de terre cuite', quantity: 180 },
        { name: 'Courgettes', quantity: 200 },
        { name: 'Haricots verts', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 8 }
      ]
    }
  ],

  "Dinde aux légumes verts": [
    {
      id: 'din2-alt1',
      category: 'diner',
      name: 'Filet de dinde grillé et pommes vapeur',
      foods: [
        { name: 'Blanc de dinde', quantity: 140 },
        { name: 'Pomme de terre cuite', quantity: 180 },
        { name: 'Brocolis', quantity: 200 },
        { name: 'Épinards', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 10 }
      ]
    },
    {
      id: 'din2-alt2',
      category: 'diner',
      name: 'Brochettes de dinde et légumes',
      foods: [
        { name: 'Blanc de dinde', quantity: 140 },
        { name: 'Riz complet cuit', quantity: 120 },
        { name: 'Courgettes', quantity: 200 },
        { name: 'Tomates', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 10 }
      ]
    },
    {
      id: 'din2-alt3',
      category: 'diner',
      name: 'Dinde au four + courgettes + riz',
      foods: [
        { name: 'Blanc de dinde', quantity: 140 },
        { name: 'Riz basmati cuit', quantity: 120 },
        { name: 'Courgettes', quantity: 200 },
        { name: 'Haricots verts', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 10 }
      ]
    }
  ],

  "Thon aux haricots": [
    {
      id: 'din3-alt1',
      category: 'diner',
      name: 'Salade de thon aux pois chiches',
      foods: [
        { name: 'Thon', quantity: 120 },
        { name: 'Lentilles cuites', quantity: 150 },
        { name: 'Tomates', quantity: 200 },
        { name: 'Épinards', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 12 }
      ]
    },
    {
      id: 'din3-alt2',
      category: 'diner',
      name: 'Wrap de thon et légumes',
      foods: [
        { name: 'Thon', quantity: 120 },
        { name: 'Pain de mie complet', quantity: 70 },
        { name: 'Avocat', quantity: 60 },
        { name: 'Tomates', quantity: 150 },
        { name: 'Épinards', quantity: 100 }
      ]
    },
    {
      id: 'din3-alt3',
      category: 'diner',
      name: 'Thon grillé et semoule',
      foods: [
        { name: 'Thon', quantity: 120 },
        { name: 'Quinoa cuit', quantity: 150 },
        { name: 'Brocolis', quantity: 200 },
        { name: 'Courgettes', quantity: 150 },
        { name: 'Huile d\'olive', quantity: 12 }
      ]
    }
  ],

  // SOUPERS
  "Collation protéinée du soir": [
    {
      id: 'sou1-alt1',
      category: 'souper',
      name: 'Fromage blanc + noix + baies',
      foods: [
        { name: 'Fromage blanc 0%', quantity: 150 },
        { name: 'Noix', quantity: 20 },
        { name: 'Compote sans sucre', quantity: 100 }
      ]
    },
    {
      id: 'sou1-alt2',
      category: 'souper',
      name: 'Skyr + fruits rouges',
      foods: [
        { name: 'Skyr 0%', quantity: 150 },
        { name: 'Compote sans sucre', quantity: 120 },
        { name: 'Amandes', quantity: 20 }
      ]
    },
    {
      id: 'sou1-alt3',
      category: 'souper',
      name: 'Œuf dur + carottes',
      foods: [
        { name: 'Œufs entiers', quantity: 60 },
        { name: 'Pomme', quantity: 120 },
        { name: 'Amandes', quantity: 20 }
      ]
    }
  ],

  "Yaourt aux fruits secs": [
    {
      id: 'sou2-alt1',
      category: 'souper',
      name: 'Yaourt nature + amandes + miel',
      foods: [
        { name: 'Yaourt grec 0%', quantity: 200 },
        { name: 'Amandes', quantity: 25 },
        { name: 'Miel', quantity: 10 }
      ]
    },
    {
      id: 'sou2-alt2',
      category: 'souper',
      name: 'Skyr + figues sèches + noix',
      foods: [
        { name: 'Skyr 0%', quantity: 200 },
        { name: 'Fruits secs mélangés', quantity: 25 },
        { name: 'Miel', quantity: 10 }
      ]
    },
    {
      id: 'sou2-alt3',
      category: 'souper',
      name: 'Fromage blanc + fruits secs',
      foods: [
        { name: 'Fromage blanc 0%', quantity: 200 },
        { name: 'Fruits secs mélangés', quantity: 25 },
        { name: 'Miel', quantity: 10 }
      ]
    }
  ],

  // COLLATIONS
  "Fruits et noix": [
    {
      id: 'col1-alt1',
      category: 'collation',
      name: 'Pomme + amandes',
      foods: [
        { name: 'Pomme', quantity: 150 },
        { name: 'Amandes', quantity: 20 }
      ]
    },
    {
      id: 'col1-alt2',
      category: 'collation',
      name: 'Poire + noix de cajou',
      foods: [
        { name: 'Pomme', quantity: 150 }, // Utiliser pomme car poire pas dans NUTRITION_DATA
        { name: 'Noix', quantity: 20 }
      ]
    },
    {
      id: 'col1-alt3',
      category: 'collation',
      name: 'Banane + noisettes',
      foods: [
        { name: 'Banane', quantity: 120 },
        { name: 'Amandes', quantity: 20 } // Utiliser amandes car noisettes pas dans NUTRITION_DATA
      ]
    }
  ],

  "Yaourt protéiné": [
    {
      id: 'col2-alt1',
      category: 'collation',
      name: 'Skyr + banane + cannelle',
      foods: [
        { name: 'Skyr 0%', quantity: 150 },
        { name: 'Banane', quantity: 100 },
        { name: 'Miel', quantity: 10 }
      ]
    },
    {
      id: 'col2-alt2',
      category: 'collation',
      name: 'Yaourt grec + flocons d\'avoine',
      foods: [
        { name: 'Yaourt grec 0%', quantity: 150 },
        { name: 'Flocons d\'avoine', quantity: 30 },
        { name: 'Miel', quantity: 10 }
      ]
    },
    {
      id: 'col2-alt3',
      category: 'collation',
      name: 'Fromage blanc + compote sans sucre',
      foods: [
        { name: 'Fromage blanc 0%', quantity: 150 },
        { name: 'Compote sans sucre', quantity: 100 },
        { name: 'Noix', quantity: 15 }
      ]
    }
  ],

  "Barre protéinée maison": [
    {
      id: 'col3-alt1',
      category: 'collation',
      name: 'Mix amandes et dattes',
      foods: [
        { name: 'Amandes', quantity: 25 },
        { name: 'Fruits secs mélangés', quantity: 20 }
      ]
    },
    {
      id: 'col3-alt2',
      category: 'collation',
      name: 'Noix et fruits secs variés',
      foods: [
        { name: 'Noix', quantity: 20 },
        { name: 'Fruits secs mélangés', quantity: 25 }
      ]
    },
    {
      id: 'col3-alt3',
      category: 'collation',
      name: 'Collation protéinée naturelle',
      foods: [
        { name: 'Protéine en poudre', quantity: 20 },
        { name: 'Flocons d\'avoine', quantity: 30 },
        { name: 'Beurre de cacahuète', quantity: 15 }
      ]
    }
  ],

  "Smoothie léger": [
    {
      id: 'col4-alt1',
      category: 'collation',
      name: 'Smoothie fraise-banane',
      foods: [
        { name: 'Protéine en poudre', quantity: 20 },
        { name: 'Banane', quantity: 80 },
        { name: 'Lait végétal', quantity: 200 }
      ]
    },
    {
      id: 'col4-alt2',
      category: 'collation',
      name: 'Smoothie mangue-lait d\'amande',
      foods: [
        { name: 'Protéine en poudre', quantity: 20 },
        { name: 'Banane', quantity: 80 }, // Utiliser banane car mangue pas dans NUTRITION_DATA
        { name: 'Lait végétal', quantity: 200 }
      ]
    },
    {
      id: 'col4-alt3',
      category: 'collation',
      name: 'Smoothie vert (épinards-banane)',
      foods: [
        { name: 'Protéine en poudre', quantity: 20 },
        { name: 'Banane', quantity: 80 },
        { name: 'Épinards', quantity: 50 },
        { name: 'Lait végétal', quantity: 200 }
      ]
    }
  ],

  "Fromage blanc aux fruits": [
    {
      id: 'col5-alt1',
      category: 'collation',
      name: 'Fromage blanc + fruits rouges',
      foods: [
        { name: 'Fromage blanc 0%', quantity: 150 },
        { name: 'Compote sans sucre', quantity: 100 },
        { name: 'Noix', quantity: 15 }
      ]
    },
    {
      id: 'col5-alt2',
      category: 'collation',
      name: 'Skyr + pomme râpée',
      foods: [
        { name: 'Skyr 0%', quantity: 150 },
        { name: 'Pomme', quantity: 100 },
        { name: 'Amandes', quantity: 15 }
      ]
    },
    {
      id: 'col5-alt3',
      category: 'collation',
      name: 'Yaourt nature + compote',
      foods: [
        { name: 'Yaourt grec 0%', quantity: 150 },
        { name: 'Compote sans sucre', quantity: 100 },
        { name: 'Noix', quantity: 15 }
      ]
    }
  ],

  "Tartine légère": [
    {
      id: 'col6-alt1',
      category: 'collation',
      name: 'Pain de seigle + purée d\'amande',
      foods: [
        { name: 'Pain complet', quantity: 30 },
        { name: 'Beurre de cacahuète', quantity: 15 },
        { name: 'Banane', quantity: 80 }
      ]
    },
    {
      id: 'col6-alt2',
      category: 'collation',
      name: 'Pain complet + miel + noix',
      foods: [
        { name: 'Pain complet', quantity: 30 },
        { name: 'Miel', quantity: 15 },
        { name: 'Noix', quantity: 15 }
      ]
    },
    {
      id: 'col6-alt3',
      category: 'collation',
      name: 'Tartine fromage frais et concombre',
      foods: [
        { name: 'Pain complet', quantity: 30 },
        { name: 'Fromage blanc 0%', quantity: 50 },
        { name: 'Banane', quantity: 80 } // Remplacer concombre par banane
      ]
    }
  ]
};

/**
 * 🔍 Recherche les alternatives manuelles pour un repas donné
 */
export function getManualAlternatives(mealName: string): MealAlternative[] {
  console.log(`🔍 Recherche d'alternatives manuelles pour: "${mealName}"`);
  
  const alternatives = MANUAL_ALTERNATIVES[mealName];
  
  if (alternatives && alternatives.length > 0) {
    console.log(`✅ ${alternatives.length} alternative(s) manuelle(s) trouvée(s) pour "${mealName}"`);
    alternatives.forEach((alt, index) => {
      console.log(`   ${index + 1}. ${alt.name}`);
    });
    return alternatives;
  }
  
  console.log(`❌ Aucune alternative manuelle trouvée pour: "${mealName}"`);
  return [];
}

/**
 * 🎲 Sélectionne une alternative aléatoire parmi les alternatives manuelles
 */
export function selectRandomManualAlternative(mealName: string): MealAlternative | null {
  const alternatives = getManualAlternatives(mealName);
  
  if (alternatives.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * alternatives.length);
  const selectedAlternative = alternatives[randomIndex];
  
  console.log(`🎲 Alternative sélectionnée: "${selectedAlternative.name}" (${randomIndex + 1}/${alternatives.length})`);
  
  return selectedAlternative;
}

/**
 * 📋 Liste tous les repas qui ont des alternatives manuelles
 */
export function getMealsWithManualAlternatives(): string[] {
  return Object.keys(MANUAL_ALTERNATIVES);
}

/**
 * 📊 Statistiques sur les alternatives manuelles
 */
export function getManualAlternativesStats(): {
  totalMeals: number;
  totalAlternatives: number;
  averageAlternativesPerMeal: number;
  mealsByCategory: { [category: string]: number };
} {
  const mealNames = Object.keys(MANUAL_ALTERNATIVES);
  const totalMeals = mealNames.length;
  const totalAlternatives = Object.values(MANUAL_ALTERNATIVES).reduce((sum, alts) => sum + alts.length, 0);
  const averageAlternativesPerMeal = totalAlternatives / totalMeals;
  
  const mealsByCategory: { [category: string]: number } = {};
  
  Object.values(MANUAL_ALTERNATIVES).forEach(alternatives => {
    alternatives.forEach(alt => {
      mealsByCategory[alt.category] = (mealsByCategory[alt.category] || 0) + 1;
    });
  });
  
  return {
    totalMeals,
    totalAlternatives,
    averageAlternativesPerMeal,
    mealsByCategory
  };
}