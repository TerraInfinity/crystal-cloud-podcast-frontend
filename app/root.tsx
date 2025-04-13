//app\root.tsx
import "./app.css"; // Importing global styles
import { isRouteErrorResponse, Outlet, Links, Meta, Scripts, ScrollRestoration } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import type { Route } from "./+types/root";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

console.log("Root module loaded");

// Create a QueryClient instance
const queryClient = new QueryClient();

// Define and export the links function
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

// Single Layout instance with debugging
function Layout({ children }: { children: React.ReactNode }) {
  const instanceId = useRef(Math.random().toString(36).slice(2)); // Unique ID per instance
  useEffect(() => {
    console.log(`Layout mounted (ID: ${instanceId.current})`);
    return () => console.log(`Layout unmounted (ID: ${instanceId.current})`);
  }, []);
  console.log(`Rendering Layout (ID: ${instanceId.current})`);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Single App instance
export default function App() {
  useEffect(() => {
    console.log("App mounted");
  }, []);
  console.log("Rendering App");
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

// New ErrorBoundary function
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  console.error("Error caught in ErrorBoundary:", error);
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (error instanceof Error) {
    details = error.message;
    stack = error.stack;
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