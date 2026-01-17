import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, X, ChevronDown, ChevronUp, Globe, Smartphone, Airplay } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getBanners, deleteBanner } from '@/services/carrusel.service';
import type { Banner } from '@/interfaces/carrusel.interface';
import { useNavigate } from 'react-router';
import { getEcommerceTypeLabel } from '@/utils';

const CarruselPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openBanners, setOpenBanners] = useState<Record<number, boolean>>({});
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await getBanners();
      if (data) {
        setBanners(data);
        setOpenBanners(
          data.reduce(
            (acc, _, index) => ({
              ...acc,
              [index]: index === 0,
            }),
            {}
          )
        );
      }
    } catch (error) {
      toast.error('Error al cargar los carruseles', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const toggleBanner = (index: number) => {
    setOpenBanners((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDelete = async (id: string) => {
    if (banners.length <= 1) {
      toast.error(
        'No puedes eliminar este carrusel. Debe haber al menos un carrusel activo.',
        { position: 'top-center' }
      );
      setShowDeleteModal(null);
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteBanner(id);
      toast.success('Carrusel eliminado con éxito', { position: 'top-center' });
      setBanners(banners.filter((banner) => banner.id !== id));
    } catch (error) {
      toast.error('Error al eliminar el carrusel', { position: 'top-center' });
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#003e5c]" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#003e5c]">Carrusel</h1>
        <Button
          className="bg-[#003e5c] text-white hover:bg-[#003e5c] flex items-center gap-2"
          onClick={() => navigate('/carrusel/new')}
        >
          <Plus size={20} />
          Nuevo Carrusel
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="border rounded-lg shadow-sm overflow-hidden bg-white"
          >
            <div className="flex justify-between items-center p-4 bg-gray-50">
              <button
                className="w-full flex justify-between items-center pr-4"
                onClick={() => toggleBanner(index)}
              >
                <span className="font-semibold text-lg">
                  Carrusel {index + 1}
                </span>
                {openBanners[index] ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
            <div
              className={`transition-all duration-500 ease-in-out transform origin-top ${
                openBanners[index]
                  ? 'max-h-[1000px] opacity-100 scale-y-100'
                  : 'max-h-0 opacity-0 scale-y-95'
              }`}
            >
              {openBanners[index] && (
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <a
                        href={banner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#003e5c] hover:underline"
                      >
                        {banner.url}
                      </a>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Airplay className="w-4 h-4" />
                        <span>
                          {banner.createAt
                            ? new Date(banner.createAt).toLocaleDateString()
                            : 'Fecha no disponible'}
                        </span>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-600"
                        onClick={() => setShowDeleteModal(banner.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Airplay className="w-4 h-4" />
                    <span className="font-medium">Tipo de Ecommerce:</span>
                     <span className="text-gray-600">{getEcommerceTypeLabel(banner.typeEcommerce)}</span>
                  </div>
                 

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Airplay className="w-4 h-4" />
                        <span className="font-medium">Imagen Web</span>
                      </div>
                      <img
                        src={banner.imageWeb}
                        alt={`Banner ${index + 1} Web`}
                        className="w-full max-h-52 object-contain rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        <span className="font-medium">Imagen Móvil</span>
                      </div>
                      <img
                        src={banner.imageMovil}
                        alt={`Banner ${index + 1} Mobile`}
                        className="w-full max-h-52 object-contain rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Eliminar Carrusel</h2>
              <button
                type="button"
                className="cursor-pointer"
                onClick={handleDeleteCancel}
              >
                <X size={20} />
              </button>
            </div>
            <hr className="mt-1 mb-4" />
            <p className="text-gray-600 font-medium">
              ¿Estás seguro de que deseas eliminar el Carrusel {banners.findIndex((b) => b.id === showDeleteModal) + 1}?
            </p>
            <div className="flex justify-between items-center gap-5 mt-5">
              <Button
                type="button"
                variant="outline"
                onClick={handleDeleteCancel}
                disabled={deleteLoading}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <div className="inline-flex items-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" />
                    Eliminando...
                  </div>
                ) : (
                  'Eliminar'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarruselPage;