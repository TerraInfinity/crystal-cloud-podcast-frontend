import React, { useEffect, useState } from 'react';
import { FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../../../types/blog';
import { useQueries } from '@tanstack/react-query';
import { fetchThumbnail } from '../../../utils/imageUtils';
import { useValidImageUrl } from '../../../hooks/useValidImageUrl';

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

const FeaturedPost: React.FC<{ blogs?: BlogPost[]; id?: string }> = ({ blogs = [], id }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Define placeholderLogo locally
  const placeholderLogo = '/assets/images/logo.png';

  // Reset currentIndex when blogs change
  useEffect(() => {
    setCurrentIndex(0);
  }, [blogs]);

  // Fetch thumbnails for all blogs using useQueries
  const thumbnailQueries = useQueries({
    queries: blogs.map((blog) => ({
      queryKey: [
        'thumbnail',
        blog.id,
        blog.videoUrl || '',
        blog.blogImage || '',
        blog.embedUrl || '',
        blog.postUrl || '',
        blog.isAgeRestricted ? 'true' : 'false',
      ],
      queryFn: () => fetchThumbnail(blog),
      placeholderData: blog.blogImage, // Use blog.blogImage as placeholder, avoiding defaultImage
    })),
  });

  // Use useValidImageUrl for each blog's author logo
  const logoUrls = blogs.map((blog) =>
    useValidImageUrl(blog.authorLogo, placeholderLogo)
  );

  // Carousel interval
  useEffect(() => {
    if (blogs.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [blogs, isPaused]);

  // Handle empty or invalid blogs prop
  if (!Array.isArray(blogs) || blogs.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">No featured posts available at this time.</p>
      </div>
    );
  }

  const currentBlog = blogs[currentIndex];
  const currentThumbnail = thumbnailQueries[currentIndex]?.data || placeholderLogo; // Fallback to placeholderLogo if query unresolved
  const currentLogo = logoUrls[currentIndex];

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
          <span
            className="text-gray-400 text-sm max-w-xs truncate"
            id="featured-post-summary"
          >
            {currentBlog.blogSummary}
          </span>
        </h2>
      </div>

      {/* Middle Block: Thumbnail */}
      <div className="w-screen" id="featured-post-media">
        <img
          id="featured-post-thumbnail"
          src={currentThumbnail}
          alt={currentBlog.title}
          className="w-full h-auto max-h-[35vh]"
        />
        <Link
          to={`/blog/${currentBlog.id}`}
          className="absolute inset-0"
          id="featured-post-link"
        >
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
                    onKeyDown={(e) => e.key === 'Enter' && handleDotClick(index)}
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
          <div
            className="flex flex-wrap items-center space-x-2 min-w-0 gap-2"
            id="featured-post-author-info"
          >
            <img
              id="featured-post-author-avatar"
              src={currentLogo}
              alt={currentBlog.authorName || 'Author'}
              className="w-8 h-8 rounded-full flex-shrink-0"
              onError={(e) => {
                e.currentTarget.src = placeholderLogo;
              }}
            />
            <div
              className="bg-green-500 rounded p-1"
              id="featured-post-author-name"
            >
              {currentBlog.authorName || 'Unknown Author'}
            </div>
            <div
              className={`${pathColor} rounded p-1 text-white`}
              id="featured-post-path-name"
            >
              {currentBlog.pathId || 'Unknown Path'}
            </div>
            {mediaTag && (
              <div
                className={`px-2 py-1 ${mediaColor} rounded text-white flex-shrink-0`}
                id="featured-post-media-tag"
              >
                {mediaTag}
              </div>
            )}
          </div>
          {/* Right: Comments, Age-Restricted, and Date */}
          <div
            className="flex items-center space-x-4 flex-shrink-0"
            id="featured-post-engagement"
          >
            <div className="flex items-center space-x-2">
              <div
                className="text-white flex items-center"
                id="featured-post-comments"
              >
                <FaComments className="mr-1" />
                {currentBlog.blogComments?.length || 0}
              </div>
              {currentBlog.isAgeRestricted && (
                <div
                  className="text-red-500 ml-2"
                  id="featured-post-age-restriction"
                >
                  18+
                </div>
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