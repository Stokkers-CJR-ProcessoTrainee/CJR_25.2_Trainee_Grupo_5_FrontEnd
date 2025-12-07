'use client';

import Link from 'next/link';
import { getProductsById, getProductsByStore } from "@/api/api";
import Navbar from "@/components/Navbar";
import Carrossel from "@/components/Carrossel";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CardProdutos from "@/components/CardProdutos";
import EditProductModal from "@/components/modals/EditProductModal";
import CarrosselVertical from "@/components/CarrosselVertical";
import ZoomableImage from "@/components/ZoomableImage";
import { CreateProductRatingModal } from '@/components/modals/RateModal/RateProduct';

// --- INTERFACES ---
interface User {
  username: string;
  profile_picture_url?: string;
}

interface Rating {
  id: number;
  rating: number;
  comment?: string;
  user?: User;
}

interface ProductImage {
  id?: number;
  order: number;
  image_url: string;
}

interface Store {
  id: number;
  name: string;
  sticker_url: string;
  user_id: number;
}

interface Category {
  name: string;
}

interface Product {
  id: number;
  store_id: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  store: Store;
  category: Category;
  product_images: ProductImage[];
  product_ratings: Rating[];
}

// --- ÍCONES ---
const StarIcon = ({ filled, size = 20, color = "#FFEB3A" }: { filled: boolean, size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 29 28" fill="none">
    <path
      d="M13.2104 0.729361C13.5205 -0.243083 14.8964 -0.243086 15.2065 0.729358L17.8047 8.87838C17.9439 9.31482 18.3505 9.61022 18.8086 9.6077L27.3616 9.56059C28.3823 9.55497 28.8075 10.8636 27.9785 11.459L21.0312 16.4483C20.6591 16.7155 20.5038 17.1934 20.6478 17.6283L23.3356 25.7482C23.6564 26.7172 22.5432 27.526 21.7207 26.9215L14.8288 21.856C14.4597 21.5847 13.9572 21.5847 13.5881 21.856L6.69615 26.9215C5.87372 27.526 4.76052 26.7172 5.08127 25.7482L7.76912 17.6283C7.91308 17.1934 7.75777 16.7155 7.3857 16.4483L0.438419 11.459C-0.390617 10.8636 0.0345829 9.55497 1.05524 9.56059L9.60833 9.6077C10.0664 9.61022 10.473 9.31482 10.6122 8.87838L13.2104 0.729361Z"
      fill={filled ? color : "#cfcfcf"}
    />
  </svg>
);

const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 45 45" fill="none">
    <path
      d="M33.177 15.7122C33.7745 15.1148 34.1102 14.3046 34.1103 13.4597C34.1105 12.6148 33.7749 11.8044 33.1775 11.2069C32.5802 10.6094 31.7699 10.2737 30.925 10.2736C30.0801 10.2735 29.2698 10.609 28.6723 11.2064L13.5895 26.2926C13.3271 26.5542 13.133 26.8763 13.0244 27.2306L11.5315 32.1489C11.5023 32.2467 11.5001 32.3505 11.5251 32.4494C11.5501 32.5483 11.6014 32.6385 11.6736 32.7106C11.7458 32.7827 11.8362 32.8339 11.9351 32.8587C12.034 32.8836 12.1379 32.8812 12.2355 32.8519L17.155 31.3601C17.509 31.2524 17.8311 31.0596 18.093 30.7984L33.177 15.7122Z"
      stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <StarIcon key={i} filled={i < rating} />
    ))}
  </div>
);

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [mean, setMean] = useState(0);
  const [reviews, setReviews] = useState(0);
  const [image_number, setImage] = useState(0);
  const [isOwner, setOwner] = useState(false);

  // Modais
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isRatingProductModalOpen, setIsRatingProductModalOpen] = useState(false);

  async function fetchProduct() {
    try {
      const product = await getProductsById(Number(id));
      const allProds = await getProductsByStore(product?.store_id);
      
      const filteredProducts = allProds.filter((item: any) => item.id !== product.id);
      const shuffledProducts = filteredProducts.sort(() => 0.5 - Math.random());

      setProducts(product);
      setAllProducts(shuffledProducts);

      if (product) {
        const ratings = product?.product_ratings || [];
        if (ratings.length > 0) {
          const sum = ratings.reduce((acc: number, r: any) => acc + r.rating, 0);
          setMean(sum / ratings.length);
          setReviews(ratings.length);
        } else {
          setMean(0);
          setReviews(0);
        }
      }

      const token = localStorage.getItem("token");
      if (token && product) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setOwner(payload.sub == product?.store?.user_id)
        } catch (err) {
          console.error("Token Inválido");
          setOwner(false);
        }
      }
    } catch (err) { console.log(err) }
  }

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!products) return <div className="min-h-screen bg-back flex items-center justify-center"><p className="text-laranja font-bold">Carregando...</p></div>;

  return (
    <main className="min-h-screen bg-back pb-20">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 max-w-7xl">
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-back text-text mb-16">
          
          <div className="flex flex-row w-full lg:w-3/5 h-[500px] gap-4">
            
            <div className="flex flex-col gap-4 h-full w-24 shrink-0">
              <CarrosselVertical className="h-full">
                {products?.product_images?.map((item, index) => (
                  <div
                    key={index}
                    className={`bg-card rounded-2xl overflow-hidden hover:brightness-90 hover:cursor-pointer transition w-full aspect-square shrink-0 snap-start border-2 ${image_number === index ? 'border-laranja' : 'border-transparent'}`}
                    onClick={() => setImage(index)}
                  >
                    <img
                      src={item?.image_url}
                      alt={`Thumbnail ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </CarrosselVertical>
            </div>

            <div className="relative flex-1 h-full bg-card rounded-3xl overflow-hidden shadow-sm">
              <ZoomableImage 
                src={products?.product_images?.[image_number]?.image_url} 
                alt={products.name} 
                className="w-full h-full object-contain" 
              />
              
              <div className="absolute bottom-4 right-4 z-10 transition-transform hover:scale-105">
                <Link href={`/store/${products?.store_id}`} title="Ir para a loja">
                  <img
                    src={products?.store?.sticker_url}
                    alt="Store Logo"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md bg-white"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full lg:w-2/5 py-2">
            
            <div className="flex justify-between items-start gap-4">
              <h1 className="font-sans font-bold capitalize text-4xl leading-tight text-text">
                {products?.name}
              </h1>
              
              <div className="flex gap-2 shrink-0">
                {isOwner && (
                  <button
                    className="w-10 h-10 flex items-center justify-center bg-laranja rounded-full hover:brightness-90 transition shadow-md"
                    onClick={() => setIsEditProductModalOpen(true)}
                    title="Editar Produto"
                  >
                    <EditIcon />
                  </button>
                )}
                <button
                  className="w-10 h-10 flex items-center justify-center bg-laranja rounded-full text-white hover:brightness-90 transition shadow-md"
                  onClick={() => setIsRatingProductModalOpen(true)}
                  title="Avaliar Produto"
                >
                  <StarIcon filled={true} size={22} color="white"/>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base border-b border-gray-200 pb-4">
              <div className="flex items-center gap-1 font-semibold text-text">
                <span>⭐</span>
                <span>{mean.toFixed(1)}</span>
                <span className="text-gray-400 font-normal">({reviews} reviews)</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="font-bold text-laranja font-sans tracking-wide hover:underline">
                  {products?.category?.name}
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="font-medium text-gray-500">
                {products?.stock} disponíveis
              </div>
            </div>

            <div>
              <span className="font-sans font-bold text-5xl text-text">
                R$ {products?.price}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="font-sans text-lg font-bold mb-2">Descrição</h3>
              <p className="font-sans text-gray-600 leading-relaxed text-justify">
                {products?.description || "Sem descrição disponível."}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sans text-2xl font-bold text-text">
              Avaliações de Clientes <span className="text-gray-400 font-normal text-lg">({reviews})</span>
            </h2>
          </div>

          <div className="relative py-2">
            <Carrossel>
              {products?.product_ratings && products.product_ratings.length > 0 ? (
                products.product_ratings.map((r, index) => (
                  <div key={index} className="bg-card border border-transparent rounded-3xl p-6 flex gap-5 w-[90vw] md:w-[600px] shadow-sm hover:shadow-md transition-all h-full">
                    
                    <img
                      src={r.user?.profile_picture_url || "/default-avatar.png"} 
                      alt={r.user?.username || "Usuário"}
                      className="w-16 h-16 rounded-full object-cover shrink-0 border border-gray-100"
                    />

                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-lg text-text truncate pr-2">
                          {r.user?.username || "Anônimo"}
                        </p>
                        <StarRating rating={r.rating} />
                      </div>

                      <p className="text-text text-sm leading-relaxed line-clamp-2 mb-2">
                        "{r.comment || "Sem comentário."}"
                      </p>

                      <div className="mt-auto flex justify-end">
                        <Link href={`/rating/product/${r.id}`} className="text-xs text-laranja font-bold hover:underline">
                          Ver mais
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full py-12 bg-back rounded-2xl flex items-center justify-center border border-dashed border-gray-300">
                  <p className="text-gray-400 font-sans">Este produto ainda não possui avaliações.</p>
                </div>
              )}
            </Carrossel>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="font-sans text-2xl font-bold mb-6 text-text">
            Mais desta loja
          </h2>
          
          <div className="relative py-2">
            <Carrossel>
              {allProducts.length > 0 ? (
                allProducts.map((p) => (
                  <Link key={p.id} href={`/product/${p.id}`} className="block h-full group">
                    <div className="transform group-hover:-translate-y-1 transition-transform duration-300">
                      <CardProdutos produto={p as any} />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="w-full py-10 text-center text-gray-400">
                  Nenhum outro produto encontrado nesta loja.
                </div>
              )}
            </Carrossel>
          </div>
        </div>

      </div>

      {isEditProductModalOpen && products && (
        <EditProductModal
          open={isEditProductModalOpen}
          close={() => setIsEditProductModalOpen(false)}
          product={products as any}
          onUpdated={fetchProduct}
        />
      )}

      {isRatingProductModalOpen && (
        <CreateProductRatingModal
          open={isRatingProductModalOpen}
          onClose={() => {
            setIsRatingProductModalOpen(false);
            fetchProduct();
          }}
          productId={Number(id)}
        />
      )}

    </main>
  );
}