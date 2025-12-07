import { use, useEffect, useState } from "react";
import RateModal from "./RateModal";
import { toast } from "react-toastify";
import { getStoreRating, updateStoreRating, deleteStoreRating } from "@/api/api";
import { on } from "events";
import { useRouter } from "next/navigation";

interface Props {
  ratingId: number;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateStoreRatingModal({ ratingId, open, onClose, onSuccess }: Props) {
  const router = useRouter();

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [storeName, setStoreName] = useState<string>("");
  const [storeId, setStoreId] = useState<number | null>(null);

  useEffect(() => {
    async function loadRating() {
      try {
        const res = await getStoreRating(ratingId);
        console.log("RESPONSE:", {res})
        setRating(res.rating);
        setComment(res.comment);
        setStoreName(res.store.name);
        setStoreId(res.store_id);

      } catch (err) {
        toast.error("Erro ao carregar avaliação.");
      }
    }

    if (open) loadRating();
  }, [ratingId, open]);

  // ---- SALVAR UPDATE ----
  const handleSave = async () => {
    console.log("Handle save chamado", {rating, comment})
    try {
      await updateStoreRating(ratingId, { rating, comment });
      toast.success("Avaliação atualizada!");
      onSuccess()
      onClose();
    } catch {
      toast.error("Erro ao atualizar avaliação!");
    }
  };

  // ---- DELETAR ----
  const handleDelete = async () => {
    if (!confirm("Deletar avaliação?")) return;
    try {
      await deleteStoreRating(ratingId);
      toast.success("Avaliação removida!");
      onClose();
      router.push(`/store/${storeId}/ratings`)
    } catch {
      toast.error("Erro ao remover avaliação!");
    }
  };

  return (
    <RateModal
      open={open}
      title={`Editar: ${storeName}`}
      rating={rating}
      setRating={setRating}
      comment={comment}
      setComment={setComment}
      onClose={onClose}
      onConfirm={handleSave}
      onDelete={handleDelete}
    />
  );
}
