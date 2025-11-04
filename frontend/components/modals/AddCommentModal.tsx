import { FaTimes } from "react-icons/fa";

interface AddCommentModalProps {
    mostrar: boolean,
    fechar: () => void,
}

export default function AddCommentModal({mostrar, fechar}: AddCommentModalProps) {
    
    
    if (!mostrar) return null

    return(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-8 max-w-md w-full text-center shadow-lg relative">
                <button
                onClick={() => fechar()}
                className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-gray-800 transition text-2xl"
                >
                    <FaTimes />
                </button>
            </div>
        </div>
    );
}