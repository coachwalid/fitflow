# Nutrition Tracker Mobile App

A comprehensive mobile nutrition tracking application built with React Native and Expo, converted from a web-based nutrition app.

## Features

### 🔐 Authentication
- Email/password registration and login
- Firebase Authentication integration
- Secure user profile management

### 👤 User Onboarding
- Step-by-step profile setup
- Personal information (name, age, gender)
- Physical measurements (weight, height)
- Body composition assessment
- Lifestyle and activity level
- Health and wellness factors
- Goal setting (weight loss, maintenance, muscle gain)

### 📊 Nutrition Calculations
- Advanced Katch-McArdle formula for BMR calculation
- Personalized TDEE (Total Daily Energy Expenditure)
- Macronutrient distribution (proteins, carbs, fats)
- Goal-specific calorie adjustments

### 🍽️ Meal Planning
- Customizable meals per day (2-5 meals)
- Flexible snack options (0-3 snacks)
- Calorie distribution across meals
- Visual meal planning interface

### 📱 Mobile-Optimized UI
- Native React Native components
- Responsive design for all screen sizes
- Intuitive navigation with React Navigation
- Beautiful and modern interface with custom styling

## Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **Backend**: Firebase (Authentication & Firestore)
- **Styling**: React Native StyleSheet with custom design system
- **TypeScript**: Fully typed for better development experience

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NutritionMobileApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - The app is already configured to use the existing Firebase project
   - Firebase config is located in `config/firebaseConfig.ts`

4. **Start the development server**
   ```bash
   # For web development
   npm run web
   
   # For iOS (macOS only)
   npm run ios
   
   # For Android
   npm run android
   ```

5. **Using Expo Go (Recommended for testing)**
   - Install Expo Go on your mobile device
   - Scan the QR code displayed in the terminal
   - The app will load on your device

## Project Structure

```
NutritionMobileApp/
├── App.tsx                 # Main app component with navigation
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
├── config/
│   └── firebaseConfig.ts  # Firebase configuration
├── hooks/
│   └── useAuth.ts         # Authentication hook
├── stores/
│   └── useUserProfileStore.ts  # User profile state management
├── screens/
│   ├── AuthScreen.tsx     # Login/Register screen
│   ├── OnboardingScreen.tsx  # Profile setup wizard
│   ├── GoalsScreen.tsx    # Goals and preferences
│   └── MealsScreen.tsx    # Main meal planning screen
├── utils/
│   └── nutritionCalculator.ts  # Nutrition calculation utilities
└── assets/               # Images and static assets
```

## Key Features Explained

### Nutrition Calculations
The app uses advanced nutritional science:
- **Katch-McArdle Formula**: More accurate BMR calculation using lean body mass
- **Activity Multipliers**: Precise TDEE calculation based on activity level
- **Goal-Specific Adjustments**: Calorie deficits/surpluses for weight management
- **Macronutrient Optimization**: Evidence-based protein, carb, and fat distribution

### User Experience
- **Progressive Onboarding**: Step-by-step profile creation with validation
- **Visual Feedback**: Progress indicators and intuitive UI elements
- **Data Persistence**: Local storage with cloud backup via Firebase
- **Offline Support**: Basic functionality works offline with automatic sync

### Security & Privacy
- **Firebase Authentication**: Industry-standard security
- **Data Encryption**: All user data is encrypted in transit and at rest
- **Privacy First**: Only necessary data is collected and stored

## Development

### Adding New Features
1. Create new screens in the `screens/` directory
2. Add navigation routes in `App.tsx`
3. Update the user profile store if needed
4. Add appropriate TypeScript types

### Customizing Nutrition Logic
- Modify calculations in `utils/nutritionCalculator.ts`
- Update the user profile interface in `stores/useUserProfileStore.ts`
- Adjust validation logic in the onboarding screen

### Styling Guidelines
- Use the consistent color scheme defined in styles
- Follow React Native best practices for responsive design
- Maintain accessibility standards

## Deployment

### Building for Production

**iOS**:
```bash
npx eas build --platform ios
```

**Android**:
```bash
npx eas build --platform android
```

**Web**:
```bash
npm run build
```

### Publishing
- Configure EAS (Expo Application Services) for app store deployment
- Set up proper app icons and splash screens
- Configure app store metadata and descriptions

## Firebase Configuration

The app uses the following Firebase services:
- **Authentication**: User registration and login
- **Firestore**: User profile and diet data storage
- **Security Rules**: Configured for user data privacy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the documentation
- Open an issue in the repository
- Contact the development team

## Roadmap

Future enhancements planned:
- [ ] Food database integration
- [ ] Barcode scanning for food items
- [ ] Progress tracking and analytics
- [ ] Social features and sharing
- [ ] Nutrition coaching integration
- [ ] Wearable device integration
- [ ] Meal photo recognition

---

Built with ❤️ using React Native and Expo
