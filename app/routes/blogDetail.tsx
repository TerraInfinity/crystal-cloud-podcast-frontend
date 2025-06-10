//app\routes\BlogDetailPage.tsx
import type { Route } from "./+types/blogDetail";
import { BlogDetailPage } from "../pages/BlogDetailPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Crystal Cloud Podcast" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function BlogDetail() {
  return <BlogDetailPage />;
}
