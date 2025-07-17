export interface PredefinedMeal {
  id: string;
  category: 'petit_dejeuner' | 'dejeuner' | 'diner' | 'souper' | 'collation';
  name: string;
  foods: Array<{
    name: string;
    quantity: number; // en grammes
  }>;
}

export const predefinedMeals: PredefinedMeal[] = [
  // PETIT-DÉJEUNERS
  {
    id: 'pd1',
    category: 'petit_dejeuner',
    name: 'Petit-déjeuner protéiné aux œufs',
    foods: [
      { name: 'Œufs entiers', quantity: 120 },
      { name: 'Pain complet', quantity: 60 },
      { name: 'Avocat', quantity: 80 },
      { name: 'Tomates', quantity: 100 }
    ]
  },
  {
    id: 'pd2',
    category: 'petit_dejeuner',
    name: 'Bowl d\'avoine aux fruits',
    foods: [
      { name: 'Flocons d\'avoine', quantity: 60 },
      { name: 'Banane', quantity: 120 },
      { name: 'Yaourt grec 0%', quantity: 150 },
      { name: 'Amandes', quantity: 20 },
      { name: 'Miel', quantity: 15 }
    ]
  },
  {
    id: 'pd3',
    category: 'petit_dejeuner',
    name: 'Smoothie protéiné',
    foods: [
      { name: 'Protéine en poudre', quantity: 30 },
      { name: 'Banane', quantity: 100 },
      { name: 'Flocons d\'avoine', quantity: 40 },
      { name: 'Lait végétal', quantity: 250 },
      { name: 'Beurre de cacahuète', quantity: 15 }
    ]
  },
  {
    id: 'pd4',
    category: 'petit_dejeuner',
    name: 'Tartines au fromage blanc',
    foods: [
      { name: 'Pain complet', quantity: 80 },
      { name: 'Fromage blanc 0%', quantity: 200 },
      { name: 'Miel', quantity: 20 },
      { name: 'Noix', quantity: 25 }
    ]
  },

  // NOUVEAUX PETIT-DÉJEUNERS
  {
    id: 'pddce40b41',
    category: 'petit_dejeuner',
    name: 'Omelette au fromage blanc et flocons',
    foods: [
      { name: 'Œufs entiers', quantity: 100 },
      { name: 'Fromage blanc 0%', quantity: 150 },
      { name: 'Flocons d\'avoine', quantity: 40 },
      { name: 'Banane', quantity: 80 }
    ]
  },
  {
    id: 'pdc700bcf4',
    category: 'petit_dejeuner',
    name: 'Pain complet, yaourt et fruits',
    foods: [
      { name: 'Pain complet', quantity: 80 },
      { name: 'Yaourt grec 0%', quantity: 150 },
      { name: 'Pomme', quantity: 120 },
      { name: 'Amandes', quantity: 15 }
    ]
  },
  {
    id: 'pdd8ffd5b2',
    category: 'petit_dejeuner',
    name: 'Smoothie banane skyr',
    foods: [
      { name: 'Skyr 0%', quantity: 150 },
      { name: 'Banane', quantity: 100 },
      { name: 'Lait végétal', quantity: 200 },
      { name: 'Beurre de cacahuète', quantity: 15 }
    ]
  },

  // DÉJEUNERS
  {
    id: 'dej1',
    category: 'dejeuner',
    name: 'Poulet grillé aux légumes',
    foods: [
      { name: 'Blanc de poulet', quantity: 150 },
      { name: 'Riz basmati cuit', quantity: 150 },
      { name: 'Brocolis', quantity: 200 },
      { name: 'Courgettes', quantity: 150 },
      { name: 'Huile d\'olive', quantity: 10 }
    ]
  },
  {
    id: 'dej2',
    category: 'dejeuner',
    name: 'Saumon quinoa',
    foods: [
      { name: 'Saumon', quantity: 120 },
      { name: 'Quinoa cuit', quantity: 150 },
      { name: 'Épinards', quantity: 200 },
      { name: 'Avocat', quantity: 60 },
      { name: 'Huile d\'olive', quantity: 8 }
    ]
  },
  {
    id: 'dej3',
    category: 'dejeuner',
    name: 'Bowl végétarien',
    foods: [
      { name: 'Tofu ferme', quantity: 120 },
      { name: 'Riz complet cuit', quantity: 150 },
      { name: 'Haricots verts', quantity: 150 },
      { name: 'Lentilles cuites', quantity: 100 },
      { name: 'Huile d\'olive', quantity: 12 }
    ]
  },
  {
    id: 'dej4',
    category: 'dejeuner',
    name: 'Bœuf aux patates douces',
    foods: [
      { name: 'Bœuf maigre (5% MG)', quantity: 130 },
      { name: 'Patate douce cuite', quantity: 200 },
      { name: 'Haricots verts', quantity: 180 },
      { name: 'Huile d\'olive', quantity: 10 }
    ]
  },

  // NOUVEAUX DÉJEUNERS
  {
    id: 'dej4c9dd549',
    category: 'dejeuner',
    name: 'Poulet curry riz complet',
    foods: [
      { name: 'Blanc de poulet', quantity: 160 },
      { name: 'Riz complet cuit', quantity: 140 },
      { name: 'Courgettes', quantity: 150 },
      { name: 'Huile d\'olive', quantity: 10 }
    ]
  },
  {
    id: 'dej1c26ddc2',
    category: 'dejeuner',
    name: 'Tofu lentilles et légumes verts',
    foods: [
      { name: 'Tofu ferme', quantity: 130 },
      { name: 'Lentilles cuites', quantity: 130 },
      { name: 'Brocolis', quantity: 180 },
      { name: 'Huile d\'olive', quantity: 10 }
    ]
  },
  {
    id: 'dejb691034d',
    category: 'dejeuner',
    name: 'Saumon patates douces et haricots',
    foods: [
      { name: 'Saumon', quantity: 130 },
      { name: 'Patate douce cuite', quantity: 200 },
      { name: 'Haricots verts', quantity: 150 },
      { name: 'Huile d\'olive', quantity: 8 }
    ]
  },

  // DÎNERS
  {
    id: 'din1',
    category: 'diner',
    name: 'Poisson blanc aux légumes',
    foods: [
      { name: 'Cabillaud', quantity: 150 },
      { name: 'Pomme de terre cuite', quantity: 180 },
      { name: 'Courgettes', quantity: 200 },
      { name: 'Épinards', quantity: 150 },
      { name: 'Huile d\'olive', quantity: 8 }
    ]
  },
  {
    id: 'din2',
    category: 'diner',
    name: 'Dinde aux légumes verts',
    foods: [
      { name: 'Blanc de dinde', quantity: 140 },
      { name: 'Sarrasin cuit', quantity: 120 },
      { name: 'Brocolis', quantity: 200 },
      { name: 'Haricots verts', quantity: 150 },
      { name: 'Huile d\'olive', quantity: 10 }
    ]
  },
  {
    id: 'din3',
    category: 'diner',
    name: 'Thon aux haricots',
    foods: [
      { name: 'Thon', quantity: 120 },
      { name: 'Haricots rouges cuits', quantity: 150 },
      { name: 'Tomates', quantity: 200 },
      { name: 'Épinards', quantity: 150 },
      { name: 'Huile d\'olive', quantity: 12 }
    ]
  },

  // NOUVEAUX DÎNERS
  {
    id: 'dinee955785',
    category: 'diner',
    name: 'Cabillaud et légumes sautés',
    foods: [
      { name: 'Cabillaud', quantity: 150 },
      { name: 'Épinards', quantity: 200 },
      { name: 'Courgettes', quantity: 150 },
      { name: 'Huile d\'olive', quantity: 10 }
    ]
  },
  {
    id: 'dinb3610a60',
    category: 'diner',
    name: 'Thon et patate douce',
    foods: [
      { name: 'Thon', quantity: 130 },
      { name: 'Patate douce cuite', quantity: 200 },
      { name: 'Tomates', quantity: 150 },
      { name: 'Huile d\'olive', quantity: 10 }
    ]
  },
  {
    id: 'dine130c78b',
    category: 'diner',
    name: 'Dinde aux haricots rouges',
    foods: [
      { name: 'Blanc de dinde', quantity: 140 },
      { name: 'Haricots rouges cuits', quantity: 160 },
      { name: 'Épinards', quantity: 150 },
      { name: 'Huile d\'olive', quantity: 8 }
    ]
  },

  // SOUPERS (4ème repas optionnel)
  {
    id: 'sou1',
    category: 'souper',
    name: 'Collation protéinée du soir',
    foods: [
      { name: 'Cottage cheese', quantity: 150 },
      { name: 'Noix', quantity: 20 },
      { name: 'Pomme', quantity: 120 }
    ]
  },
  {
    id: 'sou2',
    category: 'souper',
    name: 'Yaourt aux fruits secs',
    foods: [
      { name: 'Yaourt grec 0%', quantity: 200 },
      { name: 'Fruits secs mélangés', quantity: 25 },
      { name: 'Miel', quantity: 10 }
    ]
  },

  // NOUVEAUX SOUPERS
  {
    id: 'sou3f43e5c1',
    category: 'souper',
    name: 'Fromage blanc et noix',
    foods: [
      { name: 'Fromage blanc 0%', quantity: 200 },
      { name: 'Noix', quantity: 20 },
      { name: 'Compote sans sucre', quantity: 100 }
    ]
  },
  {
    id: 'sou178bd28f',
    category: 'souper',
    name: 'Yaourt grec, banane et amandes',
    foods: [
      { name: 'Yaourt grec 0%', quantity: 180 },
      { name: 'Banane', quantity: 100 },
      { name: 'Amandes', quantity: 15 }
    ]
  },
  {
    id: 'souf8e6582b',
    category: 'souper',
    name: 'Skyr aux fruits et noix',
    foods: [
      { name: 'Skyr 0%', quantity: 200 },
      { name: 'Pomme', quantity: 100 },
      { name: 'Noix', quantity: 15 }
    ]
  },

  // COLLATIONS
  {
    id: 'col1',
    category: 'collation',
    name: 'Fruits et noix',
    foods: [
      { name: 'Pomme', quantity: 150 },
      { name: 'Amandes', quantity: 20 }
    ]
  },
  {
    id: 'col2',
    category: 'collation',
    name: 'Yaourt protéiné',
    foods: [
      { name: 'Skyr 0%', quantity: 150 },
      { name: 'Banane', quantity: 100 },
      { name: 'Miel', quantity: 10 }
    ]
  },
  {
    id: 'col3',
    category: 'collation',
    name: 'Mix de noix et fruits secs',
    foods: [
      { name: 'Amandes', quantity: 20 },
      { name: 'Fruits secs mélangés', quantity: 25 }
    ]
  },
  {
    id: 'col4',
    category: 'collation',
    name: 'Smoothie léger',
    foods: [
      { name: 'Protéine en poudre', quantity: 20 },
      { name: 'Lait végétal', quantity: 200 },
      { name: 'Banane', quantity: 80 }
    ]
  },
  {
    id: 'col5',
    category: 'collation',
    name: 'Fromage blanc aux fruits',
    foods: [
      { name: 'Fromage blanc 0%', quantity: 150 },
      { name: 'Compote sans sucre', quantity: 100 },
      { name: 'Noix', quantity: 15 }
    ]
  },
  {
    id: 'col6',
    category: 'collation',
    name: 'Tartine légère',
    foods: [
      { name: 'Pain de mie complet', quantity: 30 },
      { name: 'Beurre de cacahuète', quantity: 15 },
      { name: 'Banane', quantity: 80 }
    ]
  },

  // NOUVELLES COLLATIONS
  {
    id: 'col58a4f72f',
    category: 'collation',
    name: 'Barre protéinée et compote',
    foods: [
      { name: 'Barres protéinées', quantity: 40 },
      { name: 'Compote sans sucre', quantity: 100 }
    ]
  },
  {
    id: 'colc48cde24',
    category: 'collation',
    name: 'Yaourt grec, miel et noix',
    foods: [
      { name: 'Yaourt grec 0%', quantity: 150 },
      { name: 'Miel', quantity: 10 },
      { name: 'Noix', quantity: 15 }
    ]
  },
  {
    id: 'col45cbf3cd',
    category: 'collation',
    name: 'Pain de mie et fromage blanc',
    foods: [
      { name: 'Pain de mie complet', quantity: 40 },
      { name: 'Fromage blanc 0%', quantity: 100 },
      { name: 'Banane', quantity: 80 }
    ]
  }
];

export function getPredefinedMeals(): PredefinedMeal[] {
  return predefinedMeals;
}