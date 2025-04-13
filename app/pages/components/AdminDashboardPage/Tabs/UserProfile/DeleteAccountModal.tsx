/**
 * DeleteAccountModal.tsx
 * A modal component for confirming user account deletion.
 */
import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import Modal from '../../../common/Modal';

// Define props interface
interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  userId: string;
  token: string | null; // Change from string to string | null
}

/**
 * DeleteAccountModal component
 *
 * This modal component prompts the user to confirm account deletion by entering their password.
 * It provides feedback on the deletion process and handles errors appropriately.
 *
 * @param {DeleteAccountModalProps} props - Component properties
 * @returns {JSX.Element} The rendered delete account modal component.
 */
function DeleteAccountModal({ isOpen, onClose, onDelete, userId, token }: DeleteAccountModalProps) {
  const [password, setPassword] = useState<string>(''); // State to hold the user's password input
  const [error, setError] = useState<string>(''); // State to hold any error messages

  /**
   * Handles the account deletion process.
   * Validates the password input and makes an API call to delete the account.
   * Displays error messages based on the outcome of the API call.
   */
  const handleDelete = async (): Promise<void> => {
    if (!password) {
      setError('Password is required.'); // Error if password is not provided
      return;
    }

    try {
      // Call the delete API using axios
      const response = await axios.delete(`/api/blogs/delete/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: { password }, // Send the password in the request body
      });

      if (response.status === 200) {
        onDelete(); // Callback for successful deletion (e.g., logout or redirect)
        onClose(); // Close the modal after successful deletion
      } else {
        setError('Failed to delete account. Please check your password.'); // Error for failed deletion
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.'); // General error handling
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-gray-900">
        <h2 className="text-xl font-semibold mb-4">Delete Account</h2>
        <p className="mb-4">
          This action will permanently remove all data associated with your account. Are you sure you want to proceed?
        </p>
        <input
          id="delete-account-password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          placeholder="Enter your password to confirm"
          className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        {error && <p id="delete-account-error" className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            id="confirm-delete-account"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Delete Account
          </button>
          <button
            id="cancel-delete-account"
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteAccountModal;