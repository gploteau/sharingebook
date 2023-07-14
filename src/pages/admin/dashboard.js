import {useState, useEffect} from "react"
import {useSession, signOut} from "next-auth/react"
import AccessDenied from "../../components/access-denied"

export default function AdminDashboard() {
    const {data: session, status} = useSession()
    const {userRole} = session ?? {userRole: null}
    const [content, setContent] = useState()

    // Fetch content from protected route
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/admin/protected")
            const json = await res.json()
            if (json.content) {
                setContent(json.content)
            }
        }
        fetchData()
    }, [session])

    // If no session exists, display access denied message
    if (!session || userRole !== "admin") {
        return (
            <div>
                <AccessDenied/>
            </div>
        )
    }

    // If session exists, display content
    return (
        <div>
            <h1>Protected Page</h1>
            <p>
                <strong>{content ?? "\u00a0"}</strong>
            </p>
            {status === "authenticated" ? <>
                <p>Signed in as {session.user.email}</p>
                <button onClick={() => signOut({redirect: false})}>Sign out</button>
            </> : null}
        </div>
    )
}
