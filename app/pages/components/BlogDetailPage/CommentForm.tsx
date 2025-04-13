/**
 * CommentForm component
 *
 * This component allows logged-in users to submit a comment for a blog post.
 * It includes a rating system (1 to 5 stars) and a text area for the comment content.
 *
 * @component
 * @param {CommentFormProps} props - The component props.
 * @returns {JSX.Element | null} The rendered comment form component, or null if the user is not logged in.
 *
 * @prop {boolean} isLoggedIn - Indicates if the user is logged in.
 * @prop {string} blogId - The ID of the blog post to which the comment is being submitted.
 * @prop {(comment: Comment) => void} onNewComment - Callback function to handle the new comment after submission.
 *
 * @example
 * <CommentForm isLoggedIn={true} blogId="123" onNewComment={handleNewComment} />
 */
import React, { useState, type JSX } from 'react';
import axios from 'axios';

// Define interfaces for type safety
interface Comment {
  id: string;
  content: string;
  blogId: string;
  rating?: number;
  // Add other fields as needed based on API response
}

interface CommentFormProps {
  isLoggedIn: boolean;
  blogId: string;
  onNewComment: (comment: Comment) => void;
}

function CommentForm({
  isLoggedIn,
  blogId,
  onNewComment,
}: CommentFormProps): JSX.Element | null {
  const [rating, setRating] = useState<number | null>(null); // State to hold the selected rating
  const [review, setReview] = useState<string>(''); // State to hold the review content

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); // Prevent default form submission behavior
    if (rating !== null && (rating < 1 || rating > 5)) {
      // Validate the rating
      console.error('Invalid rating. Please select a rating between 1 and 5.');
      return; // Exit if the rating is invalid
    }
    try {
      const apiPort = process.env.REACT_APP_BACKEND_PORT;
      const apiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/comments/create`;

      // Retrieve the token from local storage for authentication
      const token = localStorage.getItem('authToken'); // Adjust this line based on your implementation
      console.warn(blogId);
      // Submit the review to the API with the token in headers
      const response = await axios.post<Comment>(
        apiUrl,
        {
          content: review,
          blogId,
          ...(rating !== null && rating > 0 && { rating }), // Include rating only if it's valid
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Comment submitted:', response.data);

      // Call the onNewComment callback with the new comment data from the API response
      onNewComment(response.data);

      // Reset the form fields
      setRating(null);
      setReview('');
    } catch (error: unknown) {
      console.error('Error submitting comment:', error); // Log any errors during submission
    }
  };

  if (!isLoggedIn) {
    return null; // Do not render the form if the user is not logged in
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8" id="comment-form">
      <h3 className="mb-4 text-xl font-semibold" id="comment-form-title">
        Leave a Review
      </h3>
      <div className="mb-4">
        <label htmlFor="rating" className="block mb-2">
          Rating:
        </label>
        <div className="flex" id="rating-buttons">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)} // Set the rating when a star is clicked
              className={`text-2xl ${
                star <= (rating || 0) ? 'text-yellow-400' : 'text-gray-400'
              } focus:outline-none`}
              aria-label={`Rate ${star} stars`}
              id={`rating-star-${star}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="review" className="block mb-2">
          Your Review:
        </label>
        <textarea
          id="review"
          value={review}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setReview(e.target.value)
          } // Update review state on change
          className="w-full px-3 py-2 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          maxLength={512} // Limit the review length to 512 characters
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        id="submit-review-button"
      >
        Submit Review
      </button>
    </form>
  );
}

export default CommentForm;