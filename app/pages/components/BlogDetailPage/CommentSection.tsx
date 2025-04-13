/**
 * CommentSection component
 *
 * This component displays a list of comments for a specific blog post and includes a form for adding new comments.
 * It manages user authentication and prompts for login if the user is not authenticated.
 *
 * @component
 * @param {CommentSectionProps} props - The component props.
 * @returns {JSX.Element} The rendered comment section component, including the comments and the comment form if logged in.
 *
 * @prop {Comment[]} comments - The list of comments to display for the blog post.
 * @prop {string} blogId - The ID of the blog post for which comments are being displayed.
 * @prop {boolean} isLoggedIn - Indicates whether the user is currently logged in.
 */
import React, { useState, useEffect, type JSX } from 'react';
import CommentForm from './CommentForm';

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
  User?: User; // Matches the API response structure (comment.User.name)
}

interface CommentSectionProps {
  isLoggedIn: boolean;
  comments: Comment[];
  blogId: string;
}

function CommentSection({
  isLoggedIn,
  comments,
  blogId,
}: CommentSectionProps): JSX.Element {
  // State to hold the list of comments
  const [commentList, setCommentList] = useState<Comment[]>(comments || []);

  useEffect(() => {
    // Log comments when they are loaded or if no comments are found
    if (!comments || comments.length === 0) {
      console.log('No comment data found in the API response.');
    } else {
      console.log('Loaded comments:', JSON.stringify(comments));
    }
    // Sync commentList with comments prop when it changes
    setCommentList(comments || []);
  }, [comments]);

  const handleNewComment = (newComment: Comment): void => {
    // Log previous comments and the new comment being added
    console.log('Previous comments:', commentList);
    console.log('New comment being added:', newComment);

    // Add the new comment to the list (assuming API validation ensures userId)
    setCommentList((prevComments) => [...prevComments, newComment]);
  };

  return (
    <div id="comment-section">
      <h3 className="mb-4 text-xl font-semibold" id="comments-title">
        Comments
      </h3>
      <ul className="space-y-4" id="comment-list">
        {commentList.map((comment) => (
          <li
            key={comment.id}
            className="bg-gray-800 p-4 rounded-lg"
            id={`comment-${comment.id}`}
          >
            <div className="flex justify-between items-baseline mb-2">
              <strong className="text-blue-400">
                {comment.User?.name || 'Anonymous'}
              </strong>
              <span className="text-sm text-gray-400">
                {comment.date || 'Unknown date'}
              </span>
            </div>
            <p>{comment.content}</p>
            {comment.rating && comment.rating > 0 && (
              <p
                className="text-yellow-400"
                id={`comment-rating-${comment.id}`}
              >
                Rating: {'★'.repeat(comment.rating)}
                {'☆'.repeat(5 - comment.rating)}
              </p>
            )}
          </li>
        ))}
      </ul>
      {isLoggedIn && (
        <CommentForm
          isLoggedIn={isLoggedIn}
          blogId={blogId}
          onNewComment={handleNewComment}
        />
      )}
    </div>
  );
}

export default CommentSection;