//app\routes\home.tsx
import type { Route } from "./+types/home";
import { HomePage } from "../pages/HomePage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Crystal Cloud Podcast" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <HomePage />;
}
