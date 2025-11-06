'use client';
import Carrossel from "@/components/Carrossel";
import Navbar from "@/components/Navbar"

const comentarios = [
    {
        id: 1,
        usuario: {
        nome: "marcus vinicius",
        imagem_url: "/default-avatar.png",
        },
        texto: "Produto excelente! Chegou rápido e bem embalado.",
        rating: 5,
    },
    {
        id: 2,
        usuario: {
        nome: "felipe avelar",
        imagem_url: "/default-avatar.png",
        },
        texto: "Gostei bastante, mas poderia ter mais opções de cores.",
        rating: 4,
    },
    {
        id: 3,
        usuario: {
        nome: "tutu",
        imagem_url: "/default-avatar.png",
        },
        texto: "Não funcionou direito no começo, mas o suporte resolveu.",
        rating: 3,
    },
    {
        id: 3,
        usuario: {
        nome: "luis",
        imagem_url: "/default-avatar.png",
        },
        texto: "Não funcionou direito no começo, mas o suporte resolveu.",
        rating: 3,
    },
    {
        id: 3,
        usuario: {
        nome: "caio poggers",
        imagem_url: "/default-avatar.png",
        },
        texto: "Não funcionou direito no começo, mas o suporte resolveu.",
        rating: 3,
    },
    {
        id: 3,
        usuario: {
        nome: "teste",
        imagem_url: "/default-avatar.png",
        },
        texto: "Não funcionou direito no começo, mas o suporte resolveu.",
        rating: 3,
    },
];


const produtos = [
    {
        id: 1,
        name: "Celular Samsung",
        price: 500,
        stock: 15,
        product_images: [{ image_url: "/default-avatar.png" }],
        rating: 4.8,
    },
    {
        id: 2,
        name: "Celular Xiaomi",
        price: 500,
        stock: 8,
        product_images: [{ image_url: "/default-avatar.png" }],
        rating: 4.6,
    },
    {
        id: 3,
        name: "Celular Iphone",
        price: 500,
        stock: 0,
        product_images: [{ image_url: "/default-avatar.png" }],
        rating: 4.9,
    },
    {
        id: 3,
        name: "Celular Iphone",
        price: 500,
        stock: 0,
        product_images: [{ image_url: "/default-avatar.png" }],
        rating: 4.9,
    },
    {
        id: 3,
        name: "Celular Iphone",
        price: 500,
        stock: 0,
        product_images: [{ image_url: "/default-avatar.png" }],
        rating: 4.9,
    },
    {
        id: 3,
        name: "Celular Iphone",
        price: 500,
        stock: 0,
        product_images: [{ image_url: "/default-avatar.png" }],
        rating: 4.9,
    },
    {
        id: 3,
        name: "Celular Iphone",
        price: 500,
        stock: 0,
        product_images: [{ image_url: "/default-avatar.png" }],
        rating: 4.9,
    },
    {
        id: 3,
        name: "Celular Iphone",
        price: 500,
        stock: 0,
        product_images: [{ image_url: "/default-avatar.png" }],
        rating: 4.9,
    },
]


