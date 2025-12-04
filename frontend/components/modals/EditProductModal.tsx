'use client';

import { useState, useEffect } from "react";
import { deleteProduct, updateProduct } from "@/api/api";
import { toast } from "react-toastify";
import { getCategories } from "@/api/api";

interface EditProductModalProps {
  open: boolean;
  close: () => void;
  product: Product | null;
  onUpdated?: () => void;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  stock: number;
  category_id: number;
}

type Category = {
  id: number,
  name: string,
  parent_category_id?: number
}

export default function EditProductModal({ open, close, product, onUpdated }: EditProductModalProps) {
  if (!open) return null;
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


  useEffect(() => {
    if (open && product) {
      setName(product.name);
      setDescription(product.description || "");
      setCategory(product.category_id.toString());
      setPrice(product.price.toString());
      setQuantity(product.stock);
    }
  }, [open, product]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name || !category || !price) {
      return toast.error("Por favor, preencha todos os campos obrigatórios!");
    }

    if (!product?.id) {
      return toast.error("Erro: Produto não identificado.");
    }

    setLoading(true);
    try {
      const payload = {
        name,
        description,
        category_id: parseInt(category),
        price: parseFloat(price),
        stock: quantity,
      };

      await updateProduct(product?.id, payload);
      console.log("Sending payload:", payload);

      toast.success("Produto atualizado com sucesso!");
      if (onUpdated) onUpdated();
      close();

    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar produto");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    if (!product?.id) return;
    if (!confirm("Tem certeza que deseja deletar esta produto?")) return;
    try {
      await deleteProduct(product?.id);
      toast.success("Produto deletado com sucesso");
      if (onUpdated) onUpdated();
      close();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar produto!");
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

        <h2 className="text-text font-sans text-3xl mb-4"> Editar Produto </h2>

        <div className="flex flex-col w-full h-full items-center justify-center gap-2">

          <div className="w-full h-2/11 border-2 border-dashed border-laranja rounded-3xl"></div>

          <input
            type="text"
            placeholder="Nome do Produto"
            className="bg-modalinfo text-text w-full h-1/11 rounded-3xl pl-4"
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
            className="bg-modalinfo text-text w-full h-2/11 rounded-3xl pl-4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            step="0.01"
            placeholder="Preco do Produto"
            className="bg-modalinfo text-text w-full h-1/11 rounded-3xl pl-4"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button
            onClick={handleDelete}
            className="w-full h-1/11 bg-red-600 rounded-3xl text-white text-center text-xl hover:brightness-90 hover:cursor-pointer transition"
          >
            DELETAR
          </button>

          <div className="flex flex-row items-center justify-center gap-2 h-2/11">
            <div className="w-12 h-12 border-3 border-laranja text-center rounded-full hover:brightness-90 hover:cursor-pointer transition text-4xl text-laranja" onClick={() => setQuantity(Math.max(0, quantity - 1))}> - </div>
            <div className="w-60 text-center text-laranja font-sans text-5xl"> {quantity} </div>
            <div className="w-12 h-12 border-3 border-laranja text-center rounded-full hover:brightness-90 hover:cursor-pointer transition text-4xl text-laranja" onClick={() => setQuantity(quantity + 1)}> + </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-50 h-1/11 rounded-3xl text-white text-center text-xl 
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-laranja hover:brightness-90"}
            `}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>

        </div>
      </div>
    </div>
  );
}
