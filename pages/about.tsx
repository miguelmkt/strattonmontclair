import Layout from "@/components/Layout"

export default function About() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sobre Nós</h1>
        <p className="mb-4">
          Bem-vindo à nossa loja online! Somos uma empresa dedicada a fornecer produtos de alta qualidade a preços
          acessíveis para nossos clientes.
        </p>
        <p className="mb-4">
          Nossa missão é simplificar o processo de compra online, oferecendo uma experiência de usuário excepcional e um
          atendimento ao cliente de primeira classe.
        </p>
        <p className="mb-4">
          Fundada em 2024, nossa equipe trabalha incansavelmente para trazer as últimas tendências e os melhores
          produtos diretamente para você.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Nossos Valores</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Qualidade em primeiro lugar</li>
          <li>Satisfação do cliente garantida</li>
          <li>Inovação constante</li>
          <li>Responsabilidade social e ambiental</li>
        </ul>
        <p>Agradecemos por escolher nossa loja. Estamos ansiosos para atendê-lo e superar suas expectativas!</p>
      </div>
    </Layout>
  )
}

