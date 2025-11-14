import { FaTimes, FaStar } from "react-icons/fa";

interface RatingModalProps {
  open: boolean;
  title: string;
  rating: number;
  setRating: (rating: number) => void;
  comment: string;
  setComment: (comment: string) => void;
  onClose: () => void;
  onConfirm: (rating: number, comment: string) => void;
  onDelete?: () => void; // aparece apenas no update
}

export default function RateModal({
  open,
  title,
  rating,
  setRating,
  comment,
  setComment,
  onClose,
  onConfirm,
  onDelete
}: RatingModalProps) {

  const handleConfirm = () => {
    console.log("RateModal: handleConfirm chamado", { rating, comment });
    onConfirm(rating, comment);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-100 p-8 rounded-2xl w-[850px] shadow-xl relative">

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
        >
          <FaTimes />
        </button>

        {/* Título */}
        <h2 className="text-xl font-medium mb-6 text-center">
          Você está avaliando <strong>{title}</strong>
        </h2>

        {/* Avaliação com Estrelas */}
        <div className="flex justify-center gap-4 mb-6">
          {[1, 2, 3, 4, 5].map((value) => (
            <FaStar
              key={value}
              size={42}
              className={`cursor-pointer transition ${
                value <= rating ? "text-orange-500" : "text-gray-400"
              }`}
              onClick={() => setRating(value)}
            />
          ))}
        </div>

        {/* Campo de comentário */}
        <textarea
          placeholder="Avaliação da loja"
          className="bg-white w-full min-h-[180px] p-4 rounded-xl border border-gray-300
          focus:outline-none focus:border-orange-500 resize-none text-sm"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Ações */}
        <div className="flex flex-col gap-3 mt-6">
          {onDelete && (
            <button
              onClick={onDelete}
              className="bg-red-600 text-white py-2 rounded-full font-medium
              hover:brightness-110 transition"
            >
              DELETAR
            </button>
          )}

          <button
            onClick={handleConfirm}
            className="bg-orange-500 text-white py-2 rounded-full font-medium
            hover:brightness-110 transition"
          >
            {onDelete ? "Salvar" : "Avaliar"}
          </button>
        </div>

      </div>
    </div>
  );
}
