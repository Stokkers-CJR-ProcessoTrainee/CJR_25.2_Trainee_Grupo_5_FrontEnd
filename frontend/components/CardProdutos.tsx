'use client';
import React from "react";

type Produto = {
  id: number;
  name: string;
  price: number;
  stock: number;
  product_images?: { id: number; image_url: string; order: number }[];
  store: { id: number; name: string; sticker_url: string };
};

type ProdutoCardProps = {
    produto: Produto;
}

export default function CardProdutos({ produto }: ProdutoCardProps) {
    return (
          <div
                key={produto.id}
                className="relative min-w-[170px] bg-card shadow rounded-4xl p-4 h-55 flex flex-col justify-between text-gray-500 transition-transform cursor-pointer"
              >
                <div className="flex justify-center items-center flex-1">
                <img
                  src={produto.product_images?.[0]?.image_url}
                  alt={produto.name}
                  className="h-24"
                />
                </div>

                <div className="flex flex-col text-text items-start">
                  <h4 className="text-lg font-semibold">{produto.name}</h4>
                  <p className="font-semibold">R${produto.price}</p>
                  {produto.stock > 0 ? (
                    <p className="text-green-600 font-bold text-sm">Disponível</p>
                  ) : (
                    <p className="text-red-600 font-bold text-sm">Indisponível</p>
                  )}
                </div>
                
                {/* Sticker do produto */}
                <div className="absolute h-12 w-12 mb-32 ml-22 rounded-full bg-blue-500">
                  <img
                    src={produto.store.sticker_url}
                    alt={`${produto.store.name} sticker`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
              </div>
    )
}