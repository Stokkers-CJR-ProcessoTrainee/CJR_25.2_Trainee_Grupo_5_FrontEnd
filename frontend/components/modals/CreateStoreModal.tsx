'use client';
import { useState, useEffect, useRef } from "react"; 
import { createStore, getAllParentCategories } from "@/api/api";
import { toast } from "react-toastify";

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
        console.log("Upload result:", data);
        return data.url;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name) return toast.warn("O nome da loja é obrigatório!");
        if (!selectedCategoryId) return toast.warn("Selecione uma categoria!");

        setLoading(true);

        try {
            const stickerPromise = sticker_url 
                ? UploadFile(sticker_url) 
                : Promise.resolve(undefined);

            const logoPromise = logo_url 
                ? UploadFile(logo_url) 
                : Promise.resolve(undefined);
            
            const bannerPromise = banner_url 
                ? UploadFile(banner_url) 
                : Promise.resolve(undefined);

            const [stickerUrl, logoUrl, bannerUrl] = await Promise.all([
                stickerPromise,
                logoPromise,
                bannerPromise
            ]);

            const payload: Record<string, any> = { 
                name,
                category_id: Number(selectedCategoryId) 
            };

            if (description.trim()) payload.description = description.trim();
            if (stickerUrl) payload.sticker_url = stickerUrl;
            if (logoUrl) payload.logo_url = logoUrl;
            if (bannerUrl) payload.banner_url = bannerUrl;

            console.log("Payload enviado:", payload);

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
                className="ml-105 -mt-2 absolute hover:cursor-pointer"
                onClick={fechar}
                >
                    <img
                        src="/images/botao-de-sair.png"
                        alt='sair'
                        className="h-4 w-4"
                    />
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


                    <div className="absolute flex justify-center mt-85 ml-28 font-sans text-text text-base hover:brightness-90">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="px-15 py-1 rounded-full font-sans tracking-wider text-laranja border border-laranja hover:bg-laranja hover:text-white transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "Salvando..." : "Adicionar"}
                        </button>
                    </div>
                </form>

                <div className="w-full mt-4 flex justify-center h-25">
                    <svg className="relative w-100 h-full" viewBox="0 0 828 179" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 11C1 5.47715 5.47715 1 11 1H817C822.523 1 827 5.47715 827 11V168C827 173.523 822.523 178 817 178H11C5.47715 178 1 173.523 1 168V11Z" stroke="#FF6700" strokeWidth="2" strokeDasharray="30 30"/>
                    </svg>

                    <svg className="absolute h-8 w-8 mt-6" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path xmlns="http://www.w3.org/2000/svg" d="M32.75 0H9.75C8.22501 0 6.76247 0.605802 5.68414 1.68414C4.6058 2.76247 4 4.22501 4 5.75V51.75C4 53.275 4.6058 54.7375 5.68414 55.8159C6.76247 56.8942 8.22501 57.5 9.75 57.5H44.25C45.775 57.5 47.2375 56.8942 48.3159 55.8159C49.3942 54.7375 50 53.275 50 51.75V17.25L32.75 0ZM31.3125 40.25V48.875H22.6875V40.25H15.5L27 28.75L38.5 40.25H31.3125ZM29.875 20.125V4.3125L45.6875 20.125H29.875Z" fill="#FF6700"/>
                    </svg>

                    <p className="absolute font-bold font-sans text-laranja text-xs mt-15">
                        {sticker_url ? sticker_url.name : 'Anexe a foto de perfil de sua loja'}
                    </p>

                    <input
                        type="file"
                        className="absolute w-100 h-21 opacity-0 mt-2 hover:cursor-pointer"
                        onChange={(e) => setSticker(e.target.files?.[0] || null)}
                    />
                </div>

                <div className="w-full mt-1 flex justify-center h-25">
                    <svg className="relative w-100 h-full" viewBox="0 0 828 179" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 11C1 5.47715 5.47715 1 11 1H817C822.523 1 827 5.47715 827 11V168C827 173.523 822.523 178 817 178H11C5.47715 178 1 173.523 1 168V11Z" stroke="#FF6700" strokeWidth="2" strokeDasharray="30 30"/>
                    </svg>

                    <svg className="absolute h-8 w-8 mt-6" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path xmlns="http://www.w3.org/2000/svg" d="M32.75 0H9.75C8.22501 0 6.76247 0.605802 5.68414 1.68414C4.6058 2.76247 4 4.22501 4 5.75V51.75C4 53.275 4.6058 54.7375 5.68414 55.8159C6.76247 56.8942 8.22501 57.5 9.75 57.5H44.25C45.775 57.5 47.2375 56.8942 48.3159 55.8159C49.3942 54.7375 50 53.275 50 51.75V17.25L32.75 0ZM31.3125 40.25V48.875H22.6875V40.25H15.5L27 28.75L38.5 40.25H31.3125ZM29.875 20.125V4.3125L45.6875 20.125H29.875Z" fill="#FF6700"/>
                    </svg>

                    <p className="absolute font-bold font-sans text-laranja text-xs mt-15">
                        {logo_url ? logo_url.name : 'Anexe a logo em SVG de sua loja'}
                    </p>

                    <input
                        type="file"
                        className="absolute w-100 h-21 mt-2 opacity-0 hover:cursor-pointer"
                        onChange={(e) => setLogo(e.target.files?.[0] || null)}
                    />
                </div>

                <div className="w-full mt-1 flex justify-center h-25">
                    <svg className="relative w-100 h-full" viewBox="0 0 828 179" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 11C1 5.47715 5.47715 1 11 1H817C822.523 1 827 5.47715 827 11V168C827 173.523 822.523 178 817 178H11C5.47715 178 1 173.523 1 168V11Z" stroke="#FF6700" strokeWidth="2" strokeDasharray="30 30"/>
                    </svg>

                    <svg className="absolute h-8 w-8 mt-6" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path xmlns="http://www.w3.org/2000/svg" d="M32.75 0H9.75C8.22501 0 6.76247 0.605802 5.68414 1.68414C4.6058 2.76247 4 4.22501 4 5.75V51.75C4 53.275 4.6058 54.7375 5.68414 55.8159C6.76247 56.8942 8.22501 57.5 9.75 57.5H44.25C45.775 57.5 47.2375 56.8942 48.3159 55.8159C49.3942 54.7375 50 53.275 50 51.75V17.25L32.75 0ZM31.3125 40.25V48.875H22.6875V40.25H15.5L27 28.75L38.5 40.25H31.3125ZM29.875 20.125V4.3125L45.6875 20.125H29.875Z" fill="#FF6700"/>
                    </svg>

                    <p className="absolute font-bold font-sans text-laranja text-xs mt-15">
                        {banner_url? banner_url.name : 'Anexe o banner da sua loja'}
                    </p>

                    <input
                        type="file"
                        className="absolute w-100 h-21 mt-2 opacity-0 hover:cursor-pointer"
                        onChange={(e) => setBanner(e.target.files?.[0] || null)}
                    />
                </div>
            </div>    
        </div>
    )
}