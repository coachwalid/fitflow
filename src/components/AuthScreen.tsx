import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, Chrome } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  const { signIn, signUp, signInWithGoogle, loading, error } = useAuth();

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.email) {
      errors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email invalide';
    }

    if (!formData.password) {
      errors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (isSignUp) {
      if (!formData.displayName) {
        errors.displayName = 'Nom requis';
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Confirmation du mot de passe requise';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.displayName);
      } else {
        await signIn(formData.email, formData.password);
      }
    } catch (error) {
      // L'erreur est déjà gérée dans le hook useAuth
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      // If result is null, it means we're using redirect method
      // and the page will reload, so no need to handle anything here
    } catch (error) {
      // L'erreur est déjà gérée dans le hook useAuth
    }
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isSignUp ? 'Créer un compte' : 'Se connecter'}
          </h1>
          <p className="text-gray-600">
            {isSignUp 
              ? 'Rejoignez-nous pour personnaliser votre nutrition' 
              : 'Accédez à votre profil nutritionnel'
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 mb-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Chrome size={20} className="text-blue-500" />
                Continuer avec Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name (Sign Up only) */}
            {isSignUp && (
              <div>
                <label className="flex items-center gap-3 text-sm font-medium text-gray-700 mb-2">
                  <User size={16} />
                  Nom complet
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className={`w-full p-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:border-blue-500 ${
                    formErrors.displayName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Votre nom complet"
                />
                {formErrors.displayName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.displayName}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="flex items-center gap-3 text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full p-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:border-blue-500 ${
                  formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="votre@email.com"
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-3 text-sm font-medium text-gray-700 mb-2">
                <Lock size={16} />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full p-3 pr-12 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:border-blue-500 ${
                    formErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
              )}
            </div>

            {/* Confirm Password (Sign Up only) */}
            {isSignUp && (
              <div>
                <label className="flex items-center gap-3 text-sm font-medium text-gray-700 mb-2">
                  <Lock size={16} />
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full p-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:border-blue-500 ${
                    formErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Confirmez votre mot de passe"
                />
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-semibold text-lg shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                  {isSignUp ? 'Créer mon compte' : 'Se connecter'}
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
            </p>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormData({ email: '', password: '', displayName: '', confirmPassword: '' });
                setFormErrors({});
              }}
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors mt-1"
            >
              {isSignUp ? 'Se connecter' : 'Créer un compte'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}