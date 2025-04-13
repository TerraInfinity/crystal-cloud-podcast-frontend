//app\root.tsx
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router-dom";
import React, { useEffect } from "react"; // For React.ReactNode type and useEffect
import type { Route } from "./+types/root";
import "./app.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Added imports for QueryClient

// Log when the module is loaded to confirm file execution
console.log("Root module loaded");

// Create a QueryClient instance
const queryClient = new QueryClient();

// Define link preloaders for fonts
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Layout component providing HTML structure and QueryClientProvider for the app
export function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log("Layout mounted"); // Log only on mount
  }, []); // Empty dependency array ensures this runs once
  console.log("Rendering Layout"); // Log to track Layout rendering
  return (
    <html lang="en">
      {/* Meta Manages head metadata */}
      {/* Links Injects link tags from links function */}
      <head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><Meta /><Links /></head>
      <body>
        <QueryClientProvider client={queryClient}> {/* Wrap children with QueryClientProvider */}
          {children} {/* Renders child components, e.g., route components */}
        </QueryClientProvider>
        <ScrollRestoration /> {/* Restores scroll position on navigation */}
        <Scripts /> {/* Injects client-side scripts */}
      </body>
    </html>
  );
}

// Root App component that wraps Outlet with Layout
export default function App() {
  useEffect(() => {
    console.log("App mounted"); // Log only on mount
  }, []); // Empty dependency array ensures this runs once
  console.log("Rendering App"); // Log to track App rendering
  return (
    <Layout>
      <Outlet /> {/* Renders matched route components */}
    </Layout>
  );
}

// Enhanced ErrorBoundary for detailed error reporting
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  console.error("Error caught in ErrorBoundary:", error); // Log error details to console

  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    // Handle route-specific errors (e.g., 404)
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (error instanceof Error) {
    // Handle general JavaScript errors
    details = error.message;
    stack = error.stack; // Include stack trace in all environments for debugging
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}