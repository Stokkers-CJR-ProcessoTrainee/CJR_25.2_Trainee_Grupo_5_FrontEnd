import RateModal from "./RateModal";
import { toast } from "react-toastify";
import { createProductRating, getProductComment, getProductById } from "@/api/api";
import { useEffect, useState } from "react";
interface Props {
  productId: number;
  open: boolean;
  onClose: () => void;
}
type Products = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  category_id: number;
  store_id: number;
};

export function CreateProductRatingModal({ productId, open, onClose }: Props) {

  const [Product, setProduct] = useState<Products>()
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const handleSend = async (rating: number, comment: string) => {
    try {
      await createProductRating(productId, { rating, comment });
      toast.success("Avaliação enviada!");
      onClose();
    } catch {
      toast.error("Erro ao enviar avaliação!");
    }
  };

  useEffect(() => {
    async function fetchProduct(id: number){
      const product = await getProductById(id)
      return product;
    }
    async function loadData(id: number) {
      const res = await fetchProduct(id)
      setProduct(res.data)
    }
    loadData(productId)
  }, [productId]);

  return (
    Product?.name ? (
      <RateModal
        open={open}
        title={Product.name}
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
