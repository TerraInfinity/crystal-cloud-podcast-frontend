// app/routes/blogDetail.tsx
import type { Route } from "./+types/blogDetail";
import { BlogDetailPage } from "../pages/BlogDetailPage";
import { json, type LoaderFunction } from "@remix-run/node";

interface Blog {
  id: string;
  title: string;
  blogSummary?: string; // Match BlogDetailPage.tsx
}

export const loader: LoaderFunction = async ({ params }) => {
  const blogId = params.id || ""; // Assuming route like /blog/:id
  // Replace with your actual data fetching (e.g., via api/proxy.ts or /api/blogs/${id})
  const blog: Blog = {
    id: blogId,
    title: "Sample Blog Post",
    blogSummary: "A deep dive into yogic gamification and cyber wisdom.",
  };
  return json({ blog });
};

export function meta({ data }: Route.MetaArgs) {
  const blog = data && "blog" in data ? (data as { blog: Blog }).blog : undefined;
  return [
    { title: blog?.title || "Crystal Cloud Podcast" },
    { name: "description", content: blog?.blogSummary || "Ethical Cyber Bimbo Brainwashing and Yogic Gamification Wisdumb Experiences." },
    { property: "og:image", content: "https://crystalcloudpodcast.terrainfinity.ca/assets/images/logo.png" },
    { property: "og:description", content: blog?.blogSummary || "Ethical Cyber Bimbo Brainwashing and Yogic Gamification Wisdumb Experiences." },
  ];
}

export default function BlogDetail() {
  return <BlogDetailPage />;
}