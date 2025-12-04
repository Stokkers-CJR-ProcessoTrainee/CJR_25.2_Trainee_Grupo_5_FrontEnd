'use client';

import Carrossel from "@/components/Carrossel";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import CardCategorias from "@/components/CardCategorias";
import Link from "next/link";
import { Category } from "../Types";
import { getCategories, getStores } from "@/api/api";
import CardLojas from "@/components/CardLojas";

export default function CategoriesStoresPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [stores, setStores] = useState<any[]>([]);
    
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

        <div className="px-30 mt-6 flex justify-end">
            Barra pesquisa
        </div>
        
        <div className="w-full flex flex-col items-center pb-20">
                
            <div className="w-full max-w-[1200px] px-10 mt-10 text-2xl font-bold font-sans">
                <h2>Lojas</h2>
            </div>

            <div className="w-full flex justify-center">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-10 place-items-center">
                        
                    {stores.length > 0 ? (
                        stores.map((store: any) => {

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
                        <p className="col-span-full text-gray-500">Lojas não encontradas.</p>
                    )}

                </div>
            </div>
        </div>

    </main>
)
}