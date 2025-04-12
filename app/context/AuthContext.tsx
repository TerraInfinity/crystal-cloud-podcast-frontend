/**
 * AuthContext.tsx
 * This file provides the authentication context for the application, managing user authentication state,
 * token storage, and providing functions for logging in and out.
 * It exports the AuthContext and the AuthProvider component.
 */
import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from 'jwt-decode';

/**
 * Interface for the user object.
 * @property {string} id - The user's ID.
 * @property {string | null} role - The user's role, or null if not set.
 */
interface User {
  id: string;
  role: string | null;
}

/**
 * Default user object representing an unauthenticated user.
 */
const defaultUser: User = { id: '', role: null };

/**
 * Interface for the AuthContext value.
 * @property {boolean} isAuthenticated - Indicates if the user is authenticated.
 * @property {User} user - The current user object.
 * @property {string | null} token - The current JWT token, or null if not set.
 * @property {boolean} loading - Indicates if the authentication state is still loading.
 * @property {(newToken: string) => void} login - Function to log in the user with a token.
 * @property {() => void} logout - Function to log out the user.
 */
interface AuthContextType {
  isAuthenticated: boolean;
  user: User;
  token: string | null;
  loading: boolean;
  login: (newToken: string) => void;
  logout: () => void;
}

/**
 * AuthContext is a React context that provides authentication state and methods.
 */
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: defaultUser,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

/**
 * Define an interface for the expected structure of the decoded token
 */
interface DecodedToken {
  exp?: number; // Make exp optional
  id: string;
  role?: string | null;
}

/**
 * Extend the JwtPayload interface to include your custom properties
 */
interface CustomDecodedToken extends JwtPayload {
  id: string;
  role?: string | null;
}

/**
 * Validates a given JWT token by decoding it and checking its expiration time.
 * If the token is valid, it returns the decoded token; otherwise, it returns null.
 * @param {string} token - The JWT token to validate.
 * @returns {DecodedToken | null} The decoded token if valid, null otherwise.
 */
const validateToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token); // Use the defined interface
    console.log('Decoded token:', decoded); // Log the full decoded payload
    const currentTime = Date.now() / 1000;
    // Check if exp is defined before comparing
    return decoded.exp !== undefined && decoded.exp >= currentTime ? decoded : null;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * AuthProvider is a React component that provides the AuthContext to its children.
 * It manages the authentication state, including token storage and user details.
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components that will have access to the AuthContext.
 * @returns {JSX.Element} The AuthProvider component.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User>(defaultUser);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    console.log('Stored token from localStorage:', storedToken); // Log the raw token
    if (storedToken) {
      const decoded = validateToken(storedToken);
      if (decoded) {
        const newUser: User = { id: decoded.id, role: decoded.role || null };
        setUser(newUser);
        setToken(storedToken);
        setIsAuthenticated(true);
        console.log('Token is valid, user set to:', newUser); // Log the updated user
      } else {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        console.log('Token invalid or expired, removed');
      }
    } else {
      console.log('No token found in localStorage');
    }
    setLoading(false);
  }, []);

  /**
   * Logs the user in by setting the token and updating the authentication state.
   * It decodes the token to extract user information and updates the context state.
   * @param {string} newToken - The new JWT token to set for the user.
   */
  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    const decoded = jwtDecode<CustomDecodedToken>(newToken); // Use the custom type
    setUser({ id: decoded.id, role: decoded.role || null });
    setToken(newToken);
    setIsAuthenticated(true);
    console.log('User logged in, token set, user:', { id: decoded.id, role: decoded.role });
    console.log('Login action ID: login-button'); // ID for the login action
  };

  /**
   * Logs the user out by removing the token from local storage and resetting the authentication state.
   */
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsAuthenticated(false);
    setUser(defaultUser);
    console.log('User logged out, token removed');
    console.log('Logout action ID: logout-button'); // ID for the logout action
  };

  // Use useMemo to optimize performance by memoizing the context value
  const value: AuthContextType = useMemo(
    () => ({
      isAuthenticated,
      user,
      token,
      loading,
      login,
      logout,
    }),
    [isAuthenticated, user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to access the AuthContext.
 * Throws an error if used outside of an AuthProvider.
 * @returns {AuthContextType} The authentication context value.
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};