import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-card shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl px-14 py-4 flex  items-center">

        <Link href="/home" className="flex items-center">
          <span className="text-4xl font-extrabold font-sans text-laranja tracking-tight">
            Stok<span className="text-gray-800">kers</span>
          </span>
        </Link>

      </div>

    </nav>
  );
}
