//app\routes\landing.tsx
import type { Route } from "./+types/landing";
import { LandingPage } from "../pages/LandingPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Crystal Cloud Podcast" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Landing() {
  return <LandingPage />;
}
