'use client';
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import CardProdutos from "@/components/CardProdutos";
import { useEffect, useState } from "react";
import { 
    getProductsByUser, 
    getStoresByUser, 
    getUserRatings 
} from "@/api/api";

export default function VerMaisPage() {
    const params = useSearchParams();

    const tipo = params.get("tipo");    // produtos | lojas | avaliacoes_prod | avaliacoes_store
    const userId = params.get("userId");

    const [dados, setDados] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!tipo || !userId) return;

        async function carregar() {
        setLoading(true);

        if (tipo === "produtos") {
            const res = await getProductsByUser(Number(userId));
            setDados(res);
        }

        if (tipo === "lojas") {
            const res = await getStoresByUser(Number(userId));
            setDados(res);
        }

        if (tipo === "avaliacoes_store") {
            const res = await getUserRatings(Number(userId));
            setDados(res.store_ratings || []);
        }

        if (tipo === "avaliacoes_prod") {
            const res = await getUserRatings(Number(userId));
            setDados(res.product_ratings || []);
        }

        setLoading(false);
        }

        carregar();
    }, [tipo, userId]);

    if (loading) return <p>Carregando...</p>;

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
        <Navbar />

        <h1 className="text-2xl font-bold px-10 mt-8 mb-4">
            Ver mais – {tipo}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-10">
            {tipo === "produtos" &&
            dados.map((p) => <CardProdutos key={p.id} produto={p} />)}

            {tipo === "lojas" &&
            dados.map((l) => (
                <div key={l.id} className="bg-white shadow rounded-xl p-4">
                {l.name}
                </div>
            ))}

            {tipo === "avaliacoes_store" &&
            dados.map((a) => <div key={a.id}>{a.comment}</div>)}

            {tipo === "avaliacoes_prod" &&
            dados.map((a) => <div key={a.id}>{a.comment}</div>)}
        </div>
    </div>
    );
}
