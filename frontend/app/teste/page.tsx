'use client';
import { useState } from 'react';
import UpdateStoreModal from '@/components/modals/UpdateStoreModal';

export default function TestePage() {
  const [abrir, setAbrir] = useState(false);

  // Mock de uma loja só pra testar a estrutura visual
  const lojaExemplo = {
    id: 20,
    name: "Minha Loja de Teste",
    description: "Uma loja incrível",
    sticker_url: "/images/exemplo-sticker.png",
    logo_url: "/images/exemplo-logo.svg",
    banner_url: "/images/exemplo-banner.svg",
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <button
        onClick={() => setAbrir(true)}
        className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition"
      >
        Abrir modal de atualização
      </button>

      <UpdateStoreModal
        abrir={abrir}
        fechar={() => setAbrir(false)}
        store={lojaExemplo}
      />
    </div>
  );
}
