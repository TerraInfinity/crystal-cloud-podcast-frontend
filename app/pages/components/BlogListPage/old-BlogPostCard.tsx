import { FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../../../types/blog';
import { useQuery } from '@tanstack/react-query';
import { fetchThumbnail } from '../../../utils/imageUtils';
import { useValidImageUrl } from '../../../hooks/useValidImageUrl';

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

  // Placeholder logo and default image
  const placeholderLogo = '/assets/images/logo.png';
  const defaultImage = isAgeRestricted ? '/assets/images/NSFW.jpg' : '/assets/images/consciousness.jpg';

  // Normalize authorLogo to ensure it's an absolute URL
  const normalizedAuthorLogo = authorLogo && !authorLogo.match(/^https?:\/\//) ? `https://${authorLogo}` : authorLogo;

  // Use custom hook to validate and get the author logo URL
  const logoUrl = useValidImageUrl(normalizedAuthorLogo, placeholderLogo);

  // Fetch thumbnail using React Query
  const { data: thumbnailUrl } = useQuery<string | null>({
    queryKey: [
      'thumbnail',
      id,
      blog.videoUrl || '',
      blog.blogImage || '',
      blog.embedUrl || '',
      blog.postUrl || '',
      isAgeRestricted ? 'true' : 'false',
    ],
    queryFn: () => fetchThumbnail(blog),
    placeholderData: blog.blogImage || defaultImage,
  });

  // Determine media type and color
  const mediaType = videoUrl && audioUrl ? 'Audio/Video' : videoUrl ? 'Video' : audioUrl ? 'Audio' : null;
  const mediaColor = videoUrl && audioUrl ? 'bg-purple-600' : videoUrl ? 'bg-teal-500' : audioUrl ? 'bg-orange-500' : '';

  // Handle image loading errors (optional customization)
  const handleImageError = () => {
    // This can be expanded if additional error handling is needed
    // Currently, useQuery's fallback handles most cases
  };

  // Ensure thumbnailUrl is a string
  const safeThumbnailUrl = typeof thumbnailUrl === 'string' ? thumbnailUrl : defaultImage;

  return (
    <Link to={`/blog/${id}`} className="overflow-hidden rounded-lg bg-slate-800 shadow-md" id={`blog-post-link-${id}`}>
      {/* Image Container */}
      <div className="relative h-[200px] w-full" id={`blog-media-container-${id}`}>
        {safeThumbnailUrl && (
          <img
            src={safeThumbnailUrl}
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
          {typeof title === 'string' ? title : 'Untitled'}
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
              {typeof authorName === 'string' ? authorName : 'Unknown Author'}
            </div>
            <div className="text-gray-400 text-sm" id={`blog-date-${id}`}>
              {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        {typeof blogSummary === 'string' && blogSummary && (
          <p className="text-gray-300 mb-2 line-clamp-2" id={`blog-summary-${id}`}>
            {blogSummary}
          </p>
        )}
        {typeof pathId === 'string' && pathId && (
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

export default BlogPostCard;