'use client';

import Link from 'next/link';
import { getProductsById, getProductsByStore } from "@/api/api";
import Navbar from "@/components/Navbar";
import Carrossel from "@/components/Carrossel";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CardProdutos from "@/components/CardProdutos";
import EditProductModal from "@/components/modals/EditProductModal";
import CarrosselVertical from "@/components/CarrosselVertical";
import ZoomableImage from "@/components/ZoomableImage";

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
  product_ratings: { rating: number, comment?: string, user?: { username: string } }[] // Adicionado user e comment
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
  const [mean, setMean] = useState(0);
  const [reviews, setReviews] = useState(0);
  const [image_number, setImage] = useState(0);
  const [isOwner, setOwner] = useState(false);
  const [allProducts, setAllProducts] = useState<Produto[]>([]);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);


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

        {/* Container 1 */}
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
              </div>
            </div>
            <div className="flex flex-row gap-4 w-full h-8">
              <div className="font-sans w-1/2 h-full flex-1"> ⭐ {mean} | {reviews} reviews </div>
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
                <button
                    className="bg-laranja text-white font-sans tracking-wider cursor-pointer py-2 px-4 rounded-full hover:brightness-92 transition duration-300"
                >
                    Avaliar Produto
                </button>
            </div>
            
            <div className=" flex-1 w-full">
                {products?.product_ratings && products.product_ratings.length > 0 ? (
                    <Carrossel>
                        {products.product_ratings.map((rating: any, index: number) => (
                            <div
                                key={index}
                                className="bg-back text-text font-sans rounded-3xl px-6 py-4 flex flex-col justify-between min-w-[300px] max-w-[400px] h-32"
                            >
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-lg">
                                        {rating.user?.username || `Cliente ${index + 1}`}
                                    </p>
                                    <div className="flex gap-1">
                                        {Array.from({ length: rating.rating }).map((_, i) => (
                                            <span key={i} className="text-laranja">★</span>
                                        ))}
                                        {Array.from({ length: 5 - rating.rating }).map((_, i) => (
                                            <span key={i} className="text-gray-400">★</span>
                                        ))}
                                    </div>
                                </div>

                                <p className="text-[14px] leading-snug mt-2 overflow-hidden max-h-12 text-ellipsis">
                                    {rating.comment || "Este cliente não deixou um comentário."}
                                </p>
                                
                            </div>
                        ))}
                    </Carrossel>
                ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-back rounded-3xl">
                        <p className="text-gray-500 font-sans text-center">
                            Este produto ainda não possui avaliações.
                        </p>
                    </div>
                )}
            </div>
        </div>

        {/* outros produtos */}
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

    </main>
  );
}