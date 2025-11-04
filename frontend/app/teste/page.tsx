'use client';
import { useState } from "react";
import CreateStoreModal from "@/components/modals/CreateStoreModal";

export default function StoresPage() {
  const [abrir, setAbrir] = useState(false);

  return (
    <div className="p-8">
      <button
        onClick={() => setAbrir(true)}
        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:brightness-90"
      >
        Criar Loja
      </button>

      <CreateStoreModal
        abrir={abrir}
        fechar={() => setAbrir(false)}
      />
    </div>
  );
}
