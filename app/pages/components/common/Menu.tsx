/**
 * Menu.tsx
 * A component for the mobile navigation menu.
 *
 * This component renders a navigation menu that allows users to navigate
 * to different sections of the application, including Home, About, Admin,
 * and a Random Blog. It also provides functionality for user authentication
 * with options to log in or log out.
 *
 * @param props - The properties passed to the component.
 * @param props.isOpen - Indicates whether the menu is currently open (true) or closed (false).
 */
import React, { useState, useContext } from 'react';
import SearchInput from './SearchInput';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

interface BlogPost {
  id: number;
}

interface MenuProps {
  isOpen: boolean;
}

const Menu: React.FC<MenuProps> = ({ isOpen }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [randomBlogId, setRandomBlogId] = useState<number | null>(null);
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Fetches a random blog from the API.
   * If successful, updates the state with the fetched blogs and sets a random blog ID.
   * @returns {Promise<number | null>} The ID of the randomly selected blog or null if fetching fails.
   */
  const fetchRandomBlog = async (): Promise<number | null> => {
    try {
      const apiUrl = import.meta.env.VITE_VERCEL_ENV === 'true' 
        ? `${import.meta.env.VITE_FRONTEND_URL}/api/blogs` 
        : `${import.meta.env.VITE_LOCALHOST_URL}/api/blogs`;

      console.debug(apiUrl);

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: BlogPost[] = await response.json();
      console.debug(data);

      setBlogs(data);
      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomBlog = data[randomIndex].id;
        setRandomBlogId(randomBlog);
        console.debug(randomBlog);
        return randomBlog;
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    }
    return null;
  };

  /**
   * Handles the click event for the Random Blog link.
   * Prevents the default action, fetches a random blog, and navigates to its page if found.
   * @param event - The click event.
   */
  const handleRandomBlogClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const randomBlog = await fetchRandomBlog();
    if (randomBlog) {
      navigate(`/blog/${randomBlog}`);
    }
  };

  /**
   * Logs the user out and navigates to the Home page.
   */
  const handleLogout = () => {
    logout();
    navigate('/Home');
  };

  return (
    <nav
      className={`
        ${isOpen ? 'block' : 'hidden'}
        md:absolute md:top-full md:left-0 md:right-0
        bg-slate-800 z-50
      `}
    >
      <div className="flex flex-col items-center py-4">
        <Link
          to="/Home"
          className="py-2 w-full text-center text-white hover:bg-slate-700"
          id="menu-home-link"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="py-2 w-full text-center text-white hover:bg-slate-700"
          id="menu-about-link"
        >
          About
        </Link>
        <hr className="my-2 border-white" />
        {token && (
          <Link
            to="/admin"
            className="py-2 w-full text-center text-white hover:bg-slate-700"
            id="menu-admin-link"
          >
            Admin
          </Link>
        )}
        <a
          href="#"
          onClick={handleRandomBlogClick}
          className="py-2 w-full text-center text-white hover:bg-slate-700"
          id="menu-random-blog-link"
        >
          Random Blog
        </a>
        <Link
          to="/blog/create"
          className="py-2 w-full text-center text-white hover:bg-slate-700"
          id="menu-create-blog-link"
        >
          Create Blog
        </Link>
        <hr className="my-2 border-white" />
        {token ? (
          <button
            onClick={handleLogout}
            className="py-2 w-full text-center text-white hover:bg-slate-700 cursor-pointer"
            id="menu-logout-button"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/Login"
            className="py-2 w-full text-center text-white hover:bg-slate-700"
            id="menu-login-link"
          >
            Login
          </Link>
        )}
        <div className="py-2 w-full md:hidden flex justify-center" id="menu-search-input">
          <SearchInput id="search-input-menu" />
        </div>
      </div>
    </nav>
  );
};

export default Menu;