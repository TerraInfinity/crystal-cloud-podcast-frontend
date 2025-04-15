// app/hooks/useValidImageUrl.ts
import { useState, useEffect, useCallback } from 'react';
import { checkImageExists } from '../utils/imageUtils';

export const useValidImageUrl = (url: string | undefined, fallback: string): string => {
  const [validUrl, setValidUrl] = useState(fallback);

  // Normalize the URL (add https:// if missing)
  const normalizedUrl = url && !url.match(/^https?:\/\//) ? `https://${url}` : url;

  // Memoized function to handle image existence check
  const validateImage = useCallback(async () => {
    if (normalizedUrl) {
      try {
        const exists = await checkImageExists(normalizedUrl);
        setValidUrl(exists ? normalizedUrl : fallback);
      } catch (error) {
        console.error(`Image validation failed for URL: ${normalizedUrl}`, error);
        setValidUrl(fallback);
      }
    } else {
      setValidUrl(fallback);
    }
  }, [normalizedUrl, fallback]);

  useEffect(() => {
    validateImage();
  }, [validateImage]);

  return validUrl;
};