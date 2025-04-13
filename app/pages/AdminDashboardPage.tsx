import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import ProfileManager from './components/AdminDashboardPage/Tabs/UserProfile/ProfileManager';
import StatsCard from './components/AdminDashboardPage/Tabs/StatsCard';
import AchievementsGrid from './components/AdminDashboardPage/Tabs/AchievementsGrid';
import ActivityFeed from './components/AdminDashboardPage/Tabs/ActivityFeed';
import PrivacySettings from './components/AdminDashboardPage/Tabs/PrivacySettings';
import LogoutButton from './components/AdminDashboardPage/Tabs/UserProfile/LogoutButton';
import DeleteAccountModal from './components/AdminDashboardPage/Tabs/UserProfile/DeleteAccountModal';
import SiteSettings from './components/AdminDashboardPage/Tabs/SiteSettings/SiteSettings';
import type { User, Visibility } from '../types/user';

interface AuthContextType {
  token: string | null;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

// Type matching the PrivacySettings component's expected props
type ComponentPrivacySettings = {
  activity: Visibility;
  profile: Visibility;
};

/**
 * The AdminDashboardPage component manages the layout and functionality of the admin dashboard.
 * It handles user authentication, fetches profile data from the backend, and facilitates tab navigation.
 * @returns {JSX.Element} The rendered admin dashboard page component.
 */
export function AdminDashboardPage() {
  const { token, logout, isAuthenticated, loading } = useContext(AuthContext) as AuthContextType;
  const [user, setUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<'admin' | 'stats' | 'activity' | 'privacy' | 'SiteSettings'>('admin');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [updateMessage, setUpdateMessage] = useState<string>('');

  // Default settings if privacySettings is undefined
  const defaultComponentSettings: ComponentPrivacySettings = {
    activity: 'public',
    profile: 'friends_only',
  };

  // Map User privacySettings to ComponentPrivacySettings
  const mapToComponentSettings = (privacySettings?: User['privacySettings']): ComponentPrivacySettings => {
    if (!privacySettings) {
      return defaultComponentSettings;
    }
    return {
      activity: privacySettings.activityVisibility,
      profile: privacySettings.profileVisibility,
    };
  };

  // Map ComponentPrivacySettings back to User privacySettings
  const mapToUserSettings = (componentSettings: ComponentPrivacySettings, existingSettings: User['privacySettings'] | undefined): User['privacySettings'] => {
    if (!existingSettings) {
      throw new Error('Existing settings are undefined');
    }
    return {
      ...existingSettings,
      activityVisibility: componentSettings.activity,
      profileVisibility: componentSettings.profile,
      updatedAt: new Date().toISOString(),
      userId: existingSettings.userId || '',
    };
  };

  /**
   * Fetches the user profile data from the backend API.
   */
  useEffect(() => {
    const fetchProfile = async () => {
      const mode = import.meta.env.VITE_NODE_ENV || 'development';
      let backendProfileAPIUrl: string;

      if (mode === 'local-development') {
        const apiPort = process.env.REACT_APP_BACKEND_PORT;
        backendProfileAPIUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/users/profile`;
      } else {
        backendProfileAPIUrl = '/api/users/profile';
      }

      try {
        const response = await fetch(backendProfileAPIUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data: User = await response.json();
          console.log('Fetched user profile:', data);
          setUser(data);
          const storedMessage = sessionStorage.getItem('updateMessage');
          if (storedMessage) {
            setUpdateMessage(storedMessage);
            sessionStorage.removeItem('updateMessage');
          }
        } else if (response.status === 401) {
          console.log('Unauthorized, logging out');
          logout();
          navigate('/login');
        } else {
          console.error('Failed to fetch profile:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    if (token && isAuthenticated) {
      fetchProfile();
    }
  }, [token, isAuthenticated, logout, navigate]);

  /**
   * Handles profile updates by sending a PUT request to the backend API.
   * @param formData - The updated user data.
   */
  const handleUpdate = async (formData: Record<string, unknown>) => {
    const mode = import.meta.env.VITE_NODE_ENV || 'development';
    let backendProfileAPIUrl: string;

    if (mode === 'local-development') {
      const apiPort = process.env.REACT_APP_BACKEND_PORT;
      backendProfileAPIUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/users/profile`;
    } else {
      backendProfileAPIUrl = '/api/users/profile';
    }

    try {
      const response = await fetch(backendProfileAPIUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser: User = await response.json();
        setUser(updatedUser);
        setUpdateMessage('Profile updated successfully!');
        // Clear message after 5 seconds
        setTimeout(() => setUpdateMessage(''), 5000);
      } else {
        console.error('Failed to update profile:', response.status, response.statusText);
        setUpdateMessage('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateMessage('An error occurred. Please try again later.');
    }
  };

  /**
   * Handles account deletion by logging out the user and redirecting.
   */
  const handleDeleteAccount = () => {
    console.log('Account deleted');
    logout();
    navigate('/home');
  };

  if (loading) return <div className="text-white">Loading authentication...</div>;
  if (!isAuthenticated) return <div className="text-red-500">Please log in to access your profile.</div>;
  if (!user) return <div className="text-white">Loading user profile...</div>;

  return (
    <Layout title="User Profile">
      {/* Display update message globally */}
      {updateMessage && (
        <div className={`mb-4 ${updateMessage.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {updateMessage}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          id="admin-tab-button"
          onClick={() => setCurrentTab('admin')}
          className={`p-2 rounded ${
            currentTab === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
          }`}
        >
          Admin
        </button>
        <button
          id="stats-tab-button"
          onClick={() => setCurrentTab('stats')}
          className={`p-2 rounded ${
            currentTab === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
          }`}
        >
          Stats
        </button>
        <button
          id="activity-tab-button"
          onClick={() => setCurrentTab('activity')}
          className={`p-2 rounded ${
            currentTab === 'activity' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
          }`}
        >
          Activity Feed
        </button>
        <button
          id="privacy-tab-button"
          onClick={() => setCurrentTab('privacy')}
          className={`p-2 rounded ${
            currentTab === 'privacy' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
          }`}
        >
          Privacy
        </button>
        <button
          id="site-settings-tab-button"
          onClick={() => setCurrentTab('SiteSettings')}
          className={`p-2 rounded ${
            currentTab === 'SiteSettings' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
          }`}
        >
          Site Settings
        </button>
      </div>

      {/* Tab Content */}
      {currentTab === 'admin' && (
        <>
          <ProfileManager user={user} onUpdate={handleUpdate} />
          <LogoutButton onLogout={() => { logout(); navigate('/login'); }} />
          <div className="flex justify-center my-4">
            <button id="delete-account-button" onClick={() => setIsModalOpen(true)} className="bg-red-600 p-2 rounded">
              Delete Account
            </button>
          </div>
          <DeleteAccountModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onDelete={handleDeleteAccount}
            userId={user.id}
            token={token}
          />
        </>
      )}

      {currentTab === 'stats' && (
        <div className="space-y-4">
          {user.profile ? (
            <StatsCard stats={{ ...user.profile, level: user.profile.level ?? 0 }} />
          ) : (
            <div className="text-white">No stats available.</div>
          )}
          {user.profile && Array.isArray(user.profile.achievements) && user.profile.achievements.length > 0 ? (
            <AchievementsGrid achievements={user.profile.achievements} />
          ) : (
            <div className="text-white">No achievements earned yet.</div>
          )}
        </div>
      )}
      {currentTab === 'activity' && (
        <ActivityFeed userId={user.id} />
      )}
      {currentTab === 'privacy' && (
        <PrivacySettings
          privacySettings={mapToComponentSettings(user?.privacySettings)}
          onUpdatePrivacy={async (settings) => {
            if (!user || !user.privacySettings) {
              console.error('User or privacy settings not available');
              return;
            }
            const updatedSettings = mapToUserSettings(settings, user.privacySettings);
            await handleUpdate({ privacySettings: updatedSettings });
          }}
        />
      )}
      {currentTab === 'SiteSettings' && (
        <SiteSettings
          onUpdateSettings={(updatedSettings: unknown) => {
            console.log('Updating settings:', updatedSettings);
            handleUpdate({ settings: updatedSettings });
          }}
        />
      )}
    </Layout>
  );
}