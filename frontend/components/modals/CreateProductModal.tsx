'use client';

import { useEffect, useState } from "react";
import { createProduct } from "@/api/api";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { getCategories } from "@/api/api";

interface CreateProductModalProps {
  open: boolean;
  close: () => void;
  onUpdated?: () => void;
}

type Category = {
  id: number,
  name: string,
  parent_category_id?: number
}

export default function CreateProductModal({ open, close, onUpdated }: CreateProductModalProps) {
  if (!open) return null;
  const { id } = useParams();
  const [quantity, setQuantity] = useState(0);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [Categories, setCategories] = useState<Category[]>([]);


  useEffect(() => {

    async function fetchProduct() {

      try {
        const categories = await getCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      }
    }

    fetchProduct();
  }, []);

  const handleSubmit = async () => {
    if (!name || !category || !price) {
      toast.error("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    if (quantity < 0) {
      toast.error("A quantidade deve ser maior que 0.");
      return;
    }

    setLoading(true);
    try {
      const numericPrice = parseFloat(price);
      const numericCategory = parseInt(category);
      const storeId = Number(id);

      const payload = {
        name: name,
        category_id: numericCategory,
        description: description,
        price: numericPrice,
        stock: quantity,
      };

      console.log("Sending payload:", payload);
      await createProduct(storeId, payload);

      toast.success("Produto criado com sucesso!");
      if (onUpdated) onUpdated();
      close();

    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar produto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={close}
    >

      <div
        className="bg-bgmodal relative rounded-2xl p-6 w-120 h-135 shadow-lg flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="absolute top-2 right-2 w-8 h-8 hover:text-red-500"
          onClick={close}
        >
          <img
            src="/images/botao-de-sair.png"
            alt='sair'
            className="h-4 w-4"
          />
        </button>

        <h2 className="font-sans text-text text-3xl mb-4"> Adicionar Produto </h2>

        <div className="flex flex-col w-full h-full items-center justify-center gap-2">

          <div className="w-full h-1/5 border-2 border-dashed border-laranja rounded-3xl"></div>

          <input
            type="text"
            placeholder="Nome do Produto"
            className="bg-modalinfo text-text w-full h-1/10 rounded-3xl pl-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className={`bg-modalinfo pl-4 rounded-3xl w-full h-1/10 ${category === "" ? "text-cinzaplaceholder" : "text-text"}`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled> Selecione uma Categoria </option>

            {Categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="text-text">
                {cat.name}
              </option>
            ))}

          </select>

          <input
            type="text"
            placeholder="Descricao do Produto"
            className="bg-modalinfo text-text w-full h-1/5 rounded-3xl pl-4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            step="0.01"
            placeholder="Preco do Produto"
            className="bg-modalinfo text-text w-full h-1/10 rounded-3xl pl-4"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <div className="flex flex-row items-center justify-center gap-2 h-1/5">
            <div className="w-12 h-12 border-3 border-laranja text-center rounded-full hover:brightness-90 hover:cursor-pointer transition text-4xl text-laranja" onClick={() => setQuantity(Math.max(0, quantity - 1))}> - </div>
            <div className="w-60 text-center text-laranja font-sans text-5xl"> {quantity} </div>
            <div className="w-12 h-12 border-3 border-laranja text-center rounded-full hover:brightness-90 hover:cursor-pointer transition text-4xl text-laranja" onClick={() => setQuantity(quantity + 1)}> + </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading} // Prevents double clicking
            className={`w-50 h-1/10 rounded-3xl text-white text-center text-xl 
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-laranja hover:brightness-90"}
            `}
          >
            {loading ? "Salvando..." : "Adicionar"}
          </button>

        </div>
      </div>
    </div>
  );
}
