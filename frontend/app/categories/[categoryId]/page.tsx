'use client';
import { use, useEffect, useState } from 'react';
import { getProductsByCategory, getCategoryById, getProductImages } from '@/api/api';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Carrossel from '@/components/Carrossel';
import Image from "next/image";

type Product = {
    id: number;
    name: string;
};
type Category = {
    id: number;
    name: string;
}
type ProductImage = {
    order: number;
    image_url: string;
};

export default function CategoryPage() {
    const { categoryId } = useParams();
    const [CategoryProducts, setCategoryProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [ProductImages, setProductImages] = useState<Record<number, ProductImage[]>>({});
    const [subCategories, setSubCategories] = useState<Category[]>([]);

    async function fetchCategoryData(){
      const categories = await getCategoryById(categoryId);
      return categories;
    }
    async function fetchProducts() {
      const products = await getProductsByCategory(categoryId);
      return products;
    }

    useEffect(() => {
        async function loadData() {

            const categoryData = await fetchCategoryData();
            setCategory(categoryData);

            const products = await fetchProducts();
            setCategoryProducts(products);

            const imagesRecord: Record<number, ProductImage[]> = {};
            for (const product of products) {
                const images = await getProductImages(product.id);
                imagesRecord[product.id] = images;
            }
            setProductImages(imagesRecord);
        }
        loadData();
    }, []);

    return (
        <main>
            <Navbar/>
                <div className="flex justify-center items-center bg-laranja p-10 pt-25 gap-10"> 
                  <div className = "text-white font-sans font-extrabold text-4xl tracking-wider mb-6 text-end">
                    <h1>{category != null ? (category.name) : ('Carregando...')}</h1>
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
                    {category != null ? (
                    <div> 
                      <h2 className="text-laranja font-sans text-4xl ml"> SubCategorias de {category.name}</h2>
                      <div className="flex relative bg-gray-200 rounded-3xl p-5 font-sans gap-6 m-5">
                        <Carrossel> 
                        {subCategories.length > 0 ? (
                          subCategories.map((cat: any)=> (
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
                          ) 
                        )) : (<p>Não há subcategorias para {category.name}</p>)
                        }
                        </Carrossel>
                      </div>
                      <h2 className="text-laranja font-sans text-4xl ml"> Produtos de {category.name}</h2>
                      <div className="flex relative bg-gray-200 rounded-3xl p-5 font-sans gap-6 m-5">
                        <Carrossel> 
                        {CategoryProducts.length > 0 ? (
                          CategoryProducts.map((cat: any)=> (
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
                          ) 
                        )) : (<p>Não há produtos cadastrados para {category.name}</p>)
                        }
                        </Carrossel>
                      </div>
                    </div>
                    ) : ("")}
                </div>
        </main>
  );
}
