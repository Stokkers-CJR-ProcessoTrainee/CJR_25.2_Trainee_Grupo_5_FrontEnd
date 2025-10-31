import Image from "next/image";


export default async function Caixa() {
    
    const res = await fetch("http://localhost:3001/categories", {
    cache: "no-store",
  });
  const categories = await res.json();

    return (
        <div className="flex flex-wrap gap-4 m-10">
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
                  </div>
    )
}