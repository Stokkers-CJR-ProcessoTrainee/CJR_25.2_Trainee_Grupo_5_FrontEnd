export default function ProductPage() {
  return (
    <main>

      {/* Container 1 */}
      <div className="flex flex-row p-4 gap-4 bg-amber-100">

        {/* fotos */}
        <div className="flex flex-row bg-green-300 w-5/8 h-150 p-4 gap-4">
          <div className="flex flex-col p-4 gap-4 bg-green-400 h-full flex-1">
            <div className="bg-green-500 w-full flex-1"></div>
            <div className="bg-green-500 w-full flex-1"></div>
            <div className="bg-green-500 w-full flex-1"></div>
            <div className="bg-green-500 w-full flex-1"></div>
          </div>
          <div className="bg-green-400 h-full w-142"></div>
        </div>

        {/* infos */}
        <div className="flex flex-col p-4 gap-4 bg-red-400 w-3/8 h-150">
          <div className="bg-red-500 w-full h-12"></div>
          <div className="flex flex-row gap-4 bg-red-500 w-full h-8">
            <div className="bg-red-600 h-full flex-1"></div>
            <div className="bg-red-600 h-full flex-1"></div>
            <div className="bg-red-600 h-full flex-1"></div>
          </div>
          <div className="bg-red-500 h-16 w-40"></div>
          <div className="bg-red-500 flex-1 w-full"></div>
        </div>

      </div>

      {/* outros produtos */}
      <div className="flex flex-col p-4 gap-4 bg-amber-100 h-96">
        <div className="bg-blue-400 h-12 w-70"></div>
        <div className="bg-blue-400 flex-1 w-full"></div>
      </div>


    </main>
  );
}
