'use client'
import { getUserById, processCheckout } from "@/api/api"; 
import { useTheme } from "@/context/ThemeProvider";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { FaBoxOpen, FaMoon, FaSignOutAlt, FaStore, FaSun, FaShoppingCart, FaTrash, FaCreditCard, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { usePathname, useRouter } from 'next/navigation'; 
import { useCart } from "@/context/Carrinho"; 

interface User {
    profile_picture_url: string,
}

const PaymentModal = ({ isOpen, onClose, total, cartItems, onSuccess }: any) => {
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

    useEffect(() => {
        if (isOpen) setStatus('idle');
    }, [isOpen]);

    const handleConfirmPayment = async () => {
        setStatus('processing');

        setTimeout(async () => {
            try {
                const payload = cartItems.map((item: any) => ({
                    id: item.id,
                    quantity: item.quantity
                }));

                await processCheckout(payload);

                setStatus('success');
                
                setTimeout(() => {
                    onSuccess(); 
                    onClose();
                }, 1500);

            } catch (error) {
                console.error("Erro no checkout:", error);
                setStatus('error');
            }
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 text-center transform transition-all scale-100">
                
                {status === 'idle' && (
                    <>
                        <div className="bg-laranja/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-laranja">
                            <FaCreditCard size={30} />
                        </div>
                        <h2 className="text-2xl font-bold text-text mb-2">Confirmar Pagamento</h2>
                        <p className="text-gray-500 mb-6">
                            Você está prestes a finalizar a compra de <span className="font-bold">{cartItems.length} itens</span>.
                        </p>
                        <div className="bg-cinzaclaro p-4 rounded-xl mb-6 flex justify-between items-center">
                            <span className="text-gray-600">Total a pagar:</span>
                            <span className="text-2xl font-extrabold text-laranja">R$ {total.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 py-3 cursor-pointer rounded-xl border border-gray-300 text-gray-500 font-semibold hover:bg-gray-100 transition">
                                Cancelar
                            </button>
                            <button onClick={handleConfirmPayment} className="flex-1 py-3 rounded-xl cursor-pointer bg-laranja text-white font-bold hover:brightness-90 transition shadow-lg">
                                Pagar Agora
                            </button>
                        </div>
                    </>
                )}

                {status === 'processing' && (
                    <div className="py-10 flex flex-col items-center">
                        <FaSpinner className="animate-spin text-laranja text-5xl mb-4" />
                        <p className="text-text font-semibold text-lg">Processando pagamento...</p>
                        <p className="text-gray-400 text-sm">Verificando estoque e saldo.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="py-8 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <FaCheckCircle className="text-green-500 text-6xl mb-4" />
                        <h2 className="text-2xl font-bold text-text mb-1">Compra Realizada!</h2>
                        <p className="text-gray-500">Seu pedido foi confirmado.</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="py-8 flex flex-col items-center">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-text mb-1">Erro no Pagamento</h2>
                        <p className="text-gray-500 mb-4">Não foi possível processar ou estoque insuficiente.</p>
                        <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg text-gray-700 font-semibold">Fechar</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { cartItems, totalPrice, removeFromCart, cartCount, clearCart } = useCart();
    const router = useRouter(); 
    const pathname = usePathname();
    const [logado, setLogado] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); 
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
                <div className="absolute right-0 mt-3 w-80 bg-card rounded-lg shadow-xl overflow-hidden z-50 border border-transparent">
                    <div className="p-4 bg-cinzaclaro border-b border-cinzaclaro flex justify-between items-center">
                        <h3 className="text-text font-semibold">Meu Carrinho</h3>
                        <span className="text-xs text-gray-500">{cartCount} itens</span>
                    </div>

                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {cartItems.length === 0 ? (
                            <p className="p-4 text-gray-500 text-center text-sm">O carrinho está vazio.</p>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-3 border-b border-cinzaclaro hover:brightness-95 transition">
                                    <Link 
                                        href={`/product/${item.id}`}
                                        onClick={() => setIsCartOpen(false)}
                                        className="flex-1 pr-2 cursor-pointer group"
                                    >
                                        <p className="text-sm font-medium text-text truncate group-hover:text-laranja transition-colors">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.quantity}x R$ {item.price}
                                        </p>
                                    </Link>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-laranja">
                                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                                        </span>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFromCart(item.id);
                                            }}
                                            className="text-red-500 cursor-pointer hover:text-red-700 p-1"
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
                        <div className="p-4 bg-cinzaclaro">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-500 font-medium">Total:</span>
                                <span className="text-lg font-bold text-text">
                                    R$ {totalPrice.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                            
                            <button 
                                onClick={() => {
                                    if (!logado) {
                                        setIsCartOpen(false);
                                        router.push('/login');
                                        return;
                                    }

                                    setIsCartOpen(false);
                                    setIsPaymentModalOpen(true);
                                }}
                                className="block text-center cursor-pointer w-full bg-laranja text-white py-2 rounded-md font-semibold hover:brightness-90 transition shadow-md"
                            >
                                Finalizar Compra
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <>
            <nav className="bg-cinza fixed top-0 left-0 w-full z-50 shadow-md" >
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                    <Link href="/" className="flex items-center">
                        <span className="text-4xl font-extrabold font-sans text-laranja tracking-tight">
                            Stok<span className="text-balck">kers</span>
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

            <PaymentModal 
                isOpen={isPaymentModalOpen} 
                onClose={() => setIsPaymentModalOpen(false)}
                total={totalPrice}
                cartItems={cartItems}
                onSuccess={() => {
                    clearCart();
                    router.push('/');
                }}
            />
        </>
    );
}