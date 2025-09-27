import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Empresa, Product } from "@/interfaces";
import type { Cliente } from "@/interfaces/client.interface";
import type { Cotizacion, CotizacionPayload } from "@/interfaces/cotizacion.interface";
import { cn } from "@/lib/utils";
import { fetchClientActiveList } from "@/services/client.service";
import { fetchCreateCotizacion, fetchUpdateCotizacion, getCotizacionById } from "@/services/cotizacion.service";
import { fetchEmpresaActiveList } from "@/services/empresas.service";
import { getProductCombo } from "@/services/products.service";
import { formatDateTime } from "@/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Loader2, Minus, Plus, Search, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

interface FormInputs {
    clientId: string;
    businessId: string;
    dateEnd: Date;
}

interface SelectedProduct {
    id: string;
    sku: string;
    name: string;
    price: number;
    stock: number;
    quantity: number;
    mainImage?: string;
}

export default function ManagementCotizacion() {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showProductList, setShowProductList] = useState(false);

    const [loading, setLoading] = useState<boolean>(false);
    const [cotizaciontData, setCotizacionData] = useState<Cotizacion | null>(null);

    const {
        handleSubmit,
        control, 
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<FormInputs>({
        defaultValues: {
            clientId: "",
            businessId: "",
            dateEnd: new Date(),
        },
    });

    const getListEmpresas = useCallback(async () => {
        const response = await fetchEmpresaActiveList();
        setEmpresas(response || []);
    }, [])

    const getListClientes = useCallback(async () => {
        const response = await fetchClientActiveList();
        setClientes(response || []);
    }, [])

    const getListProducts = useCallback(async () => {
        const response = await getProductCombo();
        setProducts(response || []);
    }, [])

    // Función para cargar los datos iniciales (combos)
    const loadInitialData = useCallback(async () => {
        try {
            await Promise.all([
                getListEmpresas(),
                getListClientes(),
                getListProducts()
            ]);
        } catch (error) {
            console.error('Error loading initial data:', error);
            toast.error("Error al cargar los datos iniciales", { position: "top-center" });
        }
    }, [getListEmpresas, getListClientes, getListProducts]);

    // Función para rellenar el formulario con los datos de la cotización
    const fillFormWithQuotationData = useCallback((cotizacionData: any) => {
        if (cotizacionData) {
            setValue("clientId", cotizacionData.clientId);
            setValue("businessId", cotizacionData.businessId);
            setValue("dateEnd", new Date(cotizacionData.dateEnd));
        }
    }, [setValue]);

    // Función para procesar los productos de la cotización
    const processQuotationProducts = useCallback((cotizacionDetails: any[], allProducts: Product[]) => {
        const processedProducts: SelectedProduct[] = [];

        for (const detail of cotizacionDetails) {
            const product = allProducts.find(p => p.id === detail.productId);
            if (product) {
                processedProducts.push({
                    id: product.id,
                    sku: product.sku,
                    name: product.name,
                    price: detail.price,
                    stock: product.stock,
                    quantity: detail.quantity,
                    mainImage: getProductMainImage(product)
                });
            }
        }

        setSelectedProducts(processedProducts);
    }, []);

    const handleGetCotizacionById = useCallback(async () => {
        if (id && id !== "nuevo") {
            setLoading(true);
            
            try {
                // Primero cargar los combos
                await loadInitialData();
                
                // Luego cargar los datos de la cotización
                const response = await getCotizacionById(id);

                if (!response) {
                    toast.warning("Cotización no encontrada", { position: "top-center" });
                    navigate("/cotizacion");
                    return;
                }

                console.log(response);

                // Guardar los datos de la cotización
                setCotizacionData(response);

                // Rellenar el formulario con los datos de la cotización
                fillFormWithQuotationData(response);

            } catch (error) {
                console.error('Error loading quotation:', error);
                toast.error("Error al cargar la cotización", { position: "top-center" });
            } finally {
                setLoading(false);
            }
        }
    }, [id, navigate, loadInitialData, fillFormWithQuotationData]);

    // useEffect separado para cargar datos iniciales en modo "nuevo"
    useEffect(() => {
        if (id === "nuevo") {
            loadInitialData();
        }
    }, [id, loadInitialData]);

    // useEffect para cargar cotización existente
    useEffect(() => {
        if (id && id !== "nuevo") {
            handleGetCotizacionById();
        }
    }, [id, handleGetCotizacionById]);

    const onSubmit = async (values: FormInputs) => {
        
        const payload: CotizacionPayload = {
            clientId: values.clientId,
            businessId: values.businessId,
            dateEnd: values.dateEnd,
            details: selectedProducts.map(product => ({
                productId: product.id,
                quantity: product.quantity,
                price: product.price,
            }))
        }

        const response = id && id !== "nuevo" ? await fetchUpdateCotizacion(id, payload) : await fetchCreateCotizacion(payload);

        if (!response?.success) {
            toast.warning(response?.message, { position: "top-center" });
            return;
        }

        toast.success(response?.message, { position: "top-center" });
        navigate("/cotizacion");

    }

    // Función auxiliar para obtener la imagen principal (THUMBNAIL) del producto
    const getProductMainImage = (product: Product): string | undefined => {
        const thumbnailImage = product.ProductImages?.find(img => img.typeImage === "THUMBNAIL" && img.status);
        return thumbnailImage?.url;
    };

    // Filtrar productos basado en el término de búsqueda (que comiencen con el término)
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    // Agregar producto a la lista de seleccionados
    const addProduct = (product: Product) => {
        const existingProduct = selectedProducts.find(p => p.id === product.id);
        
        if (existingProduct) {
            // Si ya existe, incrementar cantidad si hay stock disponible
            if (existingProduct.quantity < product.stock) {
                setSelectedProducts(prev => 
                    prev.map(p => 
                        p.id === product.id 
                            ? { ...p, quantity: p.quantity + 1 }
                            : p
                    )
                );
            }
        } else {
            // Si no existe, agregarlo con cantidad 1
            const newProduct: SelectedProduct = {
                id: product.id,
                sku: product.sku,
                name: product.name,
                price: product.price,
                stock: product.stock,
                quantity: 1,
                mainImage: getProductMainImage(product)
            };
            setSelectedProducts(prev => [...prev, newProduct]);
        }
        
        setSearchTerm("");
        setShowProductList(false);
    };

    // Actualizar cantidad de producto
    const updateQuantity = (productId: string, newQuantity: number) => {
        const product = selectedProducts.find(p => p.id === productId);
        if (!product) return;

        if (newQuantity <= 0) {
            removeProduct(productId);
            return;
        }

        if (newQuantity <= product.stock) {
            setSelectedProducts(prev => 
                prev.map(p => 
                    p.id === productId 
                        ? { ...p, quantity: newQuantity }
                        : p
                )
            );
        }
    };

    // Remover producto de la lista
    const removeProduct = (productId: string) => {
        setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    };

    // Calcular total de la cotización
    const calculateTotal = () => {
        return selectedProducts.reduce((total, product) => 
            total + (product.price * product.quantity), 0
        );
    };

    // useEffect para procesar productos cuando están disponibles
    useEffect(() => {
        // Solo ejecutar si hay productos cargados y datos de cotización
        if (cotizaciontData && products.length > 0 && cotizaciontData.CotizacionDetail && cotizaciontData.CotizacionDetail.length > 0) {
            processQuotationProducts(cotizaciontData.CotizacionDetail, products);
        }
    }, [cotizaciontData?.id, products.length]); // Dependencias específicas para evitar loops

    return (
        <div className="w-full mx-auto">
            <h1 className="text-3xl text-blue-600 font-bold mb-6">
                {id && id !== "nuevo" ? "Editar Cotizacion" : "Nueva Cotizacion"}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 border rounded-lg p-6 bg-white shadow-lg">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                    </div>
                ) : (
                    <>
                        {id && id !== "nuevo" && cotizaciontData && (
                            <div className="flex flex-col lg:flex-row items-start gap-5">
                                <div className="flex flex-col w-full gap-1">
                                    <Label htmlFor="code">Código</Label>
                                    <div className="w-full py-1 px-2 bg-gray-100 border rounded-sm">{cotizaciontData?.code}</div>
                                </div>

                                 <div className="flex flex-col w-full gap-1">
                                    <Label htmlFor="createAt">Fecha de Cotización</Label>
                                    <div className="w-full py-1 px-2 bg-gray-100 border rounded-sm">{formatDateTime(cotizaciontData?.createAt || '')}</div>
                                </div>
                            </div>
                        )}
                      
                        <div className="flex flex-col lg:flex-row items-start gap-5">
                            <div className="flex flex-col space-y-2 w-full">
                                <Label htmlFor="businessId">Empresas</Label>
                                <Controller
                                    name="businessId"
                                    control={control}
                                    rules={{ required: 'Empresa es requerida' }}
                                    render={({ field }) => (
                                        <Select disabled={isSubmitting} onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccione una empresa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {empresas.map((empresa) => (
                                                <SelectItem key={empresa.id} value={empresa.id}>
                                                    {empresa.razonSocial}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.businessId && (
                                <p className="text-red-600 text-sm ml-2">
                                    {errors.businessId.message}
                                </p>
                                )}
                            </div>

                            <div className="flex flex-col space-y-2 w-full">
                                <Label htmlFor="clientId">Clientes</Label>
                                <Controller
                                    name="clientId"
                                    control={control}
                                    rules={{ required: 'Cliente es requerido' }}
                                    render={({ field }) => (
                                        <Select disabled={isSubmitting} onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccione un cliente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clientes.map((cliente) => (
                                                <SelectItem key={cliente.id} value={cliente.id}>
                                                    {cliente.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.clientId && (
                                <p className="text-red-600 text-sm ml-2">
                                    {errors.clientId.message}
                                </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row items-start gap-5">
                            <div className="flex flex-col space-y-2 w-full">
                                <Label htmlFor="dateEnd">Fecha de Vencimiento</Label>
                                <Controller
                                    name="dateEnd"
                                    control={control}
                                    rules={{ required: 'Fecha de vencimiento es requerida' }}
                                    render={({ field, fieldState }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal", // w-full en lugar de w-[240px]
                                                !field.value && "text-muted-foreground",
                                                fieldState.error && "border-red-500 focus:ring-red-500" // Estilo de error
                                            )}
                                            disabled={isSubmitting} // Si tienes esta variable
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP", { locale: es })
                                                ) : (
                                                <span>Seleccionar fecha</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(date) => {
                                                field.onChange(date);
                                            }}
                                            disabled={(date) => {
                                            // Para fecha de vencimiento, normalmente no queremos fechas pasadas
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                return date < today; // Solo deshabilitar fechas anteriores a hoy
                                            }}
                                            captionLayout="dropdown"
                                        />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.dateEnd && (
                                <p className="text-red-600 text-sm ml-2">
                                {errors.dateEnd.message}
                                </p>
                            )}
                            </div>

                            <div className="hidden lg:flex flex-col space-y-2 w-full"></div>
                        </div>

                            {/* Buscador de Productos */}
                        <div className="flex flex-col space-y-2 w-full">
                            <Label htmlFor="productSearch">Buscar Productos</Label>
                            <div className="relative">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="productSearch"
                                        type="text"
                                        placeholder="Buscar por nombre o SKU..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setShowProductList(e.target.value.length > 0);
                                        }}
                                        className="pl-10"
                                    />
                                    {searchTerm && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                            onClick={() => {
                                                setSearchTerm("");
                                                setShowProductList(false);
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                {/* Lista de productos filtrados */}
                                {showProductList && searchTerm && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {filteredProducts.length > 0 ? (
                                            filteredProducts.slice(0, 10).map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                    onClick={() => addProduct(product)}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        {getProductMainImage(product) ? (
                                                            <img
                                                                src={getProductMainImage(product)}
                                                                alt={product.name}
                                                                className="w-10 h-10 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                                                <span className="text-xs text-gray-500">IMG</span>
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm">{product.name}</p>
                                                            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                                                            <p className="text-xs text-gray-600">Stock: {product.stock} | Precio: S/. {product.price.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-3 text-center text-gray-500">
                                                No se encontraron productos
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tabla de Productos Seleccionados */}
                        {selectedProducts.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Productos Seleccionados</h3>
                                    <p className="text-sm text-gray-600">
                                        {selectedProducts.length} producto{selectedProducts.length !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-16">Imagen</TableHead>
                                                <TableHead>SKU</TableHead>
                                                <TableHead>Producto</TableHead>
                                                <TableHead className="text-center">Cantidad</TableHead>
                                                <TableHead className="text-right">Precio Unit.</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                                <TableHead className="w-16"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedProducts.map((product) => (
                                                <TableRow key={product.id}>
                                                    <TableCell>
                                                        {product.mainImage ? (
                                                            <img
                                                                src={product.mainImage}
                                                                alt={product.name}
                                                                className="w-12 h-12 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                                                <span className="text-xs text-gray-500">IMG</span>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{product.name}</p>
                                                            <p className="text-xs text-gray-500">Stock disponible: {product.stock}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                                                disabled={product.quantity <= 1}
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                            <span className="w-12 text-center font-medium">{product.quantity}</span>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                                                disabled={product.quantity >= product.stock}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">S/. {product.price.toFixed(2)}</TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        S/. {(product.price * product.quantity).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => removeProduct(product.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Total de la Cotización */}
                                <div className="flex justify-end">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center space-x-8">
                                            <span className="text-lg font-semibold">Total de la Cotización:</span>
                                            <span className="text-xl font-bold text-blue-600">
                                                S/. {calculateTotal().toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form Actions */}
                        <div className="flex justify-end gap-4 mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/cotizacion")}
                                disabled={isSubmitting}
                                className="text-base py-2 px-6 cursor-pointer"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || selectedProducts.length === 0}
                                className="text-base py-2 px-6 cursor-pointer"
                            >
                                {isSubmitting ? "Guardando..." : "Guardar Cotización"}
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </div>
    )
}