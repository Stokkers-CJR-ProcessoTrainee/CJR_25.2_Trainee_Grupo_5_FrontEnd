'use client';

import { getProductsById } from "@/api/api";
import Navbar from "@/components/Navbar";
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
    store: { banner_url: string },
    category: { name: string },
    product_images: {order: number, image_url: string}[]
    product_ratings: {rating: number}[]
}

export default function ProductPage() {
    const [products, setProducts]  = useState<Products | null>(null);
    const {id} = useParams();

    useEffect(() => {
        async function fetchProduct(){
            try {
                const product = await getProductsById(Number(id));
                setProducts(product)
            } catch(err){console.log(err)}
        }

        fetchProduct();

    }, [id]);
  
    return (
    <main>

        <Navbar />
        
        <div className="mt-18">

            {/* Container 1 */}
            <div className="flex flex-row p-4 gap-4 bg-amber-100">

        {/* fotos */}
        <div className="flex flex-row bg-green-300 w-5/8 h-150 p-4 gap-4">
          <div className="flex flex-col gap-4 bg-green-400 h-full flex-1">
            <div className="bg-green-500 w-full flex-1"></div>
            <div className="bg-green-500 w-full flex-1"></div>
            <div className="bg-green-500 w-full flex-1"></div>
            <div className="bg-green-500 w-full flex-1"></div>
          </div>
          <div className="bg-green-400 h-full w-142"> <img src={products?.product_images?.[0]?.image_url} alt="" /> </div>
        </div> 

        {/* infos */}
        <div className="flex flex-col p-4 gap-4 bg-red-400 w-3/8 h-150">
          <div className="bg-red-500 w-full h-12"></div>
          <div className="flex flex-row gap-4 bg-red-500 w-full h-8">
            <div className="bg-red-600 h-full flex-1"></div>
            <div className="bg-red-600 h-full flex-1"></div>
            <div className="bg-red-600 h-full flex-1"></div>
          </div>
          <div className="bg-red-500 h-16 w-40"></div>
          <div className="bg-red-500 flex-1 w-full"></div>
        </div>

      </div>

      {/* outros produtos */}
      <div className="flex flex-col p-4 gap-4 bg-amber-100 h-96">
        <div className="bg-blue-400 h-12 w-70"></div>
        <div className="bg-blue-400 flex-1 w-full"></div>
      </div>
        </div>



    </main>
  );
}