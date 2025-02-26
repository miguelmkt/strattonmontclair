"use client"

import Link from "next/link"
import { useRouter } from "next/router"

export default function Breadcrumbs() {
  const router = useRouter()
  const pathSegments = router.asPath.split("/").filter((segment) => segment !== "")

  return (
    <nav className="text-sm mb-4">
      <ol className="list-none p-0 inline-flex">
        <li className="flex items-center">
          <Link href="/" className="text-blue-500 hover:underline">
            Home
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`
          const isLast = index === pathSegments.length - 1
          const name = segment.charAt(0).toUpperCase() + segment.slice(1)

          return (
            <li key={segment} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-gray-500">{name}</span>
              ) : (
                <Link href={href} className="text-blue-500 hover:underline">
                  {name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

