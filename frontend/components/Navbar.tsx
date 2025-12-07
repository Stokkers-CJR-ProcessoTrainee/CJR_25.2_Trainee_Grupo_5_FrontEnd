'use client'
import { getUserById } from "@/api/api";
import { useTheme } from "@/context/ThemeProvider";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { FaBoxOpen, FaMoon, FaSignOutAlt, FaStore, FaSun, FaShoppingCart, FaTrash } from "react-icons/fa";
import { usePathname } from 'next/navigation'; 
import { useCart } from "@/context/Carrinho";

interface User {
    profile_picture_url: string,
}

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { cartItems, totalPrice, removeFromCart, cartCount } = useCart();
    
    const pathname = usePathname();
    const [logado, setLogado] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const cartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
                setIsCartOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, []);

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
                console.error("Erro user:", error);
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

    const getLinkActiveClass = (href: string) => pathname.startsWith(href) ? 'bg-laranja text-white' : 'border border-laranja text-laranja hover:bg-laranja hover:text-white';

    const CartDropdown = () => (
        <div className="relative" ref={cartRef}>
            <button 
                onClick={() => setIsCartOpen(!isCartOpen)} 
                className="text-2xl text-laranja hover:text-white cursor-pointer transition-colors relative flex items-center"
            >
                <FaShoppingCart />
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                    </span>
                )}
            </button>

            {isCartOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-gray-800 font-semibold">Meu Carrinho</h3>
                        <span className="text-xs text-gray-500">{cartCount} itens</span>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                        {cartItems.length === 0 ? (
                            <p className="p-4 text-gray-500 text-center text-sm">O carrinho está vazio.</p>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50">
                                    <div className="flex-1 pr-2">
                                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {item.quantity}x R$ {item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-laranja">
                                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                                        </span>
                                        {/* Botão para remover item */}
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                            title="Remover item"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="p-4 bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600 font-medium">Total:</span>
                                <span className="text-lg font-bold text-gray-900">
                                    R$ {totalPrice.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                            <button className="w-full bg-laranja text-white py-2 rounded-md font-semibold hover:bg-opacity-90 transition-colors">
                                Finalizar Compra
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <nav className="bg-cinza fixed top-0 left-0 w-full z-50 shadow-md" >
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                <Link href="/" className="flex items-center">
                    <span className="text-4xl font-extrabold font-sans text-laranja tracking-tight">
                        Stok<span className="text-black">kers</span>
                    </span>
                </Link>

                {!logado ? (
                <div className="flex space-x-8 items-center"> 
                    <div className="flex space-x-6 items-center">
                        <Link href="/categories" className={`${getActiveClass('/categories')} text-2xl hover:text-white transition-colors`}>
                            <FaBoxOpen />
                        </Link>
                        <Link href="/categories-stores" className={`${getActiveClass('/categories-stores')} text-2xl hover:text-white transition-colors`}>
                            <FaStore />
                        </Link>
                        {/* Carrinho aparece mesmo se não estiver logado (opcional) */}
                         <CartDropdown /> 
                    </div>
                
                    <div className="space-x-4">
                        <Link href="/login" className={`px-5 py-2 rounded-full tracking-wider font-sans font-semibold transition-all duration-200 ${getLinkActiveClass('/login')}`}>Login</Link>
                        <Link href="/register" className={`px-5 py-2 rounded-full font-sans tracking-wider font-semibold transition-all duration-200 ${getLinkActiveClass('/register')}`}>Registrar</Link>
                    </div>
                </div>
                ) : (
                    <div className="flex space-x-6 items-center">
                        <Link href="/categories" className={`text-2xl hover:text-white transition-colors ${getActiveClass('/categories')}`}>
                            <FaBoxOpen />
                        </Link>
                        <Link href="/categories-stores" className={`text-2xl hover:text-white transition-colors ${getActiveClass('/categories-stores')}`}>
                            <FaStore />
                        </Link>
                        
                        <CartDropdown />
                        
                        <Link href={`/profile/${userId}`} className={`text-2xl hover:text-laranja/80 transition-colors ${getActiveClass('/profile')}`}>
                            <img src={user?.profile_picture_url} alt="Foto de perfil" className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${pathname.startsWith('/profile') ? 'border-white' : 'border-transparent hover:border-laranja/50'}`} />
                        </Link>
                        <button onClick={handleLogout} className="text-laranja text-2xl hover:text-red-600 transition-colors cursor-pointer">
                            <FaSignOutAlt />
                        </button>
                    </div>
                )}
                <button onClick={toggleTheme} className="p-2 rounded-full text-themeBut hover:text-white cursor-pointer transition absolute left-[2%]" aria-label="Toggle Dark Mode">
                    {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
                </button>
            </div>
        </nav>
    );
}