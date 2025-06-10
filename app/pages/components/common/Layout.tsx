/**
 * Layout.tsx
 * A component that serves as a wrapper for the main content of the page.
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import Header from './Header'; 
import Footer from './Footer';
import AdBanner from './AdBanner';
import PageTitle from './PageTitle';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  id?: string;
}

const Layout: React.FC<LayoutProps> = ({ title, children, id }) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Welcome to Crystal Cloud Podcast" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content="Ethical Cyber Bimbo Brainwashing and Yogic Gamification Wisdumb Experiences." />
        <meta property="og:image" content="https://crystalcloudpodcast.terrainfinity.ca/assets/images/logo.png" />
        <meta property="og:image:alt" content="Crystal Cloud Podcast logo" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:url" content="https://crystalcloudpodcast.terrainfinity.ca" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Crystal Cloud Podcast" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content="Ethical Cyber Bimbo Brainwashing and Yogic Gamification Wisdumb Experiences." />
        <meta name="twitter:image" content="https://crystalcloudpodcast.terrainfinity.ca/assets/images/logo.png" />
        <meta name="twitter:site" content="@CrystalCloudPod" /> 
      </Helmet>
      <div className="min-h-screen bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <Header />
        {/* <PageTitle title={title} /> */}
        <main id={id || "main-content"} className="max-w-full overflow-x-hidden">{children}</main>
        <AdBanner />
        <Footer className="max-w-full" />
      </div>
    </>
  );
};

export default Layout;