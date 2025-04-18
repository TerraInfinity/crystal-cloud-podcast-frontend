/**
 * NewsletterForm.tsx
 * A component for the newsletter subscription form.
 *
 * This component renders a form that allows users to subscribe to a newsletter
 * by entering their email address. It includes an input field for the email
 * and a submit button. The form prevents the default submission behavior to
 * allow for custom handling of the subscription logic.
 *
 * @param props - The properties passed to the component.
 * @param props.id - A unique identifier for the form, used for accessibility.
 * @returns The rendered newsletter subscription form.
 */
import React from 'react';

interface NewsletterFormProps {
  id: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ id }) => {
  return (
    <form
      id={id}
      className="flex flex-col gap-3 w-full"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
    >
      <label htmlFor={`${id}-email`} className="sr-only">Your Email</label>
      <input
        type="email"
        id={`${id}-email`}
        placeholder="Your Email"
        className="flex-1 px-4 py-2 text-white bg-gray-700 rounded border-none"
        aria-label="Your Email"
      />
      <button
        type="submit"
        id={`${id}-submit-button`}
        className="w-full px-6 py-2 text-white bg-blue-500 rounded cursor-pointer border-none"
      >
        Subscribe
      </button>
    </form>
  );
};

export default NewsletterForm;