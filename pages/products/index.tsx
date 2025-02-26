"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/Layout"
import Link from "next/link"
import { useRouter } from "next/router"
import Image from "next/image"

interface Product {
  _id: string
  name: string
  price: number
  description: string
  imageUrl: string
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 9
  const [categories, setCategories] = useState<string[]>([])
  const router = useRouter()
  const { category } = router.query
  const [sortBy, setSortBy] = useState("featured")

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [category, sortBy])

  const fetchCategories = async () => {
    const res = await fetch("/api/categories")
    const data = await res.json()
    setCategories(data)
  }

  const fetchProducts = async () => {
    let url = `/api/products`
    if (category) {
      url += `?category=${category}`
    }

    const res = await fetch(url)
    const data = await res.json()

    const sortedProducts = [...data]
    switch (sortBy) {
      case "price_asc":
        sortedProducts.sort((a, b) => a.price - b.price)
        break
      case "price_desc":
        sortedProducts.sort((a, b) => b.price - a.price)
        break
      case "name_asc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name_desc":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        // Featured sorting (default)
        break
    }
    setProducts(sortedProducts)
  }

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Nossos Produtos</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Categories</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/products"
            className={`px-4 py-2 rounded-full ${!category ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${cat}`}
              className={`px-4 py-2 rounded-full ${
                category === cat ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Products</h2>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded-md p-2">
          <option value="featured">Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map((product) => (
          <div key={product._id} className="border rounded-lg p-4 shadow-md">
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-lg font-bold mb-4">R$ {product.price.toFixed(2)}</p>
            <Link
              href={`/products/${product._id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Ver Detalhes
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </Layout>
  )
}

