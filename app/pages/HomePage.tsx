/**
 * app\pages\HomePage.tsx
 * The main home page component that displays featured posts and a grid of blog posts.
 * It fetches blog data from the backend API using React Query for caching and state management.
 * Renders the page layout even if the API request fails, displaying an error message when needed.
 *
 * @component
 * @returns {JSX.Element} The rendered home page component.
 *
 * @example
 * // Usage of HomePage component
 * <HomePage />
 */
import React from 'react';
import Layout from './components/common/Layout';
import FeaturedPost from './components/common/FeaturedPost';
import BlogPostGrid from './components/BlogListPage/BlogPostGrid';
import type { BlogPost } from '../types/blog';
import axios, { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';

// Define the expected shape of the error response
interface ErrorResponse {
  message?: string;
}

export const HomePage = () => {
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

        // Log successful response with header comparison
        const receivedHeaders = response.headers;
        console.log('✅ Response received:', {
          status: response.status,
          headers: {
            contentType: receivedHeaders['content-type'] || 'Not set',
            contentEncoding: receivedHeaders['content-encoding'] || 'none',
            corsOrigin: receivedHeaders['access-control-allow-origin'] || 'Not set',
            corsMethods: receivedHeaders['access-control-allow-methods'] || 'Not set',
            corsHeaders: receivedHeaders['access-control-allow-headers'] || 'Not set',
          },
          expectedContentType: 'application/json',
          matchesContentType: (receivedHeaders['content-type'] || '').includes('application/json'),
          dataLength: Array.isArray(response.data) ? response.data.length : 'Not an array',
        });

        if (!Array.isArray(response.data)) {
          console.error('🛑 Response data is not an array:', response.data);
          throw new Error('Invalid response format: expected an array of blog posts');
        }

        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          // Log detailed error information
          console.error('🛑 Axios error:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            responseHeaders: error.response?.headers || 'No response headers',
            requestHeaders: error.config?.headers,
            expectedHeaders,
            matchesAccept: error.config?.headers?.Accept === expectedHeaders.Accept,
            url: error.config?.url,
            isNetworkError: !error.response,
            responseData: error.response?.data || 'No response data',
          });
          throw error;
        }
        console.error('🛑 Unexpected error:', {
          message: (error as Error).message,
          stack: (error as Error).stack,
        });
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

  // Determine error message for display
  let errorMessage: string | null = null;
  if (error) {
    if (error.response) {
      console.error('Error response details:', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
      });
      if (error.response.status === 404) {
        errorMessage = 'Blog posts not found. Please try again later.';
      } else if (error.response.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response.status === 403) {
        errorMessage = 'Access denied. This may be due to a server CORS configuration issue.';
      } else {
        errorMessage = `Error: ${error.response.status} - ${
          error.response.data?.message || error.message
        }`;
      }
    } else {
      console.error('Network error details:', {
        message: error.message,
        code: error.code,
        url: error.config?.url,
      });
      errorMessage = 'Unable to connect to the server. Please try again later.';
    }
  }

  return (
    <Layout title="The Bambi Cloud Podcast" id="home-page-layout">
      <div id="home-page-content" className="relative">
        {/* Loading overlay */}
        {isLoading && (
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
        />
        <BlogPostGrid id="blog-posts-grid" blogs={blogs} />
      </div>
    </Layout>
  );
}; 