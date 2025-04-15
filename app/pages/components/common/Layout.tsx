/**
 * Layout.tsx
 * A component that serves as a wrapper for the main content of the page.
 * It includes a header, a title, a main content area, an advertisement banner,
 * and a footer, providing a consistent structure across different pages.
 *
 * @param props - The properties passed to the component.
 * @param props.title - The title displayed in the PageTitle component,
 *                     which provides context for the page's content.
 * @param props.children - The content to be rendered within the main area,
 *                        allowing for flexible composition of page content.
 */
import React from 'react';
import Header from './Header'; 
import Footer from './Footer';
import AdBanner from './AdBanner';
import PageTitle from './PageTitle';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  id?: string; // Add this to allow id prop

}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
      <Header />
      {/* <PageTitle title={title} />  */}{/* Renders the PageTitle component with the provided title prop */}
      <main id="main-content" className="max-w-full overflow-x-hidden">{children}</main> {/* Main content area, prevents horizontal overflow */}
      <AdBanner />
      <Footer className="max-w-full" /> {/* Renders the Footer component, ensuring it does not exceed full width */}
    </div>
  );
};

export default Layout;