
import RateModal from "./RateModal";
import { toast } from "react-toastify";
import { createStoreRating, getStoreById } from "@/api/api";
import { useState, useEffect } from "react";
import { on } from "events";

interface Props {
  storeId: number;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
type Store = {
  id: number;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  sticker_url?: string | null;
};

export function CreateStoreRatingModal({ storeId, open, onClose, onSuccess }: Props) {

  const [Store, setStore] = useState<Store>()
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  
  const handleSend = async (rating: number, comment: string) => {
    try {
      await createStoreRating(storeId, { rating, comment });
      toast.success("Avaliação enviada!");
      if (onSuccess) {
        onSuccess();
      }
      onClose();
      setRating(0);
      setComment("");
    } catch {
      toast.error("Erro ao enviar avaliação!");
    }
  };

  useEffect(() => {
      async function fetchStore(id: number){
        const store = await getStoreById(id)
        return store;
      }
      async function loadData(id: number) {
        console.log("ID recebido:", storeId);
        const res = await fetchStore(id);
        setStore(res)
      }
      loadData(storeId)
    }, [storeId]);

  return (
    Store?.id ? (
          <RateModal
            open={open}
            title={Store.name}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            onClose={onClose}
            onConfirm={() => handleSend(rating, comment)}
          />
        ) : (
          <div>Carregando...</div>
        )
  );
}