export default function storePage() {
    return (
        <main className="min-h-screen bg-amber-50 pb-16">

            <Navbar />

            <div className="bg-gray-400 p-60">
                
            </div>

            <div className="bg-gray-100 flex flex-col">
                <p className="text-laranja ml-6 text-center font-sans font-semibold text-3xl mt-10">
                    Reviews e Comentários 
                </p>

                <p className="text-center text-5xl font-sans font-semibold text-laranja mt-2"> 
                    4.8
                </p>

                <div className="px-40 mt-5 py-10">
                <Carrossel>
                    {comentarios.length > 0 ? (
                        comentarios.map((comentario) => (
                        <div
                            key={comentario.id}
                            className="bg-amber-50 font-sans rounded-3xl px-6 py-4 flex items-center gap-5 text-gray-800 min-w-[600px] max-w-[750px]"
                            >
                            {/* imagem do usuário */}
                            <img
                                src={comentario.usuario.imagem_url}
                                alt={comentario.usuario.nome}
                                className="w-24 h-24 rounded-full object-cover shrink-0"
                            />

                            {/* conteúdo do comentário */}
                            <div className="flex flex-col justify-between w-full">
                                <div className="flex justify-between items-center">
                                <p className="font-semibold text-lg text-gray-900">{comentario.usuario.nome}</p>
                                {/* estrelas */}
                                <div className="flex gap-1">
                                    {Array.from({ length: comentario.rating }).map((_, i) => (
                                        <svg key={i} width="20" height="20" viewBox="0 0 29 28" fill="none">
                                            <path
                                            d="M13.2104 0.729361C13.5205 -0.243083 14.8964 -0.243086 15.2065 0.729358L17.8047 8.87838C17.9439 9.31482 18.3505 9.61022 18.8086 9.6077L27.3616 9.56059C28.3823 9.55497 28.8075 10.8636 27.9785 11.459L21.0312 16.4483C20.6591 16.7155 20.5038 17.1934 20.6478 17.6283L23.3356 25.7482C23.6564 26.7172 22.5432 27.526 21.7207 26.9215L14.8288 21.856C14.4597 21.5847 13.9572 21.5847 13.5881 21.856L6.69615 26.9215C5.87372 27.526 4.76052 26.7172 5.08127 25.7482L7.76912 17.6283C7.91308 17.1934 7.75777 16.7155 7.3857 16.4483L0.438419 11.459C-0.390617 10.8636 0.0345829 9.55497 1.05524 9.56059L9.60833 9.6077C10.0664 9.61022 10.473 9.31482 10.6122 8.87838L13.2104 0.729361Z"
                                            fill="#FFEB3A"
                                            />
                                        </svg>
                                    ))}

                                    {Array.from({ length: 5 - comentario.rating }).map((_, i) => (
                                        <svg key={i} width="20" height="20" viewBox="0 0 29 28" fill="none">
                                            <path
                                            d="M13.2104 0.729361C13.5205 -0.243083 14.8964 -0.243086 15.2065 0.729358L17.8047 8.87838C17.9439 9.31482 18.3505 9.61022 18.8086 9.6077L27.3616 9.56059C28.3823 9.55497 28.8075 10.8636 27.9785 11.459L21.0312 16.4483C20.6591 16.7155 20.5038 17.1934 20.6478 17.6283L23.3356 25.7482C23.6564 26.7172 22.5432 27.526 21.7207 26.9215L14.8288 21.856C14.4597 21.5847 13.9572 21.5847 13.5881 21.856L6.69615 26.9215C5.87372 27.526 4.76052 26.7172 5.08127 25.7482L7.76912 17.6283C7.91308 17.1934 7.75777 16.7155 7.3857 16.4483L0.438419 11.459C-0.390617 10.8636 0.0345829 9.55497 1.05524 9.56059L9.60833 9.6077C10.0664 9.61022 10.473 9.31482 10.6122 8.87838L13.2104 0.729361Z"
                                            fill="#FFFFFF"
                                            />
                                        </svg>
                                    ))}

                                    
                                </div>
                                </div>

                                <p className="text-gray-800 text-[15px] leading-snug mt-2">
                                {comentario.texto}
                                </p>

                                <div className="flex justify-end">
                                    <div className="w-14 text-sm text-laranja font-medium mt-2 cursor-pointer">
                                        ver mais
                                    </div>
                                </div>
                                
                            </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 font-sans">
                        Nenhum comentário disponível.
                        </p>
                    )}
                </Carrossel>
                </div>
            </div>

            {/* Produtos */}
            <div className="w-full max-w-5xl font-sans mx-auto mt-3 px-4">
                <div className="flex text-center gap-1">
                    <h3 className="text-xl font-sans font-bold mb-4">
                    Produtos 
                    </h3>
                    <h3 className="text-xs mt-2.5 font-sans font-bold">melhor avaliados</h3>
                </div>
                
                <div className="flex relative rounded-3xl px-2 font-sans gap-6">
                    <Carrossel>
                      {produtos.length > 0 ? (
                        produtos.map((produto) => (
                          <div
                            key={produto.id}
                            className="relative min-w-[170px] bg-white shadow rounded-4xl p-4 h-55 flex flex-col justify-between text-gray-500 transition-transform cursor-pointer"
                          >
                            <div className="flex justify-center items-center flex-1">
                            <img
                              src={produto.product_images?.[0]?.image_url}
                              alt={produto.name}
                              className="h-24"
                            />
                            </div>
            
                            <div className="flex flex-col items-start">
                              <h4 className="text-lg font-semibold text-gray-800">{produto.name}</h4>
                              <p className="text-gray-800 font-semibold">R${produto.price}</p>
                              {produto.stock > 0 ? (
                                <p className="text-green-600 font-bold text-sm">Disponível</p>
                              ) : (
                                <p className="text-red-600 font-bold text-sm">Indisponível</p>
                              )}
                            </div>
                            
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 font-sans">Este usuário ainda não possui produtos.</p>
                      )}
                    </Carrossel>
                    </div>
                </div>

            <div className="bg-gray-300 mt-10 p-30">
                div todos os produtos
            </div>
        </main>
    )
}