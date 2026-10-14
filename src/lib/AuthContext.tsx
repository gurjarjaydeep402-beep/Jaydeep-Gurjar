import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfileData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  plan: 'Free' | 'Pro' | 'Enterprise';
  credits: number;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfileData | null;
  loading: boolean;
  isGuest: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, displayName?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: (displayName?: string, email?: string) => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [guestProfile, setGuestProfile] = useState<UserProfileData | null>(() => {
    try {
      const saved = localStorage.getItem('astra_guest_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Sync user profile from Firestore or initialize profile document
  const fetchOrCreateProfile = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfileData;
        setUserProfile(data);
      } else {
        const initialProfile: UserProfileData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Astra Pioneer',
          photoURL: user.photoURL || null,
          plan: 'Pro',
          credits: 500,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userRef, initialProfile);
        setUserProfile(initialProfile);
      }
    } catch (err) {
      console.warn('Could not sync user profile to Firestore:', err);
      // Fallback local memory profile so user experience is uninterrupted
      setUserProfile({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Astra Pioneer',
        photoURL: user.photoURL || null,
        plan: 'Pro',
        credits: 500,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setGuestProfile(null);
        try {
          localStorage.removeItem('astra_guest_user');
        } catch {}
        await fetchOrCreateProfile(user);
      } else {
        // If no active Firebase user, fall back to guest session if one exists
        if (guestProfile) {
          setUserProfile(guestProfile);
        } else {
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [guestProfile]);

  // Google Sign-In with popup (primary configured provider in AI Studio Firebase projects)
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    if (cred.user) {
      await fetchOrCreateProfile(cred.user);
    }
  };

  // Demo / Guest session login
  const loginAsGuest = (displayName?: string, email?: string) => {
    const guestUser: UserProfileData = {
      uid: 'guest_' + Date.now(),
      email: email || 'gurjarjaydeep402@gmail.com',
      displayName: displayName || 'Jay Gurjar (Guest)',
      plan: 'Pro',
      credits: 500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setGuestProfile(guestUser);
    setUserProfile(guestUser);
    try {
      localStorage.setItem('astra_guest_user', JSON.stringify(guestUser));
    } catch (e) {
      console.warn('Failed to save guest session:', e);
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      await fetchOrCreateProfile(cred.user);
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed') {
        const customError = new Error(
          'Email/Password sign-in is not enabled in Firebase Console. Please use "Continue with Google" (configured by default) or use a Demo Session.'
        );
        (customError as any).code = 'auth/operation-not-allowed';
        throw customError;
      }
      throw err;
    }
  };

  const signup = async (email: string, pass: string, name?: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name?.trim() && cred.user) {
        try {
          await updateProfile(cred.user, { displayName: name.trim() });
        } catch (e) {
          console.warn('Could not set displayName on Firebase Auth user', e);
        }
      }
      await fetchOrCreateProfile(cred.user);
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed') {
        const customError = new Error(
          'Email/Password registration is not enabled in Firebase Console. Please use "Continue with Google" (configured by default) or use a Demo Session.'
        );
        (customError as any).code = 'auth/operation-not-allowed';
        throw customError;
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    setGuestProfile(null);
    setUserProfile(null);
    try {
      localStorage.removeItem('astra_guest_user');
    } catch {}
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const refreshProfile = async () => {
    if (currentUser) {
      await fetchOrCreateProfile(currentUser);
    }
  };

  const value: AuthContextType = {
    currentUser,
    userProfile: currentUser ? userProfile : (userProfile || guestProfile),
    loading,
    isGuest: !currentUser && !!guestProfile,
    login,
    signup,
    loginWithGoogle,
    loginAsGuest,
    logout,
    resetPassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
