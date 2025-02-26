"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Layout from "@/components/Layout"
import { useRouter } from "next/router"

interface Product {
  _id: string
  name: string
  price: number
  description: string
  imageUrl: string
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({ name: "", price: 0, description: "", imageUrl: "" })
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session || session.user.role !== "admin") {
      router.push("/")
    } else {
      fetchProducts()
    }
  }, [session, router])

  const fetchProducts = async () => {
    const res = await fetch("/api/products")
    const data = await res.json()
    setProducts(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    })
    if (res.ok) {
      setNewProduct({ name: "", price: 0, description: "", imageUrl: "" })
      fetchProducts()
    }
  }

  if (!session || session.user.role !== "admin") {
    return (
      <Layout>
        <p>Acesso não autorizado</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Gerenciar Produtos</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          placeholder="Nome do produto"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Preço"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Descrição"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="URL da imagem"
          value={newProduct.imageUrl}
          onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Adicionar Produto
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p>Preço: ${product.price}</p>
            <p>{product.description}</p>
            <img
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              className="mt-2 w-full h-40 object-cover"
            />
          </div>
        ))}
      </div>
    </Layout>
  )
}

