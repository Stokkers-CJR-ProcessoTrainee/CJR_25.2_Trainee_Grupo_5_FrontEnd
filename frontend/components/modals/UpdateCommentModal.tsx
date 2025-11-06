import { addProductComment, addStoreComment } from "@/api/api";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

interface UpdateCommentModalProps {
    mostrar: boolean,
    fechar: () => void,
    tipo: "store" | "product",
    id: number;
}

export default function UpdateCommentModal({mostrar, fechar, tipo, id}: UpdateCommentModalProps) {
    const [comment, setComment] = useState("");

    const handleComentar = async () => {
        if (!comment.trim()) {
            toast.error('O comentário não pode estar vazio!');
            return;
        }

        try {
            const data = {text: comment};
            const request =
                tipo === 'store'
                    ? addStoreComment(id,data)
                    : addProductComment(id,data);
            await request;

            toast.success('Comentário feito com sucesso!');
            setComment('');
            fechar();
        } catch(err:any) {
            const message = err?.response?.data?.message || "Erro ao comentar!";
            toast.error(message);
        }
    }


    if (!mostrar) return null

    return(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-8 max-w-md w-full shadow-lg relative flex flex-col gap-6">

                <button
                onClick={fechar}
                className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800 transition text-2xl"
                >
                <FaTimes />
                </button>

                <h2 className="text-xl font-semibold font-sans text-laranja tracking-wider text-center text-foreground">
                Adicionar Comentário
                </h2>

                <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escreva seu comentário..."
                className="w-full h-32 p-3 border border-laranja rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-laranja resize-none"
                />

                <button
                onClick={handleComentar}
                className="p-3 rounded-full font-sans tracking-wider text-laranja border text-white border-laranja bg-laranja hover:bg-transparent hover:text-laranja transition cursor-pointer flex items-center justify-center gap-2"
                >
                Comentar
                </button>

            </div>
        </div>
    );
}