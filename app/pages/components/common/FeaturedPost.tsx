import React, { useEffect, useState } from 'react';
import { FaComments } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../../../types/blog'; // Use type-only import for BlogPost

// Utility for grouped logging (assume this exists in your project)
import { logGroupedMessage } from '../../../utils/consoleGroupLogger'; // Adjust path as needed

/**
 * Interface for FeaturedPost component props.
 */
interface FeaturedPostProps {
  id: string;
  blogs: BlogPost[];
}

/**
 * Determines the media type and color based on the blog's video and audio URLs.
 */
const getMediaTag = (blog: BlogPost): { type: string | null; color: string } => {
  const hasVideo = blog.videoUrl && blog.videoUrl.trim() !== '';
  const hasAudio = blog.audioUrl && blog.audioUrl.trim() !== '';
  if (hasVideo && hasAudio) return { type: 'Audio/Video', color: 'bg-purple-600' };
  if (hasVideo) return { type: 'Video', color: 'bg-teal-500' };
  if (hasAudio) return { type: 'Audio', color: 'bg-orange-500' };
  return { type: null, color: '' };
};

/**
 * Maps the pathId to a TailwindCSS background color class.
 */
const getPathColor = (pathId: string): string => {
  if (!pathId) return 'bg-gray-500';
  const lowerCasePathId = pathId.toLowerCase();
  switch (lowerCasePathId) {
    case 'light':
      return 'bg-yellow-500';
    case 'dark':
      return 'bg-purple-600';
    case 'chaos':
      return 'bg-black';
    default:
      return 'bg-gray-500';
  }
};

/**
 * Extracts the YouTube video ID from a given URL.
 */
const getYouTubeID = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * Checks if an image URL exists using the Image object.
 */
const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * FeaturedPost Component
 */
