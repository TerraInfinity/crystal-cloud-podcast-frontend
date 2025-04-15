import BlogPostCard from './BlogPostCard';
import type { BlogPost } from '../../../types/blog'; // Use type-only import

/**
 * Props interface for the BlogPostGrid component.
 */
interface BlogPostGridProps {
  id: string;
  blogs: BlogPost[]; // Array of blog post objects
  thumbnails: Record<string, string>; // Map of blog IDs to thumbnail URLs
}

/**
 * BlogPostGrid Component
 *
 * Renders a responsive grid layout of blog posts using the data provided via the `blogs` prop.
 * Displays the latest blog posts in a grid, with each post rendered using the BlogPostCard component.
 * Passes pre-fetched thumbnails to each BlogPostCard for efficient rendering.
 *
 * @param {BlogPostGridProps} props - The component props
 * @param {BlogPost[]} props.blogs - Array of blog post objects (defaults to empty array)
 * @param {Record<string, string>} props.thumbnails - Map of blog IDs to thumbnail URLs
 *
 * @component
 * @example
 * const blogs = [
 *   {
 *     id: '1',
 *     title: 'Latest in Tech',
 *     authorName: 'John Doe',
 *     authorLogo: 'url_to_logo',
 *     createdAt: '2023-02-20T12:00:00Z',
 *     blogImage: 'url_to_image',
 *     isAgeRestricted: false,
 *     videoUrl: 'url_to_video',
 *     audioUrl: 'url_to_audio',
 *     blogSummary: 'A brief summary of the blog post.',
 *     pathId: 'latest-in-tech',
 *     blogComments: []
 *   }
 * ];
 * const thumbnails = { '1': 'url_to_thumbnail' };
 *
 * <BlogPostGrid id="grid-id" blogs={blogs} thumbnails={thumbnails} />
 *
 * @author Bad Wolf
 * @version 1.4
 * @since 2025-03-22
 */
const BlogPostGrid = ({ id, blogs = [], thumbnails }: BlogPostGridProps) => {
  return (
    <div className="px-20 py-0 max-md:px-10 max-md:py-0 max-sm:px-5 max-sm:py-0" id={id}>
      <h2 className="mb-8 text-2xl text-white" id="latest-posts-title">Latest Posts</h2>
      <div className="grid gap-6 mb-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" id="blog-posts-grid">
        {blogs.length > 0 ? (
          blogs
            .filter((blog) => blog && typeof blog === 'object' && blog.id && typeof blog.title === 'string')
            .map((blog) => (
              <BlogPostCard
                key={blog.id}
                blog={blog}
                thumbnail={thumbnails[blog.id] || ''} // Pass thumbnail, fallback to empty string
                data-testid={`blog-post-${blog.id}`}
              />
            ))
        ) : (
          <div className="text-white col-span-3" id="no-posts-message">No blog posts available</div>
        )}
      </div>
      <button
        id="view-all-posts-button"
        className="mb-10 text-center text-blue-500 cursor-pointer hover:text-blue-600"
      >
        View All Posts
      </button>
    </div>
  );
};

export default BlogPostGrid;