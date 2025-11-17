'use client'
import Image from "next/image";
import { getCategories, getProductsByCategory, getProductImages, getStores } from "@/api/api";
import { useEffect, useState } from "react";
import Carrossel from "@/components/Carrossel";
import Navbar from "@/components/Navbar";
import CardProdutos from "@/components/CardProdutos";
import { Store, Products, Category, ProductImage } from "./Types"
import CardCategorias from "@/components/CardCategorias";
import CardLojas from "@/components/CardLojas";
import Link from "next/dist/client/link";

export default function Home() {

  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<number, Products[]>>({});
  const [stores, setStores] = useState<Store[]>([]);


  async function fetchCategories() {
    const categories = await getCategories();
    return categories;
  }

  async function fetchProductsbyCategory(categoryId: number) {
    const products = await getProductsByCategory(categoryId);
    return products;
  }
  
  async function fetchStores() {
    const stores = await getStores();
    return stores;
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

    const allStores = await fetchStores();
    setStores(allStores); 
  }
    loadData();
  }, []); 
  
  return (
    <main>
      <Navbar/>
      <div className="flex justify-center items-center bg-laranja p-10 pt-25 gap-10"> 
        <div className = "text-white font-sans font-extrabold text-4xl tracking-wider mb-6 text-end h-32 w-196">
          <h1>Prepare-se para se despedir da desordem com o STOKKERS!</h1>
        </div>
        <div>
          <Image
            src="/images/ImageHome.png"
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
          { <div className="flex relative bg-gray-200 rounded-3xl p-5 font-sans gap-6 m-5"> 
              <Carrossel>
                {categories.length > 0 ? (
                  categories.map((cat: any) => (
                    <Link key={cat.id} href={`/categorie/${cat.id}`}>
                      <CardCategorias   key={cat.id} name={cat.name}/>
                    </Link>
                 ))
                ): (<p> Categorias não encontradas.</p>)
              }
              </Carrossel>
            </div>  
          }
          {categories.slice(0, 3).map((cat) => (
            <div key={cat.id}>
              <h2 className="text-laranja font-sans text-4xl ml">
                Produtos <span className="text-sm">em {cat.name}</span>
              </h2>
                    
              <div className="flex relative bg-gray-200 rounded-3xl p-5 font-sans gap-6 m-5">
                <Carrossel>
                {productsByCategory[cat.id] && productsByCategory[cat.id].length > 0 ? (
                  productsByCategory[cat.id]?.map((produto) => (
                    <Link key={produto.id} href={`/product/${produto.id}`}>
                      <CardProdutos key={produto.id} produto={produto} />
                    </Link>
                  ))
                ) : (
                  <p>Produtos não encontrados.</p>
                )
                }
                </Carrossel>
              </div>
            </div>
          ))}
          <h2 className="text-laranja font-sans text-4xl ml">Lojas</h2>
          { <div className="flex relative bg-gray-200 rounded-3xl p-5 font-sans gap-6 m-5">
            <Carrossel>
            {stores.length > 0 ? (
              stores.map((store: any) => (
                <Link key={store.id} href={`/store/${store.id}`}>
                  <CardLojas key={store.id}
                    name={store.name}
                    category={store.categoryName}
                    logoUrl={store.logo_url}
                  />
                </Link>
              ))
              ) : 
              (<p> Lojas não encontradas.</p>) 
           }
            </Carrossel>
          </div> }
      </div>
    </main>
  );
}
