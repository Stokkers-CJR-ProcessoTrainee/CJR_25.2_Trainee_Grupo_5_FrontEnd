'use client';
import React from "react";
import { Icon } from "@iconify/react";

interface CategoriaProps {
  name: string;
}

export default function CardCategorias({ name }: CategoriaProps) {
  const icons: Record<string, string> = {
    "eletrônicos": "ion:tv-outline",
    "jogos": "streamline:controller",
    "mercado": "healthicons:vegetables-outline",
    "moda": "ph:dress",
    "farmácia": "hugeicons:medicine-02",
    "beleza": "streamline-ultimate:make-up-lipstick",
    "brinquedos": "ph:lego",
    "casa": "ph:house-light"
  };

  const iconName = icons[name.toLowerCase()] ?? "mdi:help-circle-outline";

  return (
    <div
      className="
        flex flex-col items-center justify-center
        w-28 h-28 bg-white rounded-3xl shadow-sm
        cursor-pointer transition-transform hover:scale-105
      "
    >
      <Icon icon={iconName} color="#FF6700" width="40" height="40" />
      


      <p className="text-sm font-medium text-gray-800 text-center mt-2 truncate w-24">
        {name}
      </p>
    </div>
  );
}
