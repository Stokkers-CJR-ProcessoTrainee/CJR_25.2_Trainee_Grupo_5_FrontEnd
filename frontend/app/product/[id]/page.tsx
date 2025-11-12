'use client';

import { getProductsById } from "@/api/api";
import Navbar from "@/components/Navbar";
import Carrossel from "@/components/Carrossel";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Products {
  id: number,
  store_id: number,
  category_id: number,
  name: string,
  description?: string,
  price: number,
  stock: number,
  store: { banner_url: string, user_id: number },
  category: { name: string },
  product_images: { order: number, image_url: string }[]
  product_ratings: { rating: number }[]
}

export default function ProductPage() {
  const [products, setProducts] = useState<Products | null>(null);
  const { id } = useParams();
  const [mean, setMean] = useState(0)
  const [reviews, setReviews] = useState(0)
  const [image_number, setImage] = useState(1)
  const [isOwner, setOwner] = useState(false)

  useEffect(() => {

    async function fetchProduct() {
      try {
        const product = await getProductsById(Number(id));

        setProducts(product);

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

    fetchProduct();

  }, [id]);

  return (
    <main>

      <Navbar />

      <div className="mt-18">

        {/* Container 1 */}
        <div className="flex flex-row p-4 gap-4 bg-background">

          {/*Espaco temporario*/}
          <div className="w-1/8"></div>

          {/* fotos */}
          <div className="flex flex-row w-4/8 h-150 p-4 gap-4">
            <div className="flex flex-col gap-4 h-full flex-1">
              <div className="hover:brightness-90 hover:cursor-pointer transition w-full flex-1" onClick={() => setImage(0)}> <img src={products?.product_images?.[0]?.image_url} alt="" /> </div>
              <div className="hover:brightness-90 hover:cursor-pointer transition w-full flex-1" onClick={() => setImage(1)}> <img src={products?.product_images?.[1]?.image_url} alt="" /> </div>
              <div className="hover:brightness-90 hover:cursor-pointer transition w-full flex-1" onClick={() => setImage(2)}> <img src={products?.product_images?.[2]?.image_url} alt="" /> </div>
              <div className="hover:brightness-90 hover:cursor-pointer transition w-full flex-1" onClick={() => setImage(3)}> <img src={products?.product_images?.[3]?.image_url} alt="" /> </div>
            </div>
            <div className="h-full w-142">  <img src={products?.product_images?.[image_number]?.image_url} alt="" /> </div>
          </div>

          {/* infos */}
          <div className="flex flex-col p-4 gap-4 w-3/8 h-150">
            <div className="flex flex-row gap-4 w-full h-12">
              <div className="font-sans font-bold capitalize text-3xl w-full h-full"> {products?.name} </div>
              <div className=" h-full aspect-square p-1">
                {isOwner && (
                  <div className="w-10 h-10 text-center bg-laranja rounded-full hover:brightness-90 hover:cursor-pointer transition p-2"> ✏️ </div>
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
              <h1 className="font-sans text-xl font-bold"> Descricao </h1>
              <p className="font-sans"> {products?.description} </p>
            </div>
          </div>
        </div>

        {/* outros produtos */}
        <div className="flex flex-col p-4 gap-4 bg-background h-96">
          <div className="font-sans text-3xl font-bold bg-blue-400 h-12 w-70"> Da mesma loja </div>
          <div className="bg-blue-400 flex-1 w-full"></div>
        </div>
      </div>

    </main>
  );
}
