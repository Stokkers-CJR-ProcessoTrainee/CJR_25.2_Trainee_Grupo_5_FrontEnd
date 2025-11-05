'use client';
import { useEffect, useState } from "react";
import { updateStore } from "@/api/api";

interface UpdateStoreModalProps {
    abrir: boolean;
    fechar: () => void;
    store: any;
    onUpdated?: () => void;
}

export default function UpdateStoreModal({ abrir, fechar, store, onUpdated }: UpdateStoreModalProps) {
    if (!abrir || !store) return null;

    const[name, setName] = useState('');
    const[description, setDescription] = useState('');
    const[sticker_url, setSticker] = useState<File | null>(null);
    const[logo_url, setLogo] = useState<File | null>(null);
    const[banner_url, setBanner] = useState<File | null>(null);
    const[loading, setLoading] = useState(false);

    useEffect(() => {
        setName(store.name || '');
        setDescription(store.description || '');
    }, [store]); 

    const UploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:3001/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log("Upload result:", data);
        return data.url;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return alert("O nome da loja é obrigatório!");
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

            const payload: Record<string, string> = { name };

            // Adiciona campos somente se tiverem valor válido
            if (description.trim()) payload.description = description.trim();
            if (stickerUrl) payload.sticker_url = stickerUrl;
            if (logoUrl) payload.logo_url = logoUrl;
            if (bannerUrl) payload.banner_url = bannerUrl;

            console.log("Payload enviado:", payload);

            if (!stickerUrl && store.sticker_url) payload.sticker_url = store.sticker_url;
            if (!logoUrl && store.logo_url) payload.logo_url = store.logo_url;
            if (!bannerUrl && store.banner_url) payload.banner_url = store.banner_url;

            await updateStore(store.id, payload);

            alert("Loja atualizada com sucesso!");
            if (onUpdated) onUpdated();
            fechar();
        }   catch (err) {
            console.error(err);
            alert("Erro ao atualizar loja");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        onClick={fechar}>
            <div 
            className="bg-gray-200 relative rounded-2xl p-6 w-120 h-135 shadow-lg"
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
                    Atualizar Loja
                </h2>

                <form onSubmit={handleSubmit} className="relative font-sans text-xs">
                    <input
                        type="text"
                        placeholder="Nome da loja"
                        className="w-full bg-white p-2 pl-5 rounded-2xl mt-5"
                        value = {name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Descrição"
                        className="w-full bg-white p-2 pl-5 rounded-2xl mt-3"
                        value = {description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className="absolute flex justify-center mt-83 ml-28 font-sans text-xs hover:brightness-90">
                        <button className="bg-laranja text-white px-15 py-1 rounded-2xl hover:cursor-pointer transition">
                            Salvar alterações
                        </button>
                    </div>
                </form>

                <div className="w-full mt-4 flex justify-center h-25">
                    <svg className="relative w-100 h-full" viewBox="0 0 828 179" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 11C1 5.47715 5.47715 1 11 1H817C822.523 1 827 5.47715 827 11V168C827 173.523 822.523 178 817 178H11C5.47715 178 1 173.523 1 168V11Z" stroke="#FF6700" strokeWidth="2" strokeDasharray="30 30"/>
                    </svg>

                    <svg className="absolute h-8 w-8 mt-6" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M29.75 1H6.75C5.22501 1 3.76247 1.6058 2.68414 2.68414C1.6058 3.76247 1 5.22501 1 6.75V52.75C1 54.275 1.6058 55.7375 2.68414 56.8159C3.76247 57.8942 5.22501 58.5 6.75 58.5H41.25C42.775 58.5 44.2375 57.8942 45.3159 56.8159C46.3942 55.7375 47 54.275 47 52.75V18.25L29.75 1ZM28.3125 41.25V49.875H19.6875V41.25H12.5L24 29.75L35.5 41.25H28.3125ZM26.875 21.125V5.3125L42.6875 21.125H26.875Z" fill="#FF6700" stroke="#FF6700" stroke-width="2" stroke-dasharray="30 30"/>
                    </svg>

                    <p className="absolute font-bold font-sans text-laranja text-xs mt-15">
                        {sticker_url 
                            ? sticker_url.name 
                            : store.sticker_url 
                            ? 'Foto de perfil atual: ' + store.sticker_url.split('/').pop()
                            : 'Anexe a foto de perfil de sua loja'}
                    </p>

                    <input
                        type="file"
                        className="absolute w-100 h-21 opacity-0 mt-2 hover:cursor-pointer"
                        onChange={(e) => setSticker(e.target.files?.[0] || null)}
                    />
                </div>

                <div className="w-full mt-1 flex justify-center h-25">
                    <svg className="relative w-100 h-full" viewBox="0 0 828 179" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 11C1 5.47715 5.47715 1 11 1H817C822.523 1 827 5.47715 827 11V168C827 173.523 822.523 178 817 178H11C5.47715 178 1 173.523 1 168V11Z" stroke="#FF6700" stroke-width="2" stroke-dasharray="30 30"/>
                    </svg>

                    <svg className="absolute h-8 w-8 mt-6" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M29.75 1H6.75C5.22501 1 3.76247 1.6058 2.68414 2.68414C1.6058 3.76247 1 5.22501 1 6.75V52.75C1 54.275 1.6058 55.7375 2.68414 56.8159C3.76247 57.8942 5.22501 58.5 6.75 58.5H41.25C42.775 58.5 44.2375 57.8942 45.3159 56.8159C46.3942 55.7375 47 54.275 47 52.75V18.25L29.75 1ZM28.3125 41.25V49.875H19.6875V41.25H12.5L24 29.75L35.5 41.25H28.3125ZM26.875 21.125V5.3125L42.6875 21.125H26.875Z" fill="#FF6700" stroke="#FF6700" stroke-width="2" stroke-dasharray="30 30"/>
                    </svg>

                    <p className="absolute font-bold font-sans text-laranja text-xs mt-15">
                        {logo_url 
                            ? logo_url.name 
                            : store.logo_url 
                            ? 'Logo atual: ' + store.logo_url.split('/').pop()
                            : 'Anexe a logo de sua loja'}
                    </p>

                    <input
                        type="file"
                        accept=".svg"
                        className="absolute w-100 h-21 mt-2 opacity-0 hover:cursor-pointer"
                        onChange={(e) => setLogo(e.target.files?.[0] || null)}
                    />
                </div>

                <div className="w-full mt-1 flex justify-center h-25">
                    <svg className="relative w-100 h-full" viewBox="0 0 828 179" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 11C1 5.47715 5.47715 1 11 1H817C822.523 1 827 5.47715 827 11V168C827 173.523 822.523 178 817 178H11C5.47715 178 1 173.523 1 168V11Z" stroke="#FF6700" stroke-width="2" stroke-dasharray="30 30"/>
                    </svg>

                    <svg className="absolute h-8 w-8 mt-6" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M29.75 1H6.75C5.22501 1 3.76247 1.6058 2.68414 2.68414C1.6058 3.76247 1 5.22501 1 6.75V52.75C1 54.275 1.6058 55.7375 2.68414 56.8159C3.76247 57.8942 5.22501 58.5 6.75 58.5H41.25C42.775 58.5 44.2375 57.8942 45.3159 56.8159C46.3942 55.7375 47 54.275 47 52.75V18.25L29.75 1ZM28.3125 41.25V49.875H19.6875V41.25H12.5L24 29.75L35.5 41.25H28.3125ZM26.875 21.125V5.3125L42.6875 21.125H26.875Z" fill="#FF6700" stroke="#FF6700" stroke-width="2" stroke-dasharray="30 30"/>
                    </svg>

                    <p className="absolute font-bold font-sans text-laranja text-xs mt-15">
                        {banner_url 
                            ? banner_url.name 
                            : store.banner_url 
                            ? 'Banner atual: ' + store.banner_url.split('/').pop()
                            : 'Anexe o banner de sua loja'}
                    </p>

                    <input
                        type="file"
                        accept=".svg"
                        className="absolute w-100 h-21 mt-2 opacity-0 hover:cursor-pointer"
                        onChange={(e) => setBanner(e.target.files?.[0] || null)}
                    />
                </div>
                
                <div className="flex justify-center">
                    <button className="bg-red-600 text-white text-xs font-sans px-10 py-0.5 rounded-2xl mt-11 hover:brightness-90 hover:cursor-pointer transition-all">
                        Deletar
                    </button>
                </div>
                

                
            
            </div>
                
        </div>
    )
}