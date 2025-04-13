/**
 * NotFound.tsx
 * A component to display a 404 error page.
 *
 * This component is rendered when a user navigates to a route that does not exist.
 * It provides a user-friendly message indicating that the requested page could not be found.
 *
 * @component
 * @example
 * return (
 *   <NotFound />
 * )
 */
import React, { type JSX } from 'react';
import Layout from '../components/common/Layout'; // Import Layout component

const NotFound: React.FC = (): JSX.Element => {
  return (
    <Layout title="404 - Page Not Found">
      <div className="text-center">
        <p id="not-found-message">The page you are looking for does not exist.</p>
      </div>
    </Layout>
  );
};

export default NotFound;