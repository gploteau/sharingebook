import {withAuth} from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized({req, token}) {
            if (req.nextUrl.pathname.startsWith("/admin/") || req.nextUrl.pathname.startsWith("/api/admin/")) {
                return token?.userRole === "admin"
            }
            return !!token
        },
    },
})

export const config = {matcher: ["/api/admin/:path*", "/admin/:path*", "/me"]}
