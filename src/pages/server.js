import {authOptions} from "./api/auth/[...nextauth]"
import {useSession} from "next-auth/react"
import {getServerSession} from "next-auth/next";

export default function ServerSidePage() {
    const {data: session} = useSession()

    return (
        <div>
            <h1>Server Side Rendering</h1>
            <p>
                This page uses the <strong>getServerSession()</strong> method in{" "}
                <strong>getServerSideProps()</strong>.
            </p>
            <p>
                Using <strong>getServerSession()</strong> in{" "}
                <strong>getServerSideProps()</strong> is the recommended approach if you
                need to support Server Side Rendering with authentication.
            </p>
            <p>
                The advantage of Server Side Rendering is this page does not require
                client side JavaScript.
            </p>
            <p>
                The disadvantage of Server Side Rendering is that this page is slower to
                render.
            </p>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
    )
}

export async function getServerSideProps(context) {
    return {
        props: {
            session: await getServerSession(
                context.req,
                context.res,
                authOptions
            ),
        },
    }
}
