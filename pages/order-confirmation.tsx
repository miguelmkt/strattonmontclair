"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Layout from "@/components/Layout"
import Link from "next/link"

export default function OrderConfirmation() {
  const router = useRouter()
  const { session_id } = router.query
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    if (session_id) {
      fetchOrderDetails()
    }
  }, [session_id])

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/orders/${session_id}`)
      const data = await res.json()
      setOrderDetails(data)
    } catch (error) {
      console.error("Erro ao buscar detalhes do pedido:", error)
    }
  }

  if (!orderDetails) {
    return (
      <Layout>
        <p>Carregando detalhes do pedido...</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Pedido Confirmado!</h1>
        <p className="text-xl mb-8">Obrigado pela sua compra.</p>
        <div className="mb-8 text-left">
          <p>
            <strong>Número do Pedido:</strong> {orderDetails._id}
          </p>
          <p>
            <strong>Total:</strong> R$ {orderDetails.total.toFixed(2)}
          </p>
          <p>
            <strong>Status:</strong> {orderDetails.status}
          </p>
        </div>
        <Link
          href="/products"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors"
        >
          Continuar Comprando
        </Link>
      </div>
    </Layout>
  )
}

