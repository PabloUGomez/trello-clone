import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/signin',
  '/signup',
  '/api/webhook',
]);

export default clerkMiddleware((auth, req) => {
  if (auth().userId && isPublicRoute(req)) {
    let path = '/select-org';
    if (auth().orgId) {
      path = `/organization/${auth().orgId}`;
    }
    const orgSelection = new URL(path, req.url).toString();
    return NextResponse.redirect(orgSelection);
  }
  if (!auth().userId && !isPublicRoute(req)) {
    return auth().redirectToSignIn();
  }
  if (auth().userId && !auth().orgId && req.nextUrl.pathname !== '/select-org') {
    const orgSelection = new URL('/select-org', req.url).toString();
    return NextResponse.redirect(orgSelection);
  }
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};