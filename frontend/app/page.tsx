import Image from "next/image";
import Caixa from "./caixa";
import { getCategories } from "@/api/api";
import { use, useState } from "react";

type Category = {
  id: number;
  name: string;
};

export default function Home() {

  const [categories, setCategories] = useState<Category[]>([]);

  async function fetchCategories() {
    const categories = await getCategories();
    return categories;
  }

  const categories1 = fetchCategories();
  
  
  return (
    <main>
      <div className="flex justify-center items-center bg-background min-h-screen p-10 gap-10"> 
        <div className = "text-laranja font-sans font-extrabold text-4xl tracking-wider mb-6 text-end h-32 w-196">
          <h1>Prepare-se para se despedir da desordem com o STOKKERS!</h1>
        </div>
        <div>
          <Image
            src="/images/placeholder.png"
            alt="Placeholder Image"
            width={500}
            height={300}
          />
        </div>
      </div>
      <div className="p-30">
          <form className="flex justify-end mr-10 mt-5 gap-2">
            <input type="text" placeholder="Procurar" />
            <button type="submit">Enviar</button>
          </form>
          <h2 className="text-laranja font-sans text-4xl ml">Categorias</h2>
         <Caixa></Caixa>
          <h2 className="text-laranja font-sans text-4xl ml">Produtos <span className="text-sm"> em Mercado</span></h2>
          { <div className="flex flex-wrap gap-4 m-10">
            {categories.map((cat: any) => (
              <div
                key={cat.id}
                className="p-4 bg-gray-200 rounded-lg hover:shadow-lg transition flex flex-col items-center justify-center"
              >
                <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
                />
                {cat.name} 
              </div>
            ))}
          </div> }
          <h2 className="text-laranja font-sans text-4xl ml">Produtos <span className="text-sm"> em Beleza</span></h2>
          <div className="flex flex-wrap gap-4 m-10">
            <div className="bg-card p-4 rounded-lg hover:shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
              Categoria 1
            </div>
            <div className="bg-card p-4 rounded-lg hover:shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
              Categoria 2
            </div>
            <div className="bg-card p-4 rounded-lg hover:shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
              Categoria 3
            </div>
            <div className="bg-card p-4 rounded-lg hover:shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
              Categoria 4
            </div>
          </div>nâo
          <h2 className="text-laranja font-sans text-4xl ml">Lojas</h2>
          { <div className="flex flex-wrap gap-4 m-10">
            {categories.map((cat: any) => (
              <div
                key={cat.id}
                className="p-4 bg-gray-200 rounded-lg hover:shadow-lg transition"
              >
                {cat.name}
              </div>
            ))}
          </div> }
      </div>
    </main>
  );
}
