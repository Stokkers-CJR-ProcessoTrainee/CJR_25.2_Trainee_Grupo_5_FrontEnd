import { FaCrown, FaEnvelope, FaLock, FaTrash, FaUser } from "react-icons/fa";

export default function EditUserModal() {
    return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-card rounded-lg p-8 max-w-md w-full text-center shadow-lg">

                    <form>
                        <div className="relative mb-4">
                            <input
                            type="text"
                            placeholder="Nome"
                            className="bg-background rounded-full p-2 pl-10 border border-gray-300 w-full focus:border-laranja focus:outline-none"
                            />
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>

                        <div className="relative mb-4">
                            <input
                            type="text"
                            placeholder="Username"
                            className="bg-background rounded-full p-2 pl-10 border border-gray-300 w-full focus:border-laranja focus:outline-none"
                            />
                            <FaCrown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>

                        <div className="relative mb-4">
                            <input
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