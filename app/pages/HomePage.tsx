/**
 * app\pages\HomePage.tsx
 * The main home page component that displays featured posts and a grid of blog posts.
 * Fetches blog data and thumbnails from the backend API using React Query.
 * Handles NSFW content restrictions.
 *
 * @component
 * @returns {JSX.Element} The rendered home page component.
 */
import React, { useEffect, useState } from 'react';
import Layout from './components/common/Layout';
import FeaturedPost from './components/common/FeaturedPost';
import BlogPostGrid from './components/BlogListPage/BlogPostGrid';
import type { BlogPost } from '../types/blog';
import axios, { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { fetchAllThumbnails } from '../utils/imageUtils';

// Define the expected shape of the error response
interface ErrorResponse {
  message?: string;
}

export const HomePage = () => {
  // State for thumbnails
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [thumbnailLoading, setThumbnailLoading] = useState(true);

  // Safely check NSFW disclaimer acceptance (only on client-side)
  const isClientSide = typeof window !== 'undefined';
  const nsfwDisclaimerAccepted = isClientSide ? sessionStorage.getItem("NSFW-Disclaimer-Accepted") === 'true' : false;

  // Log environment variables for debugging
  console.log('Environment variables:', {
    VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'undefined',
    VITE_FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'undefined',
    VITE_NODE_ENV: import.meta.env.VITE_NODE_ENV || 'undefined',
  });

  // Define expected headers
  const expectedHeaders = {
    Accept: 'application/json',
  };

  // Fetch blog posts using React Query
  const { data: blogs = [], isLoading, error } = useQuery<BlogPost[], AxiosError<ErrorResponse>>({
    queryKey: ['blogs'],
    queryFn: async () => {
      try {
        const apiUrl = '/api/blogs/';
        console.log('Preparing Axios request:', {
          url: apiUrl,
          method: 'GET',
          headers: expectedHeaders,
        });

        const response = await axios.get<BlogPost[]>(apiUrl, {
          headers: expectedHeaders,
        });

        console.log('✅ Response received:', {
          status: response.status,
          dataLength: Array.isArray(response.data) ? response.data.length : 'Not an array',
        });

        if (!Array.isArray(response.data)) {
          console.error('🛑 Response data is not an array:', response.data);
          throw new Error('Invalid response format: expected an array of blog posts');
        }

        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('🛑 Axios error:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            responseData: error.response?.data || 'No response data',
          });
          throw error;
        }
        console.error('🛑 Unexpected error:', error);
        throw new Error('Failed to fetch blog posts');
      }
    },
    retry: (failureCount, error) => {
      if (error instanceof AxiosError) {
        return (
          failureCount < 3 &&
          (!error.response || error.response.status >= 500 || error.code === 'ERR_NETWORK')
        );
      }
      return false;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch thumbnails when blogs are loaded
  useEffect(() => {
    const loadThumbnails = async () => {
      if (blogs.length > 0) {
        setThumbnailLoading(true);
        try {
          const fetchedThumbnails = await fetchAllThumbnails(blogs);
          setThumbnails(fetchedThumbnails);
        } catch (error) {
          console.error('Failed to fetch thumbnails:', error);
        } finally {
          setThumbnailLoading(false);
        }
      } else {
        setThumbnailLoading(false);
      }
    };
    loadThumbnails();
  }, [blogs]);

  // Check for malformed data
  const invalidBlogs = blogs.filter(blog => !blog || !blog.id || !blog.title);
  if (invalidBlogs.length > 0) {
    console.error('Invalid blog entries found:', invalidBlogs);
  }

  // Check for duplicate IDs
  const ids = blogs.map(blog => blog.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== ids.length) {
    console.error('Duplicate blog IDs found:', ids);
  }

  // Determine error message for display
  let errorMessage: string | null = null;
  if (error) {
    if (error.response) {
      errorMessage = error.response.status === 404
        ? 'Blog posts not found. Please try again later.'
        : error.response.status >= 500
        ? 'Server error. Please try again later.'
        : `Error: ${error.response.status} - ${error.response.data?.message || error.message}`;
    } else {
      errorMessage = 'Unable to connect to the server. Please try again later.';
    }
  }

  // Define placeholder logo
  const isVercelEnv = import.meta.env.VITE_VERCEL_ENV === 'true';
  const baseUrl = isVercelEnv ? import.meta.env.VITE_FRONTEND_URL! : import.meta.env.VITE_LOCALHOST_URL!;
  const placeholderLogo = `${baseUrl}/assets/images/logo.png`;

  // Create logoUrls from blogs
  const logoUrls = blogs.reduce((acc, blog) => {
    acc[blog.id] = blog.authorLogo || placeholderLogo;
    return acc;
  }, {} as Record<string, string>);

  return (
    <Layout title="The Bambi Cloud Podcast" id="home-page-layout">
      <div id="home-page-content" className="relative">
        {/* Loading overlay */}
        {(isLoading || thumbnailLoading) && (
          <div
            id="loading-message"
            className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-10"
            aria-live="polite"
          >
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              />
            </svg>
          </div>
        )}
        {/* Error message */}
        {errorMessage && (
          <div
            id="error-message"
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
            aria-live="assertive"
          >
            {errorMessage}
          </div>
        )}
        {/* Main content */}
        <FeaturedPost
          id="featured-posts-section"
          blogs={blogs.filter((blog) => blog.featured)}
          thumbnails={thumbnails}
          logoUrls={logoUrls}
          nsfwDisclaimerAccepted={nsfwDisclaimerAccepted}
        />
        <BlogPostGrid
          id="blog-posts-grid"
          blogs={blogs}
          thumbnails={thumbnails}
          nsfwDisclaimerAccepted={nsfwDisclaimerAccepted}
        />
      </div>
    </Layout>
  ); 
};