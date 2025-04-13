/**
 * AuthForm.tsx
 * A form component for user authentication, handling both login and registration.
 *
 * @component
 * @param {AuthFormProps} props - The component props.
 * @param {boolean} props.isLogin - Indicates if the form is for login (true) or registration (false).
 * @param {(formData: FormData) => Promise<void>} props.onAuth - Callback function to handle authentication, receives form data as an argument.
 * @returns {JSX.Element} The rendered form component for user authentication.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define interfaces for type safety
interface FormData {
  name?: string;
  email: string;
  password: string;
}

interface AuthFormProps {
  isLogin: boolean;
  onAuth: (formData: FormData) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onAuth }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin && password && confirmPassword && password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
    }
  }, [password, confirmPassword, isLogin]);

  useEffect(() => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const formData: FormData = isLogin ? { email, password } : { name, email, password };
    await onAuth(formData);
    if (!isLogin) {
      navigate('/home');
    }
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      {!isLogin && (
        <input
          id="name-input"
          type="text"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
          required={!isLogin}
        />
      )}
      <input
        id="email-input"
        type="email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
        required
      />
      <input
        id="password-input"
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
        required
      />
      {!isLogin && (
        <>
          <input
            id="confirm-password-input"
            type="password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className={`w-full p-2 bg-gray-800 border rounded text-white ${
              error ? 'border-red-500' : 'border-gray-700'
            }`}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </>
      )}
      <button
        id="auth-submit-button"
        type="submit"
        className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        {isLogin ? 'Login' : 'Register'}
      </button>
    </form>
  );
};

export default AuthForm;