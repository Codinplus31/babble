import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/",
    },
});

export const config = {
    matcher: [
        "/users/:path*",
        "/conversations/:path*",
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
