'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CardProdutos from "@/components/CardProdutos";
import { getProductsByCategory, getChildCategories, getCategoryById} from "@/api/api";
import { Category, Products } from "@/app/Types";
import { FaSearch, FaChevronDown } from "react-icons/fa";

export default function CategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const categoryId = Number(id);
  const [category, setCategory] = useState<Category>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    text:
    categoryHeroTexts[category?.name ?? ""],
    image: 
    categoryHeroImages[category?.name ?? ""],
  }

  useEffect(() => {
    if (!categoryId) return;

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const categoryData = await getCategoryById(categoryId);
        setCategory(categoryData);

        const childCats = await getChildCategories(categoryId);
        setChildCategories(childCats || []);

        const Products = await getProductsByCategory(categoryId);

        setProducts(Products);
      } catch (err: any) {
        setError(err?.message || "Erro ao carregar categoria");
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
  if (category?.parent_category_id == null) {
  return (
    <main className="min-h-screen bg-back">
      <Navbar />

      <section className="w-full bg-laranja flex items-center justify-center px-20 min-h-[400px] mt-16">
        <h1
          className="
            text-white 
            font-extrabold 
            text-5xl 
            leading-tight 
            tracking-wide 
            text-end
            w-[45%]
          "
        >
          {hero.text}
        </h1>

        <img
          src={hero.image}
          alt="Banner Categoria"
          className="w-[430px] h-auto"
        />
      </section>

      <div className="bg-back px-10 py-6">

        <div className="flex items-center justify-between w-full px-40 mt-20 mb-10">

          <div className="w-full max-w-xl relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

            {search.length > 0 && (
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
                {searchFiltered.length > 0 ? (
                  searchFiltered.map((p) => (
                    <div
                      key={p.id}
                      className="
                        px-4 py-3
                        hover:bg-gray-50
                        cursor-pointer
                        transition
                        flex items-center gap-3
                      "
                      onClick={() => router.push(`/product/${p.id}`)}
                    >
                      <img
                        src={p.product_images[0]?.image_url}
                        alt={p.name}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                      <span className="text-text text-sm">{p.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-sm">
                    Nenhum produto encontrado.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            
            <div className="relative">
              <button
                onClick={() => setOpenFilters((prev) => !prev)}
                className="
                  bg-card p-3 rounded-full shadow px-6 text-sm
                  flex items-center gap-2
                  hover:bg-gray-100 transition
                  text-text
                "
              >
                Filtros
                <FaChevronDown
                  size={12}
                  className={openFilters ? "rotate-180 transition" : "transition"}
                />
              </button>

              {openFilters && (
                <div
                  className="
                    absolute right-0 mt-2 
                    bg-card shadow-xl rounded-xl
                    w-56 z-50
                    overflow-hidden
                    animate-fadeIn
                    p-3
                  "
                >
                  {childCategories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes(cat.id)}
                        onChange={() => toggleFilter(cat.id)}
                        className="accent-laranja"
                      />
                      <span className="text-sm text-text">{cat.name}</span>
                    </label>
                  ))}

                  {childCategories.length === 0 && (
                    <div className="text-sm text-gray-500 px-2 py-2">
                      Nenhuma categoria
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenOrder((prev) => !prev)}
                className="
                  bg-card p-3 rounded-full shadow px-6 text-sm
                  flex items-center gap-2
                  hover:bg-gray-100 transition
                  text-text
                "
              >
                Ordenar por
                <FaChevronDown
                  size={12}
                  className={openOrder ? "rotate-180 transition" : "transition"}
                />
              </button>

              {openOrder && (
                <div
                  className="
                    absolute right-0 mt-2 
                    bg-card shadow-xl rounded-xl
                    w-48 z-50
                    text-laranja
                    overflow-hidden
                    animate-fadeIn
                  "
                >
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setOrder("price-asc");
                      setOpenOrder(false);
                    }}
                  >
                    Menor preço
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setOrder("price-desc");
                      setOpenOrder(false);
                    }}
                  >
                    Maior preço
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setOrder("rating");
                      setOpenOrder(false);
                    }}
                  >
                    Maior avaliação
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setOrder("recent");
                      setOpenOrder(false);
                    }}
                  >
                    Mais recente
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="flex items-center gap-4 px-40 mb-10">
          {childCategories.map((cat) => (
            <button
              key={cat.id}
              className="bg-white p-3 rounded-full shadow text-sm hover:bg-laranja hover:text-white transition"
              onClick={() => router.push(`/category/${cat.id}`)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex relative rounded-3xl font-sans gap-10 ml-40">
          {ordered.length > 0 ? (
            ordered.map((produto) => (
              <CardProdutos key={produto.id} produto={produto} />
            ))
          ) : (
            <p className="text-gray-600">Nenhum produto encontrado.</p>
          )}
        </div>
      </div>
    </main>
  );
}
}
