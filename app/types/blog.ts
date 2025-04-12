// src/types/blog.ts

/**
 * Interface for a single blog post object.
 * Represents the structure of each blog post, aligned with the backend Blog model.
 */
export interface BlogPost {
    /** Unique identifier for the blog post (UUID). */
    id: string;
  
    /** Title of the blog post, max 100 characters. */
    title: string;
  
    /** Main content of the blog post. */
    content: string;
  
    /** Optional summary of the blog post. */
    blogSummary?: string;
  
    /** Optional UUID of the author. */
    authorId?: string;
  
    /** Optional name of the author, max 69 characters. */
    authorName?: string;
  
    /** Optional URL of the author's logo. */
    authorLogo?: string;
  
    /** Optional website of the author. */
    authorWebsite?: string;
  
    /** Optional flag indicating if the blog is age-restricted. */
    isAgeRestricted?: boolean;
  
    /** Optional URL of a video associated with the blog. */
    videoUrl?: string;
  
    /** Optional URL of an audio file associated with the blog. */
    audioUrl?: string;
  
    /** Optional URL of the blog's image. */
    blogImage?: string;
  
    /** Optional disclaimer text for the blog. */
    disclaimer?: string;
  
    /** Optional easter egg text hidden in the blog. */
    easterEgg?: string;
  
    /** Optional flag indicating if the blog is featured (may be a string or boolean depending on API). */
    featured?: string | boolean;
  
    /** Optional UUID of the associated path. */
    pathId?: string;
  
    /** Optional Patreon URL associated with the blog. */
    patreonURL?: string;
  
    /** Optional embed URL for a video associated with the blog. */
    embedUrl?: string;
  
    /** Role of the user associated with the blog. */
    role: 'user' | 'editor' | 'creator' | 'admin';
  
    /** Creation timestamp of the blog post (ISO string). */
    createdAt: string;
  
    /** Last updated timestamp of the blog post (ISO string). */
    updatedAt: string;
  
    /** Optional array of comments associated with the blog post. */
    blogComments?: any[]; // Consider defining a BlogComment interface for type safety
  }