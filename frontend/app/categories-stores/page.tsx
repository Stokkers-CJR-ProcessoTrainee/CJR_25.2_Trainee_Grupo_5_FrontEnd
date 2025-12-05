'use client';

import Carrossel from "@/components/Carrossel";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import CardCategorias from "@/components/CardCategorias";
import Link from "next/link";
import { Category } from "../Types";
import { getCategories, getStores } from "@/api/api";
import CardLojas from "@/components/CardLojas";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";


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
        async function fetchCategories() {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Erro ao carregar categorias:", err);
            }
        }
        fetchCategories();
    }, [])

    useEffect(() => {
        async function fetchStores() {
            try {
                const data = await getStores();
                setStores(data);
            } catch (err) {
                console.error("Erro ao carregar lojas:", err);
            }
        }
        fetchStores();
    }, [])

    function toggleFilter(categoryId: number) {
        setSelectedFilters((prev) => 
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        )
    }

    const filteredStores = stores.filter(store => {
        const matchesSearch = store.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedFilters.length === 0 || selectedFilters.includes(store.category_id);
        return matchesSearch && matchesCategory;
    });

return (
    <main className="bg-back min-h-screen flex flex-col">

        <Navbar />

        <div className="bg-laranja mt-15 h-90 w-full p-4">

            <div className="px-30 flex  mt-15 text-3xl text-back font-semibold font-sans flex-col gap-10">
                <h2>
                    Categoria
                </h2>

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

        </div>

        <div className="w-full max-w-[1200px] mx-auto px-5 mt-8 flex flex-col-reverse md:flex-row justify-end items-end md:items-center gap-4">

            <div className="relative w-full max-w-md z-20"> 
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    
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
                    <div className="
                        absolute
                        w-full
                        bg-white
                        border border-gray-100
                        rounded-xl
                        shadow-xl
                        mt-2
                        max-h-80
                        overflow-y-auto
                        z-50
                    ">

                    {filteredStores.length > 0 ? (
                        filteredStores.map((store) => (
                            <div
                                key={store.id}
                                className="
                                    px-4 py-3
                                    hover:bg-gray-100
                                    cursor-pointer
                                    transition
                                    flex items-center gap-3
                                    border-b last:border-none border-gray-50
                                "
                                onClick={() => router.push(`/store/${store.id}`)}
                            >
                                {store.sticker_url && (
                                    <img
                                        src={store.sticker_url}
                                        alt={store.name}
                                        className="w-10 h-10 rounded-md object-cover border border-gray-200"
                                    />
                                )}
                                <span className="text-black text-sm font-medium">{store.name}</span>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                            Nenhuma loja encontrada.
                        </div>
                    )}
                    </div>
                )}
            </div>

            <div className="relative z-10 overflow-visible">
                <button
                    onClick={() => setOpenFilters(!openFilters)}
                    className="
                        bg-card p-3 rounded-full shadow px-6 text-sm
                        flex items-center gap-2
                        hover:bg-gray-100 transition
                        text-text
                        hover: cursor-pointer
                    "
                >
                    Filtros
                    <FaChevronDown 
                        size={14} 
                        className={`transition-transform duration-200 ${openFilters ? 'rotate-180' : ''}`} 
                    />
                </button>

                {openFilters && (
                    <div className="
                        absolute right-0 top-full mt-2 w-56 
                        bg-white
                        rounded-3xl 
                        shadow-[0_0_15px_rgba(0,0,0,0.1)] 
                        p-5 
                        z-50
                        animate-fadeIn
                    ">
                        <div className="flex flex-col gap-3">
                            {categories.map((cat) => {
                                const iconName = categoryIcons[cat.name.toLowerCase()] || "mdi:help-circle-outline";

                                return (
                                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                      <input 
                                        type="checkbox"
                                        checked={selectedFilters.includes(cat.id)}
                                        onChange={() => toggleFilter(cat.id)}
                                        className="
                                            appearance-none w-5 h-5 
                                            border-2 border-laranja rounded-md
                                            checked:bg-laranja checked:border-laranja
                                            relative cursor-pointer
                                            transition
                                        "
                                    />
                                    <span className="text-laranja text-base font-normal group-hover:opacity-80 transition flex items-center gap-1">
                                        {cat.name} 

                                        <Icon 
                                            icon={iconName} 
                                            className="text-laranja" 
                                            width="20" 
                                            height="20" 
                                        />
                                    </span>
                                </label>
                                );
                             })}
                            {categories.length === 0 && <p className="text-sm text-gray-400">Sem categorias</p>}
                        </div>
                    </div>
                )}
            </div>

        </div>
        
        <div className={`
                w-full flex flex-col items-center pb-20 bg-back flex-1 
                ${openFilters ? 'min-h-[490px]' : ''}
            `}>
                
            <div className="w-full max-w-[1200px] px-10 mt-10 text-2xl font-bold font-sans">
                <h2>Lojas</h2>
            </div>

            <div className="w-full bg-back flex justify-center">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-10 place-items-center">
                        
                    {filteredStores.length > 0 ? (
                        filteredStores.map((store: any) => {

                        const categoriaEncontrada = categories.find((cat) => cat.id === store.category_id);
                        
                        return (
                            <Link key={store.id} href={`/store/${store.id}`}>
                                <CardLojas
                                    name={store.name}
                                    category={categoriaEncontrada ? categoriaEncontrada.name : "Categoria desconhecida"}
                                    logoUrl={store.sticker_url}
                                />
                            </Link> 
                        );
                        })
                    ) : (
                        <p className="col-span-full text-gray-500">Loja não encontrada.</p>
                    )}

                </div>
            </div>
        </div>

    </main>
)
}