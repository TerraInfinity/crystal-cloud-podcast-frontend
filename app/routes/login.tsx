// app/routes/login.tsx
import type { Route } from "./+types/login";
import { LoginPage } from "../pages/LoginPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Crystal Cloud Podcast" },
    { name: "description", content: "Ethical Cyber Bimbo Brainwashing and Yogic Gamification Wisdumb Experiences." },
    { property: "og:image", content: "https://crystalcloudpodcast.terrainfinity.ca/assets/images/logo.png" },
    { property: "og:description", content: "Ethical Cyber Bimbo Brainwashing and Yogic Gamification Wisdumb Experiences." },
  ];
}

export default function Login() {
  return <LoginPage />;
}