'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Carrossel from "@/components/Carrossel";
import CardCategorias from "@/components/CardCategorias";
import CardLojas from "@/components/CardLojas";
import { getAllParentCategories, getStores } from "@/api/api";
import { Category, Store } from "../Types";

export default function CategoriesStoresPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

  const router = useRouter();

  const categoryIcons: Record<string, string> = {
    "eletrônicos": "ion:tv-outline",
    "jogos": "streamline:controller",
    "mercado": "healthicons:vegetables-outline",
    "moda": "ph:dress",
    "farmácia": "hugeicons:medicine-02",
    "beleza": "streamline-ultimate:make-up-lipstick",
    "brinquedos": "ph:lego",
    "casa": "ph:house-light"
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [catsData, storesData] = await Promise.all([
          getAllParentCategories(),
          getStores()
        ]);
        setCategories(catsData);
        setStores(storesData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }
    fetchData();
  }, []);

  function toggleFilter(categoryId: number) {
    setSelectedFilters((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedFilters.length === 0 || selectedFilters.includes(store.category_id);
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen flex flex-col bg-back">
      <Navbar />

      <div className="bg-laranja w-full">
        <div className="container mx-auto px-6 py-10 md:pt-32 pb-16">
          <div className="flex flex-col gap-6">
            <h1 className="text-white font-sans font-extrabold text-3xl md:text-4xl tracking-wide">
              Navegue por Categorias
            </h1>
            
            <div className="relative w-full flex justify-center">
              <Carrossel>
                {categories.length > 0 ? (
                  categories.map((cat: any) => (
                    <Link key={cat.id} href={`/category/${cat.id}`} className="block">
                         <div className="transform hover:-translate-y-1 transition-transform duration-300">
                            <CardCategorias name={cat.name}/>
                         </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-white opacity-80">Carregando categorias...</div>
                )}
              </Carrossel>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-back">
        <div className="container mx-auto px-6 py-10">
          
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 mb-12">
            
            <h2 className="text-text font-sans font-bold text-2xl md:text-3xl self-start md:self-center">
              Lojas Disponíveis
            </h2>

            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-96 group">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-laranja transition-colors" />
                <input
                  type="text"
                  placeholder="Buscar lojas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    w-full
                    bg-card
                    border border-transparent
                    rounded-full
                    py-3 pl-12 pr-6
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
              </div>

              <div className="relative z-20">
                <button
                  onClick={() => setOpenFilters(!openFilters)}
                  className={`
                    h-full
                    bg-card px-6 py-3 rounded-full shadow-sm
                    flex items-center gap-2
                    text-sm font-medium text-text
                    hover:shadow-md hover:text-laranja
                    transition-all duration-300
                    border border-transparent
                    ${openFilters ? 'border-laranja text-laranja' : ''}
                  `}
                >
                  Filtros
                  <FaChevronDown 
                    size={12} 
                    className={`transition-transform duration-300 ${openFilters ? 'rotate-180' : ''}`} 
                  />
                </button>

                {openFilters && (
                  <div className="
                    absolute right-0 top-full mt-3 w-64
                    bg-card
                    rounded-2xl
                    shadow-xl
                    p-5
                    border border-transparent
                    animate-in fade-in slide-in-from-top-2 duration-200
                  ">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filtrar por</span>
                        {selectedFilters.length > 0 && (
                            <button onClick={() => setSelectedFilters([])} className="text-xs text-laranja hover:underline">Limpar</button>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                      {categories.map((cat) => {
                        const iconName = categoryIcons[cat.name.toLowerCase()] || "mdi:help-circle-outline";
                        const isSelected = selectedFilters.includes(cat.id);

                        return (
                          <label key={cat.id} className="flex items-center gap-3 cursor-pointer group hover:bg-back p-2 rounded-lg transition-colors">
                            <div className={`
                                w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                                ${isSelected ? 'bg-laranja border-laranja' : 'border-gray-300 group-hover:border-laranja'}
                            `}>
                                {isSelected && <Icon icon="mdi:check" className="text-white w-3 h-3" />}
                            </div>
                            <input 
                              type="checkbox"
                              className="hidden"
                              checked={isSelected}
                              onChange={() => toggleFilter(cat.id)}
                            />
                            <div className="flex items-center gap-2">
                                <Icon icon={iconName} className={isSelected ? "text-laranja" : "text-gray-400 group-hover:text-laranja"} width="18" />
                                <span className={`text-sm ${isSelected ? 'text-laranja font-medium' : 'text-text group-hover:text-laranja'}`}>
                                    {cat.name}
                                </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="min-h-[300px]">
            {filteredStores.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-6 md:gap-8 justify-items-center">
                {filteredStores.map((store: any) => {
                  const categoriaEncontrada = categories.find((cat) => cat.id === store.category_id);
                  return (
                    <Link key={store.id} href={`/store/${store.id}`} className="transform hover:scale-105 transition-transform duration-300 block w-full max-w-[220px]">
                      <CardLojas
                        name={store.name}
                        category={categoriaEncontrada ? categoriaEncontrada.name : "Geral"}
                        logoUrl={store.sticker_url}
                      />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-60">
                <Icon icon="mdi:store-off-outline" width="64" className="text-gray-300 mb-4" />
                <p className="text-xl font-sans text-gray-500">Nenhuma loja encontrada.</p>
                <p className="text-sm text-gray-400 mt-2">Tente ajustar seus filtros ou busca.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}