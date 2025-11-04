'use client';
import { useState } from "react";

interface CreateStoreModalProps {
    abrir: boolean;
    fechar: () => void;
}

export default function CreateStoreModel({ abrir, fechar }: CreateStoreModalProps) {
    if (!abrir) return null;

    return (
        <div 
        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        onClick={fechar}>
            <div 
            className="bg-gray-200 relative rounded-2xl p-6 w-120 h-130 shadow-lg"
            onClick={(e) => e.stopPropagation()}>

                <button 
                className="absolute hover:cursor-pointer"
                onClick={fechar}
                >
                    <img
                        src="/images/botao-de-sair.png"
                        alt='sair'
                        className="h-4 w-4 ml-105 -mt-2"
                    />
                </button>

                <h2 className="text-center font-sans font-semibold text-2xl -mt-2">
                    Adicionar Loja
                </h2>

                <form  className="font-sans text-xs">
                    <input
                        type="text"
                        placeholder="Nome da loja"
                        className="w-full bg-white p-2 pl-5 rounded-2xl mt-5"
                    />

                    <input
                        type="text"
                        placeholder="Descrição"
                        className="w-full bg-white p-2 pl-5 rounded-2xl mt-3"
                    />
                </form>

                <div className="w-full mt-4 hover:cursor-pointer flex justify-center h-25">
                    <svg className="relative w-100 h-full" viewBox="0 0 828 179" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 11C1 5.47715 5.47715 1 11 1H817C822.523 1 827 5.47715 827 11V168C827 173.523 822.523 178 817 178H11C5.47715 178 1 173.523 1 168V11Z" stroke="#FF6700" stroke-width="2" stroke-dasharray="30 30"/>
                    </svg>

                    <svg className="absolute h-8 w-8 mt-6" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M29.75 1H6.75C5.22501 1 3.76247 1.6058 2.68414 2.68414C1.6058 3.76247 1 5.22501 1 6.75V52.75C1 54.275 1.6058 55.7375 2.68414 56.8159C3.76247 57.8942 5.22501 58.5 6.75 58.5H41.25C42.775 58.5 44.2375 57.8942 45.3159 56.8159C46.3942 55.7375 47 54.275 47 52.75V18.25L29.75 1ZM28.3125 41.25V49.875H19.6875V41.25H12.5L24 29.75L35.5 41.25H28.3125ZM26.875 21.125V5.3125L42.6875 21.125H26.875Z" fill="#FF6700" stroke="#FF6700" stroke-width="2" stroke-dasharray="30 30"/>
                    </svg>

                    <p className="absolute font-bold font-sans text-laranja text-xs mt-15">
                        Anexe a foto de perfil de sua loja
                    </p>
                </div>

                <div className="w-full mt-1 hover:cursor-pointer flex justify-center h-25">
                    <svg className="relative w-100 h-full" viewBox="0 0 828 179" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 11C1 5.47715 5.47715 1 11 1H817C822.523 1 827 5.47715 827 11V168C827 173.523 822.523 178 817 178H11C5.47715 178 1 173.523 1 168V11Z" stroke="#FF6700" stroke-width="2" stroke-dasharray="30 30"/>
                    </svg>

                    <svg className="absolute h-8 w-8 mt-6" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M29.75 1H6.75C5.22501 1 3.76247 1.6058 2.68414 2.68414C1.6058 3.76247 1 5.22501 1 6.75V52.75C1 54.275 1.6058 55.7375 2.68414 56.8159C3.76247 57.8942 5.22501 58.5 6.75 58.5H41.25C42.775 58.5 44.2375 57.8942 45.3159 56.8159C46.3942 55.7375 47 54.275 47 52.75V18.25L29.75 1ZM28.3125 41.25V49.875H19.6875V41.25H12.5L24 29.75L35.5 41.25H28.3125ZM26.875 21.125V5.3125L42.6875 21.125H26.875Z" fill="#FF6700" stroke="#FF6700" stroke-width="2" stroke-dasharray="30 30"/>
                    </svg>

                    <p className="absolute font-bold font-sans text-laranja text-xs mt-15">
                        Anexe a logo em SVG de sua loja
                    </p>
                </div>

                <div className="w-full mt-1 hover:cursor-pointer flex justify-center h-25">
                    <svg className="relative w-100 h-full" viewBox="0 0 828 179" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 11C1 5.47715 5.47715 1 11 1H817C822.523 1 827 5.47715 827 11V168C827 173.523 822.523 178 817 178H11C5.47715 178 1 173.523 1 168V11Z" stroke="#FF6700" stroke-width="2" stroke-dasharray="30 30"/>
                    </svg>

                    <svg className="absolute h-8 w-8 mt-6" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M29.75 1H6.75C5.22501 1 3.76247 1.6058 2.68414 2.68414C1.6058 3.76247 1 5.22501 1 6.75V52.75C1 54.275 1.6058 55.7375 2.68414 56.8159C3.76247 57.8942 5.22501 58.5 6.75 58.5H41.25C42.775 58.5 44.2375 57.8942 45.3159 56.8159C46.3942 55.7375 47 54.275 47 52.75V18.25L29.75 1ZM28.3125 41.25V49.875H19.6875V41.25H12.5L24 29.75L35.5 41.25H28.3125ZM26.875 21.125V5.3125L42.6875 21.125H26.875Z" fill="#FF6700" stroke="#FF6700" stroke-width="2" stroke-dasharray="30 30"/>
                    </svg>

                    <p className="absolute font-bold font-sans text-laranja text-xs mt-15">
                        Anexe o banner da sua loja
                    </p>
                </div>

                <div className="flex justify-center mt-3 font-sans text-xs hover:brightness-90">
                    <button className="bg-laranja text-white px-15 py-1 rounded-2xl hover:cursor-pointer transition">
                        Adicionar
                    </button>
                </div>
            
            </div>
                
        </div>
    )
}