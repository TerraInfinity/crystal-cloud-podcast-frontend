/**
 * AuthorInfo.tsx
 * A React component for displaying author information, including their name,
 * publication date, and profile image.
 *
 * @param props - The properties passed to the component.
 * @param props.name - The name of the author.
 * @param props.date - The date associated with the author's work.
 * @param props.imageUrl - The URL of the author's profile image.
 * @returns The rendered author information component.
 */
import React from 'react';

interface AuthorInfoProps {
  name: string;
  date: string;
  imageUrl: string;
}

const AuthorInfo: React.FC<AuthorInfoProps> = ({ name, date, imageUrl }) => {
  return (
    <div className="flex gap-3 items-center">
      <img src={imageUrl} alt={name} className="w-8 h-8 rounded-full" />
      <div id="author-name">{name}</div>
      <div id="author-date" className="text-gray-400">{date}</div>
    </div>
  );
};

export default AuthorInfo;