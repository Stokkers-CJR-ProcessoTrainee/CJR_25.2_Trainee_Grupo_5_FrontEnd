import { updateData } from "@/api/api";
import { FormEvent, useState } from "react";
import { FaCrown, FaEnvelope, FaLock, FaPen, FaTimes, FaTrash, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";

interface EditUserModalProps {
    mostrar: boolean;
    fechar: () => void;
}

export default function EditUserModal({mostrar, fechar}: EditUserModalProps) {
    const [name, setName] = useState('');
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');

    function getUserId() {
        const id = localStorage.getItem('userId');
        return id;
    }

    const handleUpdate = async (e:FormEvent) => {
        e.preventDefault();
        if (!name || !user || !email) {
            toast.error('Por favor preencha algum campo')
            return;
        }

        const id = getUserId();
        if (!id) {
            toast.error('Usuário não identificado!');
            return;
        }

        const data = {
            name,
            username: user,
            email
        }

        try {
            const res = await updateData(id, data)
            toast.success('Dados atualizados com sucesso!')
            fechar();
        } catch (err:any) {
            const message = err?.response?.data?.message || "Erro ao atualizar dados!";
            toast.error(message);
        }
    }

    if (!mostrar) return null;

    return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-card rounded-lg p-8 max-w-md w-full text-center shadow-lg relative">

                    <button
                    onClick={fechar}
                    className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-gray-800 transition text-2xl"
                    >
                        <FaTimes />
                    </button>

                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <img
                            alt="Foto"
                            className="w-24 h-24 rounded-full object-cover border-2 border-laranja"
                        />
                        <button className="absolute bottom-0 right-0 bg-laranja p-2 rounded-full text-white hover:brightness-90 cursor-pointer transition">
                            <FaPen />
                        </button>
                    </div>

                    <form onSubmit={handleUpdate}>
                        <div className="relative mb-4">
                            <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Nome"
                            className="bg-background rounded-full p-2 pl-10 border border-gray-300 w-full focus:border-laranja focus:outline-none"
                            />
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>

                        <div className="relative mb-4">
                            <input
                            value={user}
                            onChange = {(e) => setUser(e.target.value)}
                            type="text"
                            placeholder="Username"
                            className="bg-background rounded-full p-2 pl-10 border border-gray-300 w-full focus:border-laranja focus:outline-none"
                            />
                            <FaCrown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>

                        <div className="relative mb-4">
                            <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email"
                            className="bg-background rounded-full p-2 pl-10 border border-gray-300 w-full focus:border-laranja focus:outline-none"
                            />
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            <button
                                type="submit"
                                className="p-3 rounded-full font-sans tracking-wider text-laranja border border-laranja hover:bg-laranja hover:text-white transition cursor-pointer flex items-center justify-center gap-2"
                            >
                                Salvar Alterações
                            </button>

                            <button
                                type="button"
                                className="p-3 rounded-full font-sans tracking-wider text-laranja border border-laranja hover:bg-red-600 hover:text-white transition cursor-pointer flex items-center justify-center gap-2"
                            >
                                <FaTrash /> Deletar Conta
                            </button>

                            <button
                                type="button"
                                className="p-3 rounded-full font-sans tracking-wider text-laranja border border-laranja hover:bg-blue-500 hover:text-white hover:border-transparent transition cursor-pointer flex items-center justify-center gap-2"
                            >
                                <FaLock /> Alterar Senha
                            </button>
                        </div>
                    </form>    

                </div>
            </div>
    );
}