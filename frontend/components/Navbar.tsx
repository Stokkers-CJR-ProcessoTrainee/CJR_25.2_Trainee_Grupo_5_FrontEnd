import Link from "next/link";
import { FaBoxOpen, FaStore } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="bg-card shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl px-14 py-4 flex  items-center">

            {/* Logo */}
            <Link href="/home" className="flex items-center">
                <span className="text-4xl font-extrabold font-sans text-laranja tracking-tight">
                    Stok<span className="text-gray-800">kers</span>
                </span>
            </Link>

            {/* Icones */}
            <div className="flex space-x-8 absolute right-0 mr-75">
                {/* Esse link abaixi vai mandar pra tela de produtos */}
                <Link href="/" className="text-laranja text-2xl hover:text-laranja/80 transition-colors">
                    <FaBoxOpen />
                </Link>
                {/* Esse vai mandar pra tela de lojas */}
                <Link href="/" className="text-laranja text-2xl hover:text-laranja/80 transition-colors">
                    <FaStore />
                </Link>
            </div>

            {/* Botões */}
            <div className="flex space-x-4 absolute right-0 mr-14">
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
    </nav>
  );
}