const FeaturedPost: React.FC<FeaturedPostProps> = ({ blogs = [] }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [logoUrls, setLogoUrls] = useState<Record<string, string>>({});

  // Determine the base URL for placeholderLogo
  const isVercelEnv = import.meta.env.VITE_VERCEL_ENV === 'true';
  let baseUrl: string;
  if (isVercelEnv) {
    baseUrl = import.meta.env.VITE_FRONTEND_URL!;
  } else {
    baseUrl = import.meta.env.VITE_LOCALHOST_URL!;
  }
  if (!baseUrl) {
    throw new Error("baseUrl is undefined. Ensure URL environment variables are set.");
  }
  const placeholderLogo = `${baseUrl}/assets/images/logo.png`;

  // Preload author logos
  useEffect(() => {
    const preloadLogos = async () => {
      const logoPromises = blogs.map(async (blog) => {
        const normalizedAuthorLogo = blog.authorLogo && !blog.authorLogo.match(/^https?:\/\//)
          ? `https://${blog.authorLogo}`
          : blog.authorLogo;
        if (!normalizedAuthorLogo) {
          logGroupedMessage(
            'Author Logo Issues',
            `No valid author logo for blog "${blog.title}" (ID: ${blog.id}). Using placeholder: ${placeholderLogo}`
          );
          return { id: blog.id, logo: placeholderLogo };
        }
        const exists = await checkImageExists(normalizedAuthorLogo);
        if (exists) {
          return { id: blog.id, logo: normalizedAuthorLogo };
        } else {
          logGroupedMessage(
            'Author Logo Issues',
            `Logo at "${normalizedAuthorLogo}" not found for blog "${blog.title}" (ID: ${blog.id}). Using placeholder: ${placeholderLogo}`
          );
          return { id: blog.id, logo: placeholderLogo };
        }
      });
      const logoResults = await Promise.all(logoPromises);
      const newLogoUrls = logoResults.reduce((acc, { id, logo }) => {
        acc[id] = logo;
        return acc;
      }, {} as Record<string, string>);
      setLogoUrls(newLogoUrls);
    };
    preloadLogos();
  }, [blogs, placeholderLogo]);

  // Fetch thumbnails
  useEffect(() => {
    const fetchThumbnails = async () => {
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL || 'https://backend.terrainfinity.ca'}/api/`;
      const newThumbnails: Record<string, string> = {};
      if (!Array.isArray(blogs)) return;
      for (const blog of blogs) {
        if (blog.videoUrl) {
          const youtubeId = getYouTubeID(blog.videoUrl);
          if (youtubeId) {
            newThumbnails[blog.id] = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
          } else {
            try {
              const response = await axios.get<{ thumbnail: string }>(
                `${apiUrl}proxy-thumbnail?url=${encodeURIComponent(blog.videoUrl)}`
              );
              newThumbnails[blog.id] = response.data.thumbnail || blog.blogImage || '';
            } catch (error) {
              newThumbnails[blog.id] = blog.blogImage || '';
            }
          }
        } else {
          newThumbnails[blog.id] = blog.blogImage || '';
        }
      }
      if (JSON.stringify(newThumbnails) !== JSON.stringify(thumbnails)) {
        setThumbnails(newThumbnails);
      }
    };
    fetchThumbnails();
  }, [blogs, thumbnails]);

  // Carousel interval
  useEffect(() => {
    if (blogs.length > 0 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [blogs, isPaused]);

  // Handle empty or invalid blogs prop
  if (!Array.isArray(blogs) || blogs.length === 0) {
    console.warn('FeaturedPost received invalid or empty blogs prop:', blogs);
    return (
      <div className="text-center p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">No featured posts available at this time.</p>
      </div>
    );
  }

  const currentBlog = blogs[currentIndex];
  if (!currentBlog) {
    console.error('Current blog is undefined at index:', currentIndex);
    return (
      <div className="text-center p-4 bg-gray-100 rounded-lg">
        <p className="text-red-500">Error: Unable to load featured post.</p>
      </div>
    );
  }

  const { type: mediaTag, color: mediaColor } = getMediaTag(currentBlog);
  const pathColor = getPathColor(currentBlog.pathId || '');

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
  };

  const handleLogoError = (blogId: string) => {
    setLogoUrls((prev) => ({
      ...prev,
      [blogId]: placeholderLogo,
    }));
  };

  return (
    <div className="relative mb-10" id="featured-post-container">
      {/* Top Block: Blog Title and Summary */}
      <div className="p-4 bg-gray-800 text-white" id="featured-post-header">
        <h2 className="text-3xl font-semibold" id="featured-post-title">
          {currentBlog.title}
          <span className="text-gray-300"> - </span>
          <span className="text-gray-400 text-sm max-w-xs truncate" id="featured-post-summary">
            {currentBlog.blogSummary}
          </span>
        </h2>
      </div>

      {/* Middle Block: Video Component */}
      <div className="w-screen" id="featured-post-media">
        <img
          id="featured-post-thumbnail"
          src={thumbnails[currentBlog.id] || currentBlog.blogImage || ''}
          alt={currentBlog.title}
          className="w-full h-auto max-h-[35vh]"
        />
        <Link to={`/blog/${currentBlog.id}`} className="absolute inset-0" id="featured-post-link">
          <span className="sr-only">Go to blog post</span>
        </Link>
        {/* Navigation Dots */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center">
          <div className="flex justify-center w-full sm:w-auto">
            <div className="p-2 rounded-lg">
              <div className="flex justify-center items-center gap-2 sm:gap-4">
                {blogs.map((_, index) => (
                  <div
                    key={index}
                    id={`dot-${index}`}
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full cursor-pointer ${
                      index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                    onClick={() => handleDotClick(index)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Go to featured post ${index + 1} of ${blogs.length}`}
                    aria-current={index === currentIndex ? 'true' : 'false'}
                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
                      e.key === 'Enter' && handleDotClick(index)
                    }
                    style={{ touchAction: 'manipulation' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Block: Metadata Container */}
      <div className="bg-black bg-opacity-50 p-4" id="featured-post-metadata">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* Left: Author and Metadata */}
          <div className="flex flex-wrap items-center space-x-2 min-w-0 gap-2" id="featured-post-author-info">
            <img
              id="featured-post-author-avatar"
              src={logoUrls[currentBlog.id] || placeholderLogo}
              alt={currentBlog.authorName || 'Author'}
              className="w-8 h-8 rounded-full flex-shrink-0"
              onError={() => handleLogoError(currentBlog.id)}
            />
            <div className="max-w-fit bg-green-500 rounded p-1" id="featured-post-author-name">
              {currentBlog.authorName || 'Unknown Author'}
            </div>
            <div className={`max-w-fit ${pathColor} rounded p-1 text-white`} id="featured-post-path-name">
              {currentBlog.pathId || 'Unknown Path'}
            </div>
            {mediaTag && (
              <div className={`px-2 py-1 ${mediaColor} rounded text-white flex-shrink-0`} id="featured-post-media-tag">
                {mediaTag}
              </div>
            )}
          </div>
          {/* Right: Comments, Age-Restricted, and Date */}
          <div className="flex items-center space-x-4 flex-shrink-0" id="featured-post-engagement">
            <div className="flex items-center space-x-2">
              <div className="text-white flex items-center" id="featured-post-comments">
                <FaComments className="mr-1" />
                {currentBlog.blogComments?.length || 0}
              </div>
              {currentBlog.isAgeRestricted && (
                <div className="text-red-500 ml-2" id="featured-post-age-restriction">18+</div>
              )}
            </div>
            <div className="text-gray-300" id="featured-post-date">
              {new Date(currentBlog.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;