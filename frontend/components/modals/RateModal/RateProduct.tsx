import RateModal from "./RateModal";
import { toast } from "react-toastify";
import { createProductRating } from "@/api/api";

interface Props {
  productId: number;
  open: boolean;
  onClose: () => void;
}

export function CreateProductRatingModal({ productId, open, onClose }: Props) {
  const handleSend = async (rating: number, comment: string) => {
    try {
      await createProductRating(productId, { rating, comment });
      toast.success("Avaliação enviada!");
      onClose();
    } catch {
      toast.error("Erro ao enviar avaliação!");
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
      onConfirm={handleSubmit}
    />


  );
}
