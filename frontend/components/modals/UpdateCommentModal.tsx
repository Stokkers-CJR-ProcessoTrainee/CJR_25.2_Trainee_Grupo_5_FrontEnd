import { updateProductComment, updateStoreComment } from "@/api/api";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

interface UpdateCommentModalProps {
  mostrar: boolean,
  fechar: () => void,
  tipo: "store" | "product",
  comentario: any | null;
  onUpdate: (updated: any) => void;
  rating_id: number | undefined;
}

export default function UpdateCommentModal({ mostrar, fechar, tipo, rating_id, comentario, onUpdate }: UpdateCommentModalProps) {
  const [comment, setComment] = useState(comentario?.content || "");

  useEffect(() => {
    setComment(comentario?.content || "");
  }, [comentario]);

  const handleClose = () => {
    setComment('');
    fechar();
  };

  const handleUpdate = async () => {
    if (!comment.trim()) {
      toast.error('O comentário não pode estar vazio!');
      return;
    }

    try {
      const data = { content: comment };
      if (tipo == "store") {
        const updated = await updateStoreComment(comentario.id, data, rating_id);
        onUpdate(updated);
      }
      if (tipo == "product") {
        const updated = await updateProductComment(comentario.id, data, rating_id);
        onUpdate(updated);
      }
      toast.success("Comentário atualizado!");
      handleClose();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Erro ao atualizar!";
      toast.error(message);
    }
  }


  if (!mostrar) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-back rounded-lg p-8 max-w-md w-full relative flex flex-col gap-6">

        <button
          onClick={handleClose}
          className="absolute cursor-pointer top-4 right-4 text-text hover:text-gray-800 transition text-xl"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold font-sans text-text tracking-wider text-center text-foreground">
          Editar Comentário
        </h2>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escreva seu comentário..."
          className="bg-card text-text w-full h-32 p-3 border border-transparent rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-laranja focus:border-laranja resize-none"
        />

        <button
          onClick={handleUpdate}
          className="p-3 rounded-full font-sans tracking-wider text-laranja border border-laranja hover:bg-laranja hover:text-white transition cursor-pointer flex items-center justify-center gap-2"
        >
          Atualizar
        </button>

      </div>
    </div>
  );
}
