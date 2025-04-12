/**
 * HomePage.tsx
 * The main home page component that displays featured posts and a grid of blog posts.
 * It fetches blog data from the backend API and manages loading and error states.
 *
 * @component
 * @returns {JSX.Element} The rendered home page component.
 * 
 * @state {BlogPost[]} blogs - The list of blog posts fetched from the API.
 * @state {boolean} loading - Indicates whether the blog data is currently being loaded.
 * @state {string | null} error - Contains error message if fetching blogs fails.
 * 
 * @example
 * // Usage of HomePage component
 * <HomePage />
 */
import React, { useState, useEffect } from 'react';
import Layout from './components/common/Layout'; // Import the Layout component
import FeaturedPost from './components/common/FeaturedPost';
import BlogPostGrid from './components/BlogListPage/BlogPostGrid';
import type { BlogPost } from '../types/blog'; // Use type-only import

import axios from 'axios'; // Import axios


export const HomePage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Testing hellow');
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        
        let apiUrl;
        const mode = import.meta.env.VITE_NODE_ENV || 'development';
        console.log('🔧 Environment Mode:', mode);
        
        if (mode === 'local-development') {
          // Local workstation behavior
          const apiPort = import.meta.env.VITE_BACKEND_PORT || '5000';
          apiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/blogs/`;
          console.log('📡 Local Development API Configuration:', {
            protocol: window.location.protocol,
            hostname: window.location.hostname,
            port: apiPort
          });
        } else {
          // Development or Production (server-friendly, proxy-based)
          apiUrl = '/api/blogs/'; // Relative path, proxied by Nginx to localhost:5000
          console.log('📡 Production/Development API Path:', apiUrl);
        }
        
        console.log('🚀 Sending request to:', apiUrl);
        const response = await axios.get<BlogPost[]>(apiUrl);
        console.log('✅ API Response:', {
          status: response.status,
          dataLength: Array.isArray(response.data) ? response.data.length : 'Not an array',
          data: response.data
        });
        
        const data = Array.isArray(response.data) ? response.data : [];
        setBlogs(data);
      } catch (error: any) {
        console.error('❌ Error fetching blogs:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config
        });
        setError('Failed to load blog posts');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <div id="loading-message">Loading...</div>; // Handle loading state
  if (error) return <div id="error-message">{error}</div>; // Handle error state

  return (
    <Layout title="The Bambi Cloud Podcast" id="home-page-layout">
      <div id="home-page-content">
        <FeaturedPost id="featured-posts-section" blogs={blogs.filter(blog => blog.featured)} />
        <BlogPostGrid id="blog-posts-grid" blogs={blogs} />
      </div>
    </Layout>
  );
};