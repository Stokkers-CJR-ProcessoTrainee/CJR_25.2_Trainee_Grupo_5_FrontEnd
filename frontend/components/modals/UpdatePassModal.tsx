import { FormEvent, useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import { toast } from "react-toastify";

interface EditUserPassProps {
    mostrar: boolean;
    voltar: () => void;
}

export default function EditUserPass({mostrar,voltar}: EditUserPassProps) {
    const [passAtual, setPassAtual] = useState('')
    const [passNew, setPassNew] = useState('')
    const [passConfirm, setPassConfirm] = useState('')

    const [showAtual, setShowAtual] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    
    const handleClose = () => {
        setPassAtual('');
        setPassNew('');
        setPassConfirm('');
        voltar();
    };

    const handleUpdatePassword = async (e:FormEvent) => {
        e.preventDefault()

        if (!passAtual || !passNew || !passConfirm) {
            toast.error('Por favor, preencha todos os campos!')
        }

        if (passNew !== passConfirm) {
            toast.error('As novas senhas não coincidem!')
        }

    }

    if (!mostrar) return null;

    return(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-70">
            <div className="bg-card rounded-lg p-8 max-w-md w-full text-center shadow-lg relative">

                <button
                onClick={handleClose}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition text-2xl cursor-pointer"
                >
                <FaArrowLeft />
                </button>

                <div className="text-laranja text-6xl mb-6">
                <FaKey className="mx-auto" />
                </div>

                <form 
                onSubmit={handleUpdatePassword}
                className="flex flex-col gap-4">
                    <div className="relative">
                        <input
                        value={passAtual}
                        onChange={(e) => setPassAtual(e.target.value)}
                        type={showAtual ? "text" : "password"}
                        placeholder="Senha Atual"
                        className="bg-background rounded-full p-2 pl-4 pr-10 border border-gray-300 w-full focus:border-laranja focus:outline-none"
                        />
                        <button
                        type="button"
                        onClick={() => setShowAtual(!showAtual)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                        {showAtual ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                        value={passNew}
                        onChange={(e) => setPassNew(e.target.value)}
                        type={showNew ? "text" : "password"}
                        placeholder="Nova Senha"
                        className="bg-background rounded-full p-2 pl-4 pr-10 border border-gray-300 w-full focus:border-laranja focus:outline-none"
                        />
                        <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                        {showNew ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                        value={passConfirm}
                        onChange={(e) => setPassConfirm(e.target.value)}
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirmar Senha"
                        className="bg-background rounded-full p-2 pl-4 pr-10 border border-gray-300 w-full focus:border-laranja focus:outline-none"
                        />
                        <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                        {showConfirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button
                        className="p-3 rounded-full font-sans tracking-wider text-laranja border border-laranja hover:bg-laranja hover:text-white transition cursor-pointer flex items-center justify-center gap-2 mt-4"
                    >
                        Alterar Senha
                    </button>

                </form>
            </div>
        </div>
    );
}