import Layout from "@/components/Layout"
import Link from "next/link"

export default function Custom404() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-8">Oops! Page not found.</p>
        <Link
          href="/"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors"
        >
          Go back to homepage
        </Link>
      </div>
    </Layout>
  )
}

