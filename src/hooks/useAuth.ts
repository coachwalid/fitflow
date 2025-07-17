import { useState, useEffect } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, enableNetwork, disableNetwork } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { useUserProfileStore } from '../stores/useUserProfileStore';

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setUserProfile, clearUserProfile } = useUserProfileStore();

  useEffect(() => {
    // Check for redirect result first
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          
          // Create or update user document in Firestore
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            provider: 'google',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }, { merge: true });

          console.log('✅ Connexion Google par redirection réussie:', user.displayName);
        }
      } catch (error: any) {
        console.error('❌ Erreur lors du traitement de la redirection:', error);
        setError(getErrorMessage(error.code || error.message));
      }
    };

    checkRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName
        };
        setUser(authUser);
        
        // Charger le profil utilisateur depuis Firestore
        await loadUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        clearUserProfile();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUserProfile, clearUserProfile]);

  const loadUserProfile = async (uid: string) => {
    try {
      // Try to enable network connection first
      await enableNetwork(db);
      
      const userDoc = await getDoc(doc(db, 'users', uid, 'profile', 'data'));
      if (userDoc.exists()) {
        const profileData = userDoc.data();
        setUserProfile(profileData);
        console.log('✅ Profil utilisateur complet chargé depuis Firestore');
      } else {
        // Check if basic user document exists
        const basicUserDoc = await getDoc(doc(db, 'users', uid));
        if (basicUserDoc.exists()) {
          console.log('ℹ️ Utilisateur existe mais profil incomplet - questionnaire requis');
          // Don't set any profile, let the onboarding screen handle it
        } else {
          // Create basic user document
          await setDoc(doc(db, 'users', uid), {
            email: auth.currentUser?.email || '',
            displayName: auth.currentUser?.displayName || '',
            provider: 'unknown',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          console.log('ℹ️ Document utilisateur de base créé');
        }
      }
    } catch (error) {
      
      // Handle offline or authorization errors gracefully
      if (error.code === 'unavailable' || error.message?.includes('offline') || error.message?.includes('client is offline')) {
        console.warn('⚠️ Mode hors ligne détecté lors du chargement du profil:', error.message);
        console.log('ℹ️ Mode hors ligne détecté, utilisation des données locales');
        // In offline mode, don't create any profile - let onboarding handle it
        console.log('ℹ️ Mode hors ligne - questionnaire sera affiché');
      } else {
        console.error('❌ Erreur lors du chargement du profil:', error);
        // For other errors, show a user-friendly message
        setError('Impossible de charger le profil. Vérifiez votre connexion internet.');
      }
    }
  };

  const saveUserProfile = async (profileData: any) => {
    if (!user) return;
    
    try {
      // Try to enable network connection first
      await enableNetwork(db);
      
      // Save to the profile subcollection
      await setDoc(doc(db, 'users', user.uid, 'profile', 'data'), {
        ...profileData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      // Also update basic user info if needed
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: profileData.prenom || user.displayName,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      // Update local store as well
      setUserProfile({
        ...profileData,
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ Profil utilisateur complet sauvegardé dans Firestore');
    } catch (error) {
      
      // Handle offline errors gracefully
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.warn('⚠️ Sauvegarde en mode hors ligne:', error.message);
        console.log('ℹ️ Sauvegarde locale en mode hors ligne');
        // Update local store even if Firestore fails
        setUserProfile({
          ...profileData,
          updatedAt: new Date().toISOString()
        });
        // Don't throw error for offline scenarios
      } else {
        console.error('❌ Erreur lors de la sauvegarde du profil:', error);
        throw error;
      }
    }
  };

  const saveDiet = async (dietData: any) => {
    if (!user) return;
    
    try {
      // Try to enable network connection first
      await enableNetwork(db);
      
      // Save diet to the dedicated diet document
      await setDoc(doc(db, 'users', user.uid, 'diet', 'current'), {
        ...dietData,
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ Diète sauvegardée dans Firestore sous /users/{userId}/diet');
    } catch (error) {
      
      // Handle offline errors gracefully
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.warn('⚠️ Sauvegarde diète en mode hors ligne:', error.message);
        console.log('ℹ️ Diète sera sauvegardée lors de la prochaine connexion');
        // Don't throw error for offline scenarios
      } else {
        console.error('❌ Erreur lors de la sauvegarde de la diète:', error);
        throw error;
      }
    }
  };

  const loadDiet = async (uid: string) => {
    try {
      // Try to enable network connection first
      await enableNetwork(db);
      
      const dietDoc = await getDoc(doc(db, 'users', uid, 'diet', 'current'));
      if (dietDoc.exists()) {
        const dietData = dietDoc.data();
        console.log('✅ Diète existante chargée depuis Firestore');
        return dietData;
      } else {
        console.log('ℹ️ Aucune diète existante trouvée');
        return null;
      }
    } catch (error) {
      
      // Handle offline or authorization errors gracefully
      if (error.code === 'unavailable' || error.message?.includes('offline') || error.message?.includes('client is offline')) {
        console.warn('⚠️ Mode hors ligne détecté lors du chargement de la diète:', error.message);
        console.log('ℹ️ Mode hors ligne - diète sera générée si nécessaire');
        return null;
      } else {
        console.error('❌ Erreur lors du chargement de la diète:', error);
        return null;
      }
    }
  };

  const deleteDiet = async () => {
    if (!user) return;
    
    try {
      // Try to enable network connection first
      await enableNetwork(db);
      
      // Delete the current diet document
      await setDoc(doc(db, 'users', user.uid, 'diet', 'current'), {
        deleted: true,
        deletedAt: new Date().toISOString()
      });
      
      console.log('✅ Diète supprimée de Firestore');
    } catch (error) {
      
      // Handle offline errors gracefully
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.warn('⚠️ Suppression diète en mode hors ligne:', error.message);
        console.log('ℹ️ Suppression sera effectuée lors de la prochaine connexion');
        // Don't throw error for offline scenarios
      } else {
        console.error('❌ Erreur lors de la suppression de la diète:', error);
        throw error;
      }
    }
  };
  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('🔄 Tentative de connexion avec Google');
      
      try {
        // Try popup first
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Create or update user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: 'google',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { merge: true });

        console.log('✅ Connexion Google par popup réussie:', user.displayName);
        return user;
      } catch (popupError: any) {
        // If popup is blocked, fallback to redirect
        if (popupError.code === 'auth/popup-blocked') {
          console.log('🔄 Popup bloquée, utilisation de la redirection...');
          await signInWithRedirect(auth, googleProvider);
          // The redirect will handle the rest, so we don't return anything here
          return null;
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la connexion Google:', error);
      
      // Gestion spécifique des erreurs Google
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Connexion annulée');
      } else {
        setError(getErrorMessage(error.code));
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('🔄 Tentative de création de compte pour:', email);
      console.log('🔧 Configuration Firebase Auth:', {
        currentUser: auth.currentUser,
        app: auth.app.name,
        config: auth.config
      });
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Mettre à jour le profil avec le nom d'affichage
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      // Créer le document utilisateur dans Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        displayName: displayName,
        provider: 'email',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('✅ Compte créé avec succès');
      return userCredential.user;
    } catch (error: any) {
      console.error('❌ Erreur lors de la création du compte:', error);
      setError(getErrorMessage(error.code));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Connexion réussie');
      return userCredential.user;
    } catch (error: any) {
      console.error('❌ Erreur lors de la connexion:', error);
      setError(getErrorMessage(error.code));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('✅ Déconnexion réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      throw error;
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Aucun compte trouvé avec cette adresse email';
      case 'auth/wrong-password':
        return 'Mot de passe incorrect';
      case 'auth/email-already-in-use':
        return 'Cette adresse email est déjà utilisée';
      case 'auth/weak-password':
        return 'Le mot de passe doit contenir au moins 6 caractères';
      case 'auth/invalid-email':
        return 'Adresse email invalide';
      case 'auth/too-many-requests':
        return 'Trop de tentatives. Veuillez réessayer plus tard';
      case 'auth/operation-not-allowed':
        return 'L\'authentification par email/mot de passe n\'est pas activée. Veuillez contacter l\'administrateur.';
      case 'auth/account-exists-with-different-credential':
        return 'Un compte existe déjà avec cette adresse email mais avec un autre mode de connexion';
      case 'auth/credential-already-in-use':
        return 'Ces identifiants sont déjà utilisés par un autre compte';
      case 'auth/unauthorized-domain':
        return 'Domaine non autorisé. Veuillez ajouter localhost:5173 aux domaines autorisés dans la console Firebase (Authentication > Settings > Authorized domains)';
      case 'unavailable':
        return 'Service temporairement indisponible. Veuillez réessayer plus tard.';
      case 'Failed to get document because the client is offline.':
        return 'Connexion internet requise pour charger les données.';
      default:
        return errorCode.includes('offline') || errorCode.includes('unavailable') 
          ? 'Connexion internet requise pour cette action.'
          : 'Une erreur est survenue. Veuillez réessayer';
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    saveUserProfile,
    saveDiet,
    loadDiet,
    deleteDiet
  };
}