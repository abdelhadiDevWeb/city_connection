import React, { createContext, useContext, useState, useEffect } from 'react';
import { ResidentUser } from '../types/social';
import { CURRENT_RESIDENT_USER } from '../services/mockSocialData';

interface AuthContextType {
  user: ResidentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Start logged in with default mock resident so user can explore directly, or can log out to test login screen
  const [user, setUser] = useState<ResidentUser | null>(CURRENT_RESIDENT_USER);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (identifier: string, pass: string) => {
    setIsLoading(true);
    // Simulate brief network authentication check
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!identifier.trim() || !pass.trim()) {
      setIsLoading(false);
      return { success: false, error: 'Veuillez saisir votre identifiant et votre mot de passe.' };
    }

    // Accept valid resident credentials
    setUser(CURRENT_RESIDENT_USER);
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
