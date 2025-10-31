import Image from "next/image";

export default function UserPage() {
  return (
    <main className="min-h-screen bg-gray-100">

      <div className="w-full h-70 bg-gray-300 relative flex items-end px-16">
      </div>

      {/* perfil */}
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="absolute -top-26 left-24 flex flex-col items-start">
          {/* foto */}
          <Image
            src="/foto-de-perfil-teste.jpg"
            alt="Foto de Perfil"
            width={128}
            height={128}
            className="w-40 h-40 rounded-full"
          />

          {/* informacoes */}
          <div className="mt-1 font-sans text-left flex flex-col gap-0.5">
            <h2 className="text-3xl font-semibold text-gray-800">Nome do Usuário</h2>
            <p className="text-gray-600">@ usuario</p>
            <p className="text-gray-600 flex items-center gap-1">
              <svg className="h-3 w-4 translate-y-0.5"  viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.04074 16.3259C1.47954 16.3259 0.999283 16.1263 0.599978 15.727C0.200673 15.3277 0.000680247 14.8471 0 14.2852V2.04074C0 1.47954 0.199993 0.999283 0.599978 0.599978C0.999963 0.200673 1.48022 0.000680247 2.04074 0H18.3667C18.9279 0 19.4085 0.199992 19.8084 0.599978C20.2084 0.999963 20.4081 1.48022 20.4074 2.04074V14.2852C20.4074 14.8464 20.2078 15.327 19.8084 15.727C19.4091 16.127 18.9285 16.3266 18.3667 16.3259H2.04074ZM10.2037 9.18333L18.3667 4.08148V2.04074L10.2037 7.14259L2.04074 2.04074V4.08148L10.2037 9.18333Z" fill="black" fillOpacity="0.6"/>
              </svg>

              email@email.teste
              </p>
          </div>
        </div>
      </div>

      <div>
        <button className="absolute top-75 right-40 bg-laranja text-white px-20 py-2 rounded-full hover:brightness-90 transition hover:cursor-pointer font-sans">
          Editar Perfil
        </button>
      </div>

      {/* produtos */}
      <div className="w-full max-w-5xl mx-auto mt-50 px-4">
        <h3 className="text-xl font-sans font-bold mb-4">Produtos</h3>
        <div className="flex font-sans gap-6 pb-4">
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
        <h3 className="text-xl font-sans font-bold mb-4">Lojas</h3>
        <div className="flex font-sans gap-6 pb-4">
          <div className="min-w-[400px] bg-white shadow rounded-4xl p-4 h-40 flex items-center justify-center text-gray-500">
            Loja 1
          </div>
        </div>
      </div>


      {/* avaliações */}
      <div className="w-full max-w-5xl mx-auto mt-12 px-4">
        <h3 className="text-xl font-sans font-bold mb-4">Avaliações</h3>
        <div className="flex font-sans gap-6 pb-4">
          <div className="min-w-[400px] bg-white shadow rounded-4xl p-4 h-40 flex items-center justify-center text-gray-500">
            Avaliações
          </div>
        </div>
      </div>
    </main>
  );
}
