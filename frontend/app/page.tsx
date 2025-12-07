'use client'
import Image from "next/image";
import { getAllParentCategories, getProductsByCategory, getStores, getChildCategories } from "@/api/api";
import { useEffect, useState } from "react";

import Carrossel from "@/components/Carrossel";
import Navbar from "@/components/Navbar";
import CardProdutos from "@/components/CardProdutos";
import CardCategorias from "@/components/CardCategorias";
import CardLojas from "@/components/CardLojas";
import Link from "next/link";

import { Store, Products, Category } from "./Types";

import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Home() {

  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<number, Products[]>>({});
  
  const [stores, setStores] = useState<Store[] | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const router = useRouter();

  async function fetchCategories() {
    return await getAllParentCategories();
  }

  async function fetchProductsbyCategory(categoryId: number) {
    return await getProductsByCategory(categoryId);
  }

  async function fetchStores() {
    return await getStores();
  }

  useEffect(() => {
    async function loadData() {
      const allCategories = await fetchCategories();
      setCategories(allCategories);

      const productsArray = await Promise.all(
        allCategories.map(async (cat: Category) => {
          try {
            const parentProducts = await fetchProductsbyCategory(cat.id);
            const subCategories = await getChildCategories(cat.id);

            let subCategoryProducts: Products[] = [];
            if (subCategories && subCategories.length > 0) {
              const subProductsPromises = subCategories.map((sub: Category) => 
                fetchProductsbyCategory(sub.id)
              );
              const subProductsArrays = await Promise.all(subProductsPromises);
              subCategoryProducts = subProductsArrays.flat();
            }

            const allProducts = [...(parentProducts || []), ...subCategoryProducts];
            
            const uniqueProducts = Array.from(new Map(allProducts.map(item => [item.id, item])).values());

            return uniqueProducts;
          } catch (error) {
            return [];
          }
        })
      );

      const mapped: Record<number, Products[]> = {};
      allCategories.forEach((cat: Category, i: number) => {
        mapped[cat.id] = productsArray[i] || []; 
      });

      setProductsByCategory(mapped);

      const allStores = await fetchStores();
      setStores(allStores || []); 
    }
    loadData();
  }, []);

  function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const filteredCategories = categories.filter((c) =>
      c.name.toLowerCase().includes(term)
    );

    const filteredProducts = Object.values(productsByCategory)
      .flat()
      .filter((p: any) => p.name.toLowerCase().includes(term));

    const filteredStores = (stores || []).filter((s) =>
      s.name.toLowerCase().includes(term)
    );

    const combined = [
      ...filteredCategories.map((c) => ({ type: "Categoria", item: c })),
      ...filteredProducts.map((p) => ({ type: "Produto", item: p })),
      ...filteredStores.map((s) => ({ type: "Loja", item: s })),
    ];

    setSearchResults(combined);
    setShowResults(true);
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar/>

      <div className="bg-laranja w-full">
        <div className="container mx-auto px-6 py-8 md:pt-24 flex flex-col-reverse md:flex-row justify-center items-center gap-6 md:gap-12"> 
          
          <div className="text-white font-sans font-extrabold text-2xl md:text-4xl tracking-wide text-center md:text-right max-w-xl leading-tight">
            <h1>Prepare-se para se despedir da desordem com o STOKKERS!</h1>
          </div>

          <div className="flex-shrink-0">
            <Image
              src="/images/home.png"
              alt="STOKKERS Hero"
              width={420}
              height={280}
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>
      </div>

      <div className="bg-back flex-1">
        <div className="container mx-auto px-6 pb-20">

          <div className="flex justify-end w-full mb-10 mt-10 relative">
            <div className="w-full max-w-lg relative group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-laranja transition-colors" />

              <input
                type="text"
                placeholder="O que você procura hoje?"
                value={searchTerm}
                onChange={handleSearchInput}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                className="
                  w-full
                  bg-card
                  border border-transparent
                  rounded-full
                  py-4 pl-12 pr-6
                  text-sm md:text-base
                  shadow-sm
                  hover:shadow-md
                  focus:shadow-lg
                  focus:border-laranja
                  outline-none
                  transition-all duration-300
                  text-text
                  placeholder-gray-400
                "
              />

              {showResults && searchResults.length > 0 && (
                <div className="absolute w-full bg-card border border-transparent rounded-2xl shadow-xl mt-2 max-h-80 overflow-y-auto z-50 custom-scrollbar">
                  {searchResults.map((result, index) => (
                    <Link
                      key={index}
                      href={
                        result.type === "Categoria"
                          ? `/category/${result.item.id}`
                          : result.type === "Produto"
                          ? `/product/${result.item.id}`
                          : `/store/${result.item.id}`
                      }
                      onClick={() => setShowResults(false)}
                    >
                      <div className="px-5 py-3 hover:bg-back cursor-pointer transition border-b border-gray-50 last:border-none">
                        <p className="text-xs text-laranja font-semibold uppercase tracking-wider mb-1">{result.type}</p>
                        <p className="text-text text-sm font-medium">{result.item.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-12">
            <div className="ml-2 mb-4">
              <h2 className="text-text font-sans font-bold text-3xl md:text-4xl">Categorias</h2>
            </div>
            
            <div className="relative py-2 flex justify-center"> 
              <Carrossel>
                {categories.length > 0 ? (
                  categories.map((cat: any) => (
                    <Link key={cat.id} href={`/category/${cat.id}`} className="transform hover:-translate-y-1 transition-transform duration-300 block">
                      <CardCategorias key={cat.id} name={cat.name}/>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-gray-400">Carregando categorias...</div>
                )}
              </Carrossel>
            </div>
          </div>

          {categories.filter(cat => cat.id === 2 || cat.id === 3 || cat.id === 5).map((cat) => (
            <div key={cat.id} className="mb-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 ml-2 gap-2">
                <h2 className="text-text font-sans font-bold text-3xl md:text-4xl">
                  Produtos
                  <span className="text-xl md:text-2xl font-normal text-gray-500 block md:inline md:ml-2">
                    em  
                    <Link href={`/category/${cat.id}`} className="text-laranja hover:underline transition-colors">
                      <strong> {cat.name}</strong>
                    </Link>
                  </span> 
                </h2>

                {productsByCategory[cat.id]?.length > 0 && (
                  <button 
                    className="text-laranja font-sans font-bold text-sm md:text-base hover:underline hover:cursor-pointer transition-colors self-end md:self-auto"
                    onClick={() => router.push(`/ver-mais?tipo=categoria&categoryId=${cat.id}`)}
                  >
                    Ver todos
                  </button>
                )}
              </div>

              <div className="relative py-2">
                <Carrossel>
                  {productsByCategory[cat.id] ? (
                    productsByCategory[cat.id].length > 0 ? (
                      productsByCategory[cat.id].map((produto) => (
                        <Link key={produto.id} href={`/product/${produto.id}`} className="block h-full">
                          <CardProdutos key={produto.id} produto={produto} />
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-400 p-4">Não há produtos disponíveis nesta categoria.</p>
                    )
                  ) : (
                    <p className="text-gray-400 p-4">Carregando produtos...</p>
                  )}
                </Carrossel>
              </div>
            </div>
          ))}

          <div className="mb-10">
            <div className="ml-2 mb-4">
              <h2 className="text-text font-sans font-bold text-3xl md:text-4xl">Lojas</h2>
            </div>
            <div className="relative py-2">
              <Carrossel>
                {stores === null ? (
                   <p className="text-gray-400 p-4">Carregando lojas...</p>
                ) : stores.length > 0 ? (
                  stores.map((store: any) => (
                    <Link key={store.id} href={`/store/${store.id}`} className="transform hover:scale-105 transition-transform duration-300 block">
                      <CardLojas
                        name={store.name}
                        category={store.categoryName}
                        logoUrl={store.logo_url}
                      />
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-400 p-4">Nenhuma loja encontrada.</p>
                )}
              </Carrossel>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}