import {withAuth} from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized({req, token}) {
            // `/admin` requires admin role
            if (req.nextUrl.pathname.startsWith("/admin/") || req.nextUrl.pathname.startsWith("/api/admin/")) {
                return token?.userRole === "admin"
            }
            // `/me` only requires the user to be logged in
            return !!token
        },
    },
})

export const config = {matcher: ["/api/admin/:path*", "/admin/:path*", "/me"]}
