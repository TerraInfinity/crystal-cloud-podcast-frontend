/**
 * LoginPage.tsx
 * The main login and registration page, handling user authentication.
 * This component manages user login and registration processes, including form handling, API calls, and OAuth options.
 *
 * @component
 * @returns {JSX.Element} The rendered login page component.
 * @description This component allows users to log in or register using either email/password or OAuth methods.
 * It handles the state for toggling between login and registration forms, as well as OAuth options.
 *
 * @context {AuthContext} AuthContext - Provides authentication methods and state.
 * @state {boolean} isLogin - Indicates whether the user is in login mode.
 * @state {boolean} useOAuth - Indicates whether to display OAuth options.
 */
import React, { useState, useContext, type JSX } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import AuthForm from './components/LoginPage/AuthForm';
import AuthToggle from './components/LoginPage/AuthToggle';

// Define interfaces for type safety
interface FormData {
  name?: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  message?: string;
}

interface AuthContextType {
  login: (token: string) => void;
}

export function LoginPage(): JSX.Element {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [useOAuth, setUseOAuth] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { login } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();

  const getApiUrl = (endpoint: string): string => {
    const mode = import.meta.env.VITE_NODE_ENV || 'development';
    if (mode === 'local-development') {
      const apiPort = process.env.REACT_APP_BACKEND_PORT;
      return `${window.location.protocol}//${window.location.hostname}:${apiPort}${endpoint}`;
    }
    return endpoint;
  };

  const handleAuth = async (formData: FormData): Promise<void> => {
    try {
      setErrorMessage('');
      const url = isLogin ? getApiUrl('/api/users/login') : getApiUrl('/api/users/register');
      const body = isLogin
        ? JSON.stringify({ email: formData.email, password: formData.password })
        : JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, isAdmin: false });

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const data: AuthResponse = await response.json();
      if (response.ok) {
        login(data.token);
        navigate(isLogin ? '/home' : '/login');
      } else {
        setErrorMessage(data.message || 'Authentication failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred during authentication');
    }
  };

  const handleOAuthLogin = (provider: string): void => {
    const mode = import.meta.env.VITE_NODE_ENV || 'development';
    let backendUrl: string;
    if (mode === 'local-development') {
      const apiPort = process.env.REACT_APP_BACKEND_PORT;
      backendUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/users/auth/${provider}`;
    } else {
      backendUrl = `/api/users/auth/${provider}`;
    }

    window.location.href = backendUrl;
  };

  const title = useOAuth ? 'Login with OAuth' : (isLogin ? 'Login' : 'Register');

  return (
    <Layout title={title}>
      {errorMessage && (
        <p id="auth-error-message" className="text-red-500 text-center mb-4">{errorMessage}</p>
      )}
      {useOAuth ? (
        <div style={{ textAlign: 'center' }}>
          <button
            id="login-google-button"
            onClick={() => handleOAuthLogin('google')}
            style={{ margin: '10px', padding: '10px', backgroundColor: '#db4437', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Login with Google
          </button>
          <button
            id="login-github-button"
            onClick={() => handleOAuthLogin('github')}
            style={{ margin: '10px', padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Login with GitHub
          </button>
          <button
            id="login-twitter-button"
            onClick={() => handleOAuthLogin('twitter')}
            style={{ margin: '10px', padding: '10px', backgroundColor: '#1da1f2', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Login with Twitter
          </button>
          <p>
            <a
              href="#"
              id="use-email-link"
              onClick={() => setUseOAuth(false)}
              style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Use Email instead
            </a>
          </p>
        </div>
      ) : (
        <>
          <AuthForm isLogin={isLogin} onAuth={handleAuth} />
          <AuthToggle isLogin={isLogin} onToggle={() => setIsLogin(!isLogin)} />
          <p>
            <a
              href="#"
              onClick={() => setUseOAuth(true)}
              style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Use OAuth instead
            </a>
          </p>
        </>
      )}
    </Layout>
  );
}