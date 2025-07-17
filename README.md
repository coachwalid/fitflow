# 🏃‍♂️ NutriFlow - Metabolism & BMI Calculator

A comprehensive React Native application built with Expo for calculating your metabolism and Body Mass Index (BMI). Get personalized recommendations for maintaining, losing, or gaining weight based on scientific formulas.

## 📱 Features

### Metabolism Calculator
- **Basal Metabolic Rate (BMR)** calculation using the Mifflin-St Jeor equation
- **Maintenance calories** estimation based on activity level
- **Weight loss recommendations** (500 calorie deficit)
- **Weight gain recommendations** (500 calorie surplus)
- Support for different activity levels from sedentary to extremely active

### BMI Calculator
- **Body Mass Index** calculation with instant results
- **Category classification** (underweight, normal, overweight, obese)
- **Color-coded results** for easy interpretation
- **Personalized recommendations** based on BMI category
- **BMI scale reference** with health ranges

### User Experience
- 🎨 Modern and intuitive UI design
- 📱 Responsive layout for all screen sizes
- ⌨️ Smart keyboard handling
- 🔄 Real-time input validation
- 📊 Clear and comprehensive results display

## 🧮 Calculation Methods

### BMR (Basal Metabolic Rate)
Uses the scientifically-proven **Mifflin-St Jeor Equation**:

**For Men:**
```
BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5
```

**For Women:**
```
BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161
```

### Maintenance Calories
```
Maintenance Calories = BMR × Activity Factor
```

**Activity Factors:**
- Sedentary (little/no exercise): 1.2
- Lightly active (light exercise 1-3 days/week): 1.375
- Moderately active (moderate exercise 3-5 days/week): 1.55
- Very active (hard exercise 6-7 days/week): 1.725
- Extremely active (very hard exercise, physical job): 1.9

### BMI (Body Mass Index)
```
BMI = weight(kg) / (height(m))²
```

**BMI Categories:**
- Underweight: < 18.5
- Normal weight: 18.5 - 24.9
- Overweight: 25.0 - 29.9
- Obese: ≥ 30.0

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd nutriflow
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

4. **Run on your preferred platform:**
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📁 Project Structure

```
nutriflow/
├── App.tsx                 # Main application component
├── screens/
│   ├── HomeScreen.tsx      # Welcome screen with navigation
│   ├── MetabolismCalculatorScreen.tsx  # BMR & calorie calculator
│   └── BMICalculatorScreen.tsx         # BMI calculator
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🎯 How to Use

### Metabolism Calculator
1. Navigate to the "Calculateur de Métabolisme" from the home screen
2. Enter your personal information:
   - Age (years)
   - Gender (Male/Female)
   - Weight (kg)
   - Height (cm)
   - Activity level
3. Tap "Calculer" to get your results
4. View your BMR, maintenance calories, and weight management recommendations

### BMI Calculator
1. Navigate to the "Calculateur d'IMC" from the home screen
2. Enter your measurements:
   - Weight (kg)
   - Height (cm)
3. Tap "Calculer l'IMC" to get your results
4. View your BMI score, category, and personalized recommendations

## 🔧 Technical Details

### Dependencies
- **React Native 0.74.5** - Core framework
- **Expo ~51.0.28** - Development platform
- **React Navigation 6** - Screen navigation
- **@react-native-picker/picker** - Activity level selection
- **TypeScript** - Type safety

### Key Features
- **TypeScript** for type safety and better development experience
- **React Navigation** for smooth screen transitions
- **Responsive design** that works on phones and tablets
- **Input validation** to ensure accurate calculations
- **Error handling** with user-friendly messages
- **Modern styling** with shadows and gradients

## 📊 Results Interpretation

### Metabolism Results
- **BMR**: Calories needed at complete rest
- **Maintenance**: Calories to maintain current weight
- **Weight Loss**: 500 calorie deficit for ~0.5kg/week loss
- **Weight Gain**: 500 calorie surplus for ~0.5kg/week gain

### BMI Results
The application provides:
- Your calculated BMI value
- Category classification with color coding
- Health recommendations based on your category
- Visual BMI scale for reference

## ⚡ Performance Optimizations

- Efficient state management with React hooks
- Optimized rendering with proper key props
- Keyboard-aware scrolling for better mobile experience
- Lightweight styling without external UI libraries

## 🔮 Future Enhancements

Potential features for future versions:
- Save calculation history
- Multiple unit systems (imperial/metric)
- Body fat percentage calculator
- Macronutrient breakdown
- Progress tracking
- Export results to PDF/email

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## ⚠️ Disclaimer

This application is for informational purposes only and should not replace professional medical advice. Always consult with healthcare professionals for personalized nutrition and fitness guidance.

---

**Built with ❤️ using React Native and Expo**