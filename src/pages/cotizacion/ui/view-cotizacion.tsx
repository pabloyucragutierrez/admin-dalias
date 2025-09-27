import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Cotizacion } from "@/interfaces/cotizacion.interface";
import type { Product } from "@/interfaces/products.interface";
import { getCotizacionById } from "@/services/cotizacion.service";
import { getProductCombo } from "@/services/products.service";
import { ArrowLeft, Building2, User, Calendar, FileText, Package, DollarSign, Phone, Mail, MapPin, Hash, Clock } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { geolocation } from "@/utils/geolocation";

interface ProductWithDetails extends Product {
    quotationQuantity: number;
    quotationPrice: number;
    subtotal: number;
}

export default function ViewCotizacion() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState<boolean>(false);
    const [cotizaciontData, setCotizacionData] = useState<Cotizacion | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [productsWithDetails, setProductsWithDetails] = useState<ProductWithDetails[]>([]);
    const [title, setTitle] = useState<string>("Cotización");

    // Función auxiliar para obtener la imagen principal del producto
    const getProductMainImage = (product: Product): string => {
        const thumbnailImage = product.ProductImages?.find(img => img.typeImage === "THUMBNAIL");
        return thumbnailImage?.url || "/placeholder-product.png";
    };

    // Función para obtener el nombre de ubicación basado en ID y nivel
    const getLocationName = (id: number, level: number): string => {
        if (!id) return "";
        
        for (const region of geolocation.regions) {
            // Nivel 1: Departamento/Región
            if (level === 1 && region.id === id) {
                return region.name;
            }
            
            // Buscar en provincias (nivel 2) y distritos (nivel 3)
            for (const province of region.children || []) {
                if (level === 2 && province.id === id) {
                    return province.name;
                }
                
                for (const district of province.children || []) {
                    if (level === 3 && district.id === id) {
                        return district.name;
                    }
                }
            }
        }
        return "";
    };

    // Función para obtener información completa de ubicación basada en identifier de distrito
    const getLocationByDistrictIdentifier = (identifier: string) => {
        if (!identifier) return { district: "", province: "", department: "" };
        
        for (const region of geolocation.regions) {
            for (const province of region.children || []) {
                const district = province.children?.find(d => d.identifier === identifier);
                if (district) {
                    return {
                        district: district.name,
                        province: province.name,
                        department: region.name
                    };
                }
            }
        }
        return { district: "", province: "", department: "" };
    };

    // Función para cargar productos
    const loadProducts = useCallback(async () => {
        try {
            const response = await getProductCombo();
            setProducts(response || []);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }, []);

    // Función para procesar productos con detalles de cotización
    const processProductsWithDetails = useCallback((cotizacionDetails: any[], allProducts: Product[]) => {
        const processedProducts: ProductWithDetails[] = [];

        for (const detail of cotizacionDetails) {
            const product = allProducts.find(p => p.id === detail.productId);
            if (product) {
                const subtotal = detail.quantity * detail.price;
                processedProducts.push({
                    ...product,
                    quotationQuantity: detail.quantity,
                    quotationPrice: detail.price,
                    subtotal: subtotal
                });
            }
        }

        setProductsWithDetails(processedProducts);
    }, []);

    const handleGetCotizacionById = useCallback(async () => {
        if (id && id !== "nuevo") {
            setLoading(true);
            
            try {
                // Cargar productos primero
                await loadProducts();
                
                // Luego cargar la cotización
                const response = await getCotizacionById(id);
                setTitle(`Cotización #${response?.code}`);
                
                if (!response) {
                    toast.warning("Cotización no encontrada", { position: "top-center" });
                    navigate("/cotizacion");
                    return;
                }

                setCotizacionData(response);

            } catch (error) {
                console.error('Error loading quotation:', error);
                toast.error("Error al cargar la cotización", { position: "top-center" });
            } finally {
                setLoading(false);
            }
        }
    }, [id, navigate, loadProducts]);

    // Procesar productos cuando estén disponibles
    useEffect(() => {
        if (cotizaciontData && products.length > 0 && cotizaciontData.CotizacionDetail) {
            processProductsWithDetails(cotizaciontData.CotizacionDetail, products);
        }
    }, [cotizaciontData?.id, products.length, processProductsWithDetails]);

    useEffect(() => {
        handleGetCotizacionById();
    }, [handleGetCotizacionById]);

    // Calcular totales
    const calculateTotals = () => {
        const subtotal = productsWithDetails.reduce((sum, product) => sum + product.subtotal, 0);
        const igv = subtotal * 0.18; // 18% IGV
        const total = subtotal + igv;
        
        return { subtotal, igv, total };
    };

    const { subtotal, igv, total } = calculateTotals();

    if (loading) {
        return (
            <div className="w-full mx-auto">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-gray-600">Cargando cotización...</div>
                </div>
            </div>
        );
    }

    if (!cotizaciontData) {
        return (
            <div className="w-full mx-auto">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-gray-600">No se encontró la cotización</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto max-w-6xl">
            {/* Header */}
            <div className="flex flex-row items-center justify-between mb-6">
                <h1 className="text-3xl text-blue-600 font-bold">
                    {title}
                </h1>
                <Button type="button" className="cursor-pointer" onClick={() => navigate("/cotizacion")}>
                    <ArrowLeft size={20} />
                    <span className="text-sm ml-2">Regresar</span>
                </Button>
            </div>

            <div className="space-y-6">
                {/* Información General de la Cotización */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Información General
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                                <Hash className="h-4 w-4 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Código</p>
                                    <p className="font-semibold">{cotizaciontData.code}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Fecha de Vencimiento</p>
                                    <p className="font-semibold">
                                        {format(new Date(cotizaciontData.dateEnd), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Fecha de Creación</p>
                                    <p className="font-semibold">
                                        {format(new Date(cotizaciontData.createAt), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Información del Cliente y Empresa */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Información del Cliente */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Información del Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Nombre Completo</p>
                                <p className="font-semibold text-lg">
                                    {cotizaciontData.client.name} {cotizaciontData.client.lastName}
                                </p>
                            </div>
                            
                            {cotizaciontData.client.razonSocial && (
                                <div>
                                    <p className="text-sm text-gray-500">Razón Social</p>
                                    <p className="font-medium">{cotizaciontData.client.razonSocial}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Documento</p>
                                    <p className="font-medium">
                                        {cotizaciontData.client.typeDocument}: {cotizaciontData.client.document}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Teléfono</p>
                                        <p className="font-medium">{cotizaciontData.client.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{cotizaciontData.client.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Dirección</p>
                                    <p className="font-medium">{cotizaciontData.client.address}</p>
                                    <p className="text-sm text-gray-600">
                                        {getLocationName(Number(cotizaciontData.client.district), 3)}, {getLocationName(Number(cotizaciontData.client.province), 2)}, {getLocationName(Number(cotizaciontData.client.department), 1)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información de la Empresa */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Información de la Empresa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Razón Social</p>
                                <p className="font-medium">{cotizaciontData.business.razonSocial}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">RUC</p>
                                    <p className="font-medium">{cotizaciontData.business.ruc}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Teléfono</p>
                                        <p className="font-medium">{cotizaciontData.business.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{cotizaciontData.business.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Dirección</p>
                                    <p className="font-medium">{cotizaciontData.business.address}</p>
                                    {cotizaciontData.business.district && (
                                        <p className="text-sm text-gray-600">
                                            {(() => {
                                                const location = getLocationByDistrictIdentifier(cotizaciontData.business.district);
                                                return `${location.district}, ${location.province}, ${location.department}`;
                                            })()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Productos de la Cotización */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Productos Cotizados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-20">Imagen</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className="text-center">Cantidad</TableHead>
                                        <TableHead className="text-right">Precio Unit.</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productsWithDetails.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <img
                                                    src={getProductMainImage(product)}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded border"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{product.sku}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-gray-500">Stock:</span>
                                                        <Badge 
                                                            variant={product.stock > 0 ? "default" : "destructive"}
                                                            className="text-xs px-2 py-0"
                                                        >
                                                            {product.stock}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline">
                                                    {product.quotationQuantity}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                S/. {product.quotationPrice.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                S/. {product.subtotal.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Resumen Financiero */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Resumen Financiero
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">S/. {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">IGV (18%):</span>
                                <span className="font-medium">S/. {igv.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Total:</span>
                                <span className="text-xl font-bold text-blue-600">S/. {total.toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Información Adicional */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <div>
                                    <p className="text-sm text-gray-500">Estado de la Cotización</p>
                                    <Badge variant={cotizaciontData.status ? "default" : "destructive"}>
                                        {cotizaciontData.status ? "Activa" : "Inactiva"}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <p className="font-medium">Última Actualización:</p>
                                <p>{format(new Date(cotizaciontData.updatedAt), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}