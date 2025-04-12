
//app\routes.ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("home", "routes/home.tsx"),  // Rendered at /home
] satisfies RouteConfig;
