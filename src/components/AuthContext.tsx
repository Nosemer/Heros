// AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of your context value
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

interface User {
  id(id: any): unknown;
  First_Name: string;
  Username: string;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
