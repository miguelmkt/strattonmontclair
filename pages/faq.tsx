import Layout from "@/components/Layout"

export default function FAQ() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Perguntas Frequentes</h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Como faço para rastrear meu pedido?</h2>
            <p>
              Após a confirmação do envio, você receberá um e-mail com o código de rastreamento. Use esse código em
              nossa página de rastreamento ou diretamente no site da transportadora.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Qual é a política de devolução?</h2>
            <p>
              Aceitamos devoluções em até 30 dias após a compra, desde que o produto esteja em sua embalagem original e
              não tenha sido usado. Entre em contato com nosso suporte para iniciar o processo de devolução.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Vocês oferecem frete grátis?</h2>
            <p>Sim, oferecemos frete grátis para compras acima de R$ 200,00 para todo o Brasil.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Como posso entrar em contato com o suporte?</h2>
            <p>
              Você pode entrar em contato conosco através do e-mail suporte@ecommerce.com ou pelo telefone (11)
              1234-5678, de segunda a sexta, das 9h às 18h.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Quais são as formas de pagamento aceitas?</h2>
            <p>Aceitamos cartões de crédito (Visa, Mastercard, American Express), boleto bancário e PIX.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

