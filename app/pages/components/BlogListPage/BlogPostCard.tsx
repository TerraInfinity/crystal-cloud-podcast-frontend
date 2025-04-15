import { FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../../../types/blog';
import { useValidImageUrl } from '../../../hooks/useValidImageUrl';

interface BlogPostCardProps {
  blog: BlogPost;
  thumbnail: string;
  nsfwDisclaimerAccepted: boolean;
}

const BlogPostCard = ({ blog, thumbnail, nsfwDisclaimerAccepted }: BlogPostCardProps) => {
  const {
    id,
    title,
    authorName,
    authorLogo,
    createdAt,
    isAgeRestricted,
    videoUrl,
    audioUrl,
    blogSummary,
    pathId,
    blogComments,
  } = blog;

  const placeholderLogo = '/assets/images/logo.png';
  const defaultImage = isAgeRestricted ? '/assets/images/NSFW.jpg' : '/assets/images/consciousness.jpg';

  const normalizedAuthorLogo = authorLogo && !authorLogo.match(/^https?:\/\//) ? `https://${authorLogo}` : authorLogo;
  const logoUrl = useValidImageUrl(normalizedAuthorLogo, placeholderLogo);
  const safeThumbnailUrl = thumbnail || defaultImage;

  const mediaType = videoUrl && audioUrl ? 'Audio/Video' : videoUrl ? 'Video' : audioUrl ? 'Audio' : null;
  const mediaColor = videoUrl && audioUrl ? 'bg-purple-600' : videoUrl ? 'bg-teal-500' : audioUrl ? 'bg-orange-500' : '';

  const isRestricted = isAgeRestricted && !nsfwDisclaimerAccepted;

  const content = (
    <div className="block" id={`blog-post-content-${id}`}>
      <div className="relative h-[200px] w-full" id={`blog-media-container-${id}`}>
        <img
          src={safeThumbnailUrl}
          alt="Blog post thumbnail"
          className="absolute inset-0 w-full h-full object-fill"
          id={`blog-post-image-${id}`}
        />
        {isAgeRestricted && (
          <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 bg-black rounded-full text-red-500" id={`age-restricted-label-${id}`}>
            18+
          </div>
        )}
      </div>
      <div className="p-4" id={`blog-content-container-${id}`}>
        <h3 className={`text-white text-xl font-semibold mb-2 truncate ${isRestricted ? 'blur-sm' : ''}`} id={`blog-title-${id}`}>
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
    </div>
  );

  return isRestricted ? (
    <div className="overflow-hidden rounded-lg bg-slate-800 shadow-md" id={`blog-post-container-${id}`}>
      {content}
    </div>
  ) : (
    <Link to={`/blog/${id}`} className="overflow-hidden rounded-lg bg-slate-800 shadow-md" id={`blog-post-link-${id}`}>
      {content}
    </Link>
  );
};

export default BlogPostCard;