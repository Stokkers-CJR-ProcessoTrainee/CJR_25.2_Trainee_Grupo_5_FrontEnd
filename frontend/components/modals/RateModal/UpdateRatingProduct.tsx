import { useEffect, useState } from "react";
import RateModal from "./RateModal";
import { toast } from "react-toastify";
import { getProductRating, updateProductRating, deleteProductRating } from "@/api/api";

interface Props {
  ratingId: number;
  open: boolean;
  onClose: () => void;
}

export function UpdateProductRatingModal({ ratingId, open, onClose }: Props) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [productName, setProductName] = useState<string>("");

  useEffect(() => {
    async function loadRating() {
      try {
        const res = await getProductRating(ratingId);

        setRating(res.rating);
        setComment(res.comment);
        setProductName(res.product.name);

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
      await updateProductRating(ratingId, { rating, comment });
      toast.success("Avaliação atualizada!");
      onClose();
    } catch {
      toast.error("Erro ao atualizar avaliação!");
    }
  };

  // ---- DELETAR ----
  const handleDelete = async () => {
    try {
      await deleteProductRating(ratingId);
      toast.success("Avaliação removida!");
      onClose();
    } catch {
      toast.error("Erro ao remover avaliação!");
    }
  };

  return (
    <RateModal
      open={open}
      title={`Editar: ${productName}`}
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
