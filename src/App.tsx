import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthScreen from './components/AuthScreen';
import UserMenu from './components/UserMenu';
import OnboardingScreen from './components/OnboardingScreen';
import GoalsScreen from './components/GoalsScreen';
import MealsScreen from './components/MealsScreen';
import { useUserProfileStore } from './stores/useUserProfileStore';

function App() {
  const { user, loading } = useAuth();
  const { profile, isProfileComplete } = useUserProfileStore();

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher l'écran d'authentification
  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      {/* Header avec menu utilisateur */}
      <div className="bg-white shadow-sm">
        <div className="px-6 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            Nutrition App
          </h1>
          <UserMenu />
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/profil" replace />} />
        <Route path="/profil" element={<OnboardingScreen />} />
        <Route 
          path="/preferences" 
          element={
            profile ? <GoalsScreen /> : <Navigate to="/profil" replace />
          } 
        />
        <Route 
          path="/meals" 
          element={
            isProfileComplete ? <MealsScreen /> : <Navigate to="/profil" replace />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;