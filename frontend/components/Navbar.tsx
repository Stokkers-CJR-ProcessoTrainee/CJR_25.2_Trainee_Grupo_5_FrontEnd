'use client'
import { getUserById } from "@/api/api";
import { useTheme } from "@/context/ThemeProvider";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBoxOpen, FaMoon, FaSignOutAlt, FaStore, FaSun, FaUser } from "react-icons/fa";
import { usePathname } from 'next/navigation'; 

interface User {
    profile_picture_url: string,
}

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();

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

    const getActiveClass = (href: string) => {
        if (href.includes('/profile')) {
            return pathname.startsWith(href) ? 'text-white' : 'text-laranja';
        }
        return pathname === href ? 'text-white' : 'text-laranja';
    };

    const getLinkActiveClass = (href: string) => {
      return pathname.startsWith(href) ? 'bg-laranja text-white' : 'border border-laranja text-laranja hover:bg-laranja hover:text-white';
    }


    return (
        <nav className="bg-cinza fixed top-0 left-0 w-full z-50 shadow-md" >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

            <Link href="/" className="flex items-center">
                <span className="text-4xl font-extrabold font-sans text-laranja tracking-tight">
                    Stok<span className="text-balck">kers</span>
                </span>
            </Link>

            {!logado ? (
            <div className="flex space-x-8 items-center"> 

                <div className="flex space-x-6">
                <Link 
                    href="/categories" 
                    className={`${getActiveClass('/categories')} text-2xl hover:text-white transition-colors`}
                >
                    <FaBoxOpen />
                </Link>
                <Link 
                    href="/categories-stores" 
                    className={`${getActiveClass('/categories-stores')} text-2xl hover:text-white transition-colors`}
                >
                    <FaStore />
                </Link>
                </div>
            
                <div className="space-x-4">
                <Link
                    href="/login"
                    className={`px-5 py-2 rounded-full tracking-wider font-sans font-semibold transition-all duration-200 ${getLinkActiveClass('/login')}`}
                >
                    Login
                </Link>
                <Link
                    href="/register"
                    className={`px-5 py-2 rounded-full font-sans tracking-wider font-semibold transition-all duration-200 ${getLinkActiveClass('/register')}`}
                >
                    Registrar
                </Link>
                </div>
            </div>
            ) : (
                <div className="flex space-x-6 items-center">
                    <Link 
                        href="/categories" 
                        className={`text-2xl hover:text-white transition-colors ${getActiveClass('/categories')}`}
                    >
                        <FaBoxOpen />
                    </Link>
                    <Link 
                        href="/categories-stores" 
                        className={`text-2xl hover:text-white transition-colors ${getActiveClass('/categories-stores')}`}
                    >
                        <FaStore />
                    </Link>
                    
                    <Link 
                        href={`/profile/${userId}`} 
                        className={`text-2xl hover:text-laranja/80 transition-colors ${getActiveClass('/profile')}`}
                    >
                        <img 
                            src={user?.profile_picture_url} 
                            alt="Foto de perfil" 
                            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${pathname.startsWith('/profile') ? 'border-white' : 'border-transparent hover:border-laranja/50'}`}
                        />
                    </Link>
                    
                    <button onClick={handleLogout} className="text-laranja text-2xl hover:text-red-600 transition-colors cursor-pointer">
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