import React, { useEffect, useState } from 'react';
import { FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchThumbnail } from '../../../utils/imageUtils';
import { useValidImageUrl } from '../../../hooks/useValidImageUrl';
import type { BlogPost } from '../../../types/blog';
import { ErrorBoundary } from 'react-error-boundary';
import PropTypes from 'prop-types';

interface FeaturedPostProps {
  id: string;
  blogs: BlogPost[];
}

const getMediaTag = (blog: BlogPost): { type: string | null; color: string } => {
  const hasVideo = blog.videoUrl && blog.videoUrl.trim() !== '';
  const hasAudio = blog.audioUrl && blog.audioUrl.trim() !== '';
  if (hasVideo && hasAudio) return { type: 'Audio/Video', color: 'bg-purple-600' };
  if (hasVideo) return { type: 'Video', color: 'bg-teal-500' };
  if (hasAudio) return { type: 'Audio', color: 'bg-orange-500' };
  return { type: null, color: '' };
};

const getPathColor = (pathId: string): string => {
  if (!pathId) return 'bg-gray-500';
  const lowerCasePathId = pathId.toLowerCase();
  switch (lowerCasePathId) {
    case 'light': return 'bg-yellow-500';
    case 'dark': return 'bg-purple-600';
    case 'chaos': return 'bg-black';
    default: return 'bg-gray-500';
  }
};

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="text-center p-4 bg-gray-100 rounded-lg">
    <p className="text-red-500">Something went wrong: {error.message}</p>
  </div>
);

const safeDateString = (dateStr: string | undefined): string => {
  if (!dateStr) return 'No date';
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
};

const FeaturedPost: React.FC<FeaturedPostProps> = ({ blogs = [] }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const baseUrl = import.meta.env.VITE_VERCEL_ENV === 'true'
    ? import.meta.env.VITE_FRONTEND_URL!
    : import.meta.env.VITE_LOCALHOST_URL!;
  if (!baseUrl) throw new Error("baseUrl is undefined.");

  const thumbnailQueries = blogs.map((blog) =>
    useQuery<string>({
      queryKey: ['thumbnail', blog.id],
      queryFn: () => fetchThumbnail(blog),
    })
  );

  useEffect(() => {
    if (blogs.length > 0 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [blogs, isPaused]);

  if (!Array.isArray(blogs) || blogs.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-100 rounded-lg">
        <p className={blogs.length === 0 ? 'text-gray-600' : 'text-red-500'}>
          {blogs.length === 0 ? 'No featured posts available.' : 'Error: Invalid blogs data.'}
        </p>
      </div>
    );
  }

  const currentBlog = blogs[currentIndex];
  if (!currentBlog || typeof currentBlog !== 'object' || !currentBlog.id || !currentBlog.title || !currentBlog.blogSummary) {
    console.error('FeaturedPost Error: Invalid currentBlog at index:', currentIndex, 'Blog:', currentBlog);
    return (
      <div className="text-center p-4 bg-gray-100 rounded-lg">
        <p className="text-red-500">Error: Invalid featured post data.</p>
      </div>
    );
  }

  const { type: mediaTag, color: mediaColor } = React.useMemo(() => getMediaTag(currentBlog), [currentBlog]);
  const pathColor = React.useMemo(() => getPathColor(currentBlog.pathId || ''), [currentBlog.pathId]);
  const currentThumbnail = thumbnailQueries[currentIndex]?.data || currentBlog.blogImage || '/assets/images/consciousness.jpg';
  const logoUrl = useValidImageUrl(currentBlog.authorLogo, `${baseUrl}/assets/images/logo.png`);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="relative mb-10" id="featured-post-container">
        <div className="p-4 bg-gray-800 text-white" id="featured-post-header">
          <h2 className="text-3xl font-semibold" id="featured-post-title">
            {typeof currentBlog.title === 'string' ? currentBlog.title : 'Untitled'}
            <span className="text-gray-300"> - </span>
            <span className="text-gray-400 text-sm max-w-xs truncate" id="featured-post-summary">
              {typeof currentBlog.blogSummary === 'string' ? currentBlog.blogSummary : ''}
            </span>
          </h2>
        </div>
        <div className="w-screen" id="featured-post-media">
          <img
            id="featured-post-thumbnail"
            src={currentThumbnail}
            alt={typeof currentBlog.title === 'string' ? currentBlog.title : 'Untitled'}
            className="w-full h-auto max-h-[35vh]"
          />
          <Link to={`/blog/${currentBlog.id}`} className="absolute inset-0" id="featured-post-link">
            <span className="sr-only">Go to blog post</span>
          </Link>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center">
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
        <div className="bg-black bg-opacity-50 p-4" id="featured-post-metadata">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex flex-wrap items-center space-x-2 min-w-0 gap-2" id="featured-post-author-info">
              <img
                id="featured-post-author-avatar"
                src={logoUrl}
                alt={typeof currentBlog.authorName === 'string' ? currentBlog.authorName : 'Author'}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div className="max-w-fit bg-green-500 rounded p-1" id="featured-post-author-name">
                {typeof currentBlog.authorName === 'string' ? currentBlog.authorName : 'Unknown Author'}
              </div>
              <div className={`max-w-fit ${pathColor} rounded p-1 text-white`} id="featured-post-path-name">
                {typeof currentBlog.pathId === 'string' ? currentBlog.pathId : 'Unknown Path'}
              </div>
              {mediaTag && (
                <div className={`px-2 py-1 ${mediaColor} rounded text-white flex-shrink-0`} id="featured-post-media-tag">
                  {mediaTag}
                </div>
              )}
            </div>
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
                {safeDateString(currentBlog.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

FeaturedPost.propTypes = {
  id: PropTypes.string.isRequired,
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      blogSummary: PropTypes.string.isRequired,
      authorName: PropTypes.string,
      createdAt: PropTypes.string,
      blogImage: PropTypes.string,
      videoUrl: PropTypes.string,
      audioUrl: PropTypes.string,
      pathId: PropTypes.string,
      blogComments: PropTypes.array,
      isAgeRestricted: PropTypes.bool,
      authorLogo: PropTypes.string,
    }).isRequired
  ).isRequired,
};

export default FeaturedPost;