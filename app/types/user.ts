/**
 * @fileoverview TypeScript type definitions for the User model in the blog application.
 * This file defines a single User interface with all related data inline for type safety in the frontend.
 */

/** Type defining visibility options for user settings */
export type Visibility = 'public' | 'friends_only' | 'private';

export interface User {
  /** Unique identifier for the user (UUID) */
  id: string;

  /** User's display name (max 50 characters) */
  name: string;

  /** User's email address (unique) */
  email: string;

  /** User's password (hashed, nullable for non-local providers) */
  password?: string;

  /** Authentication provider (e.g., 'local', 'google') */
  provider: string;

  /** Provider-specific identifier (nullable) */
  providerId?: string;

  /** User's role in the application */
  role: 'user' | 'editor' | 'creator' | 'moderator' | 'admin';

  /** User's level (nullable) */
  level?: number;

  /** User's experience points (nullable) */
  xp?: number;

  /** User's age (nullable) */
  age?: string;

  /** User's gender (nullable) */
  gender?: string;

  /** User's orientation (nullable) */
  orientation?: string;

  /** User's pronouns (nullable) */
  pronouns?: string;

  /** User's biography (nullable) */
  bio?: string;

  /** User's social media links (stored as JSON, nullable) */
  socialLinks?: Record<string, string>;

  /** Timestamps for when the user was created and last updated */
  createdAt: string;
  updatedAt: string;

  /** User's privacy settings */
  privacySettings?: {
    activityVisibility: Visibility;
    profileVisibility: Visibility;
    updatedAt?: string;
    [key: string]: any;
  };

  /** User's favorites */
  favorites?: Array<{
    id: string;
    userId: string;
    favoriteItemId: string;
    itemType: string;
    createdAt: string;
    updatedAt: string;
  }>;

  /** User's playlists */
  playlists?: Array<{
    id: string;
    userId: string;
    playlistName: string;
    items?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
  }>;

  /** User's preferences */
  preferences?: {
    id: string;
    userId: string;
    visibleTagsSFW: string[];
    visibleTagsNSFW: string[];
    visibleCategoriesSFW: {
      main: string[];
      path: string[];
      sub: string[];
    };
    visibleCategoriesNSFW: string[];
    allowNSFW: boolean;
    theme: 'day' | 'night';
    createdAt: string;
    updatedAt: string;
  };

  /** User's profile */
  profile?: {
    userId: string;
    experiencePoints: number;
    level?: number;
    achievements?: Record<string, any>;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
  };

  /** User's relations */
  relations?: Array<{
    userId: string;
    relatedUserId: string;
    relationType: 'follower' | 'friend';
    createdAt: string;
    updatedAt: string;
  }>;

  /** User's settings */
  settings?: {
    userId: string;
    theme: 'light' | 'dark';
    notificationPreferences?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
  };

  /** User's activities */
  activities?: Array<{
    id: string;
    userId: string;
    activityType: string;
    timestamp: string;
    details?: Record<string, any>;
  }>;
}