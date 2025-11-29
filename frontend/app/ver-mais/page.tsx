'use client';
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import CardProdutos from "@/components/CardProdutos";
import { useEffect, useState } from "react";
import {
  getProductByCategory,
  getProductsByUser,
  getStoresByUser,
  getUserRatings
} from "@/api/api";

export default function VerMaisPage() {
  const params = useSearchParams();

  const tipo = params.get("tipo");
  const userId = params.get("userId");
  const categoryId = params.get("categoryId");

  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Navbar />

      <h1 className="text-2xl font-bold px-10 mt-8 mb-4">
        Ver mais {tipo}
      </h1>

      <div className="w-full flex justify-center">
        <div className="grid gap-6 px-20 py-5 justify-center grid-cols-[repeat(auto-fill,minmax(170px,1fr))] max-w-[1200px]">

          {tipo === "produtos-usuario" &&
            dados.map((p) => <CardProdutos key={p.id} produto={p} />)}

          {tipo === "categoria" &&
            dados.map((p) => <CardProdutos key={p.id} produto={p} />)}

        </div>
      </div>

    </div>
  );
}
