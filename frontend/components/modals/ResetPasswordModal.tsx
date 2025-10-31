import { useState } from "react";

interface ResetPasswordModalProps {
  mostrar: boolean;
  fechar: () => void;
}

export default function ResetPasswordModal({mostrar, fechar}: ResetPasswordModalProps) {
  const [code, setCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!mostrar) return null;

  return (    
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-8 max-w-md w-full text-center shadow-lg">
        <h2 className="text-laranja font-extrabold text-xl mb-6">Recuperar Senha</h2>

            <input
              type="text"
              placeholder="Digite o código"
              className="bg-background rounded-full p-2 pl-4 border border-gray-300 mb-4 w-full"
            />
            <button
              className="bg-laranja font-sans tracking-wider text-white rounded-full w-full p-3 mb-4 hover:brightness-90 transition hover:brightness-90 transition cursor-pointer"
            >
                Verificar Código
            </button>

            <input
              type="password"
              placeholder="Nova senha"
              className="bg-background rounded-full p-2 pl-4 border border-gray-300 mb-4 w-full"
            />
            <input
              type="password"
              placeholder="Confirme a senha"
              className="bg-background rounded-full p-2 pl-4 border border-gray-300 mb-4 w-full"
            />
            <button
              className="bg-laranja font-sans tracking-wider text-white rounded-full w-full p-3 hover:brightness-90 transition hover:brightness-90 transition cursor-pointer"
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