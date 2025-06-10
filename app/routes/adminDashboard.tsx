// app/routes/adminDashboard.tsx
import type { Route } from "./+types/adminDashboard";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Crystal Cloud Podcast" },
    { name: "description", content: "Ethical Cyber Bimbo Brainwashing and Yogic Gamification Wisdumb Experiences." },
    { property: "og:image", content: "https://crystalcloudpodcast.terrainfinity.ca/assets/images/logo.png" },
    { property: "og:description", content: "Ethical Cyber Bimbo Brainwashing and Yogic Gamification Wisdumb Experiences." },
  ];
}

export default function AdminDashboard() {
  return <AdminDashboardPage />;
}