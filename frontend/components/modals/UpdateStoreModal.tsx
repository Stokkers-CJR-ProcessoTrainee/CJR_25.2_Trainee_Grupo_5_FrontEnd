'use client';
import { useEffect, useState } from "react";
import { updateStore, deleteStore } from "@/api/api";
import { FaTimes, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UploadArea } from "@/components/UploadArea";

const DEFAULT_STICKER_URL = "/foto-loja.svg"; 
const DEFAULT_LOGO_URL = "/foto-loja.svg";
const DEFAULT_BANNER_URL = "/banner-loja.svg";

interface UpdateStoreModalProps {
    abrir: boolean;
    fechar: () => void;
    store: any;
    onUpdated?: () => void;
}

export default function UpdateStoreModal({ abrir, fechar, store, onUpdated }: UpdateStoreModalProps) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [stickerFile, setStickerFile] = useState<File | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    const [isStickerRemoved, setIsStickerRemoved] = useState(false);
    const [isLogoRemoved, setIsLogoRemoved] = useState(false);
    const [isBannerRemoved, setIsBannerRemoved] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (store) {
            setName(store.name || '');
            setDescription(store.description || '');
            setStickerFile(null);
            setLogoFile(null);
            setBannerFile(null);
            setIsStickerRemoved(false);
            setIsLogoRemoved(false);
            setIsBannerRemoved(false);
        }
    }, [store, abrir]);

    const isDefaultImage = (url: string, type: 'sticker' | 'logo' | 'banner') => {
        if (!url) return true;
        const targetDefault = type === 'sticker' ? DEFAULT_STICKER_URL : type === 'logo' ? DEFAULT_LOGO_URL : DEFAULT_BANNER_URL;
        return url === targetDefault || url.includes(targetDefault.replace('/', '')); 
    };

    if (!abrir || !store) return null;

    const getImageText = (
        file: File | null,          
        dbUrl: string,              
        isRemoved: boolean,         
        labelDefault: string,       
        labelCurrent: string,
        type: 'sticker' | 'logo' | 'banner'
    ) => {
        if (isRemoved) return labelDefault;
        
        if (file) return null; 

        if (dbUrl && !isDefaultImage(dbUrl, type)) {
            return `${labelCurrent}: ${dbUrl.split('/').pop()?.substring(0, 15)}...`;
        }

        return labelDefault;
    };

    const stickerText = getImageText(stickerFile, store.sticker_url, isStickerRemoved, "Anexe a foto de perfil de sua loja", "Perfil Atual", 'sticker');
    const logoText = getImageText(logoFile, store.logo_url, isLogoRemoved, "Anexe a logo em SVG de sua loja", "Logo Atual", 'logo');
    const bannerText = getImageText(bannerFile, store.banner_url, isBannerRemoved, "Anexe o banner de sua loja", "Banner Atual", 'banner');

    const showDeleteSticker = stickerFile || (store.sticker_url && !isDefaultImage(store.sticker_url, 'sticker') && !isStickerRemoved);
    const showDeleteLogo = logoFile || (store.logo_url && !isDefaultImage(store.logo_url, 'logo') && !isLogoRemoved);
    const showDeleteBanner = bannerFile || (store.banner_url && !isDefaultImage(store.banner_url, 'banner') && !isBannerRemoved);

    const handleForceDelete = (type: 'sticker' | 'logo' | 'banner') => {
        if (type === 'sticker') { setStickerFile(null); setIsStickerRemoved(true); }
        if (type === 'logo') { setLogoFile(null); setIsLogoRemoved(true); }
        if (type === 'banner') { setBannerFile(null); setIsBannerRemoved(true); }
    };

    const UploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("https://stokkers.onrender.com/upload", { method: "POST", body: formData });
        const data = await res.json();
        return data.url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const stickerPromise = stickerFile ? UploadFile(stickerFile) : Promise.resolve(undefined);
            const logoPromise = logoFile ? UploadFile(logoFile) : Promise.resolve(undefined);
            const bannerPromise = bannerFile ? UploadFile(bannerFile) : Promise.resolve(undefined);

            const [newSticker, newLogo, newBanner] = await Promise.all([stickerPromise, logoPromise, bannerPromise]);

            const payload: Record<string, string> = { name };
            if (description.trim()) payload.description = description.trim();
            
            if (newSticker) payload.sticker_url = newSticker;
            else if (isStickerRemoved) payload.sticker_url = DEFAULT_STICKER_URL; 

            if (newLogo) payload.logo_url = newLogo;
            else if (isLogoRemoved) payload.logo_url = DEFAULT_LOGO_URL;

            if (newBanner) payload.banner_url = newBanner;
            else if (isBannerRemoved) payload.banner_url = DEFAULT_BANNER_URL;

            await updateStore(store.id, payload);
            toast.success("Loja atualizada!");
            if (onUpdated) onUpdated();
            fechar();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao atualizar");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStore = async () => {
        if (!confirm("Deletar loja?")) return;
        try { 
            await deleteStore(store.id); 
            toast.success("Deletada!"); 
            fechar();
            router.back();
        } 
        catch { toast.error("Erro ao deletar"); }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={fechar}>
            <div className="bg-back relative rounded-2xl p-6 w-120 h-140 shadow-lg" onClick={(e) => e.stopPropagation()}>

                <button className="ml-105 -mt-2 absolute text-text hover:text-gray-800 text-xl hover:cursor-pointer transition z-50" onClick={fechar}>
                    <FaTimes />
                </button>

                <h2 className="text-center font-sans text-text font-semibold text-2xl -mt-2">Atualizar Loja</h2>

                <form onSubmit={handleSubmit} className="relative font-sans text-text text-xs">
                    <input type="text" placeholder="Nome da loja" className="w-full bg-card p-2 pl-5 focus:outline-none border border-transparent focus:border-laranja rounded-2xl mt-5" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="text" placeholder="Descrição" className="w-full bg-card p-2 pl-5 focus:outline-none border border-transparent focus:border-laranja rounded-2xl mt-3" value={description} onChange={(e) => setDescription(e.target.value)} />
                    
                    <div className="relative mt-4">
                        <UploadArea 
                            file={stickerFile} 
                            setFile={(f) => { setStickerFile(f); setIsStickerRemoved(false); }}
                            placeholder={stickerText || ""} 
                        />
                        {showDeleteSticker && (
                            <button type="button" className="absolute right-4 top-4 z-20 rounded-full p-1 text-laranja hover:bg-laranja hover:text-white border border-laranja transition"
                                onClick={(e) => { e.stopPropagation(); handleForceDelete('sticker'); }}>
                                <FaTimes size={12} />
                            </button>
                        )}
                    </div>

                    <div className="relative mt-1">
                        <UploadArea 
                            file={logoFile} 
                            setFile={(f) => { setLogoFile(f); setIsLogoRemoved(false); }}
                            placeholder={logoText || ""}
                            accept=".svg"
                        />
                        {showDeleteLogo && (
                            <button type="button" className="absolute right-4 top-4 z-20 rounded-full p-1 text-laranja hover:bg-laranja hover:text-white border border-laranja transition"
                                onClick={(e) => { e.stopPropagation(); handleForceDelete('logo'); }}>
                                <FaTimes size={12} />
                            </button>
                        )}
                    </div>

                    <div className="relative mt-1">
                        <UploadArea 
                            file={bannerFile} 
                            setFile={(f) => { setBannerFile(f); setIsBannerRemoved(false); }}
                            placeholder={bannerText || ""}
                        />
                        {showDeleteBanner && (
                            <button type="button" className="absolute right-4 top-4 z-20 rounded-full p-1 text-laranja hover:bg-laranja hover:text-white border border-laranja transition"
                                onClick={(e) => { e.stopPropagation(); handleForceDelete('banner'); }}>
                                <FaTimes size={12} />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-2 mt-6">
                        <button type="submit" disabled={loading} className="px-15 py-1 rounded-full font-sans tracking-wider text-laranja border border-laranja hover:bg-laranja hover:text-white transition cursor-pointer flex items-center justify-center gap-2">
                            {loading ? "Salvando..." : "Salvar alterações"}
                        </button>
                        
                        <button type="button" onClick={handleDeleteStore} className="text-xs px-10 py-0.5 rounded-full font-sans tracking-wider text-laranja border border-laranja hover:bg-red-600 hover:border-red-600 hover:text-white transition cursor-pointer flex items-center justify-center gap-2">
                            <FaTrash /> Deletar Loja
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}