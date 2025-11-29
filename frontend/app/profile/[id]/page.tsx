'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getUserRatings, getProductsByUser, getStoresByUser, getUserById } from "@/api/api";
import EditUserModal from "@/components/modals/EditUserModal";
import { ToastContainer } from "react-toastify";
import CreateStoreModel from "@/components/modals/CreateStoreModal";
import Carrossel from "@/components/Carrossel";
import { useRouter } from "next/navigation";
import CardProdutos from "@/components/CardProdutos";


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

type Avaliacao = {
  id: number;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  store?: {
    id: number;
    name: string;
  };
  product?: {
    id: number;
    name: string;
  };
};

export default function UserPage() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState<Produto[]>([]); 
  const [lojas, setlojas] = useState<Loja[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<{
    store_ratings: Avaliacao[];
    product_ratings: Avaliacao[];
  } | null>(null);
  const [Dono, setDono] = useState(false);

  const [mostrar, setMostrar] = useState(false);

  const [abrir, setAbrir] = useState(false);

  const router = useRouter();

  const fetchAllPageData = async () => {
    if (!id) return;

    try {
      const userData = await getUserById(Number(id));
      setUsuario(userData);

      const produtosData = await getProductsByUser(Number(id));
      setProdutos(produtosData);

      const lojasData = await getStoresByUser(Number(id));
      setlojas(lojasData); 

      const avaliacoesData = await getUserRatings(Number(id));
      setAvaliacoes({
        store_ratings: avaliacoesData.store_ratings || [],
        product_ratings: avaliacoesData.product_ratings || [],
      });

      const token = localStorage.getItem("token");
      if (token && userData) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setDono(payload.sub == userData.id)
        } catch (err) {
          console.error("Token Inválido");
          setDono(false);
        }
      }

    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setUsuario(null);
      setProdutos([]);
      setlojas([]);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchInitialData = async () => {
      setLoading(true);
      await fetchAllPageData(); 
      setLoading(false);
    };

    fetchInitialData();
  }, [id]);

  const handleStoreCreated = async () => {
    setAbrir(false);   
    await fetchAllPageData();    
  };

  if (loading) return <p className="text-center mt-20 text-laranja">Carregando usuário...</p>;
  if (!usuario) return <p className="text-center mt-20 text-laranja">Usuário não encontrado.</p>;

  return ( 

    <main className="min-h-screen bg-gray-100 pb-16">

      <Navbar />

      {/* Banner */}
      <div className="w-full h-70 bg-gray-300 relative flex items-end px-16"></div>

      {/* Perfil */}

      <div className="relative w-full max-w-5xl mx-auto">
        <div className="absolute -top-[104px] left-24 flex flex-col items-start">
          
          {usuario ? (
            <img
              src={usuario.profile_picture_url || "/default-profile.png"}
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
              {usuario.email}
            </p>
          </div>
        </div>

        {Dono && (
        <div>
          <button 
          onClick={() => setMostrar(true)}
          className="absolute top-5 flex right-20 bg-laranja text-white px-20 py-2 rounded-full hover:brightness-90 transition hover:cursor-pointer font-sans tracking-wider">
            Editar Perfil
          </button>
        </div>
      )}
      </div>
        
      {/* Produtos */}
      <div className="w-full max-w-5xl font-sans mx-auto mt-[200px] px-4">
        <div className="flex items-center justify-between w-full mb-4">
          <h3 className="text-xl font-sans font-bold">Produtos</h3>

          <div
            className="px-3 py-1 flex items-center justify-center text-laranja font-bold text-sx rounded-full hover:brightness-90 hover:cursor-pointer transition"
            onClick={() => router.push(`/ver-mais?tipo=produtos-usuario&userId=${usuario.id}`)}
          >
            Ver mais
          </div>
        </div>

        
        <div className="flex relative rounded-3xl font-sans gap-6">
          <Carrossel>
          {produtos.length > 0 ? (
            produtos.map((produto) => (
              <CardProdutos key={produto.id} produto={produto} />
            ))
          ) : (
            <p className="text-gray-500 font-sans">Este usuário ainda não possui produtos.</p>
          )}
          </Carrossel>
        </div>
      </div>

      {/* Lojas */}
      <div className="w-full max-w-5xl mx-auto mt-12 px-4">
        <div className="flex items-center justify-between w-full mb-4">
          <h3 className="text-xl font-sans font-bold">Lojas</h3>

          {Dono && (
          <div 
          className="w-8 h-8 text-center text-gray-50 font-bold text-2xl bg-laranja rounded-full hover:brightness-90 hover:cursor-pointer transition"
          onClick={() => setAbrir(true)}
          >
            +
          </div>
          )}

        </div>

        <div className="flex rounded-3xl font-sans gap-6">
          <Carrossel>
          {lojas.length > 0 ? (
            lojas.map((loja) => (
              <div
                key={loja.id}
                className="shrink-0 min-w-[400px] gap-2 bg-white shadow rounded-4xl p-4 h-40 flex items-center justify-center text-gray-800 hover:cursor-pointer font-semibold"
                onClick={() => router.push(`/store/${loja.id}`)}
              >
                <div className="text-2xl flex flex-col items-center justify-center">{loja.name}</div>
                <div>
                  <img
                    src={loja.sticker_url}
                    alt={`${loja.name} sticker`}
                    className="w-24 h-24 rounded-full object-cover ml-4"
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 font-sans">Este usuário ainda não possui lojas.</p>
          )}
          </Carrossel>
        </div>
      </div>

      {/* Avaliações */}
      <div className="w-full max-w-5xl mx-auto mt-12 px-4">
        <h3 className="text-xl font-sans font-bold mb-4">Avaliações</h3>

        {/* Avaliações de lojas */}
        <h4 className="text-lg font-semibold mt-10 mb-2">Lojas</h4>
        <div className="flex relative rounded-3xl font-sans gap-6">
          <Carrossel>
          {avaliacoes?.store_ratings?.length ? (
            avaliacoes.store_ratings.map((a) => (
              <div
                key={`store-${a.id}`}
                className="min-w-[400px] bg-white shadow rounded-4xl p-4 py-8 flex flex-col justify-between"
              >
                {/* Conteúdo do card da loja */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={usuario?.profile_picture_url || "/default-avatar.png"}
                      alt="Foto do usuário"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{usuario?.name}</p>
                      <p className="text-sm text-gray-500">@{usuario?.username}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: a.rating }).map((_, i) => (
                      <svg key={i} width="20" height="20" viewBox="0 0 29 28" fill="none">
                        <path
                          d="M13.2104 0.729361C13.5205 -0.243083 14.8964 -0.243086 15.2065 0.729358L17.8047 8.87838C17.9439 9.31482 18.3505 9.61022 18.8086 9.6077L27.3616 9.56059C28.3823 9.55497 28.8075 10.8636 27.9785 11.459L21.0312 16.4483C20.6591 16.7155 20.5038 17.1934 20.6478 17.6283L23.3356 25.7482C23.6564 26.7172 22.5432 27.526 21.7207 26.9215L14.8288 21.856C14.4597 21.5847 13.9572 21.5847 13.5881 21.856L6.69615 26.9215C5.87372 27.526 4.76052 26.7172 5.08127 25.7482L7.76912 17.6283C7.91308 17.1934 7.75777 16.7155 7.3857 16.4483L0.438419 11.459C-0.390617 10.8636 0.0345829 9.55497 1.05524 9.56059L9.60833 9.6077C10.0664 9.61022 10.473 9.31482 10.6122 8.87838L13.2104 0.729361Z"
                          fill="#FFEB3A"
                        />
                      </svg>
                    ))}
                  </div>
                </div>

                <p className="mt-2 text-gray-700">{a.comment || "Sem comentário"}</p>
                <p className="text-sm mt-1 text-gray-500">Loja: {a.store?.name}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 font-sans">Este usuário ainda não avaliou nenhuma loja.</p>
          )}
          </Carrossel>
        </div>

        {/* Avaliações de produtos */}
        <h4 className="text-lg font-semibold mb-2 mt-6">Produtos</h4>
        <div className="flex relative rounded-3xl font-sans gap-6">
          <Carrossel>
          {avaliacoes?.product_ratings?.length ? (
            avaliacoes.product_ratings.map((a) => (
              <div
                key={`product-${a.id}`}
                className="min-w-[400px] bg-white shadow rounded-4xl p-4 py-8 flex flex-col justify-between"
              >
                {/* Conteúdo do card do produto */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={usuario?.profile_picture_url || "/default-avatar.png"}
                      alt="Foto do usuário"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{usuario?.name}</p>
                      <p className="text-sm text-gray-500">@{usuario?.username}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-1.5">
                    {Array.from({ length: a.rating }).map((_, i) => (
                      <svg key={i} width="20" height="20" viewBox="0 0 29 28" fill="none">
                        <path
                          d="M13.2104 0.729361C13.5205 -0.243083 14.8964 -0.243086 15.2065 0.729358L17.8047 8.87838C17.9439 9.31482 18.3505 9.61022 18.8086 9.6077L27.3616 9.56059C28.3823 9.55497 28.8075 10.8636 27.9785 11.459L21.0312 16.4483C20.6591 16.7155 20.5038 17.1934 20.6478 17.6283L23.3356 25.7482C23.6564 26.7172 22.5432 27.526 21.7207 26.9215L14.8288 21.856C14.4597 21.5847 13.9572 21.5847 13.5881 21.856L6.69615 26.9215C5.87372 27.526 4.76052 26.7172 5.08127 25.7482L7.76912 17.6283C7.91308 17.1934 7.75777 16.7155 7.3857 16.4483L0.438419 11.459C-0.390617 10.8636 0.0345829 9.55497 1.05524 9.56059L9.60833 9.6077C10.0664 9.61022 10.473 9.31482 10.6122 8.87838L13.2104 0.729361Z"
                          fill="#FFEB3A"
                        />
                      </svg>
                    ))}
                  </div>
                </div>

                <p className="mt-2 text-gray-700">{a.comment || "Sem comentário"}</p>
                <p className="text-sm mt-1 text-gray-500">Produto: {a.product?.name}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 font-sans">Este usuário ainda não avaliou nenhum produto.</p>
          )}
          </Carrossel>
        </div>
      </div>

      <EditUserModal
      mostrar={mostrar}
      fechar={() => setMostrar(false)}
      foto={usuario.profile_picture_url}
      />      

      <CreateStoreModel
        abrir={abrir}
        fechar={() => setAbrir(false)}
        onSuccess={handleStoreCreated}
      />
  
      <ToastContainer/>
      
    </main>

  );
}