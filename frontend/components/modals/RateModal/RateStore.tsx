import RateModal from "./RateModal";
import { toast } from "react-toastify";
import { createStoreRating } from "@/api/api";

interface Props {
  storeId: number;
  open: boolean;
  onClose: () => void;
}

export function CreateStoreRatingModal({ storeId, open, onClose }: Props) {
  const handleSend = async (rating: number, comment: string) => {
    try {
      await createStoreRating(storeId, { rating, comment });
      toast.success("Avaliação enviada!");
      onClose();
    } catch {
      toast.error("Erro ao enviar avaliação!");
    }
  };

  return (
    <RateModal
      open={open}
      title={storeName}
      rating={rating}
      setRating={setRating}
      comment={comment}
      setComment={setComment}
      onClose={close}
      onConfirm={handleSubmit}
    />

  );
}
