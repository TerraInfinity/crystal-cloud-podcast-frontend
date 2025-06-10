//app\routes\adminDashboard.tsx
import type { Route } from "./+types/adminDashboard";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Crystal Cloud Podcast" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function AdminDashboard() {
  return <AdminDashboardPage />;
}
