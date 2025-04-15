// app/utils/imageUtils.ts
import axios from 'axios';
import type { BlogPost } from '../types/blog'; // Adjust the path if necessary
import { logGroupedMessage } from './consoleGroupLogger'; // Adjust path if necessary

// In-memory cache to store thumbnail URLs
const thumbnailCache: Record<string, string> = {};

/**
 * Extracts the YouTube video ID from a given URL.
 * @param url - The URL of the YouTube video.
 * @returns The video ID if found, otherwise null.
 */
const getYouTubeID = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * Returns the default image URL based on age restriction.
 * @param isAgeRestricted - A boolean indicating if the content is age-restricted.
 * @returns The URL of the default image.
 */
export const getDefaultImage = (isAgeRestricted: boolean): string =>
  isAgeRestricted ? '/assets/images/NSFW.jpg' : '/assets/images/consciousness.jpg';

/**
 * Checks if an image exists at the given URL within a specified timeout.
 * @param url - The URL of the image to check.
 * @param timeoutMs - The maximum time to wait for the image to load (default is 5000 ms).
 * @returns A promise that resolves to true if the image exists, otherwise false.
 */
export const checkImageExists = (url: string, timeoutMs = 5000): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => resolve(false), timeoutMs);
    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
    img.src = url;
  });
};

/**
 * Normalizes a URL by ensuring it starts with 'http'.
 * @param url - The URL to normalize (optional).
 * @returns The normalized URL or null if the input is falsy.
 */
export const normalizeUrl = (url?: string): string | null => {
  if (!url) return null;
  return url.startsWith('http') ? url : `https://${url}`;
};

/**
 * Fetches a thumbnail URL for a given blog post.
 * @param blog - The blog post object containing video and image URLs.
 * @returns A promise resolving to the thumbnail URL or a default image if unavailable.
 */
export const fetchThumbnail = async (blog: BlogPost): Promise<string> => {
  const { videoUrl, blogImage, isAgeRestricted = false, embedUrl, postUrl, id, updatedAt } = blog;

  // Create a cache key that includes updatedAt to invalidate cache on changes
  const cacheKey = updatedAt ? `${id}:${updatedAt}` : id;

  // Check if thumbnail is already cached
  if (thumbnailCache[cacheKey]) {
    return thumbnailCache[cacheKey];
  }

  const nsfwDisclaimerAccepted = sessionStorage.getItem("NSFW-Disclaimer-Accepted") === 'true';

  // If age-restricted and disclaimer not accepted, return NSFW image
  if (isAgeRestricted && !nsfwDisclaimerAccepted) {
    const nsfwImg = '/assets/images/NSFW.jpg';
    thumbnailCache[cacheKey] = nsfwImg;
    return nsfwImg;
  }

  const urlToCheck = normalizeUrl(videoUrl) || normalizeUrl(embedUrl) || normalizeUrl(postUrl);

  if (urlToCheck) {
    const youtubeId = getYouTubeID(urlToCheck);
    if (youtubeId) {
      const thumbnailUrl = updatedAt
        ? `https://img.youtube.com/vi/${youtubeId}/0.jpg?v=${encodeURIComponent(updatedAt)}`
        : `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
      thumbnailCache[cacheKey] = thumbnailUrl;
      return thumbnailUrl;
    } else {
      const apiUrl = `${
        import.meta.env.VITE_VERCEL_ENV === 'true'
          ? import.meta.env.VITE_FRONTEND_URL
          : import.meta.env.VITE_LOCALHOST_URL
      }/api/proxy-thumbnail?url=${encodeURIComponent(urlToCheck)}${updatedAt ? `&v=${encodeURIComponent(updatedAt)}` : ''}`;
      try {
        const response = await axios.get<{ thumbnail: string }>(apiUrl);
        const thumbnailUrl = response.data.thumbnail || blogImage || getDefaultImage(isAgeRestricted);
        thumbnailCache[cacheKey] = thumbnailUrl;
        return thumbnailUrl;
      } catch (error) {
        const errorMessage = (error as Error).message;
        logGroupedMessage(`Thumbnail Fetch Error for blog ID: ${id}`, errorMessage, 'error', true);
        const fallback = blogImage || getDefaultImage(isAgeRestricted);
        thumbnailCache[cacheKey] = fallback;
        return fallback;
      }
    }
  } else if (blogImage) {
    const thumbnailUrl = updatedAt ? `${blogImage}?v=${encodeURIComponent(updatedAt)}` : blogImage;
    thumbnailCache[cacheKey] = thumbnailUrl;
    return thumbnailUrl;
  } else {
    const defaultImg = getDefaultImage(isAgeRestricted);
    thumbnailCache[cacheKey] = defaultImg;
    return defaultImg;
  }
};

/**
 * Fetches thumbnails for all blog posts and caches them.
 * @param blogs - Array of blog posts.
 * @returns A promise resolving to a map of blog IDs to thumbnail URLs.
 */
export const fetchAllThumbnails = async (blogs: BlogPost[]): Promise<Record<string, string>> => {
  const thumbnails: Record<string, string> = {};
  const fetchPromises = blogs.map(async (blog) => {
    const thumbnail = await fetchThumbnail(blog);
    thumbnails[blog.id] = thumbnail;
  });

  await Promise.all(fetchPromises);
  return thumbnails;
};

/**
 * Gets cached thumbnails without refetching.
 * @returns The current thumbnail cache.
 */
export const getCachedThumbnails = (): Record<string, string> => {
  return { ...thumbnailCache };
};