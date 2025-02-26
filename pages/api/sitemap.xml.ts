import type { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

function generateSiteMap(products: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${BASE_URL}</loc>
      </url>
      <url>
        <loc>${BASE_URL}/products</loc>
      </url>
      <url>
        <loc>${BASE_URL}/about</loc>
      </url>
      <url>
        <loc>${BASE_URL}/faq</loc>
      </url>
      ${products
        .map(({ _id }) => {
          return `
        <url>
          <loc>${`${BASE_URL}/products/${_id}`}</loc>
        </url>
      `
        })
        .join("")}
    </urlset>
  `
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const client = await clientPromise
    const db = client.db()

    const products = await db.collection("products").find({}).toArray()

    const sitemap = generateSiteMap(products)

    res.setHeader("Content-Type", "text/xml")
    res.write(sitemap)
    res.end()
  } catch (error) {
    console.error("Error generating sitemap:", error)
    res.status(500).json({ message: "Error generating sitemap" })
  }
}

