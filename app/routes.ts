
//app\routes.ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),       // renders at /
  route("home", "routes/home.tsx"),  // Rendered at /home

] satisfies RouteConfig;



