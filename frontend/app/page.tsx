import Image from "next/image";

export default function Home() {
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
          <div className="flex flex-wrap gap-4 m-10">
            <div className="bg-card p-4 rounded-lg shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
              Categoria 1
            </div>
            <div className="bg-card p-4 rounded-lg shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
              Categoria 2
            </div>
            <div className="bg-card p-4 rounded-lg shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
              Categoria 3
            </div>
            <div className="bg-card p-4 rounded-lg shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
              Categoria 4
            </div>
          </div>
          <h2 className="text-laranja font-sans text-4xl ml">Produtos <span className="text-sm"> em Mercado</span></h2>
          <div className="flex flex-wrap gap-4 m-10">
            <div className="bg-card p-4 rounded-lg shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
              Categoria 1
            </div>
            <div className="bg-card p-4 rounded-lg shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
              Categoria 2
            </div>
            <div className="bg-card p-4 rounded-lg shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
              Categoria 3
            </div>
            <div className="bg-card p-4 rounded-lg shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
              Categoria 4
            </div>
          </div>
          <h2 className="text-laranja font-sans text-4xl ml">Produtos <span className="text-sm"> em Beleza</span></h2>
          <div className="flex flex-wrap gap-4 m-10">
            <div className="bg-card p-4 rounded-lg shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
              Categoria 1
            </div>
            <div className="bg-card p-4 rounded-lg shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
              Categoria 2
            </div>
            <div className="bg-card p-4 rounded-lg shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
              Categoria 3
            </div>
            <div className="bg-card p-4 rounded-lg shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
              Categoria 4
            </div>
          </div>
          <h2 className="text-laranja font-sans text-4xl ml">Lojas</h2>
          <div className="flex flex-wrap gap-4 m-10">
            <div className="bg-card p-4 rounded-lg shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
            </div>
            <div className="bg-card p-4 rounded-lg shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
            </div>
            <div className="bg-card p-4 rounded-lg shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
            </div>
            <div className="bg-card p-4 rounded-lg shadow-lg w-48 h-48 flex items-center justify-center flex-col">
              <Image
                src="/images/placeholder.png"
                alt="Categoria 1"
                width={100}
                height={100}
              />
            </div>
          </div>
      </div>
    </main>
  );
}
