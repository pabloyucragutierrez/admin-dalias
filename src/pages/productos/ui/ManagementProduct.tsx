import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Loader2, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { createProduct, fetchProductById, updateProduct, fetchActiveCategories, fetchActiveBranches, fetchActiveBrands, fetchActiveUnits } from '@/services/products.service';
import { useNavigate, useParams } from 'react-router';
import type { ProductDto, Category, Branch, Brand, Unit } from '@/interfaces/products.interface';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Select from 'react-select';

interface OptionSelect {
  label: string;
  value: string;
}

interface FormInputs {
  sku: string;
  name: string;
  codeBarras: string;
  description: string;
  shortDescription: string;
  marcaId: string;
  unidadId: string;
  price: number;
  purchasePrice: number;
  offer: boolean;
  discountedPrice: number;
  priceDateFrom: string;
  priceDateTo: string;
  stock: number;
  stockMin: number;
  categoriesId: string[];
  sucursalesId: string[];
  file?: File;
  imageGalery?: File[];
}

export default function ManagementProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<OptionSelect[]>([]);
  const [branchOptions, setBranchOptions] = useState<OptionSelect[]>([]);
  const [brandOptions, setBrandOptions] = useState<OptionSelect[]>([]);
  const [unitOptions, setUnitOptions] = useState<OptionSelect[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<(string | File)[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputGaleryRef = useRef<HTMLInputElement | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      sku: '',
      name: '',
      codeBarras: '',
      description: '',
      shortDescription: '',
      marcaId: '',
      unidadId: '',
      price: 0,
      purchasePrice: 0,
      offer: false,
      discountedPrice: 0,
      priceDateFrom: '',
      priceDateTo: '',
      stock: 0,
      stockMin: 0,
      categoriesId: [],
      sucursalesId: [],
      file: undefined,
      imageGalery: [],
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [activeCategories, activeBranches, activeBrands, activeUnits] = await Promise.all([
          fetchActiveCategories(),
          fetchActiveBranches(),
          fetchActiveBrands(),
          fetchActiveUnits(),
        ]);
        setCategories(activeCategories || []);
        setBranches(activeBranches || []);
        setBrands(activeBrands || []);
        setUnits(activeUnits || []);
        setCategoryOptions(
          activeCategories?.map((cat) => ({
            label: cat.name,
            value: cat.id,
          })) || []
        );
        setBranchOptions(
          activeBranches?.map((branch) => ({
            label: branch.name,
            value: branch.id,
          })) || []
        );
        setBrandOptions(
          activeBrands?.map((brand) => ({
            label: brand.name,
            value: brand.id,
          })) || []
        );
        setUnitOptions(
          activeUnits?.map((unit) => ({
            label: unit.name,
            value: unit.id,
          })) || []
        );
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        toast.error('Error al cargar datos: ' + errorMessage, { position: 'top-center' });
      }
    };

    loadData();

    if (id && id !== 'new') {
      const loadProduct = async () => {
        setLoading(true);
        try {
          const product = await fetchProductById(id);
          if (product) {
            reset({
              sku: product.sku,
              name: product.name,
              codeBarras: product.codeBarras,
              description: product.description,
              shortDescription: product.shortDescription,
              marcaId: product.marcaId,
              unidadId: product.unidadId,
              price: product.price,
              purchasePrice: product.purchasePrice,
              offer: product.offer,
              discountedPrice: product.discountedPrice,
              priceDateFrom: product.priceDateFrom ? new Date(product.priceDateFrom).toISOString().slice(0, 16) : '',
              priceDateTo: product.priceDateTo ? new Date(product.priceDateTo).toISOString().slice(0, 16) : '',
              stock: product.stock,
              stockMin: product.stockMin,
              categoriesId: product.ProductCategories.map((cat) => cat.categoryId),
              sucursalesId: product.ProductSucursales.map((suc) => suc.sucursalId),
            });
            const mainImage = product.ProductImages.find((img) => img.typeImage === 'THUMBNAIL')?.url;
            const galleryImages = product.ProductImages.filter((img) => img.typeImage === 'GALLERY').map((img) => img.url);
            if (mainImage) {
              setPreview(mainImage);
            }
            if (galleryImages.length > 0) {
              setGallery(galleryImages);
            }
          } else {
            toast.error('Error al cargar el producto', { position: 'top-center' });
            navigate('/products');
          }
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          toast.error('Error al cargar el producto: ' + errorMessage, { position: 'top-center' });
          navigate('/products');
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }
  }, [id, reset, navigate]);

  const handleClicPrincipalImage = () => {
    fileInputRef.current?.click();
  };

  const handleClicGaleryImage = () => {
    fileInputGaleryRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setValue('file', file);
      setPreview(URL.createObjectURL(file));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleGaleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      if (gallery.length + filesArray.length > 5) {
        toast.warning('Máximo se pueden subir 5 imágenes para la galería.', { position: 'top-center' });
        return;
      }
      setGallery((prev) => [...prev, ...filesArray]);
      setValue('imageGalery', filesArray);
      if (fileInputGaleryRef.current) {
        fileInputGaleryRef.current.value = '';
      }
    }
  };

  const removeGaleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, imgIndex) => imgIndex !== index));
    setValue('imageGalery', gallery.filter((_, imgIndex) => imgIndex !== index) as File[]);
  };

  const onSubmit = async (values: FormInputs) => {
    if (values.categoriesId.length === 0) {
      toast.warning('Debe seleccionar al menos una categoría', { position: 'top-center' });
      return;
    }
    if (values.sucursalesId.length === 0) {
      toast.warning('Debe seleccionar al menos una sucursal', { position: 'top-center' });
      return;
    }
    if (!values.marcaId) {
      toast.warning('Debe seleccionar una marca', { position: 'top-center' });
      return;
    }
    if (!values.unidadId) {
      toast.warning('Debe seleccionar una unidad', { position: 'top-center' });
      return;
    }
    if (!id || id === 'new') {
      if (!values.file) {
        toast.warning('Es necesario subir una imagen principal del producto', { position: 'top-center' });
        return;
      }
    }

    const payload: ProductDto = {
      sku: values.sku,
      name: values.name,
      codeBarras: values.codeBarras,
      description: values.description,
      shortDescription: values.shortDescription,
      marcaId: values.marcaId,
      unidadId: values.unidadId,
      price: values.price,
      purchasePrice: values.purchasePrice,
      offer: values.offer,
      discountedPrice: values.offer ? values.discountedPrice : 0,
      priceDateFrom: values.priceDateFrom || '',
      priceDateTo: values.priceDateTo || '',
      stock: values.stock,
      stockMin: values.stockMin,
      categoriesId: values.categoriesId,
      sucursalesId: values.sucursalesId,
      file: values.file,
      imageGalery: values.imageGalery,
    };

    try {
      const response = id && id !== 'new'
        ? await updateProduct(id, payload)
        : await createProduct(payload);

      if (!response?.success) {
        toast.warning(response?.message, { position: 'top-center' });
        return;
      }

      toast.success(response?.message, { position: 'top-center' });
      navigate('/products');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error('Error al guardar el producto: ' + errorMessage, { position: 'top-center' });
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className="p-6 w-full mx-auto">
      <h1 className="text-3xl text-blue-600 font-bold mb-6">
        {id && id !== 'new' ? 'Editar Producto' : 'Nuevo Producto'}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <div className="border rounded-md p-4 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Información Básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  type="text"
                  placeholder="SKU"
                  className="w-full max-w-md"
                  {...register('sku', { required: 'SKU es requerido' })}
                />
                {errors.sku && <p className="text-red-600 text-sm">{errors.sku.message}</p>}
              </div>
              <div className="flex flex-col space-y-1">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nombre"
                  className="w-full max-w-md"
                  {...register('name', { required: 'Nombre es requerido' })}
                />
                {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="codeBarras">Código de Barras</Label>
                <Input
                  id="codeBarras"
                  type="text"
                  placeholder="Código de Barras"
                  className="w-full max-w-md"
                  {...register('codeBarras', { required: 'Código de barras es requerido' })}
                />
                {errors.codeBarras && <p className="text-red-600 text-sm">{errors.codeBarras.message}</p>}
              </div>
              <div className="flex flex-col space-y-1">
                <Label htmlFor="marcaId">Marca</Label>
                <Controller
                  name="marcaId"
                  control={control}
                  rules={{ required: 'Debe seleccionar una marca' }}
                  render={({ field }) => (
                    <Select
                      options={brandOptions}
                      value={brandOptions.find((option) => option.value === field.value) || null}
                      onChange={(selected) => field.onChange(selected ? selected.value : '')}
                      placeholder="Selecciona una marca"
                      isClearable
                      isSearchable
                      classNamePrefix="select"
                    />
                  )}
                />
                {errors.marcaId && <p className="text-red-600 text-sm">{errors.marcaId.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="unidadId">Unidad</Label>
                <Controller
                  name="unidadId"
                  control={control}
                  rules={{ required: 'Debe seleccionar una unidad' }}
                  render={({ field }) => (
                    <Select
                      options={unitOptions}
                      value={unitOptions.find((option) => option.value === field.value) || null}
                      onChange={(selected) => field.onChange(selected ? selected.value : '')}
                      placeholder="Selecciona una unidad"
                      isClearable
                      isSearchable
                      classNamePrefix="select"
                    />
                  )}
                />
                {errors.unidadId && <p className="text-red-600 text-sm">{errors.unidadId.message}</p>}
              </div>
            </div>
            <div className="flex flex-col space-y-1 mt-4">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                type="text"
                placeholder="Descripción"
                className="w-full max-w-md"
                {...register('description', { required: 'Descripción es requerida' })}
              />
              {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
            </div>
            <div className="flex flex-col space-y-1 mt-4">
              <Label htmlFor="shortDescription">Descripción Corta</Label>
              <Input
                id="shortDescription"
                type="text"
                placeholder="Descripción Corta"
                className="w-full max-w-md"
                {...register('shortDescription', { required: 'Descripción corta es requerida' })}
              />
              {errors.shortDescription && <p className="text-red-600 text-sm">{errors.shortDescription.message}</p>}
            </div>
          </div>

          {/* Pricing and Offer Section */}
          <div className="border rounded-md p-4 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Precios y Oferta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="Precio"
                  className="w-full max-w-md"
                  {...register('price', {
                    required: 'Precio es requerido',
                    min: { value: 0, message: 'El precio no puede ser negativo' },
                    valueAsNumber: true,
                  })}
                />
                {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
              </div>
              <div className="flex flex-col space-y-1">
                <Label htmlFor="purchasePrice">Precio de Compra</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  placeholder="Precio de Compra"
                  className="w-full max-w-md"
                  {...register('purchasePrice', {
                    required: 'Precio de compra es requerido',
                    min: { value: 0, message: 'El precio de compra no puede ser negativo' },
                    valueAsNumber: true,
                  })}
                />
                {errors.purchasePrice && <p className="text-red-600 text-sm">{errors.purchasePrice.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="Stock"
                  className="w-full max-w-md"
                  {...register('stock', {
                    required: 'Stock es requerido',
                    min: { value: 0, message: 'El stock no puede ser negativo' },
                    valueAsNumber: true,
                  })}
                />
                {errors.stock && <p className="text-red-600 text-sm">{errors.stock.message}</p>}
              </div>
              <div className="flex flex-col space-y-1">
                <Label htmlFor="stockMin">Stock Mínimo</Label>
                <Input
                  id="stockMin"
                  type="number"
                  placeholder="Stock Mínimo"
                  className="w-full max-w-md"
                  {...register('stockMin', {
                    required: 'Stock mínimo es requerido',
                    min: { value: 0, message: 'El stock mínimo no puede ser negativo' },
                    valueAsNumber: true,
                  })}
                />
                {errors.stockMin && <p className="text-red-600 text-sm">{errors.stockMin.message}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="offer"
                {...register('offer')}
                className="rounded border-gray-300"
              />
              <Label htmlFor="offer" className="text-sm font-medium">Oferta</Label>
            </div>
            {watch('offer') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="discountedPrice">Precio con Descuento</Label>
                  <Input
                    id="discountedPrice"
                    type="number"
                    step="0.01"
                    placeholder="Precio con Descuento"
                    className="w-full max-w-md"
                    {...register('discountedPrice', {
                      required: 'Precio con descuento es requerido si está en oferta',
                      min: { value: 0, message: 'El precio con descuento no puede ser negativo' },
                      valueAsNumber: true,
                    })}
                  />
                  {errors.discountedPrice && <p className="text-red-600 text-sm">{errors.discountedPrice.message}</p>}
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="priceDateFrom">Fecha Inicio Oferta</Label>
                  <Input
                    id="priceDateFrom"
                    type="datetime-local"
                    className="w-full max-w-md"
                    {...register('priceDateFrom', { required: 'Fecha de inicio es requerida si está en oferta' })}
                  />
                  {errors.priceDateFrom && <p className="text-red-600 text-sm">{errors.priceDateFrom.message}</p>}
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="priceDateTo">Fecha Fin Oferta</Label>
                  <Input
                    id="priceDateTo"
                    type="datetime-local"
                    className="w-full max-w-md"
                    {...register('priceDateTo', { required: 'Fecha de fin es requerida si está en oferta' })}
                  />
                  {errors.priceDateTo && <p className="text-red-600 text-sm">{errors.priceDateTo.message}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Images Section */}
          <div className="border rounded-md p-4 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Imágenes</h2>
            <div className="flex flex-col space-y-1">
              <Label>Imagen Principal</Label>
              <div
                onClick={handleClicPrincipalImage}
                className="relative border border-dashed rounded cursor-pointer overflow-hidden group flex items-center justify-center w-64 h-64 bg-white"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Imagen principal"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col justify-center gap-2 items-center px-4 text-center">
                    <span className="text-gray-600 text-pretty">
                      Seleccionar imagen principal
                    </span>
                    <Upload className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="flex flex-col space-y-1 mt-4">
              <Label>Galería de Imágenes</Label>
              <div className="flex flex-wrap gap-2">
                {gallery.map((_, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={
                        typeof gallery[index] === 'string'
                          ? gallery[index] as string
                          : URL.createObjectURL(gallery[index] as File)
                      }
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-32 object-cover rounded shadow"
                    />
                    <button
                      type="button"
                      onClick={() => removeGaleryImage(index)}
                      className="absolute top-1 right-1 text-white rounded-full p-1 text-xs hover:bg-red-700"
                    >
                      <Trash2 className="w-5 h-5 text-red-600 hover:text-white" />
                    </button>
                  </div>
                ))}
              </div>
              <div
                onClick={handleClicGaleryImage}
                className="relative border border-dashed rounded cursor-pointer overflow-hidden group flex items-center justify-center w-60 h-60 bg-white mt-4"
              >
                <div className="flex flex-col justify-center gap-2 items-center px-4 text-center">
                  <span className="text-gray-600 text-pretty">
                    Seleccionar imagen para galería
                  </span>
                  <Upload className="w-8 h-8 text-gray-600" />
                </div>
              </div>
              <input
                type="file"
                multiple
                ref={fileInputGaleryRef}
                onChange={handleGaleryImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Categories and Branches Section */}
          <div className="border rounded-md p-4 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Categorías y Sucursales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <Label>Categorías</Label>
                <Controller
                  name="categoriesId"
                  control={control}
                  rules={{ required: 'Debe seleccionar al menos una categoría' }}
                  render={({ field }) => (
                    <Select
                      isMulti
                      options={categoryOptions}
                      value={categoryOptions.filter((option) => field.value.includes(option.value))}
                      onChange={(selected) => {
                        const selectedIds = selected ? selected.map((option) => option.value) : [];
                        field.onChange(selectedIds);
                      }}
                      placeholder="Selecciona categorías"
                      isClearable
                      isSearchable
                      classNamePrefix="select"
                    />
                  )}
                />
                {errors.categoriesId && <p className="text-red-600 text-sm">{errors.categoriesId.message}</p>}
              </div>
              <div className="flex flex-col space-y-1">
                <Label>Sucursales</Label>
                <Controller
                  name="sucursalesId"
                  control={control}
                  rules={{ required: 'Debe seleccionar al menos una sucursal' }}
                  render={({ field }) => (
                    <Select
                      isMulti
                      options={branchOptions}
                      value={branchOptions.filter((option) => field.value.includes(option.value))}
                      onChange={(selected) => {
                        const selectedIds = selected ? selected.map((option) => option.value) : [];
                        field.onChange(selectedIds);
                      }}
                      placeholder="Selecciona sucursales"
                      isClearable
                      isSearchable
                      classNamePrefix="select"
                    />
                  )}
                />
                {errors.sucursalesId && <p className="text-red-600 text-sm">{errors.sucursalesId.message}</p>}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
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
}