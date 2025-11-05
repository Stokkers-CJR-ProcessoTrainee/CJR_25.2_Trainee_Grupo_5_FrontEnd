'use client';
import Navbar from "@/components/Navbar"

export default function storePage() {
    return (
        <main className="min-h-screen bg-gray-100 pb-16">

            <Navbar />

            <div className="bg-gray-400 p-60">
                
            </div>

            <div className="flex flex-col">
                <p className="text-laranja ml-6 text-center font-sans font-semibold text-3xl mt-10">
                    Reviews e Comentários 
                </p>

                <p className="text-center text-5xl font-sans font-semibold text-laranja mt-2"> 
                    4.8
                </p>
            </div>
            
            <div className="bg-gray-300 mt-10 p-30">
                div dos comentários
            </div>

            <div className="bg-gray-300 mt-10 p-30">
                div produtos melhores avaliados
            </div>

            <div className="bg-gray-300 mt-10 p-30">
                div todos os produtos
            </div>
        </main>
    )
}