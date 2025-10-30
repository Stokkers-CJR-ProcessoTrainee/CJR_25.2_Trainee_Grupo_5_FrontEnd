import Image from "next/image";

export default function UserPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col gap-60 items-center">
      {/* Banner preto */}
      <div className="w-full bg-gray-400 h-80 relative flex px-100">
        {/* Foto do usuário sobreposta */}
        <div className="flex flex-col absolute bottom-[-180px] gap-3 items-start">
        
            <Image
                src="/foto-de-perfil-teste.jpg"
                alt="Foto de Perfil"
                width={256} 
                height={256} 
                className="w-44 h-44 rounded-full"
            />

            <div className="flex flex-col font-sans gap-2">
                <div className="text-3xl">
                    <h2>Nome Teste</h2>
                    </div>
                <div className="">
                    <p>@ usuário</p>
                    </div> 
                <div className="">
                    <p>email@email.teste</p>
                    </div>
            </div>
    
        </div>
      </div>
    </div>
  )
}