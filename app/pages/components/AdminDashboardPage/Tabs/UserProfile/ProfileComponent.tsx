import React, { useState, useEffect } from 'react';
import BioComponent from './BioComponent';
import ChangePasswordForm from './ChangePasswordForm';
import SocialBar from './SocialBar';
import AdditionalDetails from './AdditionalDetails';
import { FaInstagram, FaLinkedin, FaYoutube, FaFacebookF, FaGlobe, FaTumblr, FaSnapchatGhost, FaReddit, FaTwitch, FaGithub, FaDiscord } from 'react-icons/fa';
import { SiRumble, SiLinktree } from 'react-icons/si';
import { SlSocialSpotify, SlSocialSoundcloud, SlSocialSteam } from 'react-icons/sl';
import { FaPatreon, FaXTwitter } from 'react-icons/fa6';
import ProfileHeader from './ProfileHeader';

// Define interfaces
interface SocialPlatform {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }> | string;
  isImage?: boolean;
  domains: string[] | null;
}

interface User {
  avatar: string;
  level?: number;
  xp?: number;
  nextLevelXP?: number;
  provider: string;
}

interface SocialLinks {
  [key: string]: string | undefined;
}

interface AdditionalDetailsType {
  age: string;
  gender: string;
  orientation: string;
  pronouns: string;
}

interface UrlErrors {
  [key: string]: string | undefined;
}

interface SelectedSocials {
  [key: string]: boolean;
}

