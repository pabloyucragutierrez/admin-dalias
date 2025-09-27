import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react"; 
import { useNavigate } from "react-router";

export default function Cotizacion() { 
    const navigate = useNavigate();

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:gap-0 gap-2 sm:items-center justify-between">
        <h1 className="text-4xl text-blue-600 font-bold">Cotizaciones</h1>
        <Button
          className="bg-blue-600 flex flex-row items-center gap-2 text-white hover:bg-blue-700 cursor-pointer"
          onClick={() => navigate("/cotizacion/nuevo")}
        >
          <Plus size={20} />
          Nueva Cotizacion
        </Button>
      </div>
    </>
  );
}