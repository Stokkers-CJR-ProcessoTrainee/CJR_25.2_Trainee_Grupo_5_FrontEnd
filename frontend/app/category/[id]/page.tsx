'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import CardProdutos from "@/components/CardProdutos";
import { getProductsByCategory, getChildCategories, getCategoryById } from "@/api/api";
import { Category, Products } from "@/app/Types";

export default function CategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const categoryId = Number(id);
  const [category, setCategory] = useState<Category>();
  const [loading, setLoading] = useState(false);
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Products[]>([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("default");
  const [openOrder, setOpenOrder] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

  const categoryHeroTexts: Record<string, string> = {
    "Eletrônicos": "O universo da tecnologia em um só lugar.",
    "Jogos": "Entre no mundo dos games!",
    "Mercado": "Os melhores itens do seu mercado favorito.",
    "Moda": "O estilo que combina com você.",
    "Farmácia": "Tudo para sua saúde e bem-estar.",
    "Beleza": "Beleza e cuidado ao seu alcance.",
    "Brinquedos": "A diversão da criançada começa aqui!",
    "Casa": "Transforme sua casa em um lar",
  };
  const categoryHeroImages: Record<string, string> = {
    "Eletrônicos": "/images/Categories/Eletronicos.svg",
    "Jogos": "/images/Categories/Jogos.svg",
    "Mercado": "/images/Categories/Mercado.svg",
    "Moda": "/images/Categories/Moda.svg",
    "Farmácia": "/images/Categories/Farmacia.svg",
    "Beleza": "/images/Categories/Beleza.svg",
    "Brinquedos": "/images/Categories/Brinquedos.svg",
    "Casa": "/images/Categories/Casa.svg",
  };

  const hero = {
    text: categoryHeroTexts[category?.name ?? ""] || category?.name,
    image: categoryHeroImages[category?.name ?? ""] || "/images/placeholder.svg",
  }

  useEffect(() => {
    if (!categoryId) return;

    setLoading(true);

    (async () => {
      try {
        const categoryData = await getCategoryById(categoryId);
        setCategory(categoryData);

        const childCats = await getChildCategories(categoryId);
        setChildCategories(childCats || []);

        const Products = await getProductsByCategory(categoryId);
        setProducts(Products);
      } catch (err: any) {
        console.error("Erro ao carregar categoria", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [categoryId]);

  const searchFiltered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const categoryFiltered =
    selectedFilters.length === 0
      ? searchFiltered
      : searchFiltered.filter((p) => selectedFilters.includes(p.category.id));

  const ordered = [...categoryFiltered].sort((a, b) => {
    if (order === "price-asc") return a.price - b.price;
    if (order === "price-desc") return b.price - a.price;
    if (order === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    if (order === "recent")
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return 0;
  });

  function toggleFilter(id: number) {
    setSelectedFilters((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  if (loading || !category) return <div className="min-h-screen bg-back flex items-center justify-center text-laranja font-bold">Carregando...</div>;

  if (category?.parent_category_id == null) {
    return (
      <main className="min-h-screen bg-back flex flex-col pb-20">
        <Navbar />

        <div className="bg-laranja w-full mt-16">
          <div className="container mx-auto px-6 py-8 md:py-10 flex flex-col-reverse md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-white font-extrabold text-3xl md:text-5xl leading-tight tracking-wide max-w-2xl">
                {hero.text}
              </h1>
            </div>
            
            <div className="flex-1 flex justify-center md:justify-end">
              <img
                src={hero.image}
                alt={category.name}
                className="w-56 md:w-[380px] h-auto object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 -mt-8 relative z-10">
          
          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row items-center gap-4 mb-8">
            
            <div className="relative w-full md:flex-1 group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-laranja transition-colors" />
              <input
                type="text"
                placeholder="Buscar produtos nesta categoria..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-transparent rounded-full py-3 pl-12 pr-4 text-sm focus:bg-white focus:border-laranja focus:ring-2 focus:ring-laranja/20 outline-none transition-all text-text placeholder-gray-400"
              />
              
              {search.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl mt-2 max-h-80 overflow-y-auto z-50">
                  {searchFiltered.length > 0 ? (
                    searchFiltered.map((p) => (
                      <Link 
                        key={p.id} 
                        href={`/product/${p.id}`}
                        className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors border-b last:border-none border-gray-50"
                      >
                        <img src={p.product_images[0]?.image_url} alt={p.name} className="w-10 h-10 rounded-md object-cover" />
                        <span className="text-text text-sm font-medium">{p.name}</span>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-sm">Nenhum produto encontrado.</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              
              <div className="relative">
                <button
                  onClick={() => setOpenFilters(!openFilters)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all shadow-sm border ${openFilters ? 'bg-laranja text-white border-laranja' : 'bg-white text-text border-gray-200 hover:border-laranja hover:text-laranja'}`}
                >
                  Filtros <FaChevronDown size={10} className={`transition-transform ${openFilters ? 'rotate-180' : ''}`} />
                </button>

                {openFilters && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl z-50 p-3 border border-gray-100 animate-fadeIn">
                    <div className="flex justify-between items-center mb-2 px-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Subcategorias</span>
                        {selectedFilters.length > 0 && <button onClick={() => setSelectedFilters([])} className="text-xs text-laranja hover:underline">Limpar</button>}
                    </div>
                    <div className="flex flex-col gap-1 max-h-60 overflow-y-auto custom-scrollbar">
                      {childCategories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters.includes(cat.id)}
                            onChange={() => toggleFilter(cat.id)}
                            className="accent-laranja w-4 h-4"
                          />
                          <span className={`text-sm group-hover:text-laranja transition-colors ${selectedFilters.includes(cat.id) ? 'text-laranja font-medium' : 'text-text'}`}>{cat.name}</span>
                        </label>
                      ))}
                      {childCategories.length === 0 && <div className="text-sm text-gray-400 px-2">Nenhuma subcategoria.</div>}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setOpenOrder(!openOrder)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all shadow-sm border ${openOrder ? 'bg-laranja text-white border-laranja' : 'bg-white text-text border-gray-200 hover:border-laranja hover:text-laranja'}`}
                >
                  Ordenar <FaChevronDown size={10} className={`transition-transform ${openOrder ? 'rotate-180' : ''}`} />
                </button>

                {openOrder && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-xl z-50 overflow-hidden border border-gray-100 animate-fadeIn">
                    {[
                      { label: "Menor preço", val: "price-asc" },
                      { label: "Maior preço", val: "price-desc" },
                      { label: "Melhor avaliação", val: "rating" },
                      { label: "Mais recente", val: "recent" }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${order === opt.val ? 'text-laranja font-bold bg-orange-50' : 'text-text'}`}
                        onClick={() => { setOrder(opt.val); setOpenOrder(false); }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ATALHOS RÁPIDOS (FILTROS) */}
          {childCategories.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-10 justify-center md:justify-start">
              {childCategories.map((cat) => {
                const isSelected = selectedFilters.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleFilter(cat.id)}
                    className={`
                      px-4 py-2 rounded-full text-sm transition-all shadow-sm border
                      ${isSelected 
                        ? 'bg-laranja text-white border-laranja' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-laranja hover:text-laranja'
                      }
                    `}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}

          <div className="min-h-[400px]">
            {ordered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 justify-items-center">
                {ordered.map((produto) => (
                  <Link key={produto.id} href={`/product/${produto.id}`}>
                    <CardProdutos produto={produto} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-60">
                <p className="text-xl font-sans text-gray-500">Nenhum produto encontrado.</p>
                <p className="text-sm text-gray-400 mt-2">Tente ajustar seus filtros.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    );
  }

  return null; 
}