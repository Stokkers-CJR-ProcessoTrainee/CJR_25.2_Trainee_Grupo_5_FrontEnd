'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CardProdutos from "@/components/CardProdutos";
import { getProductsByCategory, getChildCategories, getCategoryById} from "@/api/api";
import { Category, Products } from "@/app/Types";

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

  // 🔥 Títulos personalizados do Figma
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
    categoryHeroTexts[category?.name ?? ""] ??
    `Produtos em ${category?.name ?? ""}`,
    image: 
    categoryHeroImages[category?.name ?? ""] ??
    "/images/Categories/ImageCategories.svg",
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

        const ownProducts = await getProductsByCategory(categoryId);

        let childProducts: Products[] = [];
        if (childCats && childCats.length > 0) {
          const arrays = await Promise.all(
            childCats.map((Category: Category) => getProductsByCategory(Category.id))
          );
          childProducts = arrays.flat();
        }

        const allProducts = [...(ownProducts || []), ...(childProducts || [])];
        setProducts(allProducts);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Erro ao carregar categoria");
      } finally {
        setLoading(false);
      }
    })();
  }, [categoryId]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const ordered = [...filtered].sort((a, b) => {
    if (order === "price-asc") return a.price - b.price;
    if (order === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <main className=" min-h-screen">
      <Navbar />

      <section className="w-full bg-laranja flex items-center justify-center px-20 min-h-[400px] mt-16">

        <h1 className="
            text-white 
            font-extrabold 
            text-5xl 
            leading-tight 
            tracking-wide 
            text-end
            w-[45%]     /* controla largura do bloco de texto */
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


      <div className="bg-[#F9F9F9] px-10 py-6">

        <div className="flex justify-end w-full mb-6 mt-20">
          <input
            type="text"
            placeholder="Procurar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white p-3 px-4 rounded-full shadow text-sm w-64"
          />
        </div>

        <div className="flex items-center justify-between m-40 mt-10 mb-8 gap-4">

          {childCategories.map((cat) => (
            <button
              key={cat.id}
              className="bg-white p-3 rounded-full shadow text-sm hover:bg-laranja hover:text-white transition"
              onClick={() => router.push(`/category/${cat.id}`)}
            >
              {cat.name}
            </button>
          ))}

          <select
            className="bg-white p-3 rounded-full shadow text-sm transition"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="default">Ordenar por</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
          </select>
        </div>

        <div className="grid grid-cols-5 gap-20 md:grid-cols-5 sm:grid-cols-3 m-20 p-5">
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
