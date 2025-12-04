'use client'
import { addProductComment, addStoreComment, deleteProductComment, deleteStoreComment, getProductComment, getProductRating, getStoreComment, getStoreRating } from "@/api/api";
import { timeDiff } from "@/api/auxiliar/timeDiff";
import UpdateCommentModal from "@/components/modals/UpdateCommentModal";
import UpdateRatingStoreModal from "@/components/modals/RateModal/UpdateRatingStore";
import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FaArrowLeft, FaGem, FaPaperPlane, FaPen, FaTrash,} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import {motion, AnimatePresence} from "framer-motion";

interface Rating {
  id: number;
  comment: string;
  user_id: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    profile_picture_url?: string;
  };
  store: {
    user_id:number;
  }
}

export default function RatingsPage() {
    const { tipo, id} = useParams();

    const [userId, setUserId] = useState(0);
    const [logado, setLogado] = useState(false);
    const [donoRating, setDonoRating] = useState(false);
    const [donoLoja, setDonoLoja] = useState(false);

    const [comentarios, setComentarios] = useState<any[]>([]);
    const [newComentario, setNewComentario] = useState('');

    const [rating, setRating] = useState<Rating | null>(null);

    const [comentarioEditar,setComentarioEditar] = useState<any | null>(null);
    const [ratingEditar,setRatingEditar] = useState<any | null>(null);

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
    
            setDonoLoja(rating.store.user_id === userId)
        }
    }, [rating, userId]);

    useEffect(() => {
        async function fetchRating() {
            if (!tipo || !id) return;

            try {
                const rating = tipo === 'store'
                    ? await getStoreRating(Number(id))
                    : await getProductRating(Number(id));
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
                const commentsData = tipo === 'store'
                    ? await getStoreComment(Number(id))
                    : await getProductComment(Number(id));
                setComentarios(commentsData);
            } catch (error) {
                console.error("Erro ao buscar comentários:", error);
                setComentarios([]); 
            }
        }

        fetchComments();
    }, [tipo, id]); 

    const handleAddComment = async (e:FormEvent) => {
        e.preventDefault();
        if (!newComentario) {
            toast.error("Escreva algo para comentar!");
            return;
        }
        try {
            const data = {
                content: newComentario
            }
            let newComment;
            if (tipo === 'store') {
                newComment = await addStoreComment(Number(id), data);
            } else {
                newComment = await addProductComment(Number(id), data);
            }

            setComentarios((prev) => [...prev, newComment]); 
            setNewComentario('');
            toast.success('Comentário feito com sucesso!');
        } catch (err:any) {
            const message = err?.response?.data?.message || "Erro ao comentar!";
            toast.error(message);
        }
    }

    const handleDelete = async (comentario:any) => {
        const confirm = window.confirm("Tem certeza que deseja deletar a conta? Isso é permanente e vai apagar todos os dados do usuário!")
        if (!confirm) return;

        try {
            if (tipo === 'store') {
                await deleteStoreComment(Number(comentario.id), rating?.id);
            } else {
                await deleteProductComment(Number(comentario.id), rating?.id);
            }
            setComentarios(prev => prev.filter(c => c.id !== comentario.id));
            toast.success('Comentário deletado com sucesso');
        } catch (err:any) {
            const message = err?.response?.data?.message || "Erro ao comentar!";
            toast.error(message);
        }
    }

    return (
        <main className="w-full overflow-x-hidden min-h-screen flex flex-col bg-back">
            <Navbar />

            <div className="bg-cinza w-full h-115 text-black text-text shadow-md relative flex flex-col justify-center px-8">
            
                <div className="flex items-center justify-between mx-40">

                    {donoRating &&
                        <button 
                        onClick={() => setRatingEditar(true)}
                        className="absolute top-[28%] right-[11%] text-laranja cursor-pointer hover:text-white transition">
                            <FaPen size={28} />
                        </button>
                    }

                    <div className="flex items-center gap-4">

                        <button className="hover:opacity-80 hover:text-red-600 transition hover:cursor-pointer">
                            <FaArrowLeft size={28} />
                        </button>

                        <img
                        src={rating?.user.profile_picture_url}
                        alt="Foto do usuário"
                        className="w-18 h-18 rounded-full border-2 border-laranja object-cover"
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
                            className={star <= (rating?.rating ?? 0) ? "opacity-100" : "opacity-30"}
                            >
                            <path
                                d="M13.2104 0.729361C13.5205 -0.243083 14.8964 -0.243086 15.2065 0.729358L17.8047 8.87838C17.9439 9.31482 18.3505 9.61022 18.8086 9.6077L27.3616 9.56059C28.3823 9.55497 28.8075 10.8636 27.9785 11.459L21.0312 16.4483C20.6591 16.7155 20.5038 17.1934 20.6478 17.6283L23.3356 25.7482C23.6564 26.7172 22.5432 27.526 21.7207 26.9215L14.8288 21.856C14.4597 21.5847 13.9572 21.5847 13.5881 21.856L6.69615 26.9215C5.87372 27.526 4.76052 26.7172 5.08127 25.7482L7.76912 17.6283C7.91308 17.1934 7.75777 16.7155 7.3857 16.4483L0.438419 11.459C-0.390617 10.8636 0.0345829 9.55497 1.05524 9.56059L9.60833 9.6077C10.0664 9.61022 10.473 9.31482 10.6122 8.87838L13.2104 0.729361Z"
                                fill="#FFE600"
                            />
                            </svg>
                        ))}
                    </div>

                </div>

                <p className="mt-8 text-3xl font-sans tracking-wider opacity-95 ml-52 max-w-8xl">
                    {rating?.comment}
                </p>
            
            </div>

            <div className="mt-10 px-12 sm:px-24 lg:px-40 pb-16">
                <div className="flex">
                    <div className="w-1 bg-cinza text-text rounded-full"></div>

                    <div className="flex flex-col gap-8 pl-12">
                        <AnimatePresence>
                        {comentarios.map((c) => {
                            const donoComment = c.user_id === userId;
                            return (
                            <motion.div 
                            key={c.id} 
                            className="bg-card shadow-md rounded-2xl p-7 w-150 relative"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 10 } }}
                            exit={{
                            scale: 0,
                            opacity: 0,
                            rotate: Math.random() * 40 - 20,
                            transition: { duration: 0.6 }
                            }}
                            >
                                    {donoComment && (
                                        <button 
                                        onClick={() => setComentarioEditar(c)}
                                        className="absolute right-7 text-laranja2 cursor-pointer hover:text-laranja transition">
                                            <FaPen size={20} />
                                        </button>
                                    )}
                                    {donoComment && (
                                        <button 
                                        onClick={() => handleDelete(c)}
                                        className="absolute right-7 bottom-4 text-laranja2 cursor-pointer hover:text-red-600 transition">
                                            <FaTrash size={20} />
                                        </button>
                                    )}                                   
                                <div className="flex gap-3 items-center">
                                    <img
                                    src={c.user.profile_picture_url}
                                    alt="Foto do usuário"
                                    className="w-10 h-10 rounded-full border-2 border-laranja object-cover"
                                    />
                                    <div className="flex gap-2 text-text items-center relative">
                                        {(donoLoja == donoComment) && (
                                            <div className="relative group inline-block">
                                                <span className="text-laranja">
                                                    <FaGem size={16} />
                                                </span>
                                                <div className="absolute bottom-full font-sans tracking-wider left-7 -translate-x-1/2 mb-2 hidden group-hover:block
                                                                text-laranja text-xs rounded border py-1 px-2 whitespace-nowrap shadow-lg">
                                                    Dono da loja
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-xl  tracking-wider font-sans font-semibold">{c.user?.username}</p>
                                        {(c.createdAt == c.updatedAt) ?
                                            <p className="text-sm  font-sans  opacity-80 leading-tight">{timeDiff(c.createdAt)}</p>
                                        : 
                                            <p className="text-sm  font-sans  opacity-80 leading-tight">Editado há {timeDiff(c.updatedAt)}</p>
                                        }
                                    </div>
                                </div>
                                <p className="text-md text-text font-sans mt-4">{c.content}</p>
                            </motion.div>
                        );})}
                        </AnimatePresence>
                    </div>
                </div>


                {logado && (
                    <form 
                    onSubmit={handleAddComment}
                    className="relative"  >
                        <input 
                        value={newComentario}
                        onChange={(e) => setNewComentario(e.target.value)}
                        className=" border font-sans tracking-wider text-text border-transparent mt-16 w-full bg-card px-8 py-5 rounded-full focus:border-laranja focus:outline-none"
                        type="text"
                        placeholder="Adicionar Comentário"
                        />
                        <button type="submit" className="absolute top-21 right-12 text-laranja2 hover:text-laranja hover:cursor-pointer transition">
                            <FaPaperPlane size={22} />
                        </button>
                    </form>
                )}

            </div>
            <UpdateRatingStoreModal
            ratingId={rating?.id!}
            open={!!ratingEditar}
            onClose={() => setRatingEditar(null)}
            />
            <UpdateCommentModal
            mostrar={!!comentarioEditar}
            fechar={() => setComentarioEditar(null)}
            tipo={tipo as "store" | "product"} 
            rating_id={rating?.id}
            comentario={comentarioEditar}
            onUpdate={(updated) => {
            setComentarios(prev =>
            prev.map(c => c.id === updated.id ? { ...c, ...updated } : c)
            );
            }}
            />
            <ToastContainer/>
        </main>
    );
}
