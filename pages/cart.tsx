"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/Layout"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { loadStripe } from "@stripe/stripe-js"

interface CartItem {
  _id: string
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl: string
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      fetchCart()
    }
  }, [session])

  const fetchCart = async () => {
    const res = await fetch("/api/cart")
    const data = await res.json()
    setCartItems(data)
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      })
      if (res.ok) {
        fetchCart()
      } else {
        throw new Error("Falha ao atualizar a quantidade")
      }
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error)
      alert("Falha ao atualizar a quantidade")
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" })
      if (res.ok) {
        fetchCart()
      } else {
        throw new Error("Falha ao remover o item")
      }
    } catch (error) {
      console.error("Erro ao remover item:", error)
      alert("Falha ao remover o item")
    }
  }

  const checkout = async () => {
    try {
      const res = await fetch("/api/checkout", { method: "POST" })
      const { sessionId } = await res.json()
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error("Erro durante o checkout:", error)
      alert("Falha ao iniciar o checkout")
    }
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Seu Carrinho</h1>
      {cartItems.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover mr-4"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-gray-600">R$ {item.price.toFixed(2)} cada</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                  <button onClick={() => removeItem(item._id)} className="ml-4 text-red-500">
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <p className="text-xl font-bold">Total: R$ {total.toFixed(2)}</p>
            <button
              onClick={checkout}
              className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition-colors"
            >
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </Layout>
  )
}

