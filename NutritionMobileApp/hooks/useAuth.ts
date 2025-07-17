import { useState, useEffect } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { useUserProfileStore } from '../stores/useUserProfileStore';

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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName
        };
        setUser(authUser);
        
        // Load user profile from Firestore
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
      const userDoc = await getDoc(doc(db, 'users', uid, 'profile', 'data'));
      if (userDoc.exists()) {
        const profileData = userDoc.data();
        setUserProfile(profileData);
        console.log('✅ User profile loaded from Firestore');
      } else {
        // Check if basic user document exists
        const basicUserDoc = await getDoc(doc(db, 'users', uid));
        if (basicUserDoc.exists()) {
          console.log('ℹ️ User exists but profile incomplete - onboarding required');
        } else {
          // Create basic user document
          await setDoc(doc(db, 'users', uid), {
            email: auth.currentUser?.email || '',
            displayName: auth.currentUser?.displayName || '',
            provider: 'email',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          console.log('ℹ️ Basic user document created');
        }
      }
    } catch (error: any) {
      console.error('❌ Error loading profile:', error);
      setError('Unable to load profile. Please check your internet connection.');
    }
  };

  const saveUserProfile = async (profileData: any) => {
    if (!user) return;
    
    try {
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
      
      console.log('✅ Profile saved successfully');
    } catch (error: any) {
      console.error('❌ Error saving profile:', error);
      setError('Unable to save profile. Please try again.');
      throw error;
    }
  };

  const saveDiet = async (dietData: any) => {
    if (!user) return;
    
    try {
      await setDoc(doc(db, 'users', user.uid, 'diet', 'current'), {
        ...dietData,
        generatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ Diet saved successfully');
    } catch (error: any) {
      console.error('❌ Error saving diet:', error);
      setError('Unable to save diet plan. Please try again.');
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create or update user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        provider: 'email',
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      console.log('✅ Email login successful:', user.email);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Email login error:', error);
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string, displayName?: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name if provided
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: displayName || user.displayName,
        provider: 'email',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('✅ Email registration successful:', user.email);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Email registration error:', error);
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      clearUserProfile();
      setError(null);
      console.log('✅ Logout successful');
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      setError('Logout failed. Please try again.');
    }
  };

  return {
    user,
    loading,
    error,
    loginWithEmail,
    registerWithEmail,
    logout,
    saveUserProfile,
    saveDiet,
    setError
  };
}

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
}