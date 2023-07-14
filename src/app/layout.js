import './globals.scss'
import {Montserrat} from 'next/font/google'

const inter = Montserrat({weight: ['200', '400', '700'], subsets: ['latin']})

export const metadata = {
    title: 'Open Audio Platform v1.0',
    description: 'Open Audio Platform is a free open source website for audio streaming and podcasting',
}

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body className={inter.className}>{children}</body>
        </html>
    )
}
