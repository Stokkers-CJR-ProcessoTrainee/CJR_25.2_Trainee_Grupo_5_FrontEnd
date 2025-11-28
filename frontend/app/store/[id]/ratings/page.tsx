'use client';

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar"
import { useParams, useRouter } from "next/navigation";
import { getStoreById, getStoreRatingByStore } from "@/api/api";
import UpdateStoreModal from "@/components/modals/UpdateStoreModal";
import CreateProductModal from "@/components/modals/CreateProductModal"; // 1. Restaurado
import { CreateStoreRatingModal } from "@/components/modals/RateModal/RateStore";

export default function StoreRatingsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [store, setStore] = useState<any>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [Dono, setDono] = useState(false);
  const [abrir, setAbrir] = useState(false);
  const [mediaRating, setMediaRating] = useState(0);
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  async function fetchStore() {
      try {
        const res = await getStoreById(id);
        if (!res) {
          setStore(null);
          return;
        }
        setStore(res);

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setDono(payload.sub == res.user_id);
            setIsLogged(true);
          } catch (err) {
            console.error("Token inválido", err);
            setDono(false)
            setIsLogged(false);
          }
        } else {
          setIsLogged(false);
        }
      } catch (err) {
        console.error("Erro ao carregar loja:", err);
        setStore(null);
    }
  }

  async function fetchRatings() {
      try {
        const res = await getStoreRatingByStore(id);
        setRatings(res);

        if (res.length > 0) {
          const media = (res.reduce((acc: number, r: any) => acc + r.rating, 0)) / res.length;
          setMediaRating(media);
        } else {
          setMediaRating(0);
        }

      } catch (err) {
        console.error("Erro ao carregar avaliações:", err);
      }
    }

  useEffect(() => {
    if (id) {
      fetchStore();
      fetchRatings();
    }
  }, [id]);

  if (!store) return <p className="text-center font-sans font-bold mt-20 text-laranja">Loja não encontrada.</p>;

  return (
    <main className="min-h-screen bg-gray-100 pb-16">

      <Navbar />

      {/* --- BANNER --- */}
      <div className="relative bg-cinza overflow-hidden w-auto h-110">
        {store?.banner_url ? (
          <img
            src={store.banner_url}
            alt="Banner da loja"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center"></div>
        )}

        <div className="absolute inset-0 bg-linear-to-b from-black/60 to-transparent pointer-events-none"></div>

        <div className="absolute inset-0 flex mt-10 items-center justify-center z-10 pointer-events-none">
          <h2 className="text-white text-6xl font-bold font-sans tracking-wider text-center">
            {store?.name}
          </h2>
        </div>

        <div className="absolute bottom-4 right-6 z-10">
          <p className="text-white text-sm font-sans font-light italic drop-shadow-md opacity-90">
            by {store?.owner?.name || "Nome do Dono"}
          </p>
        </div>

        {Dono && (
          <div className="flex flex-col gap-4 absolute z-10 top-28 right-10">
            <button
              className="hover:cursor-pointer"
              onClick={() => setAbrir(true)}
            >
              <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="22.5" cy="22.5" r="22.5" fill="#FF9933" />
                <path d="M33.177 15.7122C33.7745 15.1148 34.1102 14.3046 34.1103 13.4597C34.1105 12.6148 33.7749 11.8044 33.1775 11.2069C32.5802 10.6094 31.7699 10.2737 30.925 10.2736C30.0801 10.2735 29.2698 10.609 28.6723 11.2064L13.5895 26.2926C13.3271 26.5542 13.133 26.8763 13.0244 27.2306L11.5315 32.1489C11.5023 32.2467 11.5001 32.3505 11.5251 32.4494C11.5501 32.5483 11.6014 32.6385 11.6736 32.7106C11.7458 32.7827 11.8362 32.8339 11.9351 32.8587C12.034 32.8836 12.1379 32.8812 12.2355 32.8519L17.155 31.3601C17.509 31.2524 17.8311 31.0596 18.093 30.7984L33.177 15.7122Z" stroke="white" strokeWidth="2.26027" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              className="hover:cursor-pointer w-11 h-11 text-center text-white font-bold text-3xl bg-laranja rounded-full hover:brightness-90 transition"
              onClick={() => setIsCreateProductModalOpen(true)}
            >
              <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="22.5" cy="22.5" r="22.5" fill="#FF9933"/>
              <path d="M6.86328 21.8179H37.3718" stroke="white" strokeWidth="3.14479"/>
              <path d="M22.5801 6.10144V36.6099" stroke="white" strokeWidth="3.14479"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="relative bg-gray-100 flex flex-col items-center">
        <img
          src={store.sticker_url}
          alt={`${store.name} sticker`}
          className="absolute top-0 w-46 h-46 rounded-full object-cover -translate-y-1/2"
        />

        <p className="text-laranja text-center font-sans font-semibold text-3xl mt-30">
          Todas as Reviews
        </p>

        <p className="text-center text-5xl font-sans font-semibold text-laranja mt-2 mb-10">
          {mediaRating.toFixed(1)}
        </p>

        {!Dono && isLogged && (
          <button
            onClick={() => setIsRatingModalOpen(true)}
            className="mb-8 px-20 py-2.5 border-2 border-laranja text-laranja font-sans font-bold text-lg rounded-full hover:cursor-pointer flex items-center gap-2 hover:bg-laranja hover:text-white transition-all"
          >
            Adicionar Review
          </button>
        )}


        {/* --- LISTA DE CARDS --- */}
        <div className="flex flex-col gap-6 pb-10 items-center w-full px-4">
          {ratings.length > 0 ? (
            ratings.map((r) => (
              <div
                key={r.id}
                className="bg-amber-50 font-sans rounded-3xl px-6 py-4 flex items-center gap-5 text-gray-800 min-w-[600px] max-w-[750px] shadow-sm"
              >
                {/* imagem do usuário */}
                <img
                  src={r.user.profile_picture_url}
                  alt={r.user.username}
                  className="w-24 h-24 rounded-full object-cover shrink-0"
                />
                
                {/* conteúdo do comentário */}
                <div className="flex flex-col justify-between w-full">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-lg text-gray-900">{r.user.username}</p>
                    {/* estrelas */}
                    <div className="flex gap-1">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <svg key={i} width="20" height="20" viewBox="0 0 29 28" fill="none">
                          <path
                            d="M13.2104 0.729361C13.5205 -0.243083 14.8964 -0.243086 15.2065 0.729358L17.8047 8.87838C17.9439 9.31482 18.3505 9.61022 18.8086 9.6077L27.3616 9.56059C28.3823 9.55497 28.8075 10.8636 27.9785 11.459L21.0312 16.4483C20.6591 16.7155 20.5038 17.1934 20.6478 17.6283L23.3356 25.7482C23.6564 26.7172 22.5432 27.526 21.7207 26.9215L14.8288 21.856C14.4597 21.5847 13.9572 21.5847 13.5881 21.856L6.69615 26.9215C5.87372 27.526 4.76052 26.7172 5.08127 25.7482L7.76912 17.6283C7.91308 17.1934 7.75777 16.7155 7.3857 16.4483L0.438419 11.459C-0.390617 10.8636 0.0345829 9.55497 1.05524 9.56059L9.60833 9.6077C10.0664 9.61022 10.473 9.31482 10.6122 8.87838L13.2104 0.729361Z"
                            fill="#FFEB3A"
                          />
                        </svg>
                      ))}

                      {Array.from({ length: 5 - r.rating }).map((_, i) => (
                        <svg key={i} width="20" height="20" viewBox="0 0 29 28" fill="none">
                          <path
                            d="M13.2104 0.729361C13.5205 -0.243083 14.8964 -0.243086 15.2065 0.729358L17.8047 8.87838C17.9439 9.31482 18.3505 9.61022 18.8086 9.6077L27.3616 9.56059C28.3823 9.55497 28.8075 10.8636 27.9785 11.459L21.0312 16.4483C20.6591 16.7155 20.5038 17.1934 20.6478 17.6283L23.3356 25.7482C23.6564 26.7172 22.5432 27.526 21.7207 26.9215L14.8288 21.856C14.4597 21.5847 13.9572 21.5847 13.5881 21.856L6.69615 26.9215C5.87372 27.526 4.76052 26.7172 5.08127 25.7482L7.76912 17.6283C7.91308 17.1934 7.75777 16.7155 7.3857 16.4483L0.438419 11.459C-0.390617 10.8636 0.0345829 9.55497 1.05524 9.56059L9.60833 9.6077C10.0664 9.61022 10.473 9.31482 10.6122 8.87838L13.2104 0.729361Z"
                            fill="#FFFFFF"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-800 text-[15px] leading-snug mt-2">
                    {r.comment}
                  </p>

                  <div className="flex justify-end">
                    <button 
                      className="w-14 text-sm text-laranja font-medium mt-2 cursor-pointer"
                      onClick={() => router.push(`/rating/store/${r.id}`)}
                    >
                      ver mais
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex mt-5 items-center justify-center">
              <p className="text-gray-500 opacity-60 font-sans text-center">
                Esta loja não possui avaliações ainda.
              </p>
            </div>
          )}
        </div>
      </div>

      {store && (
        <UpdateStoreModal
          abrir={abrir}
          fechar={() => setAbrir(false)}
          store={store}
          onUpdated={fetchStore}
        />
      )}

      {isCreateProductModalOpen && (
        <CreateProductModal
          open={isCreateProductModalOpen}
          close={() => setIsCreateProductModalOpen(false)}
          onUpdated={() => { 
          }}
        />
      )}

      <CreateStoreRatingModal
        open={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        storeId={Number(id)}
        onSuccess={fetchRatings}
      />
      
    </main>
  )
}