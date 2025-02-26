import type React from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import Footer from "./Footer"
import SearchBar from "./SearchBar"
import Breadcrumbs from "./Breadcrumbs"
import BackToTop from "./BackToTop"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-500 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            E-Commerce
          </Link>
          <div className="w-1/3">
            <SearchBar />
          </div>
          <div>
            <Link href="/products" className="mr-4">
              Produtos
            </Link>
            {session ? (
              <>
                <Link href="/cart" className="mr-4">
                  Carrinho
                </Link>
                <Link href="/orders" className="mr-4">
                  Meus Pedidos
                </Link>
                <Link href="/profile" className="mr-4">
                  Perfil
                </Link>
                <button onClick={() => signOut()} className="bg-red-500 px-4 py-2 rounded">
                  Sair
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="bg-green-500 px-4 py-2 rounded">
                Entrar
              </Link>
            )}
          </div>
        </nav>
      </header>
      <Breadcrumbs />
      <main className="flex-grow container mx-auto mt-8 px-4">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default Layout

