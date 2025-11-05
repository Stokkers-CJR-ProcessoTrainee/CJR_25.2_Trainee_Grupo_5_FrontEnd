'use client'
import Navbar from "@/components/Navbar";
import { FaArrowLeft, FaStar } from "react-icons/fa";

export default function RatingsPage() {
    const comentarios = [
    {
      autor: "João Silva",
      texto: "Excelente produto! Chegou antes do prazo.",
      tempo: "1h"
    },
    {
      autor: "Maria Souza",
      texto: "Tive um pequeno problema com o frete, mas o suporte foi ótimo.",
      tempo: "1h"
    },
    {
      autor: "Lucas Pereira",
      texto: "Produto de qualidade, recomendo!",
      tempo: "1h"
    },

    {
      autor: "Lucas Pereira",
      texto: "Produto de qualidade, recomendo!",
      tempo: "1h"
    },
  ];

  return (
    <main className="w-full overflow-x-hidden min-h-screen flex flex-col bg-gray-50">
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

        <div className="mt-10 px-12 sm:px-24 lg:px-40 pb-16">
            <div className="flex">
            <div className="w-1 bg-gray-400 rounded-full"></div>

            <div className="flex flex-col gap-8 pl-12">
                {comentarios.map((c, i) => (
                    <div key={i} className="bg-card shadow-md rounded-2xl p-6 w-150">
                        <div className="flex gap-3">
                            <img
                            src="/user-placeholder.png"
                            alt="Foto do usuário"
                            className="w-10 h-10 rounded-full border-2 border-white object-cover"
                            />
                            <div className="flex gap-2 items-center">
                                <p className="text-xl text-laranja tracking-wider font-sans font-semibold">{c.autor}</p>
                                <p className="text-sm text-laranja font-sans font-semibold opacity-80 leading-tight">{c.tempo}</p>
                            </div>
                        </div>
                        <p className="text-md text-gray-700 font-sans mt-3">{c.texto}</p>
                    </div>
                ))}
            </div>
            </div>


            {logado && (
                <form className="relative" >
                    <input 
                    className=" border font-sans tracking-wider border-transparent mt-16 w-full bg-card px-8 py-5 rounded-full focus:border-laranja focus:outline-none"
                    type="text"
                    placeholder="Adicionar Comentário"
                    />
                    <button type="submit" className="absolute top-21 right-12 text-laranja hover:text-orange-600 hover:cursor-pointer transition">
                        <FaPaperPlane size={22} />
                    </button>
                </form>
            )}

        </div>

    </main>
  );
}
