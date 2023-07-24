import {SessionProvider, useSession} from "next-auth/react"
import {CookiesProvider} from "react-cookie"
import { Analytics } from '@vercel/analytics/react';

export default function App({Component, pageProps: {session, ...pageProps}}) {

    return (
        <>
            <SessionProvider session={session}>
                {Component.auth ? (
                    <CookiesProvider>
                        <Auth>
                            <Component {...pageProps} />
                        </Auth>
                    </CookiesProvider>
                ) : (
                    <Component {...pageProps} />
                )}
                <Analytics />
            </SessionProvider>
        </>
    );
}

function Auth({children}) {
    // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
    const {status, data: session} = useSession({required: true})

    if (status === "loading") {
        return <div>Loading...</div>
    }

    // À partir d'ici, l'utilisateur est authentifié
    if (session?.userRole !== "admin") {
        return (
            <div>
                <h1>Access Denied</h1>
            </div>
        )
    }
    // À partir d'ici, l'utilisateur est authentifié et a le rôle "admin"

    return children
}
