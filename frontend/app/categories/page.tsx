'use client';

import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Carrossel from "@/components/Carrossel";
import CardProdutos from "@/components/CardProdutos";
import { useEffect, useState } from "react";
import { getProductsByCategory, getAllParentCategories } from "@/api/api";

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

type Category = {
  id: number,
  name: string,
  parent_category_id?: number
}

export default function CategoriesPage() {
  const [Categories, setCategories] = useState<Category[]>([]);
  const [CategoryProducts, setCategoryProducts] = useState<Produto[][]>([]);

  useEffect(() => {

    async function fetchProduct() {

      try {
        const categories = await getAllParentCategories();
        setCategories(categories);

        const productPromises = categories.map((category: Category) =>
          getProductsByCategory(category.id)
        );

        const allProductLists = await Promise.all(productPromises);

        const shuffledLists = allProductLists.map((productList) =>
          [...productList].sort(() => 0.5 - Math.random())
        );

        setCategoryProducts(shuffledLists);

      } catch (error) {
        console.error("Failed to fetch page data:", error);
      }
    }

    fetchProduct();
  }, []);

  return (
    <main className='min-h-screen bg-back text-text '>

      <Navbar />

      <div className="mt-18 ">

        <div className="flex flex-col gap-6 bg-laranja w-full h-80 p-15">
          <div className="font-sans font-bold text-3xl text-white"> <h1> Categorias </h1> </div>
          <div className="flex-1 w-full">
            <Carrossel>
              {Categories.map((c) => {

                return (
                  <div key={c.id}>
                    <div className="flex flex-col aspect-square bg-background h-35 rounded-4xl hover:brightness-90 hover:cursor-pointer transition">
                      <div className="flex-1"></div>
                      <div className="font-sans font-bold text-1xl text-center h-10"> {c.name} </div>
                    </div>
                  </div>
                );
              })}
            </Carrossel>
          </div>
        </div>

        <div className="flex flex-col bg-background w-full p-15 gap-10">

          {Categories.map((category, index) => {

            const productList = CategoryProducts[index] || [];

            return (
              <div key={category.id} className="flex flex-col gap-10">
                <div className="flex flex-row">
                  <div className="flex flex-row gap-2 flex-1"> <div className="font-sans text-3xl font-bold"> {productList.length} Produtos </div> <div className="font-bold pt-3"> em </div> <div className="text-laranja font-bold pt-3"> {category.name} </div> </div>
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="block h-full"
                  >
                    <div className="w-25 text-laranja font-bold font-sans pt-3 hover:brightness-90 hover:cursor-pointer transition"> ver mais </div>
                  </Link>
                </div>
                <Carrossel>
                  {productList.length > 0 ? (
                    productList.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.id}`}
                        className="block h-full"
                      >
                        <CardProdutos key={p.id} produto={p} />
                      </Link>
                    ))
                  ) : (
                    <p> Categoria sem produtos </p>
                  )}
                </Carrossel>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
