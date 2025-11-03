import Link from "next/link";
import { FaBoxOpen, FaStore } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="bg-card shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/home" className="flex items-center">
          <span className="text-4xl font-extrabold font-sans text-laranja tracking-tight">
            Stok<span className="text-gray-800">kers</span>
          </span>
        </Link>

        <div className="flex space-x-8"> 
            {/* Ícones */}
            <div className="flex space-x-6">
            <Link href="/produtos" className="text-laranja text-2xl hover:text-laranja/80 transition-colors">
                <FaBoxOpen />
            </Link>
            <Link href="/lojas" className="text-laranja text-2xl hover:text-laranja/80 transition-colors">
                <FaStore />
            </Link>
            </div>
        
            {/* Botões */}
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

      </div>
    </nav>
  );
}
