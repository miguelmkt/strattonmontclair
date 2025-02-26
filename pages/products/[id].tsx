"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Layout from "@/components/Layout"
import { useSession } from "next-auth/react"
import ProductReviews from "@/components/ProductReviews"
import { Heart, Facebook, Twitter, Linkedin } from "lucide-react"

interface Product {
  _id: string
  name: string
  price: number
  description: string
  imageUrl: string
}

interface Review {
  _id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export default function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()
  const [isInWishlist, setIsInWishlist] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProduct()
      fetchReviews()
    }
  }, [id])

  const fetchProduct = async () => {
    const res = await fetch(`/api/products/${id}`)
    const data = await res.json()
    setProduct(data)
  }

  const fetchReviews = async () => {
    const res = await fetch(`/api/products/${id}/reviews`)
    const data = await res.json()
    setReviews(data)
  }

  const addToCart = async () => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product?._id, quantity }),
      })
      if (res.ok) {
        alert("Produto adicionado ao carrinho!")
        router.push("/cart")
      } else {
        throw new Error("Falha ao adicionar o produto ao carrinho")
      }
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error)
      alert("Falha ao adicionar o produto ao carrinho")
    }
  }

  const addToWishlist = async () => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product?._id }),
      })
      if (res.ok) {
        setIsInWishlist(true)
        alert("Product added to wishlist!")
      } else {
        throw new Error("Failed to add product to wishlist")
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      alert("Failed to add product to wishlist")
    }
  }

  if (!product)
    return (
      <Layout>
        <div>Carregando...</div>
      </Layout>
    )

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          className="w-full md:w-1/2 rounded-lg shadow-md"
        />
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Share this product:</h3>
            <div className="flex gap-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product._id}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <Facebook />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product._id}`,
                )}&text=${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600"
              >
                <Twitter />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product._id}`,
                )}&title=${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900"
              >
                <Linkedin />
              </a>
            </div>
          </div>
          <p className="text-2xl font-bold mb-6">R$ {product.price.toFixed(2)}</p>
          <div className="flex items-center mb-4">
            <label htmlFor="quantity" className="mr-2">
              Quantidade:
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
              className="border rounded p-2 w-16"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={addToCart}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={addToWishlist}
              className={`px-6 py-3 rounded-lg text-lg transition-colors ${
                isInWishlist
                  ? "bg-red-100 text-red-500 hover:bg-red-200"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Heart className={`inline-block mr-2 ${isInWishlist ? "fill-red-500" : ""}`} />
              {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
      <ProductReviews productId={product._id} reviews={reviews} />
    </Layout>
  )
}

