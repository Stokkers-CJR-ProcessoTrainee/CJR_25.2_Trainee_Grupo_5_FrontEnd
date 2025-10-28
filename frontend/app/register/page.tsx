'use client'
import {register} from "../../api/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirm, setPasswordC] = useState("");

  const handle = async (e:FormEvent) => {
    e.preventDefault();
    const data = await register(nome, username, email, password, password_confirm);
    router.push('/login')
  }

  return (
    <main
      className="bg-background min-h-screen flex items-center justify-center"
    >
      <div className="flex flex-row items-center justify-center w-full max-w-6xl mx-auto gap-10">
        
        {/* Card */}
        <div
          className="bg-card flex-1 flex flex-col p-10 rounded-2xl shadow-lg max-w-md text-center"
        >
          <h1
            className="text-laranja font-sans font-extrabold text-4xl tracking-wider mb-6"
          >
            Cadastre-se
          </h1>

          <form 
            onSubmit={handle}
            className="flex flex-col gap-3 my-2 text-gray-800 mb-3">
            <input
              className="bg-background rounded-full p-2 pl-4 border border-gray-300"
              type="text"
              name="nome"
              placeholder="Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <input
              className="bg-background rounded-full p-2 pl-4 border border-gray-300"
              type="text"
              name="user"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}              
            />
            <input
              className="bg-background rounded-full p-2 pl-4 border border-gray-300"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="bg-background rounded-full p-2 pl-4 border border-gray-300"
              type="password"
              name="pass"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="bg-background rounded-full p-2 pl-4 border border-gray-300"
              type="password"
              name="pass_confirm"
              placeholder="Confirme a senha"
              value={password_confirm}
              onChange={(e) => setPasswordC(e.target.value)}
            />
            <button
              type="submit"
              className="bg-laranja text-white font-sans tracking-wider text-xl rounded-full mt-6 p-3 hover:brightness-90 hover:scale-102 transition cursor-pointer"
            >
              Cadastrar
            </button>
          </form>

          <p className="mt-2 text-gray-700">
            Já possui conta? <a href="/login" className="text-orange-500 hover:underline">Entre aqui</a>
          </p>
        </div>

        {/* Imagem */}
        <div className="flex-1 flex justify-center">
          <Image
            src="/images/cadastro-image.svg"
            alt="Cadastro Image"
            width={700} 
            height={700}
            className="object-contain"
          />
        </div>

      </div>
    </main>
  );
}