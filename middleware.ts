import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Add /podcasters as a public route
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/podcasters(.*)", // <-- Allow unauthenticated access to /podcasters
  "/podcasts(.*)",
  "/profile(.*)",
  "/discover(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
