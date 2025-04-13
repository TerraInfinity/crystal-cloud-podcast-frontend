/**
 * RestrictedAccess.tsx
 * A component to display a 403 error page.
 *
 * This component is used to inform users that they do not have the necessary
 * permissions to access a specific page. It is typically rendered when a
 * user attempts to access a restricted area of the application.
 *
 * @returns {JSX.Element} The rendered 403 error page.
 */
import React, { type JSX } from 'react';
import Layout from '../components/common/Layout'; // Import Layout component

const RestrictedAccess: React.FC = (): JSX.Element => {
  return (
    <Layout title="403 - Restricted Access">
      <div className="text-center">
        <p id="restricted-access-message">You do not have permission to view this page.</p>
      </div>
    </Layout>
  );
};

export default RestrictedAccess;