'use client';

import { useEffect, useState, useRef } from "react";
import { createProduct, createProductImage, getChildCategories } from "@/api/api";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { UploadArea } from "@/components/UploadArea";

interface CreateProductModalProps {
  open: boolean;
  close: () => void;
  onUpdated?: () => void;
  storeCategoryId: number
}

type Category = {
  id: number,
  name: string,
  parent_category_id?: number
}

export default function CreateProductModal({ open, close, onUpdated, storeCategoryId }: CreateProductModalProps) {
  if (!open) return null;

  const { id } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState<File | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [SubCategories, setSubCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (open) {
      setName('');
      setDescription('');
      setPrice('');
      setQuantity(0);
      setImage(null);
      setSelectedCategoryId('');
      setIsDropdownOpen(false);

      async function fetchData() {
        const childCategories = await getChildCategories(storeCategoryId)
        setSubCategories(childCategories)
      }
      fetchData();

      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, storeCategoryId]);

  const UploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("https://stokkers.onrender.com/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.url;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !selectedCategoryId || !price) {
      toast.warn("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    if (quantity < 0) {
      toast.warn("A quantidade deve ser maior ou igual a 0.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await UploadFile(image);
      }

      const numericPrice = parseFloat(price);
      const numericCategory = parseInt(selectedCategoryId);
      const storeId = Number(id);

      const payload: any = {
        name: name,
        category_id: numericCategory,
        description: description,
        price: numericPrice,
        stock: quantity,
      };

      const newProduct = await createProduct(storeId, payload);

      if (imageUrl && newProduct?.id) {
        const imagePayload = { 
          image_url: imageUrl,
          order: 0
        };
        await createProductImage(newProduct.id, imagePayload);
      } 

      toast.success("Produto criado com sucesso!");
      if (onUpdated) onUpdated();
      close();

    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={close}
    >
      <div
        className="bg-back relative rounded-2xl p-6 w-120 h-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="ml-105 text-text hover:text-gray-800 text-xl transition -mt-2 absolute hover:cursor-pointer"
          onClick={close}
        >
          <FaTimes />
        </button>

        <h2 className="text-center font-sans font-semibold text-2xl text-text -mt-2 mb-4">
          Adicionar Produto
        </h2>

        <form onSubmit={handleSubmit} className="relative font-sans text-sm flex flex-col gap-3">

          <UploadArea 
            file={image} 
            setFile={setImage} 
            placeholder="Anexe a foto do produto" 
          />

          <input
            type="text"
            placeholder="Nome do Produto"
            className="w-full bg-card p-2 pl-5 rounded-2xl border border-transparent focus:border-laranja focus:outline-none text-text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="w-full bg-card p-2 pl-5 pr-10 rounded-2xl border border-transparent focus:border-laranja focus:outline-none text-text text-left cursor-pointer flex justify-between items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedCategoryId
                  ? SubCategories.find(c => c.id.toString() === selectedCategoryId)?.name
                  : 'Selecione uma Categoria'}
              </span>

              <svg
                className={`fill-current h-4 w-4 text-laranja transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-md bg-card py-1 text-base shadow-lg focus:outline-none border border-transparent scrollbar-hide">
                {SubCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 transition-colors ${cat.id.toString() === selectedCategoryId
                        ? 'bg-laranja text-white font-semibold'
                        : 'text-text font-normal hover:bg-laranja/20'
                      }`}
                    onClick={() => {
                      setSelectedCategoryId(cat.id.toString());
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span className="block truncate">
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <textarea
            placeholder="Descrição"
            rows={3}
            className="w-full bg-card p-2 px-5 pt-3 text-text border border-transparent focus:border-laranja focus:outline-none rounded-2xl resize-none h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            step="0.01"
            placeholder="Preço (R$)"
            className="w-full bg-card p-2 pl-5 text-text border border-transparent focus:border-laranja focus:outline-none rounded-2xl"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <div className="flex flex-row items-center justify-center gap-4 py-2">
            <button
              type="button"
              className="w-10 h-10 hover:cursor-pointer rounded-full border border-laranja text-laranja flex items-center justify-center hover:bg-laranja hover:text-white transition"
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
            >
              -
            </button>

            <div className="w-20 text-center text-laranja font-sans text-2xl font-semibold">
              {quantity}
            </div>

            <button
              type="button"
              className="w-10 h-10 hover:cursor-pointer rounded-full border border-laranja text-laranja flex items-center justify-center hover:bg-laranja hover:text-white transition"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>

          <div className="flex justify-center mb-2">
            <button
              type="submit"
              disabled={loading}
              className="px-15 py-1 rounded-full font-sans tracking-wider text-laranja border border-laranja hover:bg-laranja hover:text-white transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Salvando..." : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}