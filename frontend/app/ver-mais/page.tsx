'use client';
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import CardProdutos from "@/components/CardProdutos";
import { useEffect, useState } from "react";
import { 
    getProductByCategory,
    getProductsByUser, 
} from "@/api/api";

export default function VerMaisPage() {
    const params = useSearchParams();

    const tipo = params.get("tipo"); 
    const userId = params.get("userId");
    const categoryId = params.get("categoryId");

    const [dados, setDados] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ItemsPerPage = 25;

    useEffect(() => {
        if (!tipo) return;

        async function carregar() {
        setLoading(true);

        if (tipo === "produtos-usuario") {
            const res = await getProductsByUser(Number(userId));
            setDados(res);
        }

        if (tipo === "categoria") {
            const res = await getProductByCategory(Number(categoryId));
            setDados(res);
        }

        setLoading(false);
        }

        carregar();
    }, [tipo, userId, categoryId]);

    useEffect(() => {
        setCurrentPage(1);
    }, [tipo, userId, categoryId])

    if (loading) return <p>Carregando...</p>;

    const totalPages = Math.ceil(dados.length / ItemsPerPage);
    const startIndex = (currentPage - 1) * ItemsPerPage;
    const endIndex = startIndex + ItemsPerPage;
    const currentItems = dados.slice(startIndex, endIndex);

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
        <Navbar />

        <h1 className="text-2xl font-bold px-10 mt-8 mb-4">
            Ver mais {tipo}
        </h1>

        <div className="w-full flex justify-center">
            <div className="grid gap-6 px-20 py-5 justify-center grid-cols-[repeat(auto-fill,minmax(170px,1fr))] max-w-[1200px]">

                {currentItems.map((p) => (
                    <CardProdutos key={p.id} produto={p} />
                ))}

            </div>
        </div>

        {dados.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50 enabled:hover:cursor-pointer"
                    >
                        &lt;
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 hover:cursor-pointer py-1 rounded-lg ${
                                currentPage === i + 1 ? "bg-laranja text-white" : "bg-gray-200"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50 enabled:hover:cursor-pointer"
                    >
                        &gt;
                    </button>
                </div>
        )}
    </div>
    );
}