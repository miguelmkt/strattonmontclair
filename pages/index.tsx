"use client"

import Layout from "@/components/Layout"
import Link from "next/link"
import { useEffect, useState } from "react"
import Newsletter from "@/components/Newsletter"

interface Product {
  _id: string
  name: string
  price: number
  imageUrl: string
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch("/api/products?featured=true")
      .then((res) => res.json())
      .then((data) => setFeaturedProducts(data.slice(0, 4)))
      .catch((err) => console.error("Error fetching featured products:", err))
  }, [])

  return (
    <Layout>
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo à nossa Loja Online</h1>
        <p className="text-xl mb-8">Descubra produtos incríveis a preços imbatíveis!</p>
        <Link
          href="/products"
          className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors"
        >
          Ver Todos os Produtos
        </Link>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Produtos em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product._id} className="border rounded-lg p-4 shadow-md">
              <img
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">R$ {product.price.toFixed(2)}</p>
              <Link href={`/products/${product._id}`} className="text-blue-500 hover:underline">
                Ver Detalhes
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Newsletter />
    </Layout>
  )
}

