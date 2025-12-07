// src/components/UploadArea.tsx
'use client';
import { useState } from "react";

interface UploadAreaProps {
    file: File | null;
    setFile: (file: File | null) => void;
    placeholder: string;
    accept?: string;
    className?: string;
}

export function UploadArea({ file, setFile, placeholder, accept = "image/*", className = "" }: UploadAreaProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div 
            className={`w-full flex justify-center h-25 relative transition-all duration-200 rounded-lg ${className} ${
                isDragging ? "bg-laranja/10 scale-[1.02] border-laranja border-2 border-dashed" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {!isDragging && (
                <svg className="relative w-100 h-full pointer-events-none" viewBox="0 0 828 179" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 11C1 5.47715 5.47715 1 11 1H817C822.523 1 827 5.47715 827 11V168C827 173.523 822.523 178 817 178H11C5.47715 178 1 173.523 1 168V11Z" stroke="#FF6700" strokeWidth="2" strokeDasharray="30 30"/>
                </svg>
            )}
            
            <svg className="absolute h-8 w-8 mt-6 pointer-events-none" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path xmlns="http://www.w3.org/2000/svg" d="M32.75 0H9.75C8.22501 0 6.76247 0.605802 5.68414 1.68414C4.6058 2.76247 4 4.22501 4 5.75V51.75C4 53.275 4.6058 54.7375 5.68414 55.8159C6.76247 56.8942 8.22501 57.5 9.75 57.5H44.25C45.775 57.5 47.2375 56.8942 48.3159 55.8159C49.3942 54.7375 50 53.275 50 51.75V17.25L32.75 0ZM31.3125 40.25V48.875H22.6875V40.25H15.5L27 28.75L38.5 40.25H31.3125ZM29.875 20.125V4.3125L45.6875 20.125H29.875Z" fill="#FF6700"/>
            </svg>

            <p className="absolute font-bold font-sans text-laranja text-xs mt-15 pointer-events-none truncate max-w-[80%] text-center">
                {file ? file.name : (isDragging ? "Solte aqui" : placeholder)}
            </p>

            <input
                type="file"
                accept={accept}
                className="absolute w-100 h-21 mt-2 opacity-0 hover:cursor-pointer"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
        </div>
    );
}