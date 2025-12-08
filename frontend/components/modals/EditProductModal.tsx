'use client';

import { useState, useEffect, useRef } from "react";
import { deleteImage, deleteProduct, getChildCategories, updateProduct, createProductImage } from "@/api/api";
import { toast } from "react-toastify";
import Carrossel from "../Carrossel";
import { FaPlus, FaTimes } from "react-icons/fa";

interface EditProductModalProps {
  open: boolean;
  close: () => void;
  product: Product | null;
  onUpdated?: () => void;
  storeCategoryId: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  stock: number;
  category_id: number;
  product_images?: { id: number; image_url: string; order: number }[];
}

type Category = {
  id: number,
  name: string,
  parent_category_id?: number
}

export default function EditProductModal({ open, close, product, onUpdated, storeCategoryId }: EditProductModalProps) {

  if (!open) return null;

  const [quantity, setQuantity] = useState(0);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [SubCategories, setSubCategories] = useState<Category[]>([]);
  const [Images, setImages] = useState(product?.product_images || []);

  const [isDragging, setIsDragging] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && storeCategoryId) {
      const loadCategories = async () => {
        try {
          const childCategories = await getChildCategories(storeCategoryId);
          setSubCategories(childCategories || []);
        } catch (error) {
          console.error("Failed to load categories", error);
        }
      };
      loadCategories();
    }
  }, [open, storeCategoryId]);

  useEffect(() => {
    if (open && product) {
      setName(product.name);
      setDescription(product.description || "");
      setCategory(product.category_id.toString());
      setPrice(product.price.toString());
      setQuantity(product.stock);
      setImages(product.product_images || []);
      setIsDropdownOpen(false);
      setIsDragging(false); 
    }
  }, [open, product]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const UploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await fetch("https://stokkers.onrender.com/upload", {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) throw new Error("Erro no upload");
    const data = await res.json();
    return data.url;
  }

  const uploadAndAttachImage = async (file: File) => {
    if (!product) return;

    setLoading(true);
    const toastId = toast.loading("Enviando imagem...");

    try {
      const url = await UploadFile(file);

      const currentOrders = Images.map(img => img.order);
      const maxOrder = currentOrders.length > 0 ? Math.max(...currentOrders) : -1;
      const nextOrder = maxOrder + 1;

      const payload = {
        image_url: url,
        order: nextOrder
      };
      
      const newImageResponse = await createProductImage(product.id, payload);

      const newImageObj = {
        id: newImageResponse.id || Date.now(), 
        image_url: url,
        order: nextOrder
      };

      setImages([...Images, newImageObj]);
      
      toast.update(toastId, { render: "Imagem adicionada!", type: "success", isLoading: false, autoClose: 3000 });
      onUpdated?.();

    } catch (error) {
      console.error(error);
      toast.update(toastId, { render: "Erro ao adicionar imagem", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setLoading(false);
      setIsDragging(false);
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        await uploadAndAttachImage(file);
    }
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); 
    if (!loading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); 
    setIsDragging(false);
    
    if (loading) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        await uploadAndAttachImage(file);
    } else if (file) {
        toast.warn("Por favor, solte apenas arquivos de imagem.");
    }
  };


  const handleSubmit = async () => {
    if (!name || !category || !price) {
      return toast.error("Por favor, preencha todos os campos obrigatórios!");
    }

    if (!product?.id) return toast.error("Erro: Produto inválido.");

    setLoading(true);

    try {
      const payload = {
        name,
        description,
        category_id: parseInt(category),
        price: parseFloat(price),
        stock: quantity,
      };

      await updateProduct(product.id, payload);

      toast.success("Produto atualizado!");
      onUpdated?.();
      close();

    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (!confirm("Deletar imagem?")) return;

    try {
      await deleteImage(id);
      setImages(prev => prev.filter(img => img.id !== id));
      toast.success("Imagem deletada!");
      onUpdated?.();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao deletar imagem.");
    }
  };

  const handleDelete = async () => {
    if (!product?.id) return;
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;

    try {
      await deleteProduct(product.id);
      toast.success("Produto deletado.");
      onUpdated?.();
      close();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao deletar.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={close}
    >
      <div
        className="bg-back relative rounded-2xl p-10 w-120 h-145 shadow-lg flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-text hover:cursor-pointer text-xl w-8 h-8 hover:text-gray-800"
          onClick={close}
        >
          <FaTimes />
        </button>

        <h2 className="text-center font-sans font-semibold text-2xl text-text mb-4">
          Editar Produto
        </h2>

        <div className="flex flex-col w-full h-full items-center justify-start gap-4 mt-2">

          <div className="flex flex-row h-2/11 w-full gap-4">
            
            <label 
                className={`aspect-square h-full border-2 border-dashed border-laranja rounded-3xl flex items-center justify-center transition relative 
                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isDragging ? 'bg-laranja/20 scale-105' : 'hover:bg-laranja/10'} 
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {loading ? (
                    <span className="text-laranja text-xs animate-pulse">...</span>
                ) : (
                    <FaPlus className="text-laranja text-2xl" />
                )}
                
                <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleInputChange}
                    disabled={loading}
                />
            </label>

            <Carrossel>
              {Images.map(item => (
                <div
                  key={item.id}
                  className="bg-card hover:border-3 hover:border-red-600 rounded-2xl hover:brightness-90 hover:cursor-pointer transition h-full shrink-0 snap-start"
                  onClick={() => handleDeleteImage(item.id)}
                >
                  <img
                    src={item.image_url}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              ))}
            </Carrossel>
          </div>

          <input
            type="text"
            placeholder="Nome do Produto"
            className="w-full bg-card p-2 pl-5 rounded-2xl border border-transparent focus:border-laranja focus:outline-none text-text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="relative w-full" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(v => !v)}
              className="w-full bg-card p-2 pl-5 pr-10 rounded-2xl border border-transparent focus:border-laranja focus:outline-none text-text text-left cursor-pointer flex justify-between items-center"
            >
              <span>
                {category
                  ? SubCategories.find(c => c.id.toString() === category)?.name
                  : "Selecione uma Categoria"}
              </span>

              <svg
                className={`fill-current h-4 w-4 text-laranja transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-md bg-card py-1 text-base shadow-lg focus:outline-none border border-transparent scrollbar-hide">
                {SubCategories.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.id.toString());
                      setIsDropdownOpen(false);
                    }}
                    className={`cursor-pointer select-none py-2 pl-3 pr-9 ${cat.id.toString() === category
                      ? "bg-laranja text-white font-semibold"
                      : "text-text hover:bg-laranja/20"
                      }`}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <textarea
            placeholder="Descrição"
            className="w-full bg-card p-2 px-5 pt-3 text-text border border-transparent focus:border-laranja focus:outline-none rounded-2xl resize-none h-40"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            step="0.01"
            placeholder="Preço do Produto"
            className="w-full bg-card p-2 pl-5 text-text border border-transparent focus:border-laranja rounded-2xl"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button
            onClick={handleDelete}
            className="w-full h-12 border hover:cursor-pointer border-laranja rounded-2xl text-laranja hover:bg-red-600 hover:text-white text-lg transition"
          >
            Deletar
          </button>

          <div className="flex flex-row items-center justify-center gap-4 h-16">
            <div
              className="w-10 h-10 border border-laranja text-laranja rounded-full flex items-center justify-center hover:bg-laranja hover:text-white cursor-pointer"
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
            >
              -
            </div>

            <div className="w-20 text-center text-laranja font-semibold font-sans text-2xl">
              {quantity}
            </div>

            <div
              className="w-10 h-10 border border-laranja text-laranja rounded-full flex items-center justify-center hover:bg-laranja hover:text-white cursor-pointer"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-48 h-12 border mb-3 border-laranja rounded-2xl text-laranja text-lg transition ${loading ? "cursor-not-allowed" : "hover:cursor-pointer hover:bg-laranja hover:text-white"
              }`}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>

        </div>
      </div>
    </div>
  );
}