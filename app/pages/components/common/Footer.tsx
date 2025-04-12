/**
 * Footer.tsx
 * A functional component that renders the website footer, which includes:
 * - About information
 * - Quick links to various sections of the site
 * - Categories of content
 * - A newsletter subscription form
 *
 * This component is designed to be responsive and adapts to different screen sizes.
 *
 * @component
 * @param props - The properties passed to the component.
 * @param props.className - Optional CSS class to apply to the footer element.
 * @returns The rendered footer component containing various sections.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import NewsletterForm from './NewsletterForm'; // Using ~ alias, adjust if not in app/components

// Define props interface to include HTML attributes
interface FooterProps extends React.HTMLAttributes<HTMLElement> {
    // className is included via HTMLAttributes
  }

  
const Footer: React.FC<FooterProps> = ({ className = '', ...props }) => {
  return (
    <footer
      className={`px-4 sm:px-6 lg:px-20 pt-20 pb-10 bg-slate-800 ${className}`}
      {...props}
    >
      <div className="grid gap-10 mb-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div>
          <h3 className="mb-6 text-lg text-white">About</h3>
          <p className="mb-6 text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam.
          </p>
          <div className="text-gray-400">
            <p>Email: career@terrainfinity.ca</p>
            <p>Phone: +00 123 456 789</p>
          </div>
        </div>
        <div>
          <h3 className="mb-6 text-lg text-white">Quick Link</h3>
          <nav className="grid gap-3">
            <Link to="/" className="text-gray-400 cursor-pointer">Home</Link>
            <Link to="/blog" className="text-gray-400 cursor-pointer">Blog</Link>
            <Link to="/archived" className="text-gray-400 cursor-pointer">Archived</Link>
            <Link to="/author" className="text-gray-400 cursor-pointer">Author</Link>
            <Link to="/contact" className="text-gray-400 cursor-pointer">Contact</Link>
            <Link to="/about" className="text-gray-400 cursor-pointer">About</Link>
          </nav>
        </div>
        <div>
          <h3 className="mb-6 text-lg text-white">Category</h3>
          <nav className="grid gap-3">
            <Link to="/category/lifestyle" className="text-gray-400 cursor-pointer">Lifestyle</Link>
            <Link to="/category/technology" className="text-gray-400 cursor-pointer">Technology</Link>
            <Link to="/category/travel" className="text-gray-400 cursor-pointer">Travel</Link>
            <Link to="/category/business" className="text-gray-400 cursor-pointer">Business</Link>
            <Link to="/category/economy" className="text-gray-400 cursor-pointer">Economy</Link>
            <Link to="/category/sports" className="text-gray-400 cursor-pointer">Sports</Link>
          </nav>
        </div>
        <div>
          <h3 className="mb-6 text-lg text-white">Weekly Newsletter</h3>
          <p className="mb-6 text-gray-400">
            Get blog articles and offers via email
          </p>
          <NewsletterForm id="newsletter-form" />
        </div>
      </div>
      <div className="flex justify-between items-center pt-10 text-gray-400 border-t border-solid border-t-gray-700 max-sm:flex-col max-sm:gap-5 max-sm:text-center">
        <div>© IsTemplate 2023. All Rights Reserved.</div>
        <nav className="flex gap-6">
          <Link to="/terms" className="text-gray-400 cursor-pointer">Terms of Use</Link>
          <Link to="/privacy" className="text-gray-400 cursor-pointer">Privacy Policy</Link>
          <Link to="/cookie" className="text-gray-400 cursor-pointer">Cookie Policy</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;