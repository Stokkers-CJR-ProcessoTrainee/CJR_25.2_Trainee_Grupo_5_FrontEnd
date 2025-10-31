import Image from "next/image";

export default function UserPage() {
  return (
    <main className="min-h-screen bg-gray-200">

      <div className="w-full h-60 bg-gray-400 relative flex items-end px-16">
      </div>

      {/* perfil */}
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="absolute -top-20 left-24 flex flex-col items-start">
          {/* foto */}
          <Image
            src="/foto-de-perfil-teste.jpg"
            alt="Foto de Perfil"
            width={128}
            height={128}
            className="w-32 h-32 rounded-full"
          />

          {/* informacoes */}
          <div className="mt-3 text-left">
            <h2 className="text-2xl font-semibold text-gray-800">Nome do Usuário</h2>
            <p className="text-gray-600">@usuario</p>
            <p className="text-gray-600">email@email.teste</p>
          </div>
        </div>
      </div>

      <div>
        <button className="absolute top-65 right-40 bg-laranja text-white px-20 py-2 rounded-full hover:brightness-90 transition hover:cursor-pointer font-sans">
          Editar Perfil
        </button>
      </div>

      {/* produtos */}
      <div className="w-full max-w-5xl mx-auto mt-50 px-4">
        <h3 className="text-xl font-semibold mb-4">Produtos</h3>
        <div className="flex gap-6 pb-4">
          <div className="min-w-[175px] bg-white shadow rounded-4xl p-4 h-50  flex items-center justify-center text-gray-500">
            Produto 1
          </div>
          <div className="min-w-[175px] bg-white shadow rounded-4xl p-4 h-50  flex items-center justify-center text-gray-500">
            Produto 2
          </div>
          <div className="min-w-[175px] bg-white shadow rounded-4xl p-4 h-50  flex items-center justify-center text-gray-500">
            Produto 4
          </div>
          <div className="min-w-[175px] bg-white shadow rounded-4xl p-4 h-50  flex items-center justify-center text-gray-500">
            Produto 5
          </div>
          <div className="min-w-[175px] bg-white shadow rounded-4xl p-4 h-50  flex items-center justify-center text-gray-500">
            Produto 6
          </div>
        </div>
      </div>

      {/* lojas */}
      <div className="w-full max-w-5xl mx-auto mt-12 px-4 mb-16">
        <h3 className="text-xl font-semibold mb-4">Lojas</h3>
        <div className="flex gap-6 pb-4">
          <div className="min-w-[400px] bg-white shadow rounded-4xl p-4 h-40 flex items-center justify-center text-gray-500">
            Loja 1
          </div>
        </div>
      </div>


      {/* avaliações */}
      <div className="w-full max-w-5xl mx-auto mt-12 px-4">
        <h3 className="text-xl font-semibold mb-4">Avaliações</h3>
        <div className="flex gap-6 pb-4">
          <div className="min-w-[400px] bg-white shadow rounded-4xl p-4 h-40 flex items-center justify-center text-gray-500">
            Avaliações
          </div>
        </div>
      </div>
    </main>
  );
}
