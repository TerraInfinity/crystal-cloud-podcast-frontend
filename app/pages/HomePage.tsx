/**
 * app\pages\HomePage.tsx
 * The main home page component that displays featured posts and a grid of blog posts.
 * It fetches blog data from the backend API using React Query for caching and state management.
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
  // Fetch blog posts using React Query with enhanced CORS debugging
  const { data: blogs = [], isLoading, error } = useQuery<BlogPost[], AxiosError<ErrorResponse>>({
    queryKey: ['blogs'],
    queryFn: async () => {
      try {
        const apiUrl = '/api/blogs/'; // Rely on vercel.json rewrite to /api/proxy
        console.log('Sending request to: ', import.meta.env.VITE_FRONTEND_URL, apiUrl, ' which will change via vite proxy to: ', import.meta.env.VITE_BACKEND_URL, apiUrl);

        const response = await axios.get<BlogPost[]>(import.meta.env.VITE_FRONTEND_URL+apiUrl, {
          headers: {
            Accept: 'application/json',
          },
          timeout: 10000,
        });

        console.log('✅ Response received:', {
          status: response.status,
          contentType: response.headers['content-type'],
          contentEncoding: response.headers['content-encoding'] || 'none',
          corsOrigin: response.headers['access-control-allow-origin'] || 'Not set',
          corsMethods: response.headers['access-control-allow-methods'] || 'Not set',
          corsHeaders: response.headers['access-control-allow-headers'] || 'Not set',
          dataLength: Array.isArray(response.data) ? response.data.length : 'Not an array',
        });

        if (!Array.isArray(response.data)) {
          console.error('🛑 Expected array, got:', response.data);
          throw new Error('Invalid response format: expected an array of blog posts');
        }

        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('🛑 Axios error:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            headers: error.response?.headers || 'No response headers',
            corsOrigin: error.response?.headers?.['access-control-allow-origin'] || 'Not set',
            corsMethods: error.response?.headers?.['access-control-allow-methods'] || 'Not set',
            corsHeaders: error.response?.headers?.['access-control-allow-headers'] || 'Not set',
            requestHeaders: error.config?.headers,
            requestUrl: error.config?.url,
            isNetworkError: !error.response,
            cause: error.cause?.message || 'Unknown cause',
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
    staleTime: 5 * 60 * 1000,
  });

  // Display loading state
  if (isLoading) {
    return (
      <div
        id="loading-message"
        className="flex justify-center items-center h-screen"
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
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
          ></path>
        </svg>
      </div>
    );
  }

  // Handle errors
  if (error) {
    let message = 'Oops, something went wrong. Please refresh the page.';
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        headers: error.response.headers,
        corsOrigin: error.response.headers?.['access-control-allow-origin'] || 'Not set',
      });
      if (error.response.status === 404) {
        message = 'Blog posts not found. Please try again later.';
      } else if (error.response.status >= 500) {
        message = 'Server error. Please try again later.';
      } else if (error.response.status === 403) {
        message = 'Access denied. This may be due to a server CORS configuration issue.';
      } else {
        message = `Error: ${error.response.status} - ${
          error.response.data?.message || error.message
        }`;
      }
    } else {
      console.error('Network error:', {
        message: error.message,
        code: error.code,
        requestUrl: error.config?.url,
      });
      message = 'Unable to connect to the server. This may be a CORS or server configuration issue. Please try again later.';
    }
    return (
      <div id="error-message" role="alert" aria-live="assertive">
        {message}
      </div>
    );
  }

  // Render the page
  return (
    <Layout title="The Bambi Cloud Podcast" id="home-page-layout">
      <div id="home-page-content">
        <FeaturedPost
          id="featured-posts-section"
          blogs={blogs.filter((blog) => blog.featured)}
        />
        <BlogPostGrid id="blog-posts-grid" blogs={blogs} />
      </div>
    </Layout>
  );
};