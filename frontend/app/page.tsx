'use client'
import Image from "next/image";
import { getAllParentCategories, getProductsByCategory, getStores } from "@/api/api";
import { use, useEffect, useState } from "react";

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
  const [stores, setStores] = useState<Store[]>([]);

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

  // 🔎 Lógica de busca (mantida)
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
            alt="Imagem Hambúrguer"
            width={500}
            height={300}
          />
        </div>
      </div>

      <div className="bg-back p-30">

        <div className="flex justify-end w-full mb-6 mt-20 relative pr-10">
          <div className="w-full max-w-xl relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearchInput}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              className="
                w-full
                bg-card
                border border-transparent
                rounded-full
                py-3 pl-12 pr-4
                text-sm
                shadow
                focus:border-laranja
                outline-none
                transition
                text-text
              "
            />

            {showResults && searchResults.length > 0 && (
              <div
                className="
                  absolute
                  w-full
                  bg-card
                  border
                  border-transparent
                  rounded-xl
                  shadow-lg
                  mt-2
                  max-h-80
                  overflow-y-auto
                  z-50
                "
              >
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
                    <div
                      className="
                        px-4 py-3
                        hover:bg-gray-50
                        cursor-pointer
                        transition
                      "
                    >
                      <p className="text-xs text-laranja">{result.type}</p>
                      <p className="text-text text-sm font-medium">{result.item.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>


        <h2 className="text-text font-sans text-4xl ml">Categorias</h2>
        <div className="flex relative bg-back rounded-3xl py-5 font-sans gap-6 m-5"> 
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

          {productsByCategory[cat.id]?.length > 0 && (
            <div 
              className="w-fit ml-auto flex justify-end font-sans text-laranja -mt-8 font-bold hover:cursor-pointer"
              onClick={() => router.push(`/ver-mais?tipo=categoria&categoryId=${cat.id}`)}
              >
              Ver mais
            </div>
            )}
            

            <div className="flex relative bg-back rounded-3xl py-5 font-sans gap-6 m-5">
              
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
        <div className="flex relative bg-back rounded-3xl py-5 font-sans gap-6 m-5">
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
