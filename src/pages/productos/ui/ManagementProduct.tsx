import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Loader2, Trash2, Upload, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  createProduct,
  fetchProductById,
  updateProduct,
  fetchActiveCategories,
  fetchActiveBranches,
} from "@/services/products.service";
import { useNavigate, useParams } from "react-router";
import type {
  Product,
  ProductDto,
  SucursalesProductDTO,
} from "@/interfaces/products.interface";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import Quill from "quill";
import Editor from "@/components/editor";
import type { CategorySelect } from "@/interfaces";
import { Select as SelectShadcn, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { typeEcommerce } from "@/utils/data";

interface OptionSelect {
  label: string;
  value: string;
}

interface FormInputs {
  sku: string;
  name: string;
  codigoOrigen: string;
  description: string;
  shortDescription: string;
  price: number;
  purchasePrice: number;
  offer: boolean;
  discountedPrice: number;
  priceDateFrom: string;
  priceDateTo: string;
  stock: number;
  stockMin: number;
  marca: string;
  familia: string;
  subfamilia: string;
  typeEcommerce: string;
  categoria: string;
  sucursalesId: SucursalesProductDTO[];
  file?: File;
  imageGalery?: File[];
  galleryImages?: string[];
}

interface BranchOption extends OptionSelect {
  quantityStands: number;
  flatsByStand: number;
}

export default function ManagementProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [categoriesData, setCategoriesData] = useState<CategorySelect[]>([]);

  const [branchOptions, setBranchOptions] = useState<BranchOption[]>([]);

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
      codigoOrigen: "",
      description: "",
      shortDescription: "",
      price: 0,
      purchasePrice: 0,
      offer: false,
      discountedPrice: 0,
      priceDateFrom: "",
      priceDateTo: "",
      stock: 0,
      stockMin: 10,
      marca: "",
      familia: "",
      subfamilia: "",
      categoria: "",
      sucursalesId: [],
      file: undefined,
      imageGalery: [],
      galleryImages: [],
      typeEcommerce: "",
    },
  });

  const selectedSucursales = watch("sucursalesId");
  const selectedMarca = watch("marca");
  const selectedFamilia = watch("familia");

  // Función para obtener categorías padres (marcas)
  const marcaOptions = useMemo(() => {
    const padres = categoriesData.filter(
      (cat) => cat.fatherId === null && cat.status
    );
    return padres.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));
  }, [categoriesData]);

  // Función para obtener categorías medias (familias) basadas en la marca seleccionada
  const familiaOptions = useMemo(() => {
    if (!selectedMarca) return [];

    const familias = categoriesData.filter(
      (cat) => cat.fatherId === selectedMarca && cat.status
    );

    return familias.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));
  }, [categoriesData, selectedMarca]);

  // Función para obtener categorías hijas basadas en la familia seleccionada
  const categoriaOptions = useMemo(() => {
    if (!selectedFamilia) return [];

    const hijos = categoriesData.filter(
      (cat) =>
        cat.fatherId === selectedFamilia &&
        cat.status &&
        // Verificar que no sea padre de otras categorías (es hoja)
        !categoriesData.some((c) => c.fatherId === cat.id)
    );

    return hijos.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));
  }, [categoriesData, selectedFamilia]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [activeCategories, activeBranches] = await Promise.all([
          fetchActiveCategories(),
          fetchActiveBranches(),
        ]);

        setCategoriesData(activeCategories);

        setBranchOptions(
          activeBranches?.map((branch) => ({
            label: branch.name,
            value: branch.id,
            quantityStands: branch.Almacen[0]?.quantityStands || 0,
            flatsByStand: branch.Almacen[0]?.flatsByStand || 0,
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
            setProduct(product);
            reset({
              sku: product.sku,
              name: product.name,
              codigoOrigen: product.codigoOriginal,
              description: product.description,
              shortDescription: product.shortDescription,
              price: product.price,
              purchasePrice: product.purchasePrice,
              offer: !!product.offer,
              discountedPrice: product.discountedPrice,
              priceDateFrom: product.priceDateFrom
                ? new Date(product.priceDateFrom).toISOString().split("T")[0]
                : "",
              priceDateTo: product.priceDateTo
                ? new Date(product.priceDateTo).toISOString().split("T")[0]
                : "",
              stock: product.stock,
              stockMin: product.stockMin,
              typeEcommerce: product.typeEcommerce,
              sucursalesId: product.ProductSucursales.map((suc) => ({
                sucursalId: suc.sucursalId,
                numberStand: suc.numberStand,
                flatNumber: suc.flatNumber,
              })),
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

  useEffect(() => {
    if (id && id !== "new" && categoriesData.length > 0 && product) {
      const existFather = categoriesData.find(
        (cat) => cat.id === product.categoria.fatherId
      );

      if (existFather) {
        if (existFather.fatherId === null) {
          setValue("marca", existFather.id);
          setValue("familia", product.categoria.id);
        } else {
          setValue("marca", existFather?.father.id);
          setValue("familia", existFather?.id);
          setValue("subfamilia", product.categoria.id);
        }
      }
    }
  }, [id, categoriesData, product, setValue]);

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
    if (!values.familia) {
      toast.warning("Debe seleccionar al menos la familia", {
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

    let categoriaId: string = "";

    if (values.subfamilia) {
      categoriaId = values.subfamilia;
    } else {
      categoriaId = values.familia;
    }

    const payload: ProductDto = {
      sku: values.sku.trim(),
      name: values.name,
      codigoOrigen: values.codigoOrigen.trim(),
      description: valueDescrip,
      shortDescription: valueShortDescrip,
      unidadId: "9f487b00-a8f7-483c-9b70-644a879a4be5",
      price: values.price,
      purchasePrice: values.purchasePrice,
      offer: values.offer,
      discountedPrice: values.offer ? values.discountedPrice : 0,
      priceDateFrom: values.priceDateFrom || "",
      priceDateTo: values.priceDateTo || "",
      stock: values.stock,
      stockMin: values.stockMin,
      categoria: categoriaId,
      sucursalesId: values.sucursalesId,
      typeEcommerce: values.typeEcommerce,
      file: values.file,
      imageGalery: values.imageGalery,
      galleryImages: gallery.map((img) => img.toString()),
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

  const generateNumberOptions = (max: number) =>
    Array.from({ length: max }, (_, i) => ({
      label: `${i + 1}`,
      value: i + 1,
    }));

  const handleMarcaChange = (selectedOption: OptionSelect | null) => {
    const newValue = selectedOption?.value || "";
    setValue("marca", newValue);
    setValue("familia", "");
    setValue("subfamilia", "");
  };

  const handleFamiliaChange = (selectedOption: OptionSelect | null) => {
    const newValue = selectedOption?.value || "";
    setValue("familia", newValue);
    setValue("subfamilia", "");
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
              <div className="flex flex-col space-y-2 w-full sm:w-[20%]">
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
                <Label htmlFor="sku">Código de Fabricante</Label>
                <Input
                  id="sku"
                  type="text"
                  placeholder="Introduce el código de fabricante"
                  className="w-full text-base py-2"
                  {...register("sku", { required: "El código de fabricante es obligatorio" })}
                />
                {errors.sku && (
                  <p className="text-red-600 text-sm">{errors.sku.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="codigoOrigen">SKU</Label>
                <Input
                  id="codigoOrigen"
                  type="text"
                  placeholder="Introduce el SKU"
                  className="w-full text-base py-2"
                  {...register("codigoOrigen", {
                    required: "El SKU es obligatorio",
                  })}
                />
                {errors.codigoOrigen && (
                  <p className="text-red-600 text-sm">
                    {errors.codigoOrigen.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-5 mt-5">
                <div className="flex flex-col space-y-2 w-full">
                    <Label htmlFor="typeEcommerce">Tipo de Ecommerce</Label>
                    <Controller
                        name="typeEcommerce"
                        control={control}
                        rules={{ required: 'Tipo de ecommerce es requerido' }}
                        render={({ field }) => (
                            <SelectShadcn disabled={isSubmitting} onValueChange={field.onChange} value={field.value}>
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
                            </SelectShadcn>
                        )}
                    />
                    {errors.typeEcommerce && (
                    <p className="text-red-600 text-sm ml-2">
                        {errors.typeEcommerce.message}
                    </p>
                    )}
                </div>

                <div className="w-full"></div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <Controller
                  name="marca"
                  control={control}
                  rules={{ required: "Debe seleccionar una marca" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={marcaOptions}
                      value={
                        marcaOptions.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(selected) => {
                        handleMarcaChange(selected);
                      }}
                      placeholder="Selecciona una marca"
                      isClearable
                      isSearchable
                      classNamePrefix="select"
                      className="text-base"
                    />
                  )}
                />
                {errors.marca && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.marca.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Familia
                </label>
                <Controller
                  name="familia"
                  control={control}
                  rules={{
                    required: selectedMarca
                      ? "Debe seleccionar una familia"
                      : false,
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={familiaOptions}
                      value={
                        familiaOptions.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(selected) => {
                        field.onChange(selected?.value || "");
                        handleFamiliaChange(selected);
                      }}
                      placeholder="Selecciona una familia"
                      isClearable
                      isSearchable
                      isDisabled={!selectedMarca || familiaOptions.length === 0}
                      classNamePrefix="select"
                      className="text-base"
                    />
                  )}
                />
                {errors.familia && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.familia.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedFamilia && categoriaOptions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sub Familia
                  </label>
                  <Controller
                    name="subfamilia"
                    control={control}
                    rules={{
                      required: selectedFamilia
                        ? "Debe seleccionar una categoría"
                        : false,
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={categoriaOptions}
                        value={
                          categoriaOptions.find(
                            (option) => option.value === field.value
                          ) || null
                        }
                        onChange={(selected) => {
                          field.onChange(selected?.value || "");
                        }}
                        placeholder="Selecciona una categoría"
                        isClearable
                        isSearchable
                        isDisabled={
                          !selectedFamilia || categoriaOptions.length === 0
                        }
                        classNamePrefix="select"
                        className="text-base"
                      />
                    )}
                  />
                  {errors.subfamilia && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.subfamilia.message}
                    </p>
                  )}
                </div>
              )}

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
                        field.value.some(
                          (suc) => suc.sucursalId === option.value
                        )
                      )}
                      onChange={(selected) => {
                        const selectedSucursales = selected
                          ? selected.map((option) => ({
                              sucursalId: option.value,
                              numberStand: 1,
                              flatNumber: 1,
                            }))
                          : [];
                        field.onChange(selectedSucursales);
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

            {selectedSucursales.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Configuración de Sucursales
                </h3>
                {selectedSucursales.map((sucursal, index) => {
                  const branch = branchOptions.find(
                    (opt) => opt.value === sucursal.sucursalId
                  );
                  return (
                    <div
                      key={sucursal.sucursalId}
                      className="border p-4 rounded-lg"
                    >
                      <h4 className="font-medium">{branch?.label}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="flex flex-col space-y-2">
                          <Label>Seleccionar el Stand</Label>
                          <Controller
                            name={`sucursalesId.${index}.numberStand`}
                            control={control}
                            rules={{
                              required: "Debes seleccionar un número de stands",
                            }}
                            render={({ field }) => (
                              <Select
                                options={generateNumberOptions(
                                  branch?.quantityStands || 0
                                )}
                                value={generateNumberOptions(
                                  branch?.quantityStands || 0
                                ).find((opt) => opt.value === field.value)}
                                onChange={(selected) =>
                                  field.onChange(selected ? selected.value : 1)
                                }
                                placeholder="Selecciona número de stands"
                                classNamePrefix="select"
                                className="text-base"
                              />
                            )}
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label>Pisos por Stand</Label>
                          <Controller
                            name={`sucursalesId.${index}.flatNumber`}
                            control={control}
                            rules={{
                              required: "Debes seleccionar un número de pisos",
                            }}
                            render={({ field }) => (
                              <Select
                                options={generateNumberOptions(
                                  branch?.flatsByStand || 0
                                )}
                                value={generateNumberOptions(
                                  branch?.flatsByStand || 0
                                ).find((opt) => opt.value === field.value)}
                                onChange={(selected) =>
                                  field.onChange(selected ? selected.value : 1)
                                }
                                placeholder="Selecciona número de pisos"
                                classNamePrefix="select"
                                className="text-base"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                  readOnly={!!id && id !== "new"}
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
                    min="0"
                    placeholder="Introduce el precio con descuento"
                    className="w-full text-base py-2"
                    {...register("discountedPrice", {
                      required:
                        "El precio con descuento es obligatorio si está en oferta",
                      min: {
                        value: 0,
                        message:
                          "El precio con descuento no puede ser negativo",
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
                    type="date"
                    className="w-full text-base py-2"
                    {...register("priceDateFrom", {
                      required: watch("offer")
                        ? "La fecha de inicio es obligatoria si está en oferta"
                        : false,
                    })}
                    onChange={(e) => {
                      const value = e.target.value;
                      setValue(
                        "priceDateFrom",
                        value ? new Date(value).toISOString().split("T")[0] : ""
                      );
                    }}
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
                    type="date"
                    className="w-full text-base py-2"
                    {...register("priceDateTo", {
                      required: watch("offer")
                        ? "La fecha de fin es obligatoria si está en oferta"
                        : false,
                    })}
                    onChange={(e) => {
                      const value = e.target.value;
                      setValue(
                        "priceDateTo",
                        value ? new Date(value).toISOString().split("T")[0] : ""
                      );
                    }}
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
