'use client'
import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaPaperPlane,} from "react-icons/fa";

export default function RatingsPage() {
    const [logado, setLogado] = useState(false);
    const { tipo, id} = useParams();
    const [comentarios, setComentarios] = useState<any[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setLogado(true);
    }, []);

    useEffect(() => {
        async function fetchComments() {
            if (!tipo || !id) return;

            try {
            const res = await fetch(`http://localhost:3001/comments/${tipo}-rating/${id}`);
            const data = await res.json();


            if (!res.ok || !Array.isArray(data)) {
                setComentarios([]); 
                return;
            }

            setComentarios(data);
            } catch (error) {
            console.error("Erro ao buscar comentários:", error);
            setComentarios([]); 
            }
        }

        fetchComments();
    }, [tipo, id]); 

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
                            <svg
                            key={star}
                            width="35"
                            height="35"
                            viewBox="0 0 29 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={star <= 4 ? "opacity-100" : "opacity-40"}
                            >
                            <path
                                d="M13.2104 0.729361C13.5205 -0.243083 14.8964 -0.243086 15.2065 0.729358L17.8047 8.87838C17.9439 9.31482 18.3505 9.61022 18.8086 9.6077L27.3616 9.56059C28.3823 9.55497 28.8075 10.8636 27.9785 11.459L21.0312 16.4483C20.6591 16.7155 20.5038 17.1934 20.6478 17.6283L23.3356 25.7482C23.6564 26.7172 22.5432 27.526 21.7207 26.9215L14.8288 21.856C14.4597 21.5847 13.9572 21.5847 13.5881 21.856L6.69615 26.9215C5.87372 27.526 4.76052 26.7172 5.08127 25.7482L7.76912 17.6283C7.91308 17.1934 7.75777 16.7155 7.3857 16.4483L0.438419 11.459C-0.390617 10.8636 0.0345829 9.55497 1.05524 9.56059L9.60833 9.6077C10.0664 9.61022 10.473 9.31482 10.6122 8.87838L13.2104 0.729361Z"
                                fill="#FFEB3A"
                            />
                            </svg>
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
                                        <p className="text-xl text-laranja tracking-wider font-sans font-semibold">{c.user?.username || "Usuário"}</p>
                                        <p className="text-sm text-laranja font-sans font-semibold opacity-80 leading-tight">{c.tempo}</p>
                                    </div>
                                </div>
                                <p className="text-md text-gray-700 font-sans mt-3">{c.content}</p>
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
