'use client'
import Navbar from "@/components/Navbar";
import { FaArrowLeft, FaStar } from "react-icons/fa";

export default function RatingsPage() {
  return (
    <main className="w-screen min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="bg-laranja w-full h-115 text-white shadow-md relative flex flex-col justify-center px-8">
        
        <div className="flex items-center justify-between mx-40">
          <div className="flex items-center gap-4">
            <button className="hover:opacity-80 transition hover:cursor-pointer">
              <FaArrowLeft size={28} />
            </button>

            <img
              src="/user-placeholder.png"
              alt="Foto do usuário"
              className="w-18 h-18 rounded-full border-2 border-white object-cover"
            />

            <div className="flex flex-row items-center gap-4">
              <h2 className="text-3xl font-semibold font-sans leading-tight">Felipe Ferreira</h2>
              <p className="text-md font-sans font-semibold opacity-80 leading-tight">há 2 dias</p>
            </div>
          </div>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={35}
                className={star <= 4 ? "text-yellow-300" : "text-white/40"}
              />
            ))}
          </div>
        </div>

        <p className="mt-8 text-2xl font-sans tracking-wider opacity-95 ml-52 max-w-8xl">
          O atendimento foi ótimo e o produto chegou dentro do prazo. Voltaria a comprar!
        </p>
      </div>
    </main>
  );
}
