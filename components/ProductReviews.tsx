"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"

interface Review {
  _id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
}

export default function ProductReviews({ productId, reviews: initialReviews }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const { data: session } = useSession()

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      alert("Você precisa estar logado para deixar uma avaliação.")
      return
    }

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      })
      if (res.ok) {
        const addedReview = await res.json()
        setReviews([...reviews, addedReview])
        setNewReview({ rating: 5, comment: "" })
      } else {
        throw new Error("Falha ao adicionar avaliação")
      }
    } catch (error) {
      console.error("Erro ao adicionar avaliação:", error)
      alert("Não foi possível adicionar sua avaliação. Tente novamente mais tarde.")
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Avaliações do Produto</h3>
      {reviews.map((review) => (
        <div key={review._id} className="border-b pb-4 mb-4">
          <div className="flex items-center mb-2">
            <span className="font-bold mr-2">{review.userName}</span>
            <span className="text-yellow-500">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </span>
          </div>
          <p>{review.comment}</p>
          <p className="text-sm text-gray-500 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
      {session && (
        <form onSubmit={handleSubmitReview} className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Adicionar Avaliação</h4>
          <div className="mb-4">
            <label className="block mb-1">Avaliação:</label>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: Number.parseInt(e.target.value) })}
              className="border rounded p-2 w-full"
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>
                  {num} estrelas
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Comentário:</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="border rounded p-2 w-full"
              rows={4}
              required
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Enviar Avaliação
          </button>
        </form>
      )}
    </div>
  )
}