interface ProfileComponentProps {
  user: User;
  isEditing: boolean;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  socialLinks: SocialLinks;
  setSocialLinks: (links: SocialLinks) => void;
  onValidationChange: (isValid: boolean) => void;
  onEdit: () => void;
  onCancel: () => void;
  currentPassword: string;
  setCurrentPassword: (password: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmNewPassword: string;
  setConfirmNewPassword: (password: string) => void;
  age: string;
  setAge: (age: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  orientation: string;
  setOrientation: (orientation: string) => void;
  pronouns: string;
  setPronouns: (pronouns: string) => void;
}

// Define social platforms with icons and valid domains
const socialPlatforms: SocialPlatform[] = [
  { key: 'website', label: 'Website', icon: FaGlobe, domains: null },
  { key: 'patreon', label: 'Patreon', icon: FaPatreon, domains: ['patreon.com'] },
  { key: 'discord', label: 'Discord', icon: FaDiscord, domains: ['discord.com'] },
  { key: 'linktree', label: 'Linktree', icon: SiLinktree, domains: ['linktr.ee'] },
  { key: 'x', label: 'X (Twitter)', icon: FaXTwitter, domains: ['twitter.com', 'x.com'] },
  { key: 'reddit', label: 'Reddit', icon: FaReddit, domains: ['reddit.com'] },
  { key: 'spotify', label: 'Spotify', icon: SlSocialSpotify, domains: ['spotify.com'] },
  { key: 'soundcloud', label: 'SoundCloud', icon: SlSocialSoundcloud, domains: ['soundcloud.com'] },
  { key: 'instagram', label: 'Instagram', icon: FaInstagram, domains: ['instagram.com'] },
  { key: 'youtube', label: 'YouTube', icon: FaYoutube, domains: ['youtube.com'] },
  { key: 'omniflix', label: 'Omniflix', icon: '/assets/images/omniflixIcon.jpg', isImage: true, domains: ['omniflix.tv'] },
  { key: 'rumble', label: 'Rumble', icon: SiRumble, domains: ['rumble.com'] },
  { key: 'github', label: 'GitHub', icon: FaGithub, domains: ['github.com'] },
  { key: 'twitch', label: 'Twitch', icon: FaTwitch, domains: ['twitch.tv'] },
  { key: 'steam', label: 'Steam', icon: SlSocialSteam, domains: ['steamcommunity.com'] },
  { key: 'tumblr', label: 'Tumblr', icon: FaTumblr, domains: ['tumblr.com'] },
  { key: 'snapchat', label: 'Snapchat', icon: FaSnapchatGhost, domains: ['snapchat.com'] },
  { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, domains: ['linkedin.com'] },
  { key: 'facebook', label: 'Facebook', icon: FaFacebookF, domains: ['facebook.com'] },
];

/**
 * ProfileComponent displays and allows editing of user profile information.
 * It includes fields for name, email, bio, age, gender, orientation, pronouns, and social links.
 *
 * @param {ProfileComponentProps} props - The component props.
 */
const ProfileComponent: React.FC<ProfileComponentProps> = ({
  user,
  isEditing,
  name,
  setName,
  email,
  setEmail,
  bio,
  setBio,
  socialLinks,
  setSocialLinks,
  onValidationChange,
  onEdit,
  onCancel,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  age,
  setAge,
  gender,
  setGender,
  orientation,
  setOrientation,
  pronouns,
  setPronouns,
}) => {
  // State to track URL validation errors for social links
  const [urlErrors, setUrlErrors] = useState<UrlErrors>({});
  // State to toggle the visibility of the change password form
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  // State to manage the selection of social platforms for editing
  const [selectedSocials, setSelectedSocials] = useState<SelectedSocials>({});
  // State to control the visibility of all social icons
  const [showAllIcons, setShowAllIcons] = useState<boolean>(false);
  // State to limit the number of displayed social icons based on screen size
  const [iconLimit, setIconLimit] = useState<number>(7);

  // Effect to validate the form whenever relevant fields change
  useEffect(() => {
    validateForm();
  }, [name, email, bio, socialLinks, age, gender, orientation, pronouns, currentPassword, newPassword, confirmNewPassword]);

  // Effect to adjust the icon limit based on the window size
  useEffect(() => {
    const handleResize = () => {
      setIconLimit(window.innerWidth >= 768 ? 6 : 7);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to toggle the selection of a social platform
  const toggleSocial = (key: string) => {
    setSelectedSocials((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Function to validate a given URL against allowed domains
  const validateUrl = (url: string, domains: string[] | null): boolean => {
    const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
    if (!url || !urlPattern.test(url)) return false;
    if (!domains) return true;
    const urlDomain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.toLowerCase();
    return domains.some((domain) => urlDomain === domain || urlDomain.endsWith(`.${domain}`));
  };

  // Function to validate the entire form and set error messages
  const validateForm = () => {
    const errors: UrlErrors = {};
    if (!name) errors.name = 'Name is required';
    if (user.provider === 'local') {
      if (!email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Invalid email format';
      }
    }
    Object.keys(socialLinks).forEach((key) => {
      const url = socialLinks[key];
      if (url) {
        const platform = socialPlatforms.find((p) => p.key === key);
        if (platform && !validateUrl(url, platform.domains)) {
          errors[key] = `Please enter a valid ${platform.label} URL`;
        }
      }
    });
    if (user.provider === 'local' && showChangePassword) {
      if (newPassword && newPassword.length < 8) {
        errors.newPassword = 'New password must be at least 8 characters';
      }
      if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
        errors.confirmNewPassword = 'Passwords do not match';
      }
      if ((newPassword || confirmNewPassword) && !currentPassword) {
        errors.currentPassword = 'Current password is required to update password';
      }
    }
    setUrlErrors(errors);
    onValidationChange(Object.keys(errors).length === 0);
  };

  return (
    <div className="text-white space-y-2">
      {/* Profile header displaying user avatar and stats */}
      <ProfileHeader
        avatar={user.avatar}
        username={name}
        level={user.level || 1}
        xp={user.xp || 0}
        nextLevelXP={user.nextLevelXP || 100}
        onAvatarChange={() => {}} // Placeholder since not provided
        isEditing={isEditing}
      />
      {isEditing ? (
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="text-gray-300" htmlFor="name">Name:</label>
            <input
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Username"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              required
            />
            {urlErrors.name && <p className="text-red-500 text-sm">{urlErrors.name}</p>}
          </div>
          {/* Email Field */}
          <div>
            <label className="text-gray-300" htmlFor="email">Email:</label>
            {user.provider === 'local' ? (
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                required
              />
            ) : (
              <div>
                <p className="text-white">{email}</p>
                <p className="text-sm text-gray-400">
                  Your email is managed by {user.provider}.
                </p>
              </div>
            )}
            {user.provider === 'local' && urlErrors.email && (
              <p className="text-red-500 text-sm">{urlErrors.email}</p>
            )}
          </div>
          {/* Bio Field */}
          <div className="relative">
            <textarea
              id="bio-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              rows={4}
              maxLength={5000}
            />
            <div className="absolute right-2 bottom-2 text-gray-400">
              {5000 - bio.length}
            </div>
          </div>
          {/* Additional Details Fields */}
          <div>
            {/* Age Field */}
            <div>
              <label className="text-gray-300" htmlFor="age">Age:</label>
              <input
                id="age"
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            {/* Gender Field */}
            <div>
              <label className="text-gray-300" htmlFor="gender">Gender:</label>
              <input
                id="gender"
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder="Gender"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            {/* Orientation Field */}
            <div>
              <label className="text-gray-300" htmlFor="orientation">Orientation:</label>
              <input
                id="orientation"
                type="text"
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                placeholder="Orientation"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            {/* Pronouns Field */}
            <div>
              <label className="text-gray-300" htmlFor="pronouns">Pronouns:</label>
              <input
                id="pronouns"
                type="text"
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                placeholder="Pronouns"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
          </div>
          {/* Social Links */}
          <div>
            <div className="flex flex-wrap gap-4 mb-4">
              {socialPlatforms.slice(0, showAllIcons ? socialPlatforms.length : iconLimit).map(({ key, icon, label, isImage }) => {
                const IconComponent = !isImage ? icon : null;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSocial(key)}
                    className={`text-2xl p-2 rounded-full transition-colors ${
                      selectedSocials[key] ? 'text-gray-500 bg-gray-700' : 'text-white hover:bg-gray-600'
                    }`}
                    title={label}
                  >
                    {isImage ? (
                      <img src={icon as string} alt={label} className="w-6 h-6 md:w-8 md:h-8" />
                    ) : (
                      IconComponent && <IconComponent className="w-6 h-6 md:w-8 md:h-8" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-4">
              {socialPlatforms.map(({ key, label }) => (
                selectedSocials[key] && (
                  <div key={key} className="w-full">
                    <input
                      type="text"
                      value={socialLinks[key] || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, [key]: e.target.value })}
                      placeholder={`${label} URL`}
                      className={`w-full p-2 bg-gray-800 border ${
                        urlErrors[key] ? 'border-red-500' : 'border-gray-700'
                      } rounded text-white`}
                    />
                    {urlErrors[key] && <p className="text-red-500 text-sm">{urlErrors[key]}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
          {/* Change Password Toggle and Fields */}
          {user.provider === 'local' && (
            <div className="flex justify-between items-center">
              <p
                className="text-sm text-blue-600 cursor-pointer"
                onClick={() => setShowChangePassword(!showChangePassword)}
              >
                {showChangePassword ? 'Hide Change Password' : 'Change Password'}
              </p>
              <p
                className="text-sm text-blue-600 cursor-pointer"
                onClick={() => setShowAllIcons(!showAllIcons)}
              >
                {showAllIcons ? 'Collapse' : 'Expand'}
              </p>
            </div>
          )}
          {showChangePassword && user.provider === 'local' && (
            <div>
              <ChangePasswordForm
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmNewPassword={confirmNewPassword}
                setConfirmNewPassword={setConfirmNewPassword}
              />
              {urlErrors.currentPassword && <p className="text-red-500 mt-2">{urlErrors.currentPassword}</p>}
              {urlErrors.newPassword && <p className="text-red-500 mt-2">{urlErrors.newPassword}</p>}
              {urlErrors.confirmNewPassword && <p className="text-red-500 mt-2">{urlErrors.confirmNewPassword}</p>}
            </div>
          )}
          {/* Cancel Button */}
          <button
            type="button"
            onClick={onCancel}
            className="w-full p-2 bg-gray-600 rounded text-white hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <p><strong>Name:</strong> {name}</p>
          <p>
            <strong>Email:</strong> {email}{' '}
            {user.provider !== 'local' && <span className="text-gray-400">({user.provider})</span>}
          </p>
          <AdditionalDetails details={{ age: Number(age), gender, orientation, pronouns }} />
          <BioComponent bio={bio} />
          {socialLinks && <SocialBar socialLinks={socialLinks} />}
          <button
            id="edit-profile-button"
            onClick={onEdit}
            className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileComponent;