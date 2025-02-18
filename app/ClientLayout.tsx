'use client'

import Link from "next/link"
import { KnownIssuesBanner } from "@/components/KnownIssuesBanner"
import { KnownIssuesManager } from "@/components/KnownIssuesManager"
import { useState, type ReactNode } from "react"

export function ClientLayout({ children }: { children: ReactNode }) {
  const [knownIssues, setKnownIssues] = useState<string[]>([])

  return (
    <div className="bg-[#EEE8E1] flex h-screen">
      <nav className="w-64 bg-[#00697F] text-white p-4 flex flex-col">
        <ul className="flex flex-col space-y-2 mt-4">
          <li>
            <Link href="/" className="block py-2 px-4 hover:bg-[#DF6F2A] rounded w-full">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/helpdesk" className="block py-2 px-4 hover:bg-[#DF6F2A] rounded w-full">
              All Tickets
            </Link>
          </li>
          <li>
            <Link href="/my-tickets" className="block py-2 px-4 hover:bg-[#DF6F2A] rounded w-full">
              My Tickets
            </Link>
          </li>
          <li>
            <Link href="/email-templates" className="block py-2 px-4 hover:bg-[#DF6F2A] rounded w-full">
              Email Templates
            </Link>
          </li>
        </ul>
        <div className="mt-auto">
          <KnownIssuesManager issues={knownIssues} onUpdateIssues={(newIssues) => setKnownIssues(newIssues)} />
        </div>
      </nav>
      <main className="flex-1 p-8 overflow-auto">
        <KnownIssuesBanner issues={knownIssues} />
        {children}
      </main>
    </div>
  )
}