'use client';
import { useState, useEffect, useRef } from "react"; 
import { createStore, getAllParentCategories } from "@/api/api";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { UploadArea } from "@/components/UploadArea"; 

interface CreateStoreModalProps {
    abrir: boolean;
    fechar: () => void;
    onSuccess: () => void;
}

interface Category {
    id: number;
    name: string;
}

export default function CreateStoreModal({ abrir, fechar, onSuccess }: CreateStoreModalProps) {
    if (!abrir) return null;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(''); 
    
    const [sticker_url, setSticker] = useState<File | null>(null);
    const [logo_url, setLogo] = useState<File | null>(null);
    const [banner_url, setBanner] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); 

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (abrir) {
            setName('');
            setDescription('');
            setSelectedCategoryId('');
            setSticker(null);
            setLogo(null);
            setBanner(null);
            setIsDropdownOpen(false); 

            getAllParentCategories()
                .then((data) => {
                    setCategories(data);
                })
                .catch((err) => {
                    console.error("Erro ao buscar categorias:", err);
                    toast.error("Erro ao carregar categorias.");
                });
            
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [abrir]);

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
        
        if (!name) return toast.warn("O nome da loja é obrigatório!");
        if (!selectedCategoryId) return toast.warn("Selecione uma categoria!");

        setLoading(true);

        try {
            const [stickerUrl, logoUrl, bannerUrl] = await Promise.all([
                sticker_url ? UploadFile(sticker_url) : Promise.resolve(undefined),
                logo_url ? UploadFile(logo_url) : Promise.resolve(undefined),
                banner_url ? UploadFile(banner_url) : Promise.resolve(undefined)
            ]);

            const payload: Record<string, any> = { 
                name,
                category_id: Number(selectedCategoryId) 
            };

            if (description.trim()) payload.description = description.trim();
            if (stickerUrl) payload.sticker_url = stickerUrl;
            if (logoUrl) payload.logo_url = logoUrl;
            if (bannerUrl) payload.banner_url = bannerUrl;

            await createStore(payload);

            toast.success("Loja criada com sucesso!");
            onSuccess();
            fechar();

        }   catch (err) {
            console.error(err);
            toast.error("Erro ao adicionar loja");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        onClick={fechar}>
            <div 
            className="bg-back relative rounded-2xl p-6 w-120 h-150 shadow-lg"
            onClick={(e) => e.stopPropagation()}>

                <button 
                className="ml-105 -mt-2 absolute text-text text-xl hover:text-gray-800 hover:cursor-pointer"
                onClick={fechar}
                >
                    <FaTimes />
                </button>

                <h2 className="text-center font-sans font-semibold text-2xl -mt-2">
                    Adicionar Loja
                </h2>

                <form onSubmit={handleSubmit} className="relative font-sans text-sm">
                    <input
                        type="text"
                        placeholder="Nome da loja"
                        className="w-full bg-card p-2 pl-5 rounded-2xl border border-transparent focus:border-laranja focus:outline-none text-text mt-5"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Descrição"
                        className="w-full bg-card p-2 pl-5 border border-transparent focus:border-laranja focus:outline-none rounded-2xl mt-3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className="relative mt-3" ref={dropdownRef}>
                        <button
                            type="button"
                            className="w-full bg-card p-2 pl-5 pr-10 rounded-2xl border border-transparent focus:border-laranja focus:outline-none text-text text-left cursor-pointer flex justify-between items-center"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className={selectedCategoryId ? 'text-text' : 'text-text'}>
                                {selectedCategoryId
                                    ? categories.find(c => c.id.toString() === selectedCategoryId)?.name
                                    : 'Selecione uma categoria'}
                            </span>
                            
                            <svg 
                                className={`fill-current h-4 w-4 text-laranja transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} 
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-md bg-card py-1 text-base shadow-lg focus:outline-none border border-transparent">
                                {categories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        className={`cursor-pointer select-none relative py-2 pl-3 pr-9 transition-colors ${
                                            cat.id.toString() === selectedCategoryId 
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
                    
                    <UploadArea 
                        file={sticker_url} 
                        setFile={setSticker} 
                        placeholder="Anexe a foto de perfil de sua loja" 
                        className="mt-4" 
                    />

                    <UploadArea 
                        file={logo_url} 
                        setFile={setLogo} 
                        placeholder="Anexe a logo em SVG de sua loja"
                        accept=".svg" 
                        className="mt-1" 
                    />

                    <UploadArea 
                        file={banner_url} 
                        setFile={setBanner} 
                        placeholder="Anexe o banner da sua loja" 
                        className="mt-1" 
                    />

                    <div className="flex justify-center w-full mt-6">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="px-15 py-1 rounded-full font-sans tracking-wider text-laranja border border-laranja hover:bg-laranja hover:text-white transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "Salvando..." : "Adicionar"}
                        </button>
                    </div>
                </form>
            </div>    
        </div>
    )
}