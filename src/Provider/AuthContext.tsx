import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../../config/firebase";

// ---------- Context Type ----------
interface AuthContextType {
  user: User | null;
  loading: boolean;
  createUser: (email: string, password: string) => Promise<any>;
  loginUser: (email: string, password: string) => Promise<any>;
  logoutUser: () => Promise<void>;
}

// ---------- Create Context ----------
export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

// ---------- Provider ----------
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Register User
  const createUser = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ✅ Login User
  const loginUser = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ✅ Logout User
  const logoutUser = async () => {
    return signOut(auth);
  };

  // ✅ Auto Login Detect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};