import React, { createContext, useContext, useState, ReactNode } from 'react';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // ... (you can add login, logout, and other related methods here)

  const value = {
    currentUser,
    setCurrentUser,
    currentFamily,
    setCurrentFamily,
    token,
    setToken,
    // ... (export the methods as well)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}