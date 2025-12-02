'use client';
import { deleteUser, updateData } from "@/api/api";
import { FormEvent, useState, ChangeEvent, use } from "react";
import { FaCrown, FaEnvelope, FaLock, FaPen, FaTimes, FaTrash, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import EditUserPass from "./UpdatePassModal";
import { useRouter } from "next/navigation";

interface EditUserModalProps {
    mostrar: boolean;
    fechar: () => void;
    foto: string | undefined | null;
    onSuccess: () => void;
}

export default function EditUserModal({mostrar, fechar, foto, onSuccess}: EditUserModalProps) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [mostrarModalPass, setMostrarPass] = useState(false)

    const UploadFile = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            
            const res = await fetch("http://localhost:3001/uploads", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Erro na resposta do servidor de upload");

            const data = await res.json();
            return data.url;
        } catch (error) {
            throw error;
        }
    }

    const handleClose = () => {
        setName('');
        setUser('');
        setEmail('');
        setSelectedFile(null);
        fechar();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
        }
    };

    const handleUpdate = async (e:FormEvent) => {
        e.preventDefault();

        if (!name && !user && !email && !selectedFile) {
            console.log("Nenhum dado preenchido");
            toast.warn('Por favor, preencha algum campo.');
            return;
        }

        setLoading(true);

        try {
            let uploadedUrl = null;

            if (selectedFile) {
                uploadedUrl = await UploadFile(selectedFile);
            }

            const data: any = {};
            if (name.trim()) data.name = name;
            if (user.trim()) data.username = user;
            if (email.trim()) data.email = email;
            if (uploadedUrl) data.profile_picture_url = uploadedUrl;

            console.log("Enviando dados para update:", data);

            await updateData(data);

            toast.success('Dados atualizados com sucesso!');
            onSuccess(); 
            handleClose();

        } catch (err:any) {
            console.error(err);
            const message = err?.response?.data?.message || "Erro ao atualizar dados!";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("Tem certeza que deseja deletar a conta? Isso é permanente e vai apagar todos os dados do usuário!")) return;

        try {
            await deleteUser();
            toast.warning('Usuário deletado com sucesso!');
            localStorage.removeItem('token');
            router.push('/');
        } catch (err:any) {
            toast.error("Erro ao deletar");
        }
    }   

    if (!mostrar) return null;

    const imagePreview = selectedFile 
        ? URL.createObjectURL(selectedFile) 
        : (foto || "/default-profile.png");

    return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg relative">

                    <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl cursor-pointer">
                        <FaTimes />
                    </button>

                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <img
                            src={imagePreview}
                            alt="Foto"
                            className="w-24 h-24 rounded-full object-cover border-2 border-laranja"
                            onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
                        />
                        
                        <label 
                            htmlFor="avatar-input"
                            className="absolute bottom-0 right-0 bg-laranja p-2 rounded-full border text-white hover:brightness-90 cursor-pointer transition flex items-center justify-center z-10"
                        >
                            <FaPen />
                        </label>
                        
                        <input 
                            id="avatar-input"
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            onChange={handleFileChange}
                        />
                    </div>

                    <form onSubmit={handleUpdate}>
                        <div className="relative mb-4">
                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Nome" className="bg-gray-100 rounded-full p-2 pl-10 border border-gray-300 w-full focus:border-laranja focus:outline-none"/>
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>
                        <div className="relative mb-4">
                            <input value={user} onChange={(e) => setUser(e.target.value)} type="text" placeholder="Username" className="bg-gray-100 rounded-full p-2 pl-10 border border-gray-300 w-full focus:border-laranja focus:outline-none"/>
                            <FaCrown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>
                        <div className="relative mb-4">
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="bg-gray-100 rounded-full p-2 pl-10 border border-gray-300 w-full focus:border-laranja focus:outline-none"/>
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            <button type="submit" disabled={loading} className="p-3 rounded-full font-sans tracking-wider text-laranja border border-laranja hover:bg-laranja hover:text-white transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50">
                                {loading ? "Salvando..." : "Salvar Alterações"}
                            </button>
                            
                            <button onClick={handleDelete} type="button" className="p-3 rounded-full font-sans tracking-wider text-laranja border border-laranja hover:bg-red-600 hover:text-white transition cursor-pointer flex items-center justify-center gap-2">
                                <FaTrash /> Deletar Conta
                            </button>
                            
                            <button onClick={() => setMostrarPass(true)} type="button" className="p-3 rounded-full font-sans tracking-wider text-laranja border border-laranja hover:bg-blue-500 hover:text-white transition cursor-pointer flex items-center justify-center gap-2">
                                <FaLock /> Alterar Senha
                            </button>
                        </div>
                    </form>    
                </div>
                <EditUserPass mostrar={mostrarModalPass} voltar={() => setMostrarPass(false)} />
            </div>
    );
}