import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { createBanner, getBanners } from '@/services/banner.service';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { typeEcommerce } from '@/utils/data';

interface FormInputs {
  url: string;
  typeEcommerce: string;
  imageWeb: FileList;
  imageMovil: FileList;
}

const NewBanner: React.FC = () => {
  const navigate = useNavigate();
  const [imageWebPreview, setImageWebPreview] = useState<string | null>(null);
  const [imageMovilPreview, setImageMovilPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [bannerCount, setBannerCount] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormInputs>({
    defaultValues: {
      url: '',
      typeEcommerce: '',
      imageWeb: undefined,
      imageMovil: undefined,
    },
  });

  useEffect(() => {
    const fetchBannerCount = async () => {
      try {
        const banners = await getBanners();
        setBannerCount(banners.length); // Contar todos los banners existentes
      } catch (error) {
        console.error('Error fetching banner count:', error);
        toast.error('Error al verificar banners existentes', { position: 'top-center' });
      }
    };
    fetchBannerCount();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'web' | 'movil') => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      if (type === 'web') {
        setImageWebPreview(url);
      } else {
        setImageMovilPreview(url);
      }
    }
  };

  const onSubmit = async (data: FormInputs) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('url', data.url);
    formData.append('typeEcommerce', data.typeEcommerce);
    if (data.imageWeb[0]) {
      formData.append('file', data.imageWeb[0]);
    }
    if (data.imageMovil[0]) {
      formData.append('movil', data.imageMovil[0]);
    }
    formData.append('order', (bannerCount + 1).toString());

    try {
      const response = await createBanner(formData);
      if ('error' in response) {
        toast.error(response.message, { position: 'top-center' });
      } else {
        toast.success('Banner creado con éxito', { position: 'top-center' });
        reset();
        setImageWebPreview(null);
        setImageMovilPreview(null);
        navigate('/banners');
      }
    } catch (error) {
      console.error('Error al crear el banner:', error);
      toast.error('Error al crear el banner', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setImageWebPreview(null);
    setImageMovilPreview(null);
    navigate('/banners');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Nuevo Banner</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Información del Banner</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col space-y-2">
                <label htmlFor="url" className="text-sm font-medium text-gray-700">URL</label>
                <input
                  id="url"
                  type="text"
                  placeholder="https://example.com"
                  className="w-full text-base py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  {...register('url', {
                    required: 'La URL es obligatoria',
                    pattern: {
                      value: /^https?:\/\/.+$/,
                      message: 'Por favor, ingresa una URL válida',
                    },
                  })}
                />
                {errors.url && <p className="text-red-600 text-sm">{errors.url.message}</p>}
              </div>

               <div className="flex flex-col space-y-2 w-full">
                    <Label htmlFor="typeEcommerce">Tipo de Ecommerce</Label>
                    <Controller
                        name="typeEcommerce"
                        control={control}
                        rules={{ required: 'Tipo de ecommerce es requerido' }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccione un tipo de ecommerce" />
                            </SelectTrigger>
                            <SelectContent>
                                {typeEcommerce.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.typeEcommerce && (
                    <p className="text-red-600 text-sm ml-2">
                        {errors.typeEcommerce.message}
                    </p>
                    )}
                </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="imageWeb" className="text-sm font-medium text-gray-700">Imagen Web</label>
                <input
                  id="imageWeb"
                  type="file"
                  accept="image/*"
                  className="w-full text-base py-2"
                  {...register('imageWeb', {
                    required: 'La imagen web es obligatoria',
                    validate: (files) =>
                      files && files[0]?.type.startsWith('image/') ||
                      'Solo se permiten archivos de imagen',
                  })}
                  onChange={(e) => handleImageChange(e, 'web')}
                />
                {errors.imageWeb && <p className="text-red-600 text-sm">{errors.imageWeb.message}</p>}
                {imageWebPreview && (
                  <img
                    src={imageWebPreview}
                    alt="Vista previa de la imagen web"
                    className="mt-2 w-full max-h-52 object-contain rounded-lg"
                  />
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="imageMovil" className="text-sm font-medium text-gray-700">Imagen Móvil</label>
                <input
                  id="imageMovil"
                  type="file"
                  accept="image/*"
                  className="w-full text-base py-2"
                  {...register('imageMovil', {
                    required: 'La imagen móvil es obligatoria',
                    validate: (files) =>
                      files && files[0]?.type.startsWith('image/') ||
                      'Solo se permiten archivos de imagen',
                  })}
                  onChange={(e) => handleImageChange(e, 'movil')}
                />
                {errors.imageMovil && <p className="text-red-600 text-sm">{errors.imageMovil.message}</p>}
                {imageMovilPreview && (
                  <img
                    src={imageMovilPreview}
                    alt="Vista previa de la imagen móvil"
                    className="mt-2 w-full max-h-52 object-contain rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="text-base py-2 px-6 border border-gray-300 rounded-md hover:bg-gray-100"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="text-base py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? (
                <div className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Guardando...
                </div>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewBanner;