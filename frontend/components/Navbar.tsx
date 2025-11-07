import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBoxOpen, FaSignOutAlt, FaStore, FaUser } from "react-icons/fa";

export default function Navbar() {
    const [logado, setLogado] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLogado(false);
            return;
        }
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.sub);
        setLogado(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setLogado(false);
        window.location.reload();
    }

    return (
        <nav className="bg-cinza fixed shadow-xl top-0 left-0 w-full z-50" >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

            {/* Logo */}
            <Link href="/home" className="flex items-center">
            <span className="text-4xl font-extrabold font-sans text-laranja tracking-tight">
                Stok<span className="text-gray-800">kers</span>
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
                    <Link href="/" className="text-laranja text-2xl hover:text-laranja/80 transition-colors">
                        <FaBoxOpen />
                    </Link>
                    <Link href="/" className="text-laranja text-2xl hover:text-laranja/80 transition-colors">
                        <FaStore />
                    </Link>
                    <Link href={`/profile/${userId}`} className="text-laranja text-2xl hover:text-laranja/80 transition-colors">
                        <FaUser /> 
                    </Link>
                    <button onClick={handleLogout} className="text-laranja text-2xl hover:text-red-500 transition-colors cursor-pointer">
                        <FaSignOutAlt />
                    </button>
                </div>
            )}

        </div>
        </nav>
    );
}
