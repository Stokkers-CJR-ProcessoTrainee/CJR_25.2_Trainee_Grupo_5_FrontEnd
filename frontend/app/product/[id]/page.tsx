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
import { FaStar } from 'react-icons/fa';
import { CreateProductRatingModal } from '@/components/modals/RateModal/RateProduct';

interface Products {
  id: number,
  store_id: number,
  category_id: number,
  name: string,
  description?: string,
  price: number,
  stock: number,
  store: { sticker_url: string, user_id: number },
  category: { name: string },
  product_images: { order: number, image_url: string }[],
  product_ratings: {id: number, rating: number, comment?: string, user?: { username: string, profile_picture_url?: string } }[] // Adicionado user, comment e profile_picture_url
}

type Produto = {
  id: number;
  name: string;
  category_id: number,
  store_id: number,
  description: string,
  price: number;
  stock: number;
  product_images?: { id: number; image_url: string; order: number }[];
  store: { id: number; name: string; sticker_url: string };
};

export default function ProductPage() {
  const [products, setProducts] = useState<Products | null>(null);
  const { id } = useParams();
  const router = useRouter();
  const [mean, setMean] = useState(0);
  const [reviews, setReviews] = useState(0);
  const [image_number, setImage] = useState(0);
  const [isOwner, setOwner] = useState(false);
  const [allProducts, setAllProducts] = useState<Produto[]>([]);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isRatingProductModalOpen, setIsRatingProductModalOpen] = useState(false);


  async function fetchProduct() {
    try {
      const product = await getProductsById(Number(id));
      const allProducts = await getProductsByStore(product?.store_id);
      const filteredProducts = allProducts.filter((item: any) => item.id !== product.id);
      const shuffledProducts = filteredProducts.sort(() => 0.5 - Math.random());
      setProducts(product);
      setAllProducts(shuffledProducts);

      if (product) {
        const ratings = product?.product_ratings || [];

        if (ratings.length > 0) {
          const sum = ratings.reduce((acc: number, r: any) => acc + r.rating, 0);
          const mean = sum / ratings.length;

          setMean(mean);
          setReviews(ratings.length);
        } else {
          setMean(0);
          setReviews(0);
        }
      }

      const token = localStorage.getItem("token");
      if (token) {
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

  return (
    <main>

      <Navbar />

      <div className="mt-18">

        {/* Container 1: Imagens e Informações do Produto */}
        <div className="flex flex-row p-4 gap-4 bg-back text-text">

          {/*Espaco temporario*/}
          <div className="w-1/8"></div>

          {/* fotos */}
          <div className="flex flex-row w-4/8 h-150 p-4 gap-4">
            <div className="flex flex-col gap-4 h-full w-4/16">

              <CarrosselVertical className="h-full">
                {products?.product_images?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-2xl hover:brightness-90 hover:cursor-pointer transition w-full shrink-0 snap-start"
                    onClick={() => setImage(index)}
                  >
                    <img
                      src={item?.image_url}
                      alt={`Product thumbnail ${index}`}
                      className={`rounded-2xl w-full object-cover ${image_number === index ? 'border-3 border-laranja' : 'border-2 border-transparent'
                        }`}
                    />
                  </div>
                ))}
              </CarrosselVertical>

            </div>
            <div className="relative h-full w-3/4">  <ZoomableImage src={products?.product_images?.[image_number]?.image_url} alt="" className="bg-card rounded-2xl" />
              <div className="absolute h-20 w-20 bottom-119 right-3 rounded-full">
                <Link
                  key={products?.store_id}
                  href={`/store/${products?.store_id}`}
                  className="block h-full"
                >
                  <img
                    src={products?.store?.sticker_url}
                    alt=""
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* infos */}
          <div className="flex flex-col p-4 gap-4 w-3/8 h-150">
            <div className="flex flex-row gap-4 w-full h-12">
              <div className="font-sans font-bold capitalize text-3xl w-full h-full"> {products?.name} </div>
              <div className=" h-full aspect-square p-1">
                {isOwner && (
                  <div
                    className="w-10 h-10 flex items-center justify-center bg-laranja rounded-full hover:brightness-90 hover:cursor-pointer transition"
                    onClick={() => setIsEditProductModalOpen(true)}
                  >
                    <svg
                      width="45"
                      height="45"
                      viewBox="0 0 45 45"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M33.177 15.7122C33.7745 15.1148 34.1102 14.3046 34.1103 13.4597C34.1105 12.6148 33.7749 11.8044 33.1775 11.2069C32.5802 10.6094 31.7699 10.2737 30.925 10.2736C30.0801 10.2735 29.2698 10.609 28.6723 11.2064L13.5895 26.2926C13.3271 26.5542 13.133 26.8763 13.0244 27.2306L11.5315 32.1489C11.5023 32.2467 11.5001 32.3505 11.5251 32.4494C11.5501 32.5483 11.6014 32.6385 11.6736 32.7106C11.7458 32.7827 11.8362 32.8339 11.9351 32.8587C12.034 32.8836 12.1379 32.8812 12.2355 32.8519L17.155 31.3601C17.509 31.2524 17.8311 31.0596 18.093 30.7984L33.177 15.7122Z"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
                <div
                    className="w-10 h-10 mt-4 flex items-center justify-center bg-laranja rounded-full text-white hover:brightness-90 hover:cursor-pointer transition"
                    onClick={() => setIsRatingProductModalOpen(true)}
                  >
                    <FaStar
                    size={25}
                    />
                  </div>
              </div>
            </div>
            <div className="flex flex-row gap-4 w-full h-8">
              <div className="font-sans w-1/2 h-full flex-1"> ⭐ {mean.toFixed(1)} | {reviews} reviews </div>
              <div className="font-sans font-bold text-laranja h-full w-1/4"> {products?.category?.name} </div>
              <div className="font-sans font-bold text-laranja h-full w-1/4"> {products?.stock} disponiveis </div>
            </div>
            <div className="font-sans font-bold text-5xl h-16 w-40"> R${products?.price} </div>
            <div className="flex-1 w-full">
              <h1 className="font-sans text-xl font-bold mb-5"> Descricao </h1>
              <p className="font-sans"> {products?.description} </p>
            </div>
          </div>
        </div>

        {/* Carrossel de Avaliações do Produto */}
        <div className="flex flex-col p-4 gap-4 bg-back text-text pb-20">
            <div className="flex justify-between items-center h-12">
                <div className="font-sans text-xl font-bold">
                    Avaliações de Clientes ({reviews})
                </div>
            </div>

            <div className="flex-1 w-full px-10">
              <Carrossel>
                {products?.product_ratings && products.product_ratings.length > 0 ? (
                  products.product_ratings.map((r, index) => (
                    <div
                      key={index} 
                      className="bg-card text-text font-sans rounded-3xl px-6 py-4 flex items-center gap-5 min-w-[600px] max-w-[750px] shadow-lg"
                    >
                      {/* imagem do usuário */}
                      <img
                        src={r.user?.profile_picture_url || "/default-avatar.png"} 
                        alt={r.user?.username || "Usuário"}
                        className="w-24 h-24 rounded-full object-cover shrink-0 border-2 border-laranja"
                      />

                      {/* conteúdo do comentário */}
                      <div className="flex flex-col justify-between w-full">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-lg ">{r.user?.username || "Usuário Anônimo"}</p>
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
                                  fill="#cfcfcfff"
                                />
                              </svg>
                            ))}
                          </div>
                        </div>

                        <p className=" text-[15px] leading-snug mt-2">
                          {r.comment || "*Sem comentário fornecido*"}
                        </p>

                        <div className="flex justify-end">
                          <button
                            className="w-14 text-sm text-laranja font-medium mt-2 cursor-pointer"
                            onClick={() => router.push(`/rating/product/${r.id}`)}
                          >
                            ver mais
                          </button>
                        </div>

                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-10 flex items-center justify-center">
                    <p className="text-gray-500 opacity-60 font-sans text-center">
                      Este produto ainda não foi avaliado.
                    </p>
                  </div>
                )}
              </Carrossel>
            </div>
        </div>

        {/* Produtos da mesma loja */}
        <div className="flex flex-col p-4 gap-4 bg-back text-text h-96">
          <div className="font-sans text-3xl font-bold h-12 w-70"> Da mesma loja </div>
          <div className=" flex-1 w-full">
            <Carrossel>
              {allProducts.length > 0 ? (
                allProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="block h-full"
                  >
                    <CardProdutos key={p.id} produto={p} />
                  </Link>
                ))
              ) : (
                <p> produtos nao encontrados </p>
              )}
            </Carrossel>
          </div>
        </div>
      </div>

      {isEditProductModalOpen && (
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
            fetchProduct(); // Recarregar avaliações após fechar o modal, caso o usuário tenha avaliado
          }}
          productId={Number(id)}
        />
      )}

    </main>
  );
}