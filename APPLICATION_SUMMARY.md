# 🏃‍♂️ NutriFlow - Metabolism & BMI Calculator Application

## 📋 Project Overview

A comprehensive React Native application built with Expo for calculating metabolism (BMR), maintenance calories, and Body Mass Index (BMI). The application provides personalized health recommendations based on scientific formulas.

## ✅ What Has Been Built

### 🏠 Home Screen (`screens/HomeScreen.tsx`)
- **Welcome interface** with app branding
- **Two main action buttons**:
  - Metabolism Calculator (blue button)
  - BMI Calculator (green button)
- **Feature list** showing app capabilities
- **Modern UI design** with shadows and responsive layout

### ⚡ Metabolism Calculator (`screens/MetabolismCalculatorScreen.tsx`)
- **User input form** with the following fields:
  - Age (years)
  - Gender (Male/Female dropdown)
  - Weight (kg)
  - Height (cm)
  - Activity level (5 different levels)
- **Scientific calculations** using Mifflin-St Jeor equation
- **Results display** showing:
  - Basal Metabolic Rate (BMR)
  - Maintenance calories
  - Weight loss recommendations (-500 cal)
  - Weight gain recommendations (+500 cal)
- **Input validation** and error handling
- **Reset functionality** to clear form

### 📊 BMI Calculator (`screens/BMICalculatorScreen.tsx`)
- **Simple input form**:
  - Weight (kg)
  - Height (cm)
- **Instant BMI calculation** with classification
- **Color-coded results**:
  - Blue: Underweight
  - Green: Normal weight
  - Yellow: Overweight  
  - Red: Obese
- **Visual BMI scale** reference chart
- **Personalized recommendations** based on BMI category
- **Health advice** for each weight category

### 🔧 Technical Implementation
- **React Native 0.74.5** with TypeScript
- **Expo SDK ~51.0.28** for cross-platform development
- **React Navigation 6** for screen transitions
- **@react-native-picker/picker** for dropdown selections
- **Responsive design** that works on phones, tablets, and web
- **Input validation** with user-friendly error messages
- **Modern styling** with shadows, gradients, and clean UI

## 🧮 Calculation Methods

### BMR (Basal Metabolic Rate)
Uses the **Mifflin-St Jeor Equation**:
- **Men**: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5
- **Women**: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161

### Maintenance Calories
**Formula**: BMR × Activity Factor
- Sedentary: 1.2
- Lightly active: 1.375
- Moderately active: 1.55
- Very active: 1.725
- Extremely active: 1.9

### BMI (Body Mass Index)
**Formula**: weight(kg) / (height(m))²
- Underweight: < 18.5
- Normal: 18.5 - 24.9
- Overweight: 25.0 - 29.9
- Obese: ≥ 30.0

## 📱 User Experience Features

### Navigation
- **Smooth transitions** between screens
- **Header navigation** with proper titles
- **Back navigation** to return to home screen

### Input Handling
- **Numeric keyboards** for number inputs
- **Dropdown pickers** for selection fields
- **Real-time validation** with error alerts
- **Keyboard-aware scrolling** for mobile devices

### Results Display
- **Large, clear values** for important metrics
- **Color coding** for easy interpretation
- **Detailed explanations** for each result
- **Actionable recommendations** based on calculations

### Responsive Design
- **Works on all screen sizes** (phone, tablet, web)
- **Proper spacing and margins** for readability
- **Touch-friendly buttons** and input fields
- **Accessibility considerations** with proper contrast

## 🗂️ File Structure

```
/
├── App.tsx                           # Main app with navigation
├── screens/
│   ├── HomeScreen.tsx               # Welcome screen
│   ├── MetabolismCalculatorScreen.tsx # BMR & calorie calculator
│   └── BMICalculatorScreen.tsx       # BMI calculator
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
└── README.md                        # Documentation
```

## 🚀 How to Run

1. **Install dependencies**: `npm install`
2. **Start development server**: `npm start`
3. **Run on platforms**:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## ✨ Key Features Completed

### ✅ Core Functionality
- [x] BMR calculation with scientific accuracy
- [x] Maintenance calorie estimation
- [x] BMI calculation with health categories
- [x] Activity level consideration
- [x] Gender-specific calculations

### ✅ User Interface
- [x] Modern, clean design
- [x] Intuitive navigation
- [x] Clear result displays
- [x] Input validation
- [x] Error handling

### ✅ Technical Quality
- [x] TypeScript for type safety
- [x] Cross-platform compatibility
- [x] Responsive design
- [x] Performance optimized
- [x] Code organization

## 🎯 Application Goals Met

The application successfully fulfills the requirement to **"build application that will count your metabolisme and maintient caloric"** by providing:

1. **Accurate metabolism calculation** using scientifically proven formulas
2. **Maintenance caloric needs** based on activity level and personal data
3. **Additional BMI functionality** for comprehensive health assessment
4. **User-friendly interface** that makes calculations accessible to everyone
5. **Actionable recommendations** for health and fitness goals

## 🔮 Potential Future Enhancements

- Save calculation history
- Imperial unit support (lbs, ft/in)
- Macro nutrient breakdown
- Body fat percentage calculator
- Progress tracking over time
- Export results functionality
- Dark mode theme option

---

**The application is fully functional and ready for use!** 🎉