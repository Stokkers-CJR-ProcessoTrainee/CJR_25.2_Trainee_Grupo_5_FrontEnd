'use client';
import { useEffect, useState } from "react";
import { updateStore, deleteStore } from "@/api/api";
import { FaTimes, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

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
        return url === targetDefault || url.includes(targetDefault.replace('/', '')); // Verifica match exato ou parcial
    };

    if (!abrir || !store) return null;

    const getImageState = (
        file: File | null,          
        dbUrl: string,              
        isRemoved: boolean,         
        labelDefault: string,       
        labelCurrent: string,
        type: 'sticker' | 'logo' | 'banner'
    ) => {
        if (isRemoved) {
            return {
                text: labelDefault, 
                showDelete: false,
                textColor: 'text-laranja'
            };
        }
        if (file) {
            return {
                text: `Selecionado: ${file.name}`,
                showDelete: true, 
                textColor: 'text-laranja'
            };
        }
        if (dbUrl && !isDefaultImage(dbUrl, type)) {
            return {
                text: `${labelCurrent}: ${dbUrl.split('/').pop()?.substring(0, 15)}...`,
                showDelete: true, 
                textColor: 'text-laranja'
            };
        }
        return {
            text: labelDefault,
            showDelete: false,
            textColor: 'text-laranja'
        };
    };

    const stickerStatus = getImageState(stickerFile, store.sticker_url, isStickerRemoved, "Anexe a foto de perfil de sua loja", "Perfil Atual", 'sticker');
    const logoStatus = getImageState(logoFile, store.logo_url, isLogoRemoved, "Anexe a logo em SVG de sua loja", "Logo Atual", 'logo');
    const bannerStatus = getImageState(bannerFile, store.banner_url, isBannerRemoved, "Anexe o banner de sua loja", "Banner Atual", 'banner');

    const handleForceDelete = (type: 'sticker' | 'logo' | 'banner') => {
        if (type === 'sticker') { setStickerFile(null); setIsStickerRemoved(true); }
        if (type === 'logo') { setLogoFile(null); setIsLogoRemoved(true); }
        if (type === 'banner') { setBannerFile(null); setIsBannerRemoved(true); }
    };

    const UploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("http://localhost:3001/upload", { method: "POST", body: formData });
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
        try { await deleteStore(store.id); toast.success("Deletada!"); if(onUpdated) onUpdated(); fechar(); } 
        catch { toast.error("Erro ao deletar"); }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={fechar}>
            <div className="bg-gray-200 relative rounded-2xl p-6 w-120 h-135 shadow-lg" onClick={(e) => e.stopPropagation()}>

                <button className="ml-105 -mt-2 absolute hover:cursor-pointer z-50" onClick={fechar}>
                    <img src="/images/botao-de-sair.png" alt='sair' className="h-4 w-4" />
                </button>

                <h2 className="text-center font-sans font-semibold text-2xl -mt-2">Atualizar Loja</h2>

                <form onSubmit={handleSubmit} className="relative font-sans text-xs">
                    <input type="text" placeholder="Nome da loja" className="w-full bg-white p-2 pl-5 rounded-2xl mt-5" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="text" placeholder="Descrição" className="w-full bg-white p-2 pl-5 rounded-2xl mt-3" value={description} onChange={(e) => setDescription(e.target.value)} />
                    
                    <div className="absolute flex justify-center mt-83 ml-26 font-sans text-xs hover:brightness-90 z-40">
                        <button type="submit" disabled={loading} className="px-15 py-1 rounded-full font-sans tracking-wider text-laranja border border-laranja hover:bg-laranja hover:text-white transition cursor-pointer flex items-center justify-center gap-2">
                            {loading ? "Salvando..." : "Salvar alterações"}
                        </button>
                    </div>
                </form>

                {/* --- STICKER --- */}
                <div className="w-full mt-4 flex justify-center h-25 relative">
                    <svg className="relative w-100 h-full" viewBox="0 0 828 179" fill="none"><path d="M1 11C1 5.47715 5.47715 1 11 1H817C822.523 1 827 5.47715 827 11V168C827 173.523 822.523 178 817 178H11C5.47715 178 1 173.523 1 168V11Z" stroke="#FF6700" strokeWidth="2" strokeDasharray="30 30" /></svg>
                    <svg className="absolute h-8 w-8 mt-6" viewBox="0 0 48 60" fill="none"><path d="M29.75 1H6.75C5.22501 1 3.76247 1.6058 2.68414 2.68414C1.6058 3.76247 1 5.22501 1 6.75V52.75C1 54.275 1.6058 55.7375 2.68414 56.8159C3.76247 57.8942 5.22501 58.5 6.75 58.5H41.25C42.775 58.5 44.2375 57.8942 45.3159 56.8159C46.3942 55.7375 47 54.275 47 52.75V18.25L29.75 1ZM28.3125 41.25V49.875H19.6875V41.25H12.5L24 29.75L35.5 41.25H28.3125ZM26.875 21.125V5.3125L42.6875 21.125H26.875Z" fill="#FF6700" stroke="#FF6700" strokeWidth="2" strokeDasharray="30 30" /></svg>

                    <p className={`absolute font-bold text-center font-sans text-xs mt-15 max-w-100 px-2 truncate ${stickerStatus.textColor}`}>
                        {stickerStatus.text}
                    </p>

                    <input type="file" className="absolute w-100 h-21 opacity-0 mt-2 hover:cursor-pointer z-10"
                        onChange={(e) => { setStickerFile(e.target.files?.[0] || null); setIsStickerRemoved(false); }} />

                    {stickerStatus.showDelete && (
                        <button type="button" className="absolute right-6 top-3 z-20 rounded-full p-1 text-laranja hover:bg-laranja hover:text-white border border-laranja transition"
                            onClick={(e) => { e.stopPropagation(); handleForceDelete('sticker'); }}>
                            <FaTimes size={12} />
                        </button>
                    )}
                </div>

                {/* --- LOGO --- */}
                <div className="w-full mt-1 flex justify-center h-25 relative">
                    <svg className="relative w-100 h-full" viewBox="0 0 828 179" fill="none"><path d="M1 11C1 5.47715 5.47715 1 11 1H817C822.523 1 827 5.47715 827 11V168C827 173.523 822.523 178 817 178H11C5.47715 178 1 173.523 1 168V11Z" stroke="#FF6700" strokeWidth="2" strokeDasharray="30 30" /></svg>
                    <svg className="absolute h-8 w-8 mt-6" viewBox="0 0 48 60" fill="none"><path d="M29.75 1H6.75C5.22501 1 3.76247 1.6058 2.68414 2.68414C1.6058 3.76247 1 5.22501 1 6.75V52.75C1 54.275 1.6058 55.7375 2.68414 56.8159C3.76247 57.8942 5.22501 58.5 6.75 58.5H41.25C42.775 58.5 44.2375 57.8942 45.3159 56.8159C46.3942 55.7375 47 54.275 47 52.75V18.25L29.75 1ZM28.3125 41.25V49.875H19.6875V41.25H12.5L24 29.75L35.5 41.25H28.3125ZM26.875 21.125V5.3125L42.6875 21.125H26.875Z" fill="#FF6700" stroke="#FF6700" strokeWidth="2" strokeDasharray="30 30" /></svg>

                    <p className={`absolute font-bold text-center font-sans text-xs mt-15 max-w-100 px-2 truncate ${logoStatus.textColor}`}>
                        {logoStatus.text}
                    </p>

                    <input type="file" className="absolute w-100 h-21 mt-2 opacity-0 hover:cursor-pointer z-10"
                        onChange={(e) => { setLogoFile(e.target.files?.[0] || null); setIsLogoRemoved(false); }} />
                    
                    {logoStatus.showDelete && (
                        <button type="button" className="absolute right-6 top-3 z-20 rounded-full p-1 text-laranja hover:bg-laranja hover:text-white border border-laranja transition"
                            onClick={(e) => { e.stopPropagation(); handleForceDelete('logo'); }}>
                            <FaTimes size={12} />
                        </button>
                    )}
                </div>

                {/* --- BANNER --- */}
                <div className="w-full mt-1 flex justify-center h-25 relative">
                    <svg className="relative w-100 h-full" viewBox="0 0 828 179" fill="none"><path d="M1 11C1 5.47715 5.47715 1 11 1H817C822.523 1 827 5.47715 827 11V168C827 173.523 822.523 178 817 178H11C5.47715 178 1 173.523 1 168V11Z" stroke="#FF6700" strokeWidth="2" strokeDasharray="30 30" /></svg>
                    <svg className="absolute h-8 w-8 mt-6" viewBox="0 0 48 60" fill="none"><path d="M29.75 1H6.75C5.22501 1 3.76247 1.6058 2.68414 2.68414C1.6058 3.76247 1 5.22501 1 6.75V52.75C1 54.275 1.6058 55.7375 2.68414 56.8159C3.76247 57.8942 5.22501 58.5 6.75 58.5H41.25C42.775 58.5 44.2375 57.8942 45.3159 56.8159C46.3942 55.7375 47 54.275 47 52.75V18.25L29.75 1ZM28.3125 41.25V49.875H19.6875V41.25H12.5L24 29.75L35.5 41.25H28.3125ZM26.875 21.125V5.3125L42.6875 21.125H26.875Z" fill="#FF6700" stroke="#FF6700" strokeWidth="2" strokeDasharray="30 30" /></svg>

                    <p className={`absolute font-bold text-center font-sans text-xs mt-15 max-w-100 px-2 truncate ${bannerStatus.textColor}`}>
                        {bannerStatus.text}
                    </p>

                    <input type="file" className="absolute w-100 h-21 mt-2 opacity-0 hover:cursor-pointer z-10"
                        onChange={(e) => { setBannerFile(e.target.files?.[0] || null); setIsBannerRemoved(false); }} />
                    
                    {bannerStatus.showDelete && (
                        <button type="button" className="absolute right-6 top-3 z-20 rounded-full p-1 text-laranja hover:bg-laranja hover:text-white border border-laranja transition"
                            onClick={(e) => { e.stopPropagation(); handleForceDelete('banner'); }}>
                            <FaTimes size={12} />
                        </button>
                    )}
                </div>

                <div className="flex justify-center">
                    <button type="button" onClick={handleDeleteStore} className="text-xs px-10 py-0.5 mt-11 rounded-full font-sans tracking-wider text-laranja border border-laranja hover:bg-red-600 hover:text-white transition cursor-pointer flex items-center justify-center gap-2">
                        <FaTrash /> Deletar Loja
                    </button>
                </div>
            </div>
        </div>
    )
}