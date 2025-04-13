//app\routes.ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),       // renders at /
  route("home", "routes/home.tsx"),  // Rendered at /home
  route("login", "routes/login.tsx"),  // Rendered at /login
  route("blogDetail", "routes/blogDetail.tsx"),  // Rendered at /blogDetails
  route("adminDashboard", "routes/adminDashboard.tsx"),  // Rendered at /adminDashboard
  route("restrictedAccess", "pages/errors/RestrictedAccess.tsx"),  // Rendered at /403
  route("serverError", "pages/errors/ServerError.tsx"),  // Rendered at /500
  route("unauthorizedAccess", "pages/errors/UnauthorizedAccess.tsx"),  // Rendered at /401
  //route("*", "pages/errors/NotFound.tsx"),  // Catch-all route for non-existent pages

] satisfies RouteConfig;



