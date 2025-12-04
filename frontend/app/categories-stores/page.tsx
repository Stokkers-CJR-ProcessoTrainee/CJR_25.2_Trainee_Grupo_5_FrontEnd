'use client';

import Carrossel from "@/components/Carrossel";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import CardCategorias from "@/components/CardCategorias";
import Link from "next/link";
import { Category } from "../Types";
import { getCategories, getStores } from "@/api/api";
import CardLojas from "@/components/CardLojas";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function CategoriesStoresPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [stores, setStores] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    const router = useRouter();
    
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

    const filteredStores = stores.filter(store => 
        store.name.toLowerCase().includes(search.toLowerCase())
    );

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

        <div className="w-full max-w-[1200px] mx-auto px-5 mt-8 flex justify-end">
            <div className="relative w-full max-w-md"> 
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
        </div>
        
        <div className="w-full flex flex-col items-center pb-20">
                
            <div className="w-full max-w-[1200px] px-10 mt-10 text-2xl font-bold font-sans">
                <h2>Lojas</h2>
            </div>

            <div className="w-full flex justify-center">
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