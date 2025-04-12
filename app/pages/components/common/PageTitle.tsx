/**
 * PageTitle.tsx
 * A React component for displaying a page title with customizable styles.
 *
 * This component renders an h1 element that displays the provided title prop.
 * It is designed to be used in various parts of the application where a page title is needed.
 *
 * @component
 * @param props - The properties passed to the component.
 * @param props.title - The title to be displayed in the header.
 * @returns A styled header element containing the page title.
 */
import React from 'react';

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <h1 id="page-title" className="px-0 py-10 text-5xl text-center text-white">
      {title}
    </h1>
  );
};

export default PageTitle;