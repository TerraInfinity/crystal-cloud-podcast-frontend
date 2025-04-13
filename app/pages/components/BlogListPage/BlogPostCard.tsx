import React, { useState, useEffect } from 'react';
import { FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import type { BlogPost } from '../../../types/blog';
import { logGroupedMessage } from '../../../utils/consoleGroupLogger'; // Adjust path if needed
/**
 * BlogPostCard component displays a blog post with its details including title, author, date, and media.
 * Assumes that the post is visible to the user based on backend filtering of posts according to user preferences.
 *
 * @param {Object} props - The props for the component.
 * @param {BlogPost} props.blog - The blog post object containing all necessary details.
 */
const BlogPostCard = ({ blog }: { blog: BlogPost }) => {
  // Destructure fields from the blog object
  const {
    id,
    title,
    authorName,
    authorLogo,
    createdAt,
    blogImage,
    isAgeRestricted,
    videoUrl,
    audioUrl,
    blogSummary,
    pathId,
    blogComments,
  } = blog;

  // Placeholder logo for the author
  const placeholderLogo = '/assets/images/logo.png';

  // Default image based on age restriction
  const defaultImage = isAgeRestricted ? '/assets/images/NSFW.jpg' : '/assets/images/consciousness.jpg';

  // Normalize authorLogo to ensure it's an absolute URL
  const normalizedAuthorLogo = authorLogo && !authorLogo.match(/^https?:\/\//) ? `https://${authorLogo}` : authorLogo;

  // State for logo URL
  const [logoUrl, setLogoUrl] = useState<string>(placeholderLogo);

  // Function to check if an image URL exists using Image object
  const checkImageExists = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);  // Image loaded successfully
      img.onerror = () => resolve(false); // Image failed to load (e.g., 404)
      img.src = url;
    });
  };

  // Effect to verify and set logo URL
  useEffect(() => {
    if (normalizedAuthorLogo) {
      checkImageExists(normalizedAuthorLogo).then((exists) => {
        if (exists) {
          setLogoUrl(normalizedAuthorLogo);
        } else {
          logGroupedMessage(
            'Author Logo Issues',
            `Author logo at "${normalizedAuthorLogo}" could not be found for blog post "${title}" (ID: ${id}). Defaulting to placeholder logo: ${placeholderLogo}`
          );
          setLogoUrl(placeholderLogo);
        }
      });
    } else {
      logGroupedMessage(
        'Author Logo Issues',
        `No valid author logo provided for blog post "${title}" (ID: ${id}). Defaulting to placeholder logo: ${placeholderLogo}`
      );
      setLogoUrl(placeholderLogo);
    }
  }, [normalizedAuthorLogo, placeholderLogo, id, title]);

  // Determine media type and color
  const mediaType = videoUrl && audioUrl ? 'Audio/Video' : videoUrl ? 'Video' : audioUrl ? 'Audio' : null;
  const mediaColor = videoUrl && audioUrl ? 'bg-purple-600' : videoUrl ? 'bg-teal-500' : audioUrl ? 'bg-orange-500' : '';

  // State for image source and fetch type
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [fetchType, setFetchType] = useState<'youtube' | 'other' | null>(null);

  // Effect to set initial image source
  useEffect(() => {
    if (videoUrl) {
      const youtubeId = getYouTubeID(videoUrl);
      if (youtubeId) {
        setImgSrc(`https://img.youtube.com/vi/${youtubeId}/0.jpg`);
        setFetchType('youtube');
      } else {
        setFetchType('other');
      }
    } else if (blogImage && blogImage !== '/assets/images/logo.png') {
      setImgSrc(blogImage);
    } else {
      setImgSrc(defaultImage);
    }
  }, [videoUrl, blogImage, defaultImage]);

    // Effect to fetch thumbnails for non-YouTube videos
    useEffect(() => {
      if (fetchType === 'other' && videoUrl) {
        const logPrefix = `[Thumbnail Fetch - ${new Date().toISOString()}] [Blog Title: ${title}]`;
        //console.log(`${logPrefix} Starting thumbnail fetch for videoUrl:`, videoUrl);
        
        // Determine the API URL based on the environment variable
        const apiUrl = import.meta.env.VITE_VERCEL_ENV === 'true' 
          ? import.meta.env.VITE_FRONTEND_URL 
          : import.meta.env.VITE_LOCALHOST_URL;
        const fullUrl = `${apiUrl}/api/proxy-thumbnail?url=${encodeURIComponent(videoUrl)}`;
        //console.log(`${logPrefix} Constructed API URL:`, fullUrl);
  
        axios
          .get(fullUrl)
          .then((response) => {
            const thumbnail = response.data.thumbnail;
            // Group for received thumbnail messages
            //logGroupedMessage('Thumbnail Received', `${logPrefix} Received thumbnail: ${thumbnail}`);
            const finalImgSrc = thumbnail || blogImage || defaultImage;
            // Log with white color
            //logGroupedMessage('Image Source Update', `${logPrefix} Setting imgSrc to: ${finalImgSrc}`, 'white', false);
            setImgSrc(finalImgSrc);
          })
          .catch((error) => {
            const errorMsg = error.response?.data?.error || error.message;
           // console.error(`${logPrefix} Failed to fetch thumbnail:`, { videoUrl, error: errorMsg, status: error.response?.status });
            const fallbackImgSrc = blogImage || defaultImage;
            // Group for fallback image source messages
            logGroupedMessage('Fallback Image Source', `${logPrefix} Falling back to imgSrc: ${fallbackImgSrc}`, 'yellow', true);
            //console.log(`${logPrefix} Falling back to imgSrc:`, fallbackImgSrc);
            setImgSrc(fallbackImgSrc);
          });
      }
    }, [fetchType, videoUrl, blogImage, defaultImage]);

  // Handle image loading errors
  const handleImageError = () => {
    if (blogImage && imgSrc !== blogImage) {
      setImgSrc(blogImage);
    } else {
      setImgSrc(defaultImage);
    }
  };

  return (
    <Link to={`/blog/${id}`} className="overflow-hidden rounded-lg bg-slate-800 shadow-md" id={`blog-post-link-${id}`}>
      {/* Image Container */}
      <div className="relative h-[200px] w-full" id={`blog-media-container-${id}`}>
        {imgSrc && (
          <img
            src={imgSrc}
            alt="Blog post thumbnail"
            className="absolute inset-0 w-full h-full object-fill"
            onError={handleImageError}
            id={`blog-post-image-${id}`}
          />
        )}
        {isAgeRestricted && (
          <div className="absolute top-4 right-4 text-red-500" id={`age-restricted-label-${id}`}>
            18+
          </div>
        )}
      </div>
      {/* Content Container */}
      <div className="p-4" id={`blog-content-container-${id}`}>
        <h3 className="text-white text-xl font-semibold mb-2 truncate" id={`blog-title-${id}`}>
          {title}
        </h3>
        <div className="flex items-center mb-2" id={`author-info-container-${id}`}>
          <img
            src={logoUrl}
            alt="Author logo"
            className="w-10 h-10 rounded-full object-cover mr-3"
            id={`author-logo-${id}`}
          />
          <div>
            <div className="text-white truncate" id={`author-name-${id}`}>
              {authorName || 'Unknown Author'}
            </div>
            <div className="text-gray-400 text-sm" id={`blog-date-${id}`}>
              {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        {blogSummary && (
          <p className="text-gray-300 mb-2 line-clamp-2" id={`blog-summary-${id}`}>
            {blogSummary}
          </p>
        )}
        {pathId && (
          <div className="text-gray-300 text-sm mb-2" id={`path-id-${id}`}>
            {pathId}
          </div>
        )}
        <div className="flex justify-between items-center text-sm" id={`blog-footer-${id}`}>
          {mediaType && (
            <div className={`px-2 py-1 ${mediaColor} rounded text-white flex-shrink-0`} id={`media-type-${id}`}>
              {mediaType}
            </div>
          )}
          {blogComments && blogComments.length > 0 && (
            <div className="text-white flex items-center" id={`comments-count-${id}`}>
              <FaComments className="mr-1" /> {blogComments.length}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

// Helper function to extract YouTube video ID
const getYouTubeID = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default BlogPostCard;