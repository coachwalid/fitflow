# NutriFlow

Une application mobile React Native + Expo pour le suivi nutritionnel.

## Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Expo CLI (optionnel, mais recommandé)

## Installation

1. Cloner le projet ou naviguer dans le dossier
2. Installer les dépendances :

```bash
npm install
```

## Lancement de l'application

Pour démarrer l'application en mode développement :

```bash
npx expo start
```

Cela ouvrira le serveur de développement Expo. Vous pourrez ensuite :

- Scanner le QR code avec l'application Expo Go sur votre téléphone
- Appuyer sur 'a' pour ouvrir sur un émulateur Android
- Appuyer sur 'i' pour ouvrir sur un simulateur iOS
- Appuyer sur 'w' pour ouvrir dans le navigateur web

## Structure du projet

```
├── App.tsx                 # Point d'entrée principal avec navigation
├── screens/
│   └── HomeScreen.tsx      # Écran d'accueil
├── assets/                 # Images et assets
├── app.json               # Configuration Expo
├── package.json           # Dépendances et scripts
└── tsconfig.json          # Configuration TypeScript
```

## Technologies utilisées

- React Native
- Expo SDK 51
- TypeScript
- React Navigation 6
- Expo Status Bar
- React Native Safe Area Context

## Fonctionnalités actuelles

- ✅ Écran d'accueil avec message de bienvenue
- ✅ Bouton "Commencer" (fonctionnalité à venir)
- ✅ Navigation configurée (prêt pour d'autres écrans)
- ✅ Design responsive et moderne

## Développement

L'application est prête pour le développement. Le bouton "Commencer" sur l'écran d'accueil est configuré mais n'effectue aucune action pour le moment.

Pour ajouter de nouveaux écrans :
1. Créer un nouveau fichier dans `screens/`
2. Ajouter la route dans `App.tsx`
3. Configurer la navigation depuis `HomeScreen.tsx`