import { useEffect, useState } from "react";
import RateModal from "./RateModal";
import { toast } from "react-toastify";
import { getProductRating, updateProductRating, deleteProductRating } from "@/api/api";
import { on } from "events";
import { useRouter } from "next/navigation";

interface Props {
  ratingId: number;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpdateProductRatingModal({ ratingId, open, onClose, onSuccess }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [productId, setProductId] = useState<number | null>(null);

  useEffect(() => {
    async function loadRating() {
      try {
        const res = await getProductRating(ratingId);

        setRating(res.rating);
        setComment(res.comment);
        setProductName(res.product.name);
        setProductId(res.product_id);

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
      onSuccess();
      onClose();
    } catch {
      toast.error("Erro ao atualizar avaliação!");
    }
  };

  // ---- DELETAR ----
  const handleDelete = async () => {
    if (!confirm("Deletar avaliação?")) return;
    try {
      await deleteProductRating(ratingId);
      toast.success("Avaliação removida!");
      onClose();
      router.push(`/product/${productId}`)
    } catch {
      toast.error("Erro ao remover avaliação!");
    }
  };

  return (
    <RateModal
      open={open}
      title={`${productName}`}
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
