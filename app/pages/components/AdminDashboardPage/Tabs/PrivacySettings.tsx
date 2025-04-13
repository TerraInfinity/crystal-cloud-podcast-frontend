import React, { useState } from 'react';
import type { Visibility } from '../../../../types/user';

// Define interface for privacy settings
interface PrivacySettings {
  activity: Visibility;
  profile: Visibility;
}

// Define interface for component props
interface PrivacySettingsProps {
  privacySettings?: PrivacySettings;
  onUpdatePrivacy: (settings: PrivacySettings) => void | Promise<void>;
}

/**
 * PrivacySettings component
 *
 * This component allows users to manage their privacy settings for their profile.
 * Users can set visibility options for their activity and profile, determining who can see their information.
 *
 * @param {PrivacySettingsProps} props - The component props.
 * @param {PrivacySettings} [props.privacySettings] - The current privacy settings for the user.
 * @param {function} props.onUpdatePrivacy - Callback function to handle updates to the privacy settings.
 * @returns {JSX.Element} The rendered privacy settings component.
 */
const PrivacySettings: React.FC<PrivacySettingsProps> = ({ privacySettings, onUpdatePrivacy }) => {
  /**
   * The current state of the privacy settings.
   */
  const [settings, setSettings] = useState<PrivacySettings>(
    privacySettings || {
      activity: 'public',
      profile: 'friends_only',
    }
  );

  /**
   * Handles changes to the privacy settings.
   *
   * @param {'activity' | 'profile'} key - The key of the setting to update.
   * @param {'public' | 'friends_only' | 'private'} value - The new value of the setting.
   */
  const handleChange = (key: 'activity' | 'profile', value: Visibility) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Handles saving the updated privacy settings.
   */
  const handleSave = async () => {
    await onUpdatePrivacy(settings);
  };

  return (
    <div className="space-y-4" id="privacy-settings">
      {/* Activity Visibility Dropdown */}
      <div>
        <label className="block text-white mb-1" htmlFor="activity-visibility">
          Activity Visibility
        </label>
        <select
          id="activity-visibility"
          value={settings.activity}
          onChange={(e) => handleChange('activity', e.target.value as Visibility)}
          className="w-full bg-gray-700 text-white p-2 rounded"
        >
          <option value="public">Public</option>
          <option value="friends_only">Friends Only</option>
          <option value="private">Private</option>
        </select>
      </div>
      {/* Profile Visibility Dropdown */}
      <div>
        <label className="block text-white mb-1" htmlFor="profile-visibility">
          Profile Visibility
        </label>
        <select
          id="profile-visibility"
          value={settings.profile}
          onChange={(e) => handleChange('profile', e.target.value as Visibility)}
          className="w-full bg-gray-700 text-white p-2 rounded"
        >
          <option value="public">Public</option>
          <option value="friends_only">Friends Only</option>
          <option value="private">Private</option>
        </select>
      </div>
      {/* Save Changes Button */}
      <button
        id="save-privacy-settings"
        onClick={handleSave}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default PrivacySettings;