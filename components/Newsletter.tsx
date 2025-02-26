"use client"

import type React from "react"

import { useState } from "react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (response.ok) {
        setMessage("Obrigado por se inscrever!")
        setEmail("")
      } else {
        throw new Error("Falha ao se inscrever")
      }
    } catch (error) {
      setMessage("Ocorreu um erro. Por favor, tente novamente.")
    }
  }

  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold mb-4 text-center">Inscreva-se em nossa Newsletter</h3>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu endereço de e-mail"
              required
              className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
            >
              Inscrever
            </button>
          </div>
          {message && <p className="mt-2 text-center">{message}</p>}
        </form>
      </div>
    </div>
  )
}

