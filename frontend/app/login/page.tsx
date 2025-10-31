'use client';
import Image from "next/image";
import {forgotPassword, login} from "../../api/api";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import ResetPasswordModal from "@/components/modals/ResetPasswordModal";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [resetPassModal, setResetPassModal] = useState(false);

  const handleLogin = async (e:FormEvent) => {
    e.preventDefault();
      if (!email || !password) {
      toast.error("Por favor preencha todos os campos!");
      return;
    }
    try {
      setLoading(true);
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      toast.success("Login bem-sucedido! Redirecionando...");
      setTimeout(() => {
      router.push('/home');
      }, 2500);
    } catch (error:any) {
      const message = error?.response?.data?.message;
      toast.error(
        Array.isArray(message) ? message.join(", ") : message || "Erro ao fazer login!"
      );
    }finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e:FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor insira seu email para recuperar a senha!");
      return;
    }
    try {
      const data = await forgotPassword(email);
      toast.success(data.message);
      setResetPassModal(true);
    } catch (error:any) {
      const message = error?.response?.data?.message;
      toast.error(
        Array.isArray(message) ? message.join(", ") : message || "Erro ao recuperar a senha!"
      );
    }
  }

  return (
    <main
      className="bg-background min-h-screen flex items-center justify-center"
    >
      <div className="flex flex-row items-center justify-center w-full max-w-6xl mx-auto gap-15">
        
        {/* Imagem */}
        <div className="flex-1 flex justify-center">
          <Image
            src="/images/login-image.svg"
            alt="Login Image"
            width={700} 
            height={700}
            className="object-contain"
          />
        </div>

        {/* Card */}
        <div
          className="bg-card flex-1 flex flex-col p-10 py-20 rounded-lg shadow-lg max-w-md text-center"
        >
          <h1
            className="text-laranja font-sans font-extrabold text-2xl tracking-wider mb-6"
          >
            BEM VINDO DE VOLTA!
          </h1>

          <form 
            className="flex flex-col gap-3 my-2 text-gray-800 mb-3"
            onSubmit={handleLogin}
          >
            <input
              className="bg-background rounded-full p-2 pl-4 border border-gray-300"
              type="text"
              name="Email"
              id="email"
              placeholder="Email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="bg-background rounded-full p-2 pl-4 border border-gray-300"
              type="password"
              name="Senha"
              id="pass"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              disabled={loading}
              type="submit"
              className={`bg-laranja text-white font-sans tracking-wider text-xl rounded-full mt-6 p-3 hover:brightness-90 transition cursor-pointer ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:brightness-90"
              }`}
            >
              {loading ? "Entrando.." : "Entrar"}
            </button>
            <ToastContainer/>
          </form>

          <p
            className="mb-5"
          ><a
            className="text-laranja hover:underline"
            href="#"
            onClick={(handleForgot)}
          >
            Esqueceu a senha?
          </a></p>

          <p className="mt-3 text-gray-700">
            Não possui conta? <a href="/register" className="text-orange-500 hover:underline">Crie Aqui!</a>
          </p>
        </div>

      </div>

      <ResetPasswordModal
        mostrar={resetPassModal}
        fechar={() => setResetPassModal(false)}
      />

    </main>
  );
}
