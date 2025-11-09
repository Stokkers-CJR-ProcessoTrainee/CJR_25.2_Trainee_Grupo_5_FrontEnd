'use client'
import Image from "next/image";
import { getCategories, getProductsByCategory, getProductImages, getStores } from "@/api/api";
import { useEffect, useState } from "react";
import Carrossel from "@/components/Carrossel";
import Navbar from "@/components/Navbar";
import { Store, Products, Category, ProductImage } from "./Types"

export default function Home() {

  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<number, Products[]>>({});
  const [stores, setStores] = useState<Store[]>([]);
  const [productImagesByProductByCategory, setProductImagesByProductByCategory] = useState<Record<number, Record<number, ProductImage[]>>>({});


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

    const imagesMap: Record<number, Record<number, ProductImage[]>> = {};

    for (const cat of featuredCategories) {
      imagesMap[cat.id] = {};

      for (const product of mapped[cat.id]) {
        const images = await getProductImages(product.id);
        imagesMap[cat.id][product.id] = images;
      }
    }

    setProductImagesByProductByCategory(imagesMap);
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
                  productsByCategory[cat.id]?.map((product) => (
                    <div
                      key={product.id}
                      className="inline-block mr-4 p-4 bg-gray-200 rounded-lg hover:shadow-lg transition flex flex-col items-center justify-center w-40"
                    >
                      <Image
                        src={
                          productImagesByProductByCategory[cat.id]?.[product.id]?.[0]?.image_url 
                          ?? "/images/placeholder.png"
                        }
                        alt={product.name}
                        width={100}
                        height={100}
                      />
                      {product.name}
                    </div>
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
              stores.map((cat: any) => (
                <div
                  key={cat.id}
                  className="p-4 bg-gray-200 rounded-lg hover:shadow-lg transition"
                >
                  {cat.name}
                </div>
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
