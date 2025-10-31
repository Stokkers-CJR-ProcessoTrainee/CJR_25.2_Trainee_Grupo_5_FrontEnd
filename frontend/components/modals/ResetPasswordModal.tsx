import { verifyCode } from "@/api/api";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

interface ResetPasswordModalProps {
  mostrar: boolean;
  fechar: () => void;
  email : string;
}

export default function ResetPasswordModal({mostrar, fechar, email}: ResetPasswordModalProps) {
    const [code, setCode] = useState("");
    const [codeVerified, setCodeVerified] = useState(false);
    const [new_password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleVerify = async (e:FormEvent) => {
        e.preventDefault();
        if (!code) {
            toast.error("Digite o código enviado por email!");
            return;
        }
        try {
            const res = await verifyCode(email,code);
            toast.success(res.message);
            setCodeVerified(true);
        } catch (error:any) {
            const message = error?.response?.data?.message;
            toast.error(message);
        }
    }

    if (!mostrar) return null;

    return (    
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card rounded-lg p-8 max-w-md w-full text-center shadow-lg">
            <h2 className="text-laranja font-extrabold text-xl mb-6">Recuperar Senha</h2>
            <form onSubmit={handleVerify}>
                <input
                type="text"
                placeholder="Digite o código"
                className="bg-background rounded-full p-2 pl-4 border border-gray-300 mb-4 w-full"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                />
                <button
                className="bg-laranja font-sans tracking-wider text-white rounded-full w-full p-3 
                mb-4 hover:brightness-90 transition hover:brightness-90 transition cursor-pointer"
                >
                    Verificar Código
                </button>
            </form>

                <input
                type="password"
                placeholder="Nova senha"
                className={`bg-background rounded-full p-2 pl-4 border mb-4 w-full ${
                    codeVerified 
                    ? "border-gray-300 focus:border-laranja focus:outline-none" 
                    : "border-gray-400 bg-gray-200 cursor-not-allowed"
                }`}
                value={new_password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!codeVerified}
                />
                <input
                type="password"
                placeholder="Confirme a senha"
                className={`bg-background rounded-full p-2 pl-4 border mb-4 w-full ${
                    codeVerified 
                    ? "border-gray-300 focus:border-laranja focus:outline-none" 
                    : "border-gray-400 bg-gray-200 cursor-not-allowed"
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={!codeVerified}
                />
                <button
                className={`w-full p-3 rounded-full font-sans tracking-wider text-white transition ${
                    codeVerified 
                    ? "bg-laranja hover:brightness-90 cursor-pointer" 
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!codeVerified}
                >
                    Redefinir Senha
                </button>

            <button
                onClick={fechar}
                className="mt-6 text-gray-500 hover:underline"
            >
            Fechar
            </button>

        </div>
        </div>
    );
}