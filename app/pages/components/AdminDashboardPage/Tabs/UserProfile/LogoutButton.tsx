import React from 'react';

// Define interface for component props
interface LogoutButtonProps {
  onLogout: () => void;
}

/**
 * LogoutButton component
 * 
 * This component renders a button that, when clicked, triggers the user logout process.
 * It is designed to be used in user profile or dashboard sections where logout functionality is needed.
 * 
 * @param {LogoutButtonProps} props - The component props.
 * @param {function} props.onLogout - The callback function to execute when the button is clicked.
 * @returns {JSX.Element} The rendered logout button component.
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <div className="text-center p-4">
      <button
        id="logout-button"
        onClick={onLogout}
        className="w-full max-w-md p-2 bg-red-600 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;