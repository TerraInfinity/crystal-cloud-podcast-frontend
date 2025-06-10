// app/routes/landing.tsx
import type { Route } from "./+types/landing";
import { LandingPage } from "../pages/LandingPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Crystal Cloud Podcast" },
    { name: "description", content: "Ethical Cyber Bimbo Brainwashing and Yogic Gamification Wisdumb Experiences." },
    { property: "og:image", content: "https://crystalcloudpodcast.terrainfinity.ca/assets/images/logo.png" },
    { property: "og:description", content: "Ethical Cyber Bimbo Brainwashing and Yogic Gamification Wisdumb Experiences." },
  ];
}

export default function Landing() {
  return <LandingPage />;
}