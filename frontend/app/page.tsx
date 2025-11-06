'use client'
import Image from "next/image";
import { getCategories } from "@/api/api";
import { useEffect, useState } from "react";
import { getProductsByCategory } from "@/api/api";

type Category = {
  id: number;
  name: string;
};
type Products = {
  id: number;
  name: string;
};

export default function Home() {

  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<number, Products[]>>({});


  async function fetchCategories() {
    const categories = await getCategories();
    return categories;
  }

  async function fetchProductsbyCategory(categoryId: number) {
    const products = await getProductsByCategory(categoryId);
    return products;
  }

  useEffect(() => {
  async function loadData() {
    const allCategories = await fetchCategories();
    setCategories(allCategories);

    const featuredCategories: Category[] = allCategories.slice(0, 3);

    const productsArray = await Promise.all(
      featuredCategories.map((cat: Category) => fetchProductsbyCategory(cat.id))
    );

    const mapped: Record<number, Products[]> = {};
    featuredCategories.forEach((cat, i) => {
      mapped[cat.id] = productsArray[i];
    });

    setProductsByCategory(mapped);
  }
    loadData();
  }, []); 
  
  return (
    <main>
      <div className="flex justify-center items-center bg-background min-h-screen p-10 gap-10"> 
        <div className = "text-laranja font-sans font-extrabold text-4xl tracking-wider mb-6 text-end h-32 w-196">
          <h1>Prepare-se para se despedir da desordem com o STOKKERS!</h1>
        </div>
        <div>
          <Image
            src="/images/placeholder.png"
            alt="Placeholder Image"
            width={500}
            height={300}
          />
        </div>
      </div>
      <div className="p-30">
          <form className="flex justify-end mr-10 mt-5 gap-2">
            <input type="text" placeholder="Procurar" />
            <button type="submit">Enviar</button>
          </form>
          <h2 className="text-laranja font-sans text-4xl ml">Categorias</h2>
          { <div className="flex flex-wrap gap-4 m-10">
            {categories.map((cat: any) => (
              <div
                key={cat.id}
                className="p-4 bg-gray-200 rounded-lg hover:shadow-lg transition flex flex-col items-center justify-center"
              >
                <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
                />
                {cat.name} 
              </div>
            ))}
          </div> }
          {categories.slice(0, 3).map((cat) => (
            <div key={cat.id}>
              <h2 className="text-laranja font-sans text-4xl ml">
                Produtos <span className="text-sm">em {cat.name}</span>
              </h2>
                    
              <div className="flex flex-wrap gap-4 m-10">
                {productsByCategory[cat.id]?.map((product) => (
                  <div
                    key={product.id}
                    className="inline-block mr-4 p-4 bg-gray-200 rounded-lg hover:shadow-lg transition flex flex-col items-center justify-center w-40"
                  >
                    <Image
                      src="/images/placeholder.png"
                      alt={product.name}
                      width={100}
                      height={100}
                    />
                    {product.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <h2 className="text-laranja font-sans text-4xl ml">Lojas</h2>
          { <div className="flex flex-wrap gap-4 m-10">
            {categories.map((cat: any) => (
              <div
                key={cat.id}
                className="p-4 bg-gray-200 rounded-lg hover:shadow-lg transition"
              >
                {cat.name}
              </div>
            ))}
          </div> }
      </div>
    </main>
  );
}
