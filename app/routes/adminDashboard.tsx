// app/routes/adminDashboard.tsx
import type { Route } from "./+types/adminDashboard";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Crystal Cloud Podcast" },
    { name: "description", content: "Ethical Cyber Bimbo Brainwashing and Yogic Gamification Wisdumb Experiences." },
    { property: "og:image", content: "https://crystalcloudpodcast.terrainfinity.ca/assets/images/logo.png" },
    { property: "og:description", content: "Ethical Cyber Bimbo Brainwashing and Yogic Gamification Wisdumb Experiences." },
    { property: "og:title", content: "Crystal Cloud Podcast" },
    { property: "og:url", content: "https://crystalcloudpodcast.terrainfinity.ca/admin" },
    { property: "og:site_name", content: "Crystal Cloud Podcast" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: "https://crystalcloudpodcast.terrainfinity.ca/assets/images/logo.png" },
    { name: "twitter:title", content: "Crystal Cloud Podcast" },
    { name: "twitter:description", content: "Ethical Cyber Bimbo Brainwashing and Yogic Gamification Wisdumb Experiences." },
  ];
}

export default function AdminDashboard() {
  return <AdminDashboardPage />;
}