import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Sobre Nós</h3>
            <p className="text-gray-300">
              Somos uma loja online dedicada a oferecer os melhores produtos com preços competitivos.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="hover:text-blue-400">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-blue-400">
                  Carrinho
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-blue-400">
                  Minha Conta
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-400">
                  Termos e Condições
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <p className="text-gray-300">Email: contato@ecommerce.com</p>
            <p className="text-gray-300">Telefone: (11) 1234-5678</p>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>&copy; 2024 E-Commerce. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

