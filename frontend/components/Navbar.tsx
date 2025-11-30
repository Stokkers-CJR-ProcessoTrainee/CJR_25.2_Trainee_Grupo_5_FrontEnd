import { getUserById } from "@/api/api";
import { useTheme } from "@/context/ThemeProvider";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBoxOpen, FaMoon, FaSignOutAlt, FaStore, FaSun, FaUser } from "react-icons/fa";

interface User {
    profile_picture_url: string,
}

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();

    const [logado, setLogado] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [user,setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLogado(false);
            return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const id = payload.sub;
        setUserId(id);
        setLogado(true);

        async function fetchUser() {
            try {
                const user = await getUserById(id);
                setUser(user);
            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
            }
        }
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setLogado(false);
        window.location.reload();
    }

    return (
        <nav className="bg-cinza fixed top-0 left-0 w-full z-50" >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

            {/* Logo */}
            <Link href="/home" className="flex items-center">
            <span className="text-4xl font-extrabold font-sans text-laranja tracking-tight">
                Stok<span className="text-balck">kers</span>
            </span>
            </Link>

            {!logado ? (
            <div className="flex space-x-8"> 

                <div className="flex space-x-6">
                <Link href="/" className="text-laranja text-2xl hover:text-laranja/80 transition-colors">
                    <FaBoxOpen />
                </Link>
                <Link href="/" className="text-laranja text-2xl hover:text-laranja/80 transition-colors">
                    <FaStore />
                </Link>
                </div>
            
                <div className="space-x-4">
                <Link
                    href="/login"
                    className="border border-laranja text-laranja px-5 py-2 rounded-full tracking-wider font-sans font-semibold hover:bg-laranja hover:text-white transition-all duration-200"
                >
                    Login
                </Link>
                <Link
                    href="/register"
                    className="border border-laranja text-laranja px-5 py-2 rounded-full font-sans tracking-wider font-semibold hover:bg-laranja hover:text-white transition-all duration-200"
                >
                    Registrar
                </Link>
                </div>
            </div>
            ) : (
                <div className="flex space-x-6">
                    <Link href="/" className="mt-1 text-laranja text-2xl hover:text-gray-100 transition-colors">
                        <FaBoxOpen />
                    </Link>
                    <Link href="/" className="mt-1 text-laranja text-2xl hover:text-gray-100 transition-colors">
                        <FaStore />
                    </Link>
                    <Link href={`/profile/${userId}`} className="text-laranja text-2xl hover:text-laranja/80 transition-colors">
                        <img 
                        src={user?.profile_picture_url} 
                        alt="Foto de perfil" 
                        className="w-8 h-8 rounded-full border-transparent border-2 hover:border-white"
                        />
                    </Link>
                    <button onClick={handleLogout} className="mt-1 text-laranja text-2xl hover:text-red-600 transition-colors cursor-pointer">
                        <FaSignOutAlt />
                    </button>
                </div>
            )}
            <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-themeBut hover:text-white cursor-pointer transition absolute left-[2%]"
            aria-label="Toggle Dark Mode"
            >
                {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
            </button>
        </div>
        </nav>
    );
}
