import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type React from "react"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  onItemClick: (href: string) => void
}

export function Breadcrumb({ items, onItemClick }: BreadcrumbProps) {
  const handleClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault()
    onItemClick(href)
  }

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />}
            <Link
              href={item.href}
              onClick={(e) => handleClick(item.href, e)}
              className={`inline-flex items-center text-sm font-medium ${
                index === items.length - 1
                  ? "text-[#00697F] hover:text-[#005A6E]"
                  : "text-gray-700 hover:text-[#DF6F2A]"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

