'use client'
import Image from "next/image";
import { getCategories, getProductsByCategory, getStores } from "@/api/api";
import { useEffect, useState } from "react";

import Carrossel from "@/components/Carrossel";
import Navbar from "@/components/Navbar";
import CardProdutos from "@/components/CardProdutos";
import CardCategorias from "@/components/CardCategorias";
import CardLojas from "@/components/CardLojas";
import Link from "next/link";

import { Store, Products, Category } from "./Types";

import { FiSearch } from "react-icons/fi";

export default function Home() {

  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<number, Products[]>>({});
  const [stores, setStores] = useState<Store[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

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

      const featuredCategories = allCategories.slice(0, 3);

      const productsArray = await Promise.all(
        featuredCategories.map((cat: Category) => fetchProductsbyCategory(cat.id))
      );

      const mapped: Record<number, Products[]> = {};
      featuredCategories.forEach((cat: Category, i: number) => {
        mapped[cat.id] = productsArray[i];
      });

      setProductsByCategory(mapped);

      const allStores = await fetchStores();
      setStores(allStores);
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

    const filteredStores = stores.filter((s) =>
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
    <main>
      <Navbar/>

      <div className="flex justify-center items-center bg-laranja p-10 pt-25 gap-10"> 
        <div className="text-white font-sans font-extrabold text-4xl tracking-wider mb-6 text-end h-32 w-196">
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

      <div className="bg-back p-30">

        <div className="relative flex justify-end mr-10 mt-5">
          <div className="w-140 relative">

            <input
              type="text"
              className="w-full px-4 py-2 bg-card text-text rounded-full border border-transparent focus:border-laranja focus:outline-none"
              placeholder="Procurar por..."
              value={searchTerm}
              onChange={handleSearchInput}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
            />

            <button className="absolute right-3 top-2.5 text-gray-500">
              <FiSearch size={20} />
            </button>

            {showResults && searchResults.length > 0 && (
              <div className="absolute mt-2 w-full bg-card shadow-xl rounded-xl text-text max-h-60 overflow-y-auto z-10 border border-transparent">
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
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <p className="text-xs text-gray-500">{result.type}</p>
                      <p className="font-medium">{result.item.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>
        </div>

        <h2 className="text-text font-sans text-4xl ml">Categorias</h2>
        <div className="flex relative bg-back rounded-3xl p-5 font-sans gap-6 m-5"> 
          <Carrossel>
            {categories.length > 0 ? (
              categories.map((cat: any) => (
                <Link key={cat.id} href={`/category/${cat.id}`}>
                  <CardCategorias key={cat.id} name={cat.name}/>
                </Link>
              ))
            ) : (
              <p>Categorias não encontradas.</p>
            )}
          </Carrossel>
        </div>

        {categories.slice(0, 3).map((cat) => (
          <div key={cat.id}>
            <h2 className="text-text font-sans text-4xl ml">
              Produtos <span className="text-sm">em {cat.name}</span>
            </h2>

            <div className="flex relative bg-back rounded-3xl p-5 font-sans gap-6 m-5">
              <Carrossel>
                {productsByCategory[cat.id] && productsByCategory[cat.id].length > 0 ? (
                  productsByCategory[cat.id]?.map((produto) => (
                    <Link key={produto.id} href={`/product/${produto.id}`}>
                      <CardProdutos key={produto.id} produto={produto} />
                    </Link>
                  ))
                ) : (
                  <p>Produtos não encontrados.</p>
                )}
              </Carrossel>
            </div>
          </div>
        ))}

        <h2 className="text-text font-sans text-4xl ml">Lojas</h2>
        <div className="flex relative bg-back rounded-3xl p-5 font-sans gap-6 m-5">
          <Carrossel>
            {stores.length > 0 ? (
              stores.map((store: any) => (
                <Link key={store.id} href={`/store/${store.id}`}>
                  <CardLojas
                    name={store.name}
                    category={store.categoryName}
                    logoUrl={store.logo_url}
                  />
                </Link>
              ))
            ) : (
              <p>Lojas não encontradas.</p>
            )}
          </Carrossel>
        </div>
      </div>
    </main>
  );
}
