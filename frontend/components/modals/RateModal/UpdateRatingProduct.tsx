import RateModal from "./RateModal";
import { toast } from "react-toastify";
import { updateProductRating } from "@/api/api";

interface Props {
  ratingId: number;
  initialRating: number;
  initialComment: string;
  open: boolean;
  onClose: () => void;
}

export function UpdateProductRatingModal({
  ratingId,
  initialRating,
  initialComment,
  open,
  onClose,
}: Props) {
  const handleSend = async (rating: number, comment: string) => {
    try {
      await updateProductRating(ratingId, { rating, comment });
      toast.success("Avaliação atualizada!");
      onClose();
    } catch {
      toast.error("Erro ao atualizar avaliação!");
    }
  };

  return (
    <RateModal
      open={open}
      title={productName}
      rating={rating}
      setRating={setRating}
      comment={comment}
      setComment={setComment}
      onClose={close}
      onConfirm={handleSave}
      onDelete={handleDelete}
    />

  );
}
