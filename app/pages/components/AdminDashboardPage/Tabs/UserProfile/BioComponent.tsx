import React from 'react';

/**
 * BioComponent displays a user's biography.
 *
 * @param {BioComponentProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
interface BioComponentProps {
  bio?: string;
}

function BioComponent({ bio }: BioComponentProps) {
  return (
    <p id="user-bio" className="text-gray-300">
      {bio ? bio : 'No bio yet.'}
    </p>
  );
}

export default BioComponent;