"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/Layout"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

interface Order {
  _id: string
  createdAt: string
  total: number
  status: string
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      fetchOrders()
    }
  }, [session])

  const fetchOrders = async () => {
    const res = await fetch("/api/orders")
    const data = await res.json()
    setOrders(data)
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Meus Pedidos</h1>
      {orders.length === 0 ? (
        <p>Você ainda não fez nenhum pedido.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 shadow-md">
              <p>
                <strong>Pedido ID:</strong> {order._id}
              </p>
              <p>
                <strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Total:</strong> R$ {order.total.toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}

