import React, { useEffect, useState } from 'react';

// Define interface for component props
interface ChangePasswordFormProps {
  setCurrentPassword: (password: string) => void;
  setNewPassword: (password: string) => void;
  setConfirmNewPassword: (password: string) => void;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

/**
 * ChangePasswordForm component allows users to change their password.
 * It validates the new password and confirms that it matches.
 *
 * @param {ChangePasswordFormProps} props - The component props.
 * @param {Function} props.setCurrentPassword - Function to update the current password state.
 * @param {Function} props.setNewPassword - Function to update the new password state.
 * @param {Function} props.setConfirmNewPassword - Function to update the confirm new password state.
 * @param {string} props.currentPassword - The current password entered by the user.
 * @param {string} props.newPassword - The new password entered by the user.
 * @param {string} props.confirmNewPassword - The confirmation of the new password.
 * @returns {JSX.Element} The rendered ChangePasswordForm component.
 */
const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  setCurrentPassword,
  setNewPassword,
  setConfirmNewPassword,
  currentPassword,
  newPassword,
  confirmNewPassword,
}) => {
  const [error, setError] = useState<string>('');

  // Check if the new password and confirm password match
  const isPasswordMismatch = newPassword && confirmNewPassword && newPassword !== confirmNewPassword;
  // Check if the new password is at least 8 characters long
  const isPasswordTooShort = newPassword && newPassword.length < 8;

  useEffect(() => {
    // Update error state based on password validation
    if (isPasswordMismatch) {
      setError('Passwords do not match.');
    } else if (isPasswordTooShort) {
      setError('Password must be at least 8 characters.');
    } else {
      setError('');
    }
  }, [newPassword, confirmNewPassword]);

  return (
    <div className="space-y-2">
      <div>
        <input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
        />
      </div>
      <div>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
        />
      </div>
      <div>
        <input
          id="confirm-new-password"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          placeholder="Confirm New Password"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
        />
      </div>
      {error && <p id="password-error" className="text-red-500">{error}</p>}
    </div>
  );
};

export default ChangePasswordForm;