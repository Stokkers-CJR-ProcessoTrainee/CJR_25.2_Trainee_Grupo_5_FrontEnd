"use client";
import { useState } from "react";

// Importe seus modais
import {CreateProductRatingModal} from "../../components/modals/RateModal/RateProduct";
import {UpdateProductRatingModal} from "../../components/modals/RateModal/UpdateRatingProduct";
import {CreateStoreRatingModal} from "../../components/modals/RateModal/RateStore";
import {UpdateStoreRatingModal} from "../../components/modals/RateModal/UpdateRatingStore";

export default function TestRatings() {
  // Estados para controlar cada modal
  const [openProdCreate, setOpenProdCreate] = useState(false);
  const [openProdUpdate, setOpenProdUpdate] = useState(false);
  const [openStoreCreate, setOpenStoreCreate] = useState(false);
  const [openStoreUpdate, setOpenStoreUpdate] = useState(false);

  // IDs de teste
  const productId = 1;
  const productRatingId = 10;
  const storeId = 2;
  const storeRatingId = 20;

  return (
    <div className="flex flex-col gap-4 justify-center items-center p-10">
      <h1 className="text-xl font-bold">Teste de Modais</h1>

      <button
        onClick={() => setOpenProdCreate(true)}
        className="px-4 py-2 bg-laranja text-white rounded-full"
      >
        Criar Rating Produto
      </button>

      <button
        onClick={() => setOpenProdUpdate(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-full"
      >
        Editar Rating Produto
      </button>

      <button
        onClick={() => setOpenStoreCreate(true)}
        className="px-4 py-2 bg-green-500 text-white rounded-full"
      >
        Criar Rating Loja
      </button>

      <button
        onClick={() => setOpenStoreUpdate(true)}
        className="px-4 py-2 bg-purple-500 text-white rounded-full"
      >
        Editar Rating Loja
      </button>

      {/* Modais Renderizados */}
      <CreateProductRatingModal
        open={openProdCreate}
        onClose={() => setOpenProdCreate(false)}
        productId={productId}
      />

      <UpdateProductRatingModal
        open={openProdUpdate}
        onClose={() => setOpenProdUpdate(false)}
        ratingId={productRatingId}
        initialRating={4}
        initialComment="Muito bom!"
      />

      <CreateStoreRatingModal
        open={openStoreCreate}
        onClose={() => setOpenStoreCreate(false)}
        storeId={storeId}
      />

      <UpdateStoreRatingModal
        open={openStoreUpdate}
        onClose={() => setOpenStoreUpdate(false)}
        ratingId={storeRatingId}
        initialRating={3}
        initialComment="Loja média, atendimento ok"
      />
    </div>
  );
}
