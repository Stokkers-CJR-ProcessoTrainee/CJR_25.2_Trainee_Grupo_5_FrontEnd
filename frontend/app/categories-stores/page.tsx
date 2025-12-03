'use client';

import Carrossel from "@/components/Carrossel";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import CardCategorias from "@/components/CardCategorias";
import Link from "next/link";
import { Category } from "../Types";
import { getCategories } from "@/api/api";

export default function CategoriesStoresPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    
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

    </main>
)
}