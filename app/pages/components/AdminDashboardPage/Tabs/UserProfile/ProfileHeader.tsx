import React from 'react';
import { FaCamera } from 'react-icons/fa';

// Define interface for component props
interface ProfileHeaderProps {
  avatar: string;
  username?: string;
  level?: number;
  xp?: number;
  nextLevelXP?: number;
  onAvatarChange: (file: File) => void;
  isEditing: boolean;
}

/**
 * ProfileHeader component displays the user's profile information including avatar, username, level, and XP.
 *
 * @param {ProfileHeaderProps} props - The component props.
 * @param {string} props.avatar - The URL of the user's avatar image.
 * @param {string} [props.username='User'] - The username of the user.
 * @param {number} [props.level=1] - The current level of the user.
 * @param {number} [props.xp=0] - The current experience points of the user.
 * @param {number} [props.nextLevelXP=100] - The experience points required to reach the next level.
 * @param {function} props.onAvatarChange - Callback function to handle avatar changes.
 * @param {boolean} props.isEditing - Flag to indicate if the user is in editing mode.
 * @returns {JSX.Element} The rendered ProfileHeader component.
 */
const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatar,
  username = 'User',
  level = 1,
  xp = 0,
  nextLevelXP = 100,
  onAvatarChange,
  isEditing,
}) => {
  // Default avatar image path
  const defaultAvatar = '/assets/images/logo.png';

  // Calculate XP percentage for the progress bar
  const xpPercentage = nextLevelXP ? Math.min((xp / nextLevelXP) * 100, 100) : 0;

  // Handle file input change for avatar upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Check if the file exists and its size is within the limit
    if (file && file.size <= 2 * 1024 * 1024) {
      onAvatarChange(file);
    } else {
      alert('File size exceeds 2 MB. Please choose a smaller file.');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <img
          id="user-avatar"
          src={avatar || defaultAvatar}
          alt="User Avatar"
          className="w-16 h-16 rounded-full"
        />
        {isEditing && (
          <label className="absolute inset-0 flex items-center justify-center cursor-pointer">
            <FaCamera className="text-white text-2xl" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">{username}</h2>
        <p className="text-gray-300">Level: {level}</p>
        <div className="w-32 bg-gray-200 h-2 rounded-full">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
        <p className="text-gray-400 text-sm">XP: {xp}/{nextLevelXP}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;