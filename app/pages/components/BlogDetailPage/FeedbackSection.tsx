/**
 * FeedbackSection component
 *
 * This component renders a section for user feedback, including a comment form and a list of comments.
 * It checks user authentication status and prompts users to log in if they are not authenticated.
 *
 * @component
 * @param {FeedbackSectionProps} props - The component props.
 * @returns {JSX.Element} A JSX element representing the feedback section of the blog post.
 *
 * @prop {Comment[]} comments - An array of comment objects to display in the comment section.
 * @prop {string} blogId - The unique identifier of the blog post for which feedback is being provided.
 */
import React, { useContext, type JSX } from 'react';
import CommentSection from './CommentSection';
import { AuthContext } from '../../../context/AuthContext';

// Define interfaces for type safety
interface User {
  name: string;
  // Add other user fields as needed
}

interface Comment {
  id: string;
  content: string;
  rating?: number;
  date?: string;
  userId?: string;
  User?: User;
}

interface AuthContextType {
  isAuthenticated: boolean;
}

interface FeedbackSectionProps {
  isLoggedIn: boolean;
  comments: Comment[];
  blogId: string;
}

/**
 * The FeedbackSection component is a functional component that displays a comment form and a list of comments
 * for a specific blog post. It utilizes the AuthContext to determine if the user is authenticated. If the user
 * is not authenticated, it displays a message prompting them to log in.
 *
 * @param {FeedbackSectionProps} props - The properties passed to the component.
 * @returns {JSX.Element} A JSX element representing the feedback section of the blog post.
 */
function FeedbackSection({ comments, blogId, isLoggedIn }: FeedbackSectionProps): JSX.Element {
  const { isAuthenticated } = useContext(AuthContext) as AuthContextType;

  return (
    <section className="mt-12" id="feedback-section">
      <h2 className="mb-6 text-2xl font-semibold" id="feedback-title">
        Feedback
      </h2>
      <CommentSection
        isLoggedIn={isAuthenticated}
        comments={comments}
        blogId={blogId}
      />
      {!isAuthenticated && (
        <div
          className="mt-8 p-4 bg-gray-800 rounded-lg text-center"
          id="login-prompt"
        >
          <p className="mb-4">You must be logged in to leave a comment.</p>
        </div>
      )}
    </section>
  );
}

export default FeedbackSection;