'use client'
import { addProductComment, addStoreComment, getStoreComment, getStoreRating } from "@/api/api";
import { timeDiff } from "@/api/auxiliar/timeDiff";
import UpdateCommentModal from "@/components/modals/UpdateCommentModal";
import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FaArrowLeft, FaPaperPlane, FaPen,} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

interface Rating {
  id: number;
  comment: string;
  user_id: number;
  rating: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
    profile_picture_url?: string;
  };
}

export default function RatingsPage() {
    const { tipo, id} = useParams();

    const [userId, setUserId] = useState(0);
    const [logado, setLogado] = useState(false);
    const [donoRating, setDonoRating] = useState(false);

    const [comentarios, setComentarios] = useState<any[]>([]);
    const [newComentario, setNewComentario] = useState('');

    const [rating, setRating] = useState<Rating | null>(null);

    const [mostrar,setMostrar] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { return; }

        setLogado(true);

        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.sub);
    }, []);

    useEffect(() => {
        if (rating && userId) {
            setDonoRating(rating.user_id === userId);
        }
    }, [rating, userId]);

    useEffect(() => {
        async function fetchRating() {
            if (!tipo || !id) return;

            try {
                const rating = await getStoreRating(Number(id));

                setRating(rating);

            } catch (error) {
            console.error("Erro ao acessar a avaliação:", error);
            setComentarios([]); 
            }
        }

        fetchRating();
    }, [tipo, id]); 

    useEffect(() => {
        async function fetchComments() {
            if (!tipo || !id) return;

            try {
                const commentsData = await getStoreComment(Number(id));

                setComentarios(commentsData);

            } catch (error) {
            console.error("Erro ao buscar comentários:", error);
            setComentarios([]); 
            }
        }

        fetchComments();
    }, [tipo, id]); 

    const handleAddComment = async (e:FormEvent) => {
        if (!newComentario) {
            toast.error("Escreva algo para comentar!");
            return;
        }
        try {
            const data = {
                content: newComentario
            }
            const request =
                tipo === 'store'
                ? addStoreComment(Number(id),data)
                : addProductComment(Number(id),data);
            await request;
            
            setNewComentario('');
            toast.success('Comentário feito com sucesso!');
        } catch (err:any) {
            const message = err?.response?.data?.message || "Erro ao comentar!";
            toast.error(message);
        }
    }

    return (
        <main className="w-full overflow-x-hidden min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <div className="bg-laranja w-full h-115 text-white shadow-md relative flex flex-col justify-center px-8">
            
                <div className="flex items-center justify-between mx-40">

                    {donoRating &&
                        <button className="absolute top-[28%] right-[11%] text-white cursor-pointer hover:text-gray-300 transition">
                            <FaPen size={28} />
                        </button>
                    }

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
                            <h2 className="text-3xl font-semibold font-sans leading-tight">{rating?.user.username}</h2>
                            <p className="text-md font-sans font-semibold opacity-80 leading-tight">{timeDiff(rating?.createdAt)}</p>
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
                            className={star <= (rating?.rating ?? 0) ? "opacity-100" : "opacity-40"}
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
                    {rating?.comment}
                </p>
            
            </div>

            <div className="mt-10 px-12 sm:px-24 lg:px-40 pb-16">
                <div className="flex">
                    <div className="w-1 bg-gray-400 rounded-full"></div>

                    <div className="flex flex-col gap-8 pl-12">
                        {comentarios.map((c, i) => {
                            const donoComment = c.user_id === userId;
                            return (
                            <div key={i} className="bg-card shadow-md rounded-2xl p-6 w-150 relative">
                                    {donoComment && (
                                        <button 
                                        onClick={() => setMostrar(true)}
                                        className="absolute right-7 text-laranja2 cursor-pointer hover:text-laranja transition">
                                            <FaPen size={20} />
                                        </button>
                                    )}
                                <div className="flex gap-3 items-center">
                                    <img
                                    src="/user-placeholder.png"
                                    alt="Foto do usuário"
                                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                    />
                                    <div className="flex gap-2 items-center">
                                        <p className="text-xl text-laranja tracking-wider font-sans font-semibold">{c.user?.username}</p>
                                        <p className="text-sm text-laranja font-sans font-semibold opacity-80 leading-tight">{timeDiff(c.createdAt)}</p>
                                    </div>
                                </div>
                                <p className="text-md text-gray-700 font-sans mt-3">{c.content}</p>
                            </div>
                        );})}
                    </div>
                </div>


                {logado && (
                    <form 
                    onSubmit={handleAddComment}
                    className="relative"  >
                        <input 
                        value={newComentario}
                        onChange={(e) => setNewComentario(e.target.value)}
                        className=" border font-sans tracking-wider border-transparent mt-16 w-full bg-card px-8 py-5 rounded-full focus:border-laranja focus:outline-none"
                        type="text"
                        placeholder="Adicionar Comentário"
                        />
                        <button type="submit" className="absolute top-21 right-12 text-laranja2 hover:text-laranja hover:cursor-pointer transition">
                            <FaPaperPlane size={22} />
                        </button>
                    </form>
                )}

            </div>
            <UpdateCommentModal
            mostrar={mostrar}
            fechar={() => setMostrar(false)}
            tipo={"store"}
            id = {1}
            />
            <ToastContainer/>
        </main>
    );
}
