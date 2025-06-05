import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Loader2, Trash2, Upload, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  createProduct,
  fetchProductById,
  updateProduct,
  fetchActiveCategories,
  fetchActiveBranches,
  fetchActiveBrands,
  fetchActiveUnits,
} from "@/services/products.service";
import { useNavigate, useParams } from "react-router";
import type { ProductDto } from "@/interfaces/products.interface";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import Quill from "quill";
import Editor from "@/components/editor";

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

  const [categoryOptions, setCategoryOptions] = useState<OptionSelect[]>([]);
  const [branchOptions, setBranchOptions] = useState<OptionSelect[]>([]);
  const [brandOptions, setBrandOptions] = useState<OptionSelect[]>([]);
  const [unitOptions, setUnitOptions] = useState<OptionSelect[]>([]);

  const [preview, setPreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<(string | File)[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputGaleryRef = useRef<HTMLInputElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const quillRef2 = useRef<Quill | null>(null);
  const [valueDescrip, setValueDescrip] = useState<string>("");
  const [valueShortDescrip, setValueShortDescrip] = useState<string>("");

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
      sku: "",
      name: "",
      codeBarras: "",
      description: "",
      shortDescription: "",
      marcaId: "",
      unidadId: "",
      price: 0,
      purchasePrice: 0,
      offer: false,
      discountedPrice: 0,
      priceDateFrom: "",
      priceDateTo: "",
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
        const [activeCategories, activeBranches, activeBrands, activeUnits] =
          await Promise.all([
            fetchActiveCategories(),
            fetchActiveBranches(),
            fetchActiveBrands(),
            fetchActiveUnits(),
          ]);
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
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        toast.error("Error al cargar datos: " + errorMessage, {
          position: "top-center",
        });
      }
    };

    loadData();

    if (id && id !== "new") {
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
              offer: !!product.offer, // Aseguramos que offer sea booleano
              discountedPrice: product.discountedPrice,
              priceDateFrom: product.priceDateFrom
                ? new Date(product.priceDateFrom).toISOString().slice(0, 16)
                : "",
              priceDateTo: product.priceDateTo
                ? new Date(product.priceDateTo).toISOString().slice(0, 16)
                : "",
              stock: product.stock,
              stockMin: product.stockMin,
              categoriesId: product.ProductCategories.map(
                (cat) => cat.categoryId
              ),
              sucursalesId: product.ProductSucursales.map(
                (suc) => suc.sucursalId
              ),
            });
            setValueDescrip(product.description);
            setValueShortDescrip(product.shortDescription);
            const mainImage = product.ProductImages.find(
              (img) => img.typeImage === "THUMBNAIL"
            )?.url;
            const galleryImages = product.ProductImages.filter(
              (img) => img.typeImage === "GALLERY"
            ).map((img) => img.url);
            if (mainImage) {
              setPreview(mainImage);
            }
            if (galleryImages.length > 0) {
              setGallery(galleryImages);
            }
          } else {
            toast.error("Error al cargar el producto", {
              position: "top-center",
            });
            navigate("/products");
          }
        } catch (err: unknown) {
          const errorMessage =
            err instanceof Error ? err.message : "Error desconocido";
          toast.error("Error al cargar el producto: " + errorMessage, {
            position: "top-center",
          });
          navigate("/products");
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
      setValue("file", file);
      setPreview(URL.createObjectURL(file));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleGaleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      if (gallery.length + filesArray.length > 5) {
        toast.warning("Máximo se pueden subir 5 imágenes para la galería.", {
          position: "top-center",
        });
        return;
      }
      setGallery((prev) => [...prev, ...filesArray]);
      setValue("imageGalery", filesArray);
      if (fileInputGaleryRef.current) {
        fileInputGaleryRef.current.value = "";
      }
    }
  };

  const removeGaleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, imgIndex) => imgIndex !== index));
    setValue(
      "imageGalery",
      gallery.filter((_, imgIndex) => imgIndex !== index) as File[]
    );
  };

  const onSubmit = async (values: FormInputs) => {
    if (values.categoriesId.length === 0) {
      toast.warning("Debe seleccionar al menos una categoría", {
        position: "top-center",
      });
      return;
    }
    if (values.sucursalesId.length === 0) {
      toast.warning("Debe seleccionar al menos una sucursal", {
        position: "top-center",
      });
      return;
    }
    if (!values.marcaId) {
      toast.warning("Debe seleccionar una marca", { position: "top-center" });
      return;
    }
    if (!values.unidadId) {
      toast.warning("Debe seleccionar una unidad", { position: "top-center" });
      return;
    }
    if (!valueDescrip) {
      toast.warning("Es necesario agregar una descripción del producto", {
        position: "top-center",
      });
      return;
    }
    if (!valueShortDescrip) {
      toast.warning("Es necesario agregar una descripción corta del producto", {
        position: "top-center",
      });
      return;
    }
    if (!id || id === "new") {
      if (!values.file) {
        toast.warning("Es necesario subir una imagen principal del producto", {
          position: "top-center",
        });
        return;
      }
    }

    const payload: ProductDto = {
      sku: values.sku,
      name: values.name,
      codeBarras: values.codeBarras,
      description: valueDescrip,
      shortDescription: valueShortDescrip,
      marcaId: values.marcaId,
      unidadId: values.unidadId,
      price: values.price,
      purchasePrice: values.purchasePrice,
      offer: values.offer,
      discountedPrice: values.offer ? values.discountedPrice : 0,
      priceDateFrom: values.priceDateFrom || "",
      priceDateTo: values.priceDateTo || "",
      stock: values.stock,
      stockMin: values.stockMin,
      categoriesId: values.categoriesId,
      sucursalesId: values.sucursalesId,
      file: values.file,
      imageGalery: values.imageGalery,
    };

    try {
      const response =
        id && id !== "new"
          ? await updateProduct(id, payload)
          : await createProduct(payload);

      if (!response?.success) {
        toast.warning(response?.message, { position: "top-center" });
        return;
      }

      toast.success(response?.message, { position: "top-center" });
      navigate("/products");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      toast.error("Error al guardar el producto: " + errorMessage, {
        position: "top-center",
      });
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <div className="w-full mx-auto">
      <h1 className="text-3xl text-blue-600 font-bold mb-6">
        {id && id !== "new" ? "Editar Producto" : "Nuevo Producto"}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Main Section: Name, Short Description, and Image */}
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-1">
              Información Principal
            </h2>
            <hr className="mb-5" />
            <div className="flex flex-col md:flex-row justify-between gap-6">
              {/* Name and Short Description */}
              <div className="flex flex-col space-y-4 w-full sm:w-[77%]">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="name">Nombre del Producto</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Introduce el nombre del producto"
                    className="w-full text-base py-2"
                    {...register("name", {
                      required: "El nombre es obligatorio",
                    })}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="shortDescription">Descripción Corta</Label>
                  <Editor
                    className="bg-white border rounded-lg"
                    ref={quillRef2}
                    readOnly={false}
                    value={valueShortDescrip}
                    onTextChange={setValueShortDescrip}
                  />
                  {errors.shortDescription && (
                    <p className="text-red-600 text-sm">
                      {errors.shortDescription.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Main Image */}
              <div className="flex flex-col space-y-2 w-full sm:w-[21%]">
                <Label>Imagen Principal</Label>
                <div
                  onClick={handleClicPrincipalImage}
                  className="relative border-2 border-dashed rounded-lg cursor-pointer overflow-hidden group flex items-center justify-center w-full h-[15rem] bg-gray-50"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Imagen principal"
                      className="w-full h-full object-fill"
                    />
                  ) : (
                    <div className="flex flex-col justify-center gap-3 items-center px-6 text-center">
                      <span className="text-gray-600 text-base">
                        Selecciona una imagen principal
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
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-1">
              Información Básica
            </h2>
            <hr className="mb-5" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  type="text"
                  placeholder="Introduce el SKU"
                  className="w-full text-base py-2"
                  {...register("sku", { required: "El SKU es obligatorio" })}
                />
                {errors.sku && (
                  <p className="text-red-600 text-sm">{errors.sku.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="codeBarras">Código de Barras</Label>
                <Input
                  id="codeBarras"
                  type="text"
                  placeholder="Introduce el código de barras"
                  className="w-full text-base py-2"
                  {...register("codeBarras", {
                    required: "El código de barras es obligatorio",
                  })}
                />
                {errors.codeBarras && (
                  <p className="text-red-600 text-sm">
                    {errors.codeBarras.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="marcaId">Marca</Label>
                <Controller
                  name="marcaId"
                  control={control}
                  rules={{ required: "Debes seleccionar una marca" }}
                  render={({ field }) => (
                    <Select
                      options={brandOptions}
                      value={
                        brandOptions.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(selected) =>
                        field.onChange(selected ? selected.value : "")
                      }
                      placeholder="Selecciona una marca"
                      isClearable
                      isSearchable
                      classNamePrefix="select"
                      className="text-base"
                    />
                  )}
                />
                {errors.marcaId && (
                  <p className="text-red-600 text-sm">
                    {errors.marcaId.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="unidadId">Unidad</Label>
                <Controller
                  name="unidadId"
                  control={control}
                  rules={{ required: "Debes seleccionar una unidad" }}
                  render={({ field }) => (
                    <Select
                      options={unitOptions}
                      value={
                        unitOptions.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(selected) =>
                        field.onChange(selected ? selected.value : "")
                      }
                      placeholder="Selecciona una unidad"
                      isClearable
                      isSearchable
                      classNamePrefix="select"
                      className="text-base"
                    />
                  )}
                />
                {errors.unidadId && (
                  <p className="text-red-600 text-sm">
                    {errors.unidadId.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-2 mt-6">
              <Label htmlFor="description">Descripción Completa</Label>
              <Editor
                className="bg-white border rounded-lg"
                ref={quillRef}
                readOnly={false}
                value={valueDescrip}
                onTextChange={setValueDescrip}
              />
              {errors.description && (
                <p className="text-red-600 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Categories and Branches Section */}
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-1">
              Categorías y Sucursales
            </h2>
            <hr className="mb-5" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label>Categorías</Label>
                <Controller
                  name="categoriesId"
                  control={control}
                  rules={{
                    required: "Debes seleccionar al menos una categoría",
                  }}
                  render={({ field }) => (
                    <Select
                      isMulti
                      options={categoryOptions}
                      value={categoryOptions.filter((option) =>
                        field.value.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const selectedIds = selected
                          ? selected.map((option) => option.value)
                          : [];
                        field.onChange(selectedIds);
                      }}
                      placeholder="Selecciona categorías"
                      isClearable
                      isSearchable
                      classNamePrefix="select"
                      className="text-base"
                    />
                  )}
                />
                {errors.categoriesId && (
                  <p className="text-red-600 text-sm">
                    {errors.categoriesId.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Sucursales</Label>
                <Controller
                  name="sucursalesId"
                  control={control}
                  rules={{
                    required: "Debes seleccionar al menos una sucursal",
                  }}
                  render={({ field }) => (
                    <Select
                      isMulti
                      options={branchOptions}
                      value={branchOptions.filter((option) =>
                        field.value.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const selectedIds = selected
                          ? selected.map((option) => option.value)
                          : [];
                        field.onChange(selectedIds);
                      }}
                      placeholder="Selecciona sucursales"
                      isClearable
                      isSearchable
                      classNamePrefix="select"
                      className="text-base"
                    />
                  )}
                />
                {errors.sucursalesId && (
                  <p className="text-red-600 text-sm">
                    {errors.sucursalesId.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing and Offer Section */}
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-1">
              Precios y Oferta
            </h2>
            <hr className="mb-5" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="Introduce el precio"
                  className="w-full text-base py-2"
                  {...register("price", {
                    required: "El precio es obligatorio",
                    min: {
                      value: 0,
                      message: "El precio no puede ser negativo",
                    },
                    valueAsNumber: true,
                  })}
                />
                {errors.price && (
                  <p className="text-red-600 text-sm">{errors.price.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="purchasePrice">Precio de Compra</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  placeholder="Introduce el precio de compra"
                  className="w-full text-base py-2"
                  {...register("purchasePrice", {
                    required: "El precio de compra es obligatorio",
                    min: {
                      value: 0,
                      message: "El precio de compra no puede ser negativo",
                    },
                    valueAsNumber: true,
                  })}
                />
                {errors.purchasePrice && (
                  <p className="text-red-600 text-sm">
                    {errors.purchasePrice.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="Introduce el stock"
                  className="w-full text-base py-2"
                  {...register("stock", {
                    required: "El stock es obligatorio",
                    min: {
                      value: 0,
                      message: "El stock no puede ser negativo",
                    },
                    valueAsNumber: true,
                  })}
                  readOnly={!!id && id !== "new"} // Forzamos booleano explícito
                />
                {errors.stock && (
                  <p className="text-red-600 text-sm">{errors.stock.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="stockMin">Stock Mínimo</Label>
                <Input
                  id="stockMin"
                  type="number"
                  placeholder="Introduce el stock mínimo"
                  className="w-full text-base py-2"
                  {...register("stockMin", {
                    required: "El stock mínimo es obligatorio",
                    min: {
                      value: 0,
                      message: "El stock mínimo no puede ser negativo",
                    },
                    valueAsNumber: true,
                  })}
                />
                {errors.stockMin && (
                  <p className="text-red-600 text-sm">
                    {errors.stockMin.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <input
                type="checkbox"
                id="offer"
                {...register("offer")}
                className="rounded border-gray-300 h-5 w-5"
              />
              <Label htmlFor="offer" className="text-base font-medium">
                Oferta
              </Label>
            </div>
            {watch("offer") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="discountedPrice">Precio con Descuento</Label>
                  <Input
                    id="discountedPrice"
                    type="number"
                    step="0.01"
                    placeholder="Introduce el precio con descuento"
                    className="w-full text-base py-2"
                    {...register("discountedPrice", {
                      required:
                        "El precio con descuento es obligatorio si está en oferta",
                      min: {
                        value: 0,
                        message: "El precio con descuento no puede ser negativo",
                      },
                      valueAsNumber: true,
                    })}
                  />
                  {errors.discountedPrice && (
                    <p className="text-red-600 text-sm">
                      {errors.discountedPrice.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="priceDateFrom">Fecha Inicio Oferta</Label>
                  <Input
                    id="priceDateFrom"
                    type="datetime-local"
                    className="w-full text-base py-2"
                    {...register("priceDateFrom", {
                      required:
                        "La fecha de inicio es obligatoria si está en oferta",
                    })}
                  />
                  {errors.priceDateFrom && (
                    <p className="text-red-600 text-sm">
                      {errors.priceDateFrom.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="priceDateTo">Fecha Fin Oferta</Label>
                  <Input
                    id="priceDateTo"
                    type="datetime-local"
                    className="w-full text-base py-2"
                    {...register("priceDateTo", {
                      required:
                        "La fecha de fin es obligatoria si está en oferta",
                    })}
                  />
                  {errors.priceDateTo && (
                    <p className="text-red-600 text-sm">
                      {errors.priceDateTo.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Gallery Images Section */}
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-1">
              Galería de Imágenes
            </h2>
            <hr className="mb-5" />

            <div className="flex flex-col space-y-2">
              <div className="flex flex-wrap items-center gap-4">
                {gallery.map((_, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={
                        typeof gallery[index] === "string"
                          ? (gallery[index] as string)
                          : URL.createObjectURL(gallery[index] as File)
                      }
                      alt={`Imagen ${index + 1}`}
                      className="w-40 h-40 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeGaleryImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <div
                  onClick={handleClicGaleryImage}
                  className={`flex items-center justify-center ${
                    gallery.length > 0
                      ? "w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition"
                      : "w-40 h-40 border-2 border-dashed rounded-lg bg-gray-50"
                  } cursor-pointer overflow-hidden group`}
                >
                  {gallery.length > 0 ? (
                    <Plus className="w-6 h-6 text-white" />
                  ) : (
                    <div className="flex flex-col justify-center gap-3 items-center px-6 text-center">
                      <span className="text-gray-600 text-base">
                        Añadir imagen a galería
                      </span>
                      <Upload className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
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
          </div>

          {/* Form Actions */}
          <div className="flex justify-between gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-base py-2 px-6 w-[48%]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-base py-2 px-6 w-[48%]"
            >
              {isSubmitting ? (
                <div className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Guardando...
                </div>
              ) : (
                "Guardar"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}