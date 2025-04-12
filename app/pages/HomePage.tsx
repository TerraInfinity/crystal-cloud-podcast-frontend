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

export const HomePage = () => {
  // Fetch blog posts using React Query with caching
  const { data: blogs = [], isLoading, error } = useQuery<BlogPost[], AxiosError>({
    queryKey: ['blogs'], // Unique key for caching this query
    queryFn: async () => {
      const apiUrl = '/api/blogs/'; // Relative path to leverage proxy
      const isDev = process.env.NODE_ENV === 'development'; // Check if in development mode
      if (isDev) console.log('🚀 Sending request to:', apiUrl);
      
      const response = await axios.get<BlogPost[]>(apiUrl);
      
      if (isDev) console.log('✅ API Response:', {
        status: response.status,
        dataLength: Array.isArray(response.data) ? response.data.length : 'Not an array',
        data: response.data
      });
      
      return Array.isArray(response.data) ? response.data : []; // Ensure data is an array
    },
  });

  // Display loading state with a spinner
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

  // Handle errors with specific messaging based on status
  if (error) {
    console.error('❌ Error fetching blogs:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    const message =
      error.response?.status === 404
        ? 'Blog posts not found. Please try again later.'
        : 'Oops, something went wrong. Please refresh the page.';
    return (
      <div id="error-message" role="alert">
        {message}
      </div>
    );
  }

  // Render the layout with featured posts and blog grid
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