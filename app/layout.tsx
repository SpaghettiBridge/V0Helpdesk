import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "./ClientLayout"
import type { ReactNode } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Helpdesk System",
  description: "A comprehensive helpdesk system for managing support tickets",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}