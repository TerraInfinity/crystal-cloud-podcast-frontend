import React, { useEffect, useState } from 'react';
import { FaComments } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../../../types/blog'; // Use type-only import for BlogPost

/**
 * Interface for FeaturedPost component props.
 *
 * @interface FeaturedPostProps
 * @property {BlogPost[]} blogs - An array of blog post objects to be displayed in the carousel.
 */
interface FeaturedPostProps {
  id: string;
  blogs: BlogPost[];
}

/**
 * Determines the media type and color based on the blog's video and audio URLs.
 *
 * @param {BlogPost} blog - The blog post object.
 * @returns {{ type: string | null; color: string }} An object containing the media type and its corresponding color.
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
 *
 * @param {string} pathId - The path ID of the blog.
 * @returns {string} The TailwindCSS class for the background color.
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
 *
 * @param {string} url - The YouTube video URL.
 * @returns {string | null} The YouTube video ID or null if not found.
 */
const getYouTubeID = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * FeaturedPost Component
 *
 * A carousel component that displays featured blog posts. It fetches thumbnails for videos,
 * handles automatic and manual navigation through the posts, and displays relevant information
 * such as the author, creation date, and media tags.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {BlogPost[]} props.blogs - An array of blog post objects to be displayed in the carousel.
 * @returns {JSX.Element | null} The rendered featured post carousel or null if no blogs are provided.
 *
 * @example
 * <FeaturedPost blogs={blogsArray} />
 */
const FeaturedPost: React.FC<FeaturedPostProps> = ({ blogs = [] }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const placeholderLogo = '/assets/images/logo.png';
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchThumbnails = async () => {
      const mode = import.meta.env.VITE_NODE_ENV || 'development';
      let apiUrl;
      if (mode === 'local-development') {
        const apiPort = import.meta.env.VITE_BACKEND_PORT || '5000';
        apiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/`;
      } else {
        apiUrl = '/api/';
      }

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

  useEffect(() => {
    if (blogs.length > 0 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [blogs, isPaused]);

  if (!Array.isArray(blogs)) {
    console.error('FeaturedPost received invalid blogs prop:', blogs);
    return null;
  }

  if (blogs.length === 0) {
    return null;
  }

  const currentBlog = blogs[currentIndex];
  if (!currentBlog) {
    console.error('Current blog is undefined at index:', currentIndex);
    return null;
  }

  const { type: mediaTag, color: mediaColor } = getMediaTag(currentBlog);
  const pathColor = getPathColor(currentBlog.pathId || '');

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
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
              src={currentBlog.authorLogo || placeholderLogo}
              alt={currentBlog.authorName || 'Author'}
              className="w-8 h-8 rounded-full flex-shrink-0"
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