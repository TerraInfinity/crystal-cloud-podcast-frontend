//app\routes\login.tsx
import type { Route } from "./+types/login";
import { LoginPage } from "../pages/LoginPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Crystal Cloud Podcast" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Login() {
  return <LoginPage />;
}
