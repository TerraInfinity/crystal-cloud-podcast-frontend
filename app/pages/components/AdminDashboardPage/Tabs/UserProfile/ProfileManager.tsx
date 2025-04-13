import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import ProfileComponent from './ProfileComponent';

// Define the User interface with optional fields
interface User {
  name?: string;
  email?: string;
  bio?: string;
  socialLinks?: Record<string, string>;
  age?: string;
  gender?: string;
  orientation?: string;
  pronouns?: string;
  provider?: string;
  avatar?: string;
}

// Define the ProfileManagerProps interface
interface ProfileManagerProps {
  user: User;
  onUpdate: (updatedUser: Record<string, unknown>) => void;
}

/**
 * ProfileManager component is responsible for managing user profile data.
 * It allows users to view, edit, and update their profile information.
 *
 * @param {ProfileManagerProps} props - Component properties
 */
function ProfileManager({ user, onUpdate }: ProfileManagerProps) {
  const { token } = useContext(AuthContext);
  const [initialData, setInitialData] = useState<User>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [name, setName] = useState<string>(user.name || '');
  const [email, setEmail] = useState<string>(user.email || '');
  const [bio, setBio] = useState<string>(user.bio || '');
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(user.socialLinks || {});
  const [age, setAge] = useState<string>(user.age || '');
  const [gender, setGender] = useState<string>(user.gender || '');
  const [orientation, setOrientation] = useState<string>(user.orientation || '');
  const [pronouns, setPronouns] = useState<string>(user.pronouns || '');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [updateError, setUpdateError] = useState<string>('');
  const [updateSuccess, setUpdateSuccess] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      const mode = import.meta.env.VITE_NODE_ENV || 'development';
      let apiUrl;

      if (mode === 'local-development') {
        const backendOrigin = process.env.REACT_APP_BACKEND_ORIGIN || 'http://localhost';
        const backendPort = process.env.REACT_APP_BACKEND_PORT || '5000';
        apiUrl = `${backendOrigin}:${backendPort}/api/users/profile`;
      } else {
        apiUrl = '/api/users/profile';
      }

      try {
        const response = await axios.get<User>(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setName(data.name || '');
        setEmail(data.email || '');
        setBio(data.bio || '');
        setSocialLinks(data.socialLinks || {});
        setAge(data.age || '');
        setGender(data.gender || '');
        setOrientation(data.orientation || '');
        setPronouns(data.pronouns || '');
        setInitialData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [token]);

  // Create a wrapper function that conforms to the expected type
  const handleSocialLinksChange = (links: Record<string, string | undefined>) => {
    setSocialLinks(links as Record<string, string>);
  };

  /**
   * Handles form submission for updating the user profile.
   * Collects form data and passes it to the onUpdate callback.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;

    const profileData: Record<string, unknown> = {
      name,
      bio,
      socialLinks,
      age,
      gender,
      orientation,
      pronouns,
    };

    if (user.provider && user.provider === 'local') {
      profileData.email = email;
      if (newPassword && currentPassword) {
        profileData.currentPassword = currentPassword;
        profileData.password = newPassword;
      }
    }

    await onUpdate(profileData);
  };

  return (
    <form id="profile-form" onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <ProfileComponent
        user={{...user, avatar: user.avatar || '', provider: user.provider || 'local'}}
        isEditing={isEditing}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        bio={bio}
        setBio={setBio}
        socialLinks={socialLinks}
        setSocialLinks={handleSocialLinksChange}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmNewPassword={confirmNewPassword}
        setConfirmNewPassword={setConfirmNewPassword}
        onValidationChange={setIsValid}
        onEdit={() => setIsEditing(true)}
        onCancel={() => {
          setName(initialData.name || '');
          setEmail(initialData.email || '');
          setBio(initialData.bio || '');
          setSocialLinks(initialData.socialLinks || {});
          setAge(initialData.age || '');
          setGender(initialData.gender || '');
          setOrientation(initialData.orientation || '');
          setPronouns(initialData.pronouns || '');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
          setIsEditing(false);
        }}
        age={age}
        setAge={setAge}
        gender={gender}
        setGender={setGender}
        orientation={orientation}
        setOrientation={setOrientation}
        pronouns={pronouns}
        setPronouns={setPronouns}
      />
      {isEditing && (
        <>
          {updateError && <p className="text-red-500">{updateError}</p>}
          {updateSuccess && <p className="text-green-500">{updateSuccess}</p>}
          <button
            id="update-profile-button"
            type="submit"
            disabled={!isValid}
            className={`w-full p-2 rounded text-white hover:bg-blue-700 ${
              isValid ? 'bg-blue-600' : 'bg-gray-600 opacity-50 cursor-not-allowed'
            }`}
          >
            Update Profile
          </button>
        </>
      )}
    </form>
  );
}

export default ProfileManager;