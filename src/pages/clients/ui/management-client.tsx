import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Cliente, ClientManagementPayload } from "@/interfaces/client.interface";
import { fetchCreateClient, fetchUpdateClient, getClientById } from "@/services/client.service";
import { typeEcommerce } from "@/utils/data";
import { geolocation } from "@/utils/geolocation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

interface District {
  id: number;
  name: string;
  parentId: number;
  level: number;
  identifier: string;
}

interface Province {
  id: number;
  name: string;
  children: District[];
}

interface FormInputs {
    email: string;
    documentType: string;
    documentNumber: string;
    name: string;
    lastName: string;
    razonSocial: string;
    phone: string;
    departmentId: string;
    provinceId: string;
    districtId: string;
    address: string;
    password: string;
    confirmPassword: string;
    typeEcommerce: string;
}

export default function ManagementClient() {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
    const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
    const [availableProvinces, setAvailableProvinces] = useState<Province[]>([]);
    const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [clientData, setClientData] = useState<Cliente | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        handleSubmit,
        register,
        setValue,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormInputs>({
        defaultValues: {
            email: "",
            documentType: "",
            documentNumber: "",
            name: "",
            lastName: "",
            razonSocial: "",
            phone: "",
            departmentId: "",
            provinceId: "",
            districtId: "",
            address: "",
            password: "",
            confirmPassword: "",
            typeEcommerce: "",
        },
    });

    const { documentType } = watch();


    const handleGetClientById = useCallback(async () => {
        if (id && id !== "nuevo") {
            setLoading(true);
            const response = await getClientById(id);

            if (!response) {
                toast.warning("Cliente no encontrado", { position: "top-center" });
                navigate("/clientes");
                return;
            }

            // Guardar los datos del cliente para usar en useEffect
            setClientData(response);

            setValue("email", response?.email || "");
            setValue("documentType", response?.typeDocument || "");
            setValue("documentNumber", response?.document || "");
            setValue("name", response?.name || "");
            setValue("lastName", response?.lastName || "");
            setValue("razonSocial", response?.razonSocial || "");
            setValue("phone", response?.phone || "");
            setValue("departmentId", response?.department || "");
            setValue("address", response?.address || "");
            setValue("typeEcommerce", response?.typeEcommerce || "");

            const regionId = response?.department ? parseInt(response?.department) : null;
            const region = geolocation.regions.find((r) => r.id === regionId);

            setSelectedRegion(regionId);
            setAvailableProvinces(region?.children || []);
            setValue("provinceId", response?.province || "");
            
            const provinceId = response?.province ? parseInt(response?.province) : null;
            setSelectedProvince(provinceId);

            setLoading(false);
        }
    }, [id, navigate, setValue])

     useEffect(() => {
        handleGetClientById();
    }, [handleGetClientById]);

    // useEffect para cargar los distritos cuando las provincias estén disponibles
    useEffect(() => {
        if (clientData && availableProvinces.length > 0) {
            const provinceId = clientData?.province ? parseInt(clientData?.province) : null;
            const province = availableProvinces.find((p) => p.id === provinceId);
            
            if (province) {
                setAvailableDistricts(province?.children || []);
                // Establecer el valor del distrito después de que las opciones estén disponibles
                setValue("districtId", clientData?.district || "");
            }
        }
    }, [clientData, availableProvinces, setValue]);

    const onSubmit = async (values: FormInputs) => {
        if (values.password !== values.confirmPassword) {
            toast.warning("Las contraseñas no coinciden", { position: "top-center" });
            return;
        }

        try {

            const payload: ClientManagementPayload = {
                email: values.email,
                documentType: values.documentType,
                documentNumber: values.documentNumber,
                name: values.name,
                lastName: values.lastName,
                razonSocial: values.razonSocial,
                phone: values.phone,
                departmentId: values.departmentId,
                provinceId: values.provinceId,
                districtId: values.districtId,
                address: values.address,
                password: values.password,
                plataforma: "admin",
                typeEcommerce: values.typeEcommerce,
            }

            const response = id && id !== "nuevo" ? await fetchUpdateClient(id, payload) : await fetchCreateClient(payload);

            if (!response?.success) {
                toast.warning(response?.message, { position: "top-center" });
                return;
            }

            toast.success(response?.message, { position: "top-center" });
            navigate("/clientes");

        } catch (error) {
            console.log(error)
            toast.error("Error al crear el cliente", { position: "top-center" });
        }

    }

    const handleRegionChange = (value: string) => {
        const regionId = value ? parseInt(value) : null;
        const region = geolocation.regions.find((r) => r.id === regionId);

        setSelectedRegion(regionId);
        setSelectedProvince(null);
        setAvailableProvinces(region?.children || []);
        setAvailableDistricts([]);
        setValue("provinceId", "");
        setValue("districtId", "");
    };

    const handleProvinceChange = (value: string) => {
        const provinceId = value ? parseInt(value) : null;
        const province = availableProvinces.find((p) => p.id === provinceId);

        setSelectedProvince(provinceId);
        setAvailableDistricts(province?.children || []);
        setValue("districtId", "");
    };

    const handleCancel = () => {
        navigate("/clientes");
    };

    return (
        <div className="w-full mx-auto">
            <h1 className="text-3xl text-[#003e5c] font-bold mb-6">
                {id && id !== "nuevo" ? "Editar Cliente" : "Nuevo Cliente"}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 border rounded-lg p-6 bg-white shadow-lg">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin h-8 w-8 text-[#003e5c]" />
                    </div>
                ) : (
                    <>
                         <div className="flex flex-row items-start gap-5">
                        <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="documentType">Tipo de Documento</Label>
                        <Controller
                            name="documentType"
                            control={control}
                            rules={{ required: 'Tipo de Documento es requerido' }}
                            render={({ field }) => (
                                <Select disabled={isSubmitting} onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Tipo de Documento" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DNI">DNI</SelectItem>
                                    <SelectItem value="RUC">RUC</SelectItem>
                                </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.documentType && (
                        <p className="text-red-600 text-sm ml-2">
                            {errors.documentType.message}
                        </p>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="documentNumber">Número de Documento</Label>
                        <Input
                        id="documentNumber"
                        type="text"
                        placeholder="Número de Documento"
                        disabled={isSubmitting}
                        className="w-full text-base py-2"
                        {...register('documentNumber', {
                            required: 'Número de Documento es requerido',
                            pattern: {
                            value: documentType === "DNI" ? /^[0-9]{8}$/ : /^[0-9]{11}$/,
                            message:
                            documentType === "DNI"
                                ? "El DNI debe tener 8 dígitos"
                                : "El RUC debe tener 11 dígitos",
                        },
                        })}
                        />
                        {errors.documentNumber && (
                        <p className="text-red-600 text-sm ml-2">
                            {errors.documentNumber.message}
                        </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-row items-start gap-5">
                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        className="w-full text-base py-2"
                        disabled={isSubmitting}
                        {...register('email', {
                            required: 'Email es requerido',
                            pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Email inválido',
                            },
                        })}
                        />
                        {errors.email && <p className="text-red-600 text-sm ml-2">{errors.email.message}</p>}
                    </div>

                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="email">Teléfono</Label>
                        <Input
                        id="phone"
                        type="tel"
                        placeholder="Teléfono"
                        className="w-full text-base py-2"
                        disabled={isSubmitting}
                        {...register('phone', {
                            required: 'Teléfono es requerido',
                            pattern: {
                            value: /^[0-9]{9}$/,
                            message: 'Teléfono inválido',
                            },
                        })}
                        />
                        {errors.phone && <p className="text-red-600 text-sm ml-2">{errors.phone.message}</p>}
                    </div>
                </div>

                {documentType === "DNI" && (
                  <>
                    <div className="flex flex-row items-start gap-5">
                        <div className="flex flex-col space-y-2 w-full">
                            <Label htmlFor="names">Nombres</Label>
                            <Input
                            id="names"
                            type="text"
                            placeholder="Nombres"
                            className="w-full text-base py-2"
                            disabled={isSubmitting}
                            {...register('name', {
                                required: 'Nombres es requerido',
                            })}
                            />
                            {errors.name && (
                            <p className="text-red-600 text-sm ml-2">
                                {errors.name.message}
                            </p>
                            )}
                        </div>
                        <div className="flex flex-col space-y-2 w-full">
                            <Label htmlFor="lastNames">Apellidos</Label>
                            <Input
                            id="lastNames"
                            type="text"
                            placeholder="Apellidos"
                            className="w-full text-base py-2"
                            disabled={isSubmitting}
                            {...register('lastName', {
                                required: 'Apellidos es requerido',
                            })}
                            />
                            {errors.lastName && (
                            <p className="text-red-600 text-sm ml-2">
                                {errors.lastName.message}
                            </p>
                            )}
                        </div>
                    </div>
                  </>
                )}
                
                {documentType === "RUC" && (
                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="documentNumber">RUC</Label>
                        <Input
                        id="documentNumber"
                        type="text"
                        placeholder="RUC"
                        className="w-full text-base py-2"
                        disabled={isSubmitting}
                        {...register('documentNumber', {
                            required: 'RUC es requerido',
                        })}
                        />
                        {errors.documentNumber && (
                        <p className="text-red-600 text-sm ml-2">
                            {errors.documentNumber.message}
                        </p>
                        )}
                    </div>
                )}

                <div className="flex flex-row items-start gap-5">
                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="departmentId">Departamento</Label>
                        <Controller
                            name="departmentId"
                            control={control}
                            rules={{ required: 'Departamento es requerido' }}
                            render={({ field }) => (
                                <Select disabled={isSubmitting} onValueChange={(value) => {
                                    field.onChange(value);
                                    handleRegionChange(value);
                                }} value={field.value}>
                                <SelectTrigger  className="w-full">
                                    <SelectValue placeholder="Selecciona Departamento" />
                                </SelectTrigger>
                                <SelectContent>
                                    {geolocation.regions.map((region) => (
                                        <SelectItem key={region.id} value={region.id.toString()}>{region.name}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.departmentId && (
                        <p className="text-red-600 text-sm ml-2">
                            {errors.departmentId.message}
                        </p>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="provinceId">Provincia</Label>
                        <Controller
                            name="provinceId"
                            control={control}
                            rules={{ required: 'Provincia es requerido' }}
                            render={({ field }) => (
                                <Select disabled={!selectedRegion || isSubmitting} onValueChange={(value) => {
                                    field.onChange(value);
                                    handleProvinceChange(value);
                                }} value={field.value}>
                                <SelectTrigger  className="w-full">
                                    <SelectValue placeholder="Selecciona Provincia" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableProvinces.map((province) => (
                                        <SelectItem key={province.id} value={province.id.toString()}>{province.name}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.provinceId && (
                        <p className="text-red-600 text-sm ml-2">
                            {errors.provinceId.message}
                        </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-row items-start gap-5">
                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="districtId">Distrito</Label>
                        <Controller
                            name="districtId"
                            control={control}
                            rules={{ required: 'Distrito es requerido' }}
                            render={({ field }) => (
                                <Select disabled={!selectedProvince || isSubmitting} onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger  className="w-full">
                                    <SelectValue placeholder="Selecciona Distrito" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableDistricts.map((district) => (
                                        <SelectItem key={district.id} value={district.id.toString()}>{district.name}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.districtId && (
                        <p className="text-red-600 text-sm ml-2">
                            {errors.districtId.message}
                        </p>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="address">Dirección</Label>
                        <Input
                        id="address"
                        type="text"
                        placeholder="Ingresa tu dirección"
                        className="w-full text-base py-2"
                        disabled={isSubmitting}
                        {...register('address', {
                            required: 'Dirección es requerida',
                        })}
                        />
                        {errors.address && (
                        <p className="text-red-600 text-sm ml-2">
                            {errors.address.message}
                        </p>
                        )}
                    </div>
                </div>

                {(!id || id === 'nuevo') && (
                    <div className="flex flex-row items-start gap-5">
                        <div className="flex flex-col space-y-2 w-full">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                                <Input
                                {...register("password", {
                                    required: "La contraseña es requerida",
                                    minLength: {
                                        value: 6,
                                        message: "La contraseña debe tener al menos 6 caracteres"
                                    }
                                })}
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Ingrese su contraseña"
                                />
                                <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 -translate-y-1/2 text-gray-500 cursor-pointer ${
                                    errors.password ? "top-1/3" : "top-1/2"
                                }`}
                                >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>

                                {errors.password && (
                                <p className="msg-error">{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                         <div className="flex flex-col space-y-2 w-full">
                            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                            <div className="relative">
                                <Input
                                {...register("confirmPassword", {
                                    required: "La confirmación de contraseña es requerida",
                                    minLength: {
                                        value: 6,
                                        message: "La confirmación de contraseña debe tener al menos 6 caracteres"
                                    },
                                })}
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                placeholder="Ingrese su confirmación de contraseña"
                                />
                                <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className={`absolute right-3 -translate-y-1/2 text-gray-500 cursor-pointer ${
                                    errors.confirmPassword ? "top-1/3" : "top-1/2"
                                }`}
                                >
                                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>

                                {errors.confirmPassword && (
                                <p className="msg-error">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="flex flex-col lg:flex-row items-start gap-5">
                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="typeEcommerce">Tipo de Ecommerce</Label>
                        <Controller
                            name="typeEcommerce"
                            control={control}
                            rules={{ required: 'Tipo de ecommerce es requerido' }}
                            render={({ field }) => (
                                <Select disabled={isSubmitting} onValueChange={field.onChange} value={field.value}>
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

                    <div className="w-full"></div>
                </div>

                 {/* Form Actions */}
                <div className="flex justify-end gap-4 mt-8">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="text-base py-2 px-6 cursor-pointer"
                    >
                        Cancelar
                    </Button>
                    <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="text-base py-2 px-6 cursor-pointer"
                    >
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
                    </>
                )}  
            </form>
        </div>
    )
}