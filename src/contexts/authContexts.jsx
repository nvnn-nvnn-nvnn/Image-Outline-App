import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      console.log("Attempting sign in...");
      console.log("Auth object:", auth);
      console.log("Google provider:", googleProvider);
      console.log("Current domain:", window.location.hostname);
      
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Sign in successful:", result.user);
      return result.user;
    } catch (error) {
      console.error("Error signing in:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Full error object:", error);
      
      // Common Firebase auth errors
      if (error.code === 'auth/unauthorized-domain') {
        console.error("DOMAIN NOT AUTHORIZED: Add your domain to Firebase Console");
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.error("POPUP CLOSED: User closed the popup");
      } else if (error.code === 'auth/popup-blocked') {
        console.error("POPUP BLOCKED: Browser blocked the popup");
      }
      
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    user,
    signInWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};