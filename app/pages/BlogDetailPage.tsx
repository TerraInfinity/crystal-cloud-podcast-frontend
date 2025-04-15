/**
 * BlogDetailPage component
 *
 * This component serves as the main page for displaying a blog post.
 * It includes the header, page title, blog content, feedback section,
 * advertisement banner, and footer.
 *
 * @component
 * @returns {JSX.Element} The rendered blog detail page.
 *
 * @state {Blog | null} blog - The blog post data fetched from the API.
 * @state {boolean} loading - Indicates if the blog post is still loading.
 * @state {string | null} error - Error message if fetching the blog fails.
 * @state {boolean} isLoggedIn - Indicates if the user is logged in.
 * @state {BlogComment[]} comments - List of comments associated with the blog post.
 * @state {boolean} audioVisible - Controls visibility of audio content.
 * @state {boolean} videoVisible - Controls visibility of video content.
 * @state {string | null} userRole - Role of the user (e.g., 'admin', 'user').
 * @state {boolean} isEditMode - Indicates if the component is in edit mode.
 * @state {Blog | null} editedBlog - Holds the blog data being edited.
 *
 * @context {AuthContextType} AuthContext - Provides authentication status and user role.
 */
import React, { useState, useEffect, useContext, type JSX } from 'react';
import Layout from './components/common/Layout';
import BlogContent from './components/BlogDetailPage/BlogContent';
import FeedbackSection from './components/BlogDetailPage/FeedbackSection';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

// Define interfaces for type safety
interface Blog {
  id: string;
  title: string;
  content: string;
  blogSummary?: string;
  audioUrl?: string;
  videoUrl?: string;
  BlogComments?: BlogComment[];
}

interface BlogComment {
  id: string;
  content: string;
  // Add other comment fields as needed
}

interface AuthContextType {
  isAuthenticated: boolean;
}

interface Params {
  [key: string]: string | undefined;
}

export function BlogDetailPage(): JSX.Element {
  const { id } = useParams<Params>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [audioVisible, setAudioVisible] = useState<boolean>(true);
  const [videoVisible, setVideoVisible] = useState<boolean>(true);
  const { isAuthenticated } = useContext(AuthContext) as AuthContextType;
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editedBlog, setEditedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlog = async (): Promise<void> => {
      try {
        const apiUrl = `/api/blogs/${id}`;
        console.log('Fetching blog from:', apiUrl); // Debug log
        const response = await axios.get<{ data: Blog }>(apiUrl);
        console.log('Blog response:', response.data); // Debug log
        setBlog(response.data.data);
        setEditedBlog(response.data.data);
        setComments(response.data.data.BlogComments || []);
        document.title = response.data.data.title;
      } catch (e: unknown) {
        console.error('Error fetching blog:', e);
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    const checkLoginStatus = async (): Promise<void> => {
      // Placeholder for actual API call
      setIsLoggedIn(false);
    };

    const fetchUserRole = async (): Promise<void> => {
      console.log('Fetching user role...');
      try {
        const apiUrl = '/api/users/role';
        const response = await axios.get<{ role: string }>(apiUrl, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        console.log('User role fetched successfully:', response.data.role);
        setUserRole(response.data.role);
      } catch (e: unknown) {
        console.error('Error fetching user role:', e);
      }
      console.log('Finished fetching user role.');
    };

    fetchBlog();
    checkLoginStatus();
    if (isAuthenticated) fetchUserRole();
  }, [isAuthenticated, id]);

  useEffect(() => {
    if (blog) {
      if (!blog.audioUrl) {
        setAudioVisible(false);
      }
      if (!blog.videoUrl) {
        setVideoVisible(false);
      }
    }
  }, [blog]);

  const handleSave = async (): Promise<void> => {
    if (!editedBlog) return;

    try {
      const apiUrl = `/api/blogs/update/${id}`;
      const response = await axios.put(apiUrl, editedBlog, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.status !== 200) throw new Error('Failed to update blog');
      setBlog(editedBlog);
      setIsEditMode(false);
    } catch (e: unknown) {
      console.error('Error saving blog:', e);
      alert('Failed to save changes');
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!blog) {
    return <div className="text-white">Blog not found</div>;
  }

  return (
    <Layout title={blog.title}>
      {userRole === 'admin' && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button
              id="edit-blog-button"
              onClick={() => setIsEditMode(!isEditMode)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              aria-label="Toggle Edit Mode"
            >
              {isEditMode ? 'Cancel' : 'Edit'}
            </button>
            {isEditMode && (
              <button
                id="save-changes-button"
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                aria-label="Save Changes"
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}
      {isEditMode && editedBlog ? (
        <div className="mb-12 px-4 sm:px-6 lg:px-8" id="blog-edit-form">
          <input
            id="blog-title-input"
            type="text"
            value={editedBlog.title}
            onChange={(e) => setEditedBlog({ ...editedBlog, title: e.target.value })}
            className="w-full mb-4 p-2 text-black rounded"
            placeholder="Blog Title"
          />
          <textarea
            id="blog-summary-input"
            value={editedBlog.blogSummary || ''}
            onChange={(e) => setEditedBlog({ ...editedBlog, blogSummary: e.target.value })}
            className="w-full mb-4 p-2 text-black rounded"
            placeholder="Summary"
            rows={3}
          />
          <textarea
            id="blog-content-input"
            value={editedBlog.content}
            onChange={(e) => setEditedBlog({ ...editedBlog, content: e.target.value })}
            className="w-full mb-4 p-2 text-black rounded"
            placeholder="Content"
            rows={10}
          />
          <input
            id="blog-audio-url-input"
            type="url"
            value={editedBlog.audioUrl || ''}
            onChange={(e) => setEditedBlog({ ...editedBlog, audioUrl: e.target.value })}
            className="w-full mb-4 p-2 text-black rounded"
            placeholder="Audio URL (optional)"
          />
          <input
            id="blog-video-url-input"
            type="url"
            value={editedBlog.videoUrl || ''}
            onChange={(e) => setEditedBlog({ ...editedBlog, videoUrl: e.target.value })}
            className="w-full mb-4 p-2 text-black rounded"
            placeholder="Video URL (optional)"
          />
        </div>
      ) : (
        <div id="blog-content-display">
          <BlogContent blog={{ ...blog, summary: blog.blogSummary }} />
        </div>
      )}
      <div id="blog-feedback-section">
        <FeedbackSection isLoggedIn={isAuthenticated} comments={comments} blogId={blog.id} />
      </div>
    </Layout>
  );
}