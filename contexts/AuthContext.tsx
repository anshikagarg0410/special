import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
  Auth,
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User
} from 'firebase/auth';
import { auth } from '../firebase'; // Import auth from your firebase.ts

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // To check auth status on page load

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (error) {
      console.error("Firebase login failed:", error);
      return false;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    // This is the key part: it listens for changes in Firebase's auth state
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false); // Auth status is now known
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser, // isAuthenticated is true if currentUser is not null
    login,
    logout
  };

  // Don't render the app until we know if the user is logged in or not
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};