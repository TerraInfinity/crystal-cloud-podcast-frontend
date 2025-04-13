/**
 * UnauthorizedAccess.tsx
 * A component to display a 401 error page.
 *
 * This component is rendered when a user attempts to access a page
 * that requires authentication but is not logged in. It provides
 * a user-friendly message prompting the user to log in.
 *
 * @returns {JSX.Element} The rendered component.
 */
import React, { type JSX } from 'react';
import Layout from '../components/common/Layout';

const UnauthorizedAccess: React.FC = (): JSX.Element => {
  return (
    <Layout title="401 - Unauthorized Access">
      <div className="text-center">
        <p id="unauthorized-access-message">You need to log in to access this page.</p>
      </div>
    </Layout>
  );
};

export default UnauthorizedAccess;