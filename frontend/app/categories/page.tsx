'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Carrossel from "@/components/Carrossel";
import CardProdutos from "@/components/CardProdutos";
import CardCategorias from "@/components/CardCategorias";
import { getProductsByCategory, getAllParentCategories } from "@/api/api";

type Produto = {
  id: number;
  name: string;
  category_id: number;
  store_id: number;
  description: string;
  price: number;
  stock: number;
  product_images?: { id: number; image_url: string; order: number }[];
  store: { id: number; name: string; sticker_url: string };
};

type Category = {
  id: number;
  name: string;
  parent_category_id?: number;
};


export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Produto[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const cats = await getAllParentCategories();
        setCategories(cats);

        const productPromises = cats.map((category: Category) =>
          getProductsByCategory(category.id)
        );

        const allProductLists = await Promise.all(productPromises);

        const shuffledLists = allProductLists.map((productList) =>
          [...productList].sort(() => 0.5 - Math.random())
        );

        setCategoryProducts(shuffledLists);
      } catch (error) {
        console.error("Failed to fetch page data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-back flex items-center justify-center text-laranja font-bold">Carregando...</div>;
  }

  return (
    <main className='min-h-screen bg-back text-text flex flex-col pb-20'>
      <Navbar />

      <div className="bg-laranja w-full mt-16">
        <div className="container mx-auto px-6 py-10 md:pt-24 md:pb-16 flex flex-col gap-8">
          
          <h1 className="text-white font-sans font-extrabold text-3xl md:text-4xl tracking-wide">
            Todas as Categorias
          </h1>
          
          <div className="relative w-full flex justify-center">
            <Carrossel>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <Link key={cat.id} href={`/category/${cat.id}`} className="block">
                    <div className="transform hover:-translate-y-1 transition-transform duration-300">
                      <CardCategorias name={cat.name} />
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-white/80">Categorias não encontradas.</p>
              )}
            </Carrossel>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 flex flex-col gap-16">
        {categories.map((category, index) => {
          const productList = categoryProducts[index] || [];

          if (productList.length === 0) return null;

          return (
            <div key={category.id} className="flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                  <h2 className="text-text font-sans font-bold text-3xl">
                  Produtos
                  </h2>
                  <span className="text-xl text-gray-500 font-normal">
                    em <Link href={`/category/${category.id}`} className="text-laranja font-bold hover:underline">{category.name}</Link>
                  </span>
                </div>

                <Link 
                  href={`/category/${category.id}`}
                  className="text-laranja font-bold font-sans text-sm hover:underline cursor-pointer transition-colors self-start md:self-auto"
                >
                  Ver todos
                </Link>
              </div>

              <div className="relative">
                <Carrossel>
                  {productList.map((p) => (
                    <Link
                      key={p.id}
                      href={`/product/${p.id}`}
                      className="block h-full transform hover:-translate-y-1 transition-transform duration-300"
                    >
                      <CardProdutos produto={p} />
                    </Link>
                  ))}
                </Carrossel>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}