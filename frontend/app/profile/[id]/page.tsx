'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductsByUser, getStoresByUser, getUserById } from "@/api/api";

type Usuario = {
  id: number;
  name: string;
  username: string;
  email: string;
  profile_picture_url?: string | null;
};

type Produto = {
  id: number;
  name: string;
  price: number;
  stock: number;
  product_images?: { id: number; image_url: string; order: number }[];
  store: { id: number; name: string; sticker_url: string };
};

type Loja = {
  id: number;
  name: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  sticker_url?: string;
};

type Avaliacao = { id: number; titulo: string; image_url?: string };

export default function UserPage() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState<Produto[]>([]); 
  const [lojas, setlojas] = useState<Loja[]>([]);

  const avaliacoes: Avaliacao[] = [
    { id: 1, titulo: "Avaliação 1" },
    { id: 2, titulo: "Avaliação 2" },
    { id: 3, titulo: "Avaliação 3" },
  ];

  // Puxando usuário do backend
  useEffect(() => {
    if (!id) return;

  async function fetchUserAndProducts() {
    setLoading(true);
    try {
      const userData = await getUserById(Number(id));
      setUsuario(userData);

      const produtosData = await getProductsByUser(Number(id));
      setProdutos(produtosData);

      const lojasData = await getStoresByUser(Number(id));
      setlojas(lojasData);

    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setUsuario(null);
      setProdutos([]);
      setlojas([]);
    } finally {
      setLoading(false);
    }
  }

  fetchUserAndProducts();
}, [id]);

  if (loading) return <p className="text-center mt-20 text-laranja">Carregando usuário...</p>;
  if (!usuario) return <p className="text-center mt-20 text-laranja">Usuário não encontrado.</p>;

  return (
    <main className="min-h-screen bg-gray-100 pb-16">
      {/* Banner */}
      <div className="w-full h-70 bg-gray-300 relative flex items-end px-16"></div>

      {/* Perfil */}
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="absolute -top-[104px] left-24 flex flex-col items-start">
          {usuario ? (
            <img
              src={usuario.profile_picture_url && usuario.profile_picture_url.trim() !== "" 
                  ? usuario.profile_picture_url 
                  : "/default-avatar.png"}
              alt="Foto de Perfil"
              className="w-40 h-40 rounded-full object-cover"
              onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
            />
          ) : null}

          <div className="mt-1 font-sans text-left flex flex-col gap-0.5">
            <h2 className="text-3xl font-semibold text-gray-800">{usuario.name}</h2>
            <p className="text-gray-600">@{usuario.username}</p>
            <p className="text-gray-600 flex items-center gap-1">
              <svg className="h-3 w-4 translate-y-0.5" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.04074 16.3259C1.47954 16.3259 0.999283 16.1263 0.599978 15.727C0.200673 15.3277 0.000680247 14.8471 0 14.2852V2.04074C0 1.47954 0.199993 0.999283 0.599978 0.599978C0.999963 0.200673 1.48022 0.000680247 2.04074 0H18.3667C18.9279 0 19.4085 0.199992 19.8084 0.599978C20.2084 0.999963 20.4081 1.48022 20.4074 2.04074V14.2852C20.4074 14.8464 20.2078 15.327 19.8084 15.727C19.4091 16.127 18.9285 16.3266 18.3667 16.3259H2.04074ZM10.2037 9.18333L18.3667 4.08148V2.04074L10.2037 7.14259L2.04074 2.04074V4.08148L10.2037 9.18333Z" 
                  fill="currentColor"
                  fillOpacity="0.6"
                />
              </svg>

              {usuario.email}</p>
          </div>
        </div>
      </div>

      <div>
        <button className="absolute top-[300px] right-40 bg-laranja text-white px-20 py-2 rounded-full hover:brightness-90 transition hover:cursor-pointer font-sans">
          Editar Perfil
        </button>
      </div>

      {/* Produtos */}
      <div className="w-full max-w-5xl font-sans mx-auto mt-[200px] px-4">
        <h3 className="text-xl font-sans font-bold mb-4">Produtos</h3>
        <div className="flex relative font-sans gap-6 pb-4 overflow-x-auto scrollbar-hide">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className="min-w-[175px] bg-white shadow rounded-4xl p-4 h-50 flex flex-col items-center justify-center text-gray-500 transition-transform cursor-pointer"
            >
              <img
                src={produto.product_images?.[0]?.image_url}
                alt={produto.name}
                className=" h-24"
              />

              <h4 className="text-lg font-semibold text-gray-800 text-center">
                {produto.name}
              </h4>

              <p className="text-gray-800 font-semibold">
                R$ {produto.price}
              </p>

              {produto.stock > 0 ? (
                <p className="text-green-600 font-semibold text-sm">Disponível</p>
              ) : (
                <p className="text-red-600 font-semibold text-sm">Indisponível</p>
              )}

              <div className="absolute h-12 w-12 mb-32 ml-25 rounded-full bg-blue-500">
                <img
                  src={produto.store.sticker_url}
                  alt={`${produto.store.name} sticker`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Lojas */}
      <div className="w-full max-w-5xl mx-auto mt-12 px-4">
        <h3 className="text-xl font-sans font-bold mb-4">Lojas</h3>
        <div className="flex font-sans gap-6 pb-4 overflow-x-auto scrollbar-hide">
          {lojas.map((loja) => (
            <div
              key={loja.id}
              className="min-w-[400px] gap-10 bg-white shadow rounded-4xl p-4 h-40 flex items-center justify-center text-gray-800 font-semibold"
            >
              <div className="text-2xl flex flex-col items-center justify-center">
                {loja.name}
                
              </div>
              

              <div>
                <img
                  src={loja.sticker_url}
                  alt={`${loja.name} sticker`}
                  className="w-24 h-24 rounded-full object-cover ml-4"
                />
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Avaliações */}
      <div className="w-full max-w-5xl mx-auto mt-12 px-4">
        <h3 className="text-xl font-sans font-bold mb-4">Avaliações</h3>
        <div className="flex font-sans gap-6 pb-4 overflow-x-auto scrollbar-hide">
          {avaliacoes.map((avaliacao) => (
            <div
              key={avaliacao.id}
              className="min-w-[400px] bg-white shadow rounded-4xl p-4 h-40 flex items-center justify-center text-gray-500"
            >
              {avaliacao.titulo}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
