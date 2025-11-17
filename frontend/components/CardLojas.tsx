'use client';
import React from "react";

interface LojaCardProps {
  name: string;
  category: string;
  logoUrl: string;
}

export default function CardLojas({ name, category, logoUrl }: LojaCardProps) {
  return (
    <div
      className="
        flex flex-col items-center
        w-32 cursor-pointer
        transition-transform hover:scale-105
      "
    >
      <div className="w-28 h-28 rounded-full bg-white shadow flex items-center justify-center">
        <img
          src={logoUrl}
          alt={name}
          className="w-20 h-20 object-contain rounded-full"
        />
      </div>

      <p className="mt-2 text-base font-semibold text-gray-900 text-center truncate w-28">
        {name}
      </p>

      <p className="text-sm text-purple-700 font-medium text-center truncate w-28">
        {category}
      </p>
    </div>
  );
}
