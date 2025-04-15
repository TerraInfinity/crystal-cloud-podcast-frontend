// app/utils/imageUtils.ts
import axios from 'axios';
import type { BlogPost } from '../types/blog'; // Adjust the path if necessary
import { logGroupedMessage } from './consoleGroupLogger'; // Adjust path if necessary

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
const getDefaultImage = (isAgeRestricted: boolean): string =>
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
 * @throws {Error} If the fetch fails or the URL is invalid.
 */
export const fetchThumbnail = async (blog: BlogPost): Promise<string> => {
  const { videoUrl, blogImage, isAgeRestricted = false, embedUrl, postUrl, id } = blog;

  // Prioritize videoUrl, then embedUrl, then postUrl for video content
  const urlToCheck = normalizeUrl(videoUrl) || normalizeUrl(embedUrl) || normalizeUrl(postUrl);

  if (urlToCheck) {
    const youtubeId = getYouTubeID(urlToCheck);
    if (youtubeId) {
      // Immediate return for YouTube thumbnails
      return `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
    } else {
      // API call for non-YouTube videos
      const apiUrl = `${
        import.meta.env.VITE_VERCEL_ENV === 'true'
          ? import.meta.env.VITE_FRONTEND_URL
          : import.meta.env.VITE_LOCALHOST_URL
      }/api/proxy-thumbnail?url=${encodeURIComponent(urlToCheck)}`;
      try {
        const response = await axios.get<{ thumbnail: string }>(apiUrl);
        return response.data.thumbnail || blogImage || getDefaultImage(isAgeRestricted);
      } catch (error) {
        const errorMessage = (error as Error).message;
        logGroupedMessage(
          `Thumbnail Fetch Error for blog ID: ${id}`,
          errorMessage,
          'error',
          true
        );
        return blogImage || getDefaultImage(isAgeRestricted);
      }
    }
  } else if (blogImage) {
    return blogImage;
  } else {
    return getDefaultImage(isAgeRestricted);
  }
};