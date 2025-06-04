import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBanner } from '@/services/carrusel.service';
import { useNavigate } from 'react-router';

interface FormInputs {
  webImage: FileList;
  mobileImage: FileList;
  url: string;
}

const NewCarrusel: React.FC = () => {
  const navigate = useNavigate();
  const [webPreview, setWebPreview] = useState<string | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      webImage: undefined,
      mobileImage: undefined,
      url: '',
    },
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'web' | 'mobile'
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      if (type === 'web') {
        setWebPreview(url);
      } else {
        setMobilePreview(url);
      }
    }
  };

  const onSubmit = async (data: FormInputs) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', data.webImage[0]);
    formData.append('movil', data.mobileImage[0]);
    formData.append('url', data.url);

    try {
      const response = await createBanner(formData);
      if (response) {
        toast.success('Carrusel creado con éxito', { position: 'top-center' });
        reset();
        setWebPreview(null);
        setMobilePreview(null);
        navigate('/carrusel');
      } else {
        toast.error('Error al crear el carrusel', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Error al crear el carrusel:', error);
      toast.error('Error al crear el carrusel', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setWebPreview(null);
    setMobilePreview(null);
    navigate('/carrusel');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Nuevo Carrusel</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Información del Carrusel</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="url">URL (obligatoria)</Label>
                <Input
                  id="url"
                  type="text"
                  placeholder="https://example.com"
                  className="w-full text-base py-2"
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
              <div className="flex flex-col space-y-2">
                <Label htmlFor="webImage">Imagen Web (obligatoria)</Label>
                <Input
                  id="webImage"
                  type="file"
                  accept="image/*"
                  className="w-full text-base py-2"
                  {...register('webImage', {
                    required: 'La imagen web es obligatoria',
                    validate: (files) =>
                      files && files[0]?.type.startsWith('image/') ||
                      'Solo se permiten imágenes',
                  })}
                  onChange={(e) => handleImageChange(e, 'web')}
                />
                {errors.webImage && <p className="text-red-600 text-sm">{errors.webImage.message}</p>}
                {webPreview && (
                  <img
                    src={webPreview}
                    alt="Web Preview"
                    className="mt-2 w-full max-h-52 object-contain rounded-lg"
                  />
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="mobileImage">Imagen Móvil (obligatoria)</Label>
                <Input
                  id="mobileImage"
                  type="file"
                  accept="image/*"
                  className="w-full text-base py-2"
                  {...register('mobileImage', {
                    required: 'La imagen móvil es obligatoria',
                    validate: (files) =>
                      files && files[0]?.type.startsWith('image/') ||
                      'Solo se permiten imágenes',
                  })}
                  onChange={(e) => handleImageChange(e, 'mobile')}
                />
                {errors.mobileImage && <p className="text-red-600 text-sm">{errors.mobileImage.message}</p>}
                {mobilePreview && (
                  <img
                    src={mobilePreview}
                    alt="Mobile Preview"
                    className="mt-2 w-full max-h-52 object-contain rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="text-base py-2 px-6"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="text-base py-2 px-6"
            >
              {loading ? (
                <div className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Guardando...
                </div>
              ) : (
                'Guardar'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewCarrusel;