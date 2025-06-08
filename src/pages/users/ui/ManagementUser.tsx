import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createUsers, fetchUserById, updateUsers, fetchActiveRoles } from '@/services/users.service';
import { useNavigate, useParams } from 'react-router';
import type { UserDto, Role } from '@/interfaces/users.interface';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { geolocation } from '@/utils/geolocation';
import { documentTypes, maritalStatuses, genderTypes } from '@/utils/data';

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

interface Region {
  id: number;
  name: string;
  children: Province[];
}

interface FormInputs {
  name: string;
  lastName: string;
  email: string;
  gender: string;
  documentType: string;
  documentNumber: string;
  maritalStatus: string;
  birthday: string;
  street: string;
  number: string;
  apartment: string;
  reference: string;
  regionId: string;
  provinceId: string;
  districtId: string;
  zipCode: string;
  phone: string;
  username: string;
  password: string;
  roleId: string;
}

export default function ManagementUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [availableProvinces, setAvailableProvinces] = useState<Province[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      gender: '',
      documentType: '',
      documentNumber: '',
      maritalStatus: '',
      birthday: '',
      street: '',
      number: '',
      apartment: '',
      reference: '',
      regionId: '',
      provinceId: '',
      districtId: '',
      zipCode: '',
      phone: '',
      username: '',
      password: '',
      roleId: '',
    },
  });

  const documentType = watch('documentType');

  const validateDocumentNumber = (value: string, docType: string | null) => {
    if (!value) return 'Número de documento es requerido';
    if (!docType) return 'Seleccione un tipo de documento primero';

    switch (docType) {
      case 'DNI':
        return /^\d{8}$/.test(value) || 'El DNI debe tener exactamente 8 dígitos';
      case 'RUC':
        return /^\d{11}$/.test(value) || 'El RUC debe tener exactamente 11 dígitos';
      case 'Carnet de Extranjería':
        return /^\d{9}$/.test(value) || 'El Carnet de Extranjería debe tener exactamente 9 dígitos';
      case 'Pasaporte':
        return /^[A-Z0-9]{6,9}$/.test(value) || 'El Pasaporte debe tener entre 6 y 9 caracteres alfanuméricos';
      case 'Cédula de Identidad':
        return /^[A-Z0-9]{6,12}$/.test(value) || 'La Cédula de Identidad debe tener entre 6 y 12 caracteres alfanuméricos';
      case 'Otros':
        return /^.+$/.test(value) || 'El número de documento no puede estar vacío';
      default:
        return 'Tipo de documento no válido';
    }
  };

  const findDistrictByIdentifier = (identifier: string): District | null => {
    for (const region of geolocation.regions) {
      for (const province of region.children || []) {
        const district = province.children?.find((d) => d.identifier === identifier);
        if (district) return district;
      }
    }
    return null;
  };

  const findProvinceById = (provinceId: number): Province | null => {
    for (const region of geolocation.regions) {
      const province = region.children?.find((p) => p.id === provinceId);
      if (province) return province;
    }
    return null;
  };

  const findRegionByProvinceId = (provinceId: number): Region | null => {
    for (const region of geolocation.regions) {
      if (region.children?.some((p) => p.id === provinceId)) {
        return region;
      }
    }
    return null;
  };

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const activeRoles = await fetchActiveRoles();
        setRoles(activeRoles);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        toast.error('Error al cargar los roles: ' + errorMessage, { position: 'top-center' });
      }
    };

    loadRoles();

    if (id && id !== 'new') {
      const loadUser = async () => {
        setLoading(true);
        try {
          const user = await fetchUserById(id);
          if (user) {
            let regionId = '';
            let provinceId = '';
            let districtId = user.person.AddressPersons[0]?.district || '';

            if (districtId) {
              const district = findDistrictByIdentifier(districtId);
              if (district) {
                const province = findProvinceById(district.parentId);
                if (province) {
                  const region = findRegionByProvinceId(province.id);
                  if (region) {
                    regionId = region.id.toString();
                    provinceId = province.id.toString();
                    setSelectedRegion(region.id);
                    setAvailableProvinces(region.children || []);
                    setSelectedProvince(province.id);
                    setAvailableDistricts(province.children || []);
                    setValue('regionId', regionId);
                    setValue('provinceId', provinceId);
                    setValue('districtId', districtId);
                  }
                }
              }
            }

            reset({
              name: user.person.name,
              lastName: user.person.lastName,
              email: user.person.email,
              gender: user.person.gender || '',
              documentType: user.person.documentType,
              documentNumber: user.person.documentNumber,
              maritalStatus: user.person.maritalStatus,
              birthday: user.person.birthday ? new Date(user.person.birthday).toISOString().split('T')[0] : '',
              street: user.person.AddressPersons[0]?.street || '',
              number: user.person.AddressPersons[0]?.number || '',
              apartment: user.person.AddressPersons[0]?.apartment || '',
              reference: user.person.AddressPersons[0]?.reference || '',
              regionId,
              provinceId,
              districtId,
              zipCode: user.person.AddressPersons[0]?.zipCode || '',
              phone: user.person.PhonesPersons[0]?.phone || '',
              username: user.username,
              password: '',
              roleId: user.roleId,
            });
          } else {
            toast.error('Error al cargar el usuario', { position: 'top-center' });
            navigate('/users');
          }
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          toast.error('Error al cargar el usuario: ' + errorMessage, { position: 'top-center' });
          navigate('/users');
        } finally {
          setLoading(false);
        }
      };
      loadUser();
    }
  }, [id, reset, setValue, navigate]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value ? parseInt(e.target.value) : null;
    const region = geolocation.regions.find((r) => r.id === regionId);

    setSelectedRegion(regionId);
    setSelectedProvince(null);
    setAvailableProvinces(region?.children || []);
    setAvailableDistricts([]);
    setValue('provinceId', '');
    setValue('districtId', '');
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value ? parseInt(e.target.value) : null;
    const province = availableProvinces.find((p) => p.id === provinceId);

    setSelectedProvince(provinceId);
    setAvailableDistricts(province?.children || []);
    setValue('districtId', '');
  };

  const onSubmit = async (values: FormInputs) => {
    if (!values.districtId) {
      toast.warning('Debe seleccionar un distrito', { position: 'top-center' });
      return;
    }

    const payload: UserDto = {
      name: values.name,
      lastName: values.lastName || undefined,
      email: values.email,
      gender: values.gender || undefined,
      documentType: values.documentType,
      documentNumber: values.documentNumber,
      maritalStatus: values.maritalStatus,
      birthday: values.birthday ? new Date(values.birthday).toISOString() : undefined,
      street: values.street || undefined,
      number: values.number || undefined,
      apartment: values.apartment || undefined,
      reference: values.reference || undefined,
      district: values.districtId,
      zipCode: values.zipCode || undefined,
      phone: values.phone || undefined,
      username: values.username,
      password: values.password || undefined,
      roleId: values.roleId,
    };

    try {
      const response = id && id !== 'new'
        ? await updateUsers(id, payload)
        : await createUsers(payload);

      if (!response?.success) {
        toast.warning(response?.message, { position: 'top-center' });
        return;
      }

      toast.success(response?.message, { position: 'top-center' });
      navigate('/users');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error('Error al guardar el usuario: ' + errorMessage, { position: 'top-center' });
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  return (
    <div className="w-full mx-auto">
      <h1 className="text-3xl text-blue-600 font-bold mb-8">
        {id && id !== 'new' ? 'Editar Usuario' : 'Nuevo Usuario'}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Card */}
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nombre"
                  className="w-full text-base py-2"
                  {...register('name', { required: 'Nombre es requerido' })}
                />
                {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Apellido"
                  className="w-full text-base py-2"
                  {...register('lastName', { required: 'Apellido es requerido' })}
                />
                {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="w-full text-base py-2"
                  {...register('email', {
                    required: 'Email es requerido',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email inválido',
                    },
                  })}
                />
                {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="gender">Género</Label>
                <select
                  id="gender"
                  className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('gender', { required: 'Género es requerido' })}
                >
                  <option value="">Selecciona un género</option>
                  {genderTypes.map((gender) => (
                    <option key={gender.value} value={gender.value}>{gender.label}</option>
                  ))}
                </select>
                {errors.gender && <p className="text-red-600 text-sm">{errors.gender.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="maritalStatus">Estado Civil</Label>
                <select
                  id="maritalStatus"
                  className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('maritalStatus', { required: 'Estado civil es requerido' })}
                >
                  <option value="">Selecciona un estado</option>
                  {maritalStatuses.map((status) => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
                {errors.maritalStatus && <p className="text-red-600 text-sm">{errors.maritalStatus.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="birthday">Fecha de Nacimiento</Label>
                <Input
                  id="birthday"
                  type="date"
                  className="w-full text-base py-2"
                  {...register('birthday', { required: 'Fecha de nacimiento es requerida' })}
                />
                {errors.birthday && <p className="text-red-600 text-sm">{errors.birthday.message}</p>}
              </div>
            </div>
          </div>

          {/* Document Information Card */}
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Documento de Identidad</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="documentType">Tipo de Documento</Label>
                <select
                  id="documentType"
                  className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('documentType', { required: 'Tipo de documento es requerido' })}
                >
                  <option value="">Selecciona un tipo</option>
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.documentType && <p className="text-red-600 text-sm">{errors.documentType.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="documentNumber">Número de Documento</Label>
                <Input
                  id="documentNumber"
                  type="text"
                  placeholder="Número de Documento"
                  className="w-full text-base py-2"
                  {...register('documentNumber', {
                    required: 'Número de documento es requerido',
                    validate: (value) => validateDocumentNumber(value, documentType),
                  })}
                />
                {errors.documentNumber && <p className="text-red-600 text-sm">{errors.documentNumber.message}</p>}
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Información de Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Teléfono"
                  className="w-full text-base py-2"
                  {...register('phone', {
                    required: 'Teléfono es requerido',
                    pattern: {
                      value: /^\+?\d{7,15}$/,
                      message: 'Teléfono inválido',
                    },
                  })}
                />
                {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nombre de Usuario"
                  className="w-full text-base py-2"
                  {...register('username', { required: 'Nombre de usuario es requerido' })}
                />
                {errors.username && <p className="text-red-600 text-sm">{errors.username.message}</p>}
              </div>
              {(!id || id === 'new') && (
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Contraseña"
                    className="w-full text-base py-2"
                    {...register('password', {
                      required: id && id !== 'new' ? false : 'Contraseña es requerida',
                    })}
                  />
                  {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="roleId">Rol</Label>
                <select
                  id="roleId"
                  className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('roleId', { required: 'Rol es requerido' })}
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                {errors.roleId && <p className="text-red-600 text-sm">{errors.roleId.message}</p>}
              </div>
            </div>
          </div>

          {/* Address Information Card */}
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Dirección</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="regionId">Región</Label>
                <select
                  id="regionId"
                  className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('regionId', { required: 'Región es requerida' })}
                  onChange={handleRegionChange}
                >
                  <option value="">Selecciona una región</option>
                  {geolocation.regions.map((region) => (
                    <option key={region.id} value={region.id.toString()}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {errors.regionId && <p className="text-red-600 text-sm">{errors.regionId.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="provinceId">Provincia</Label>
                <select
                  id="provinceId"
                  className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  {...register('provinceId', { required: 'Provincia es requerida' })}
                  onChange={handleProvinceChange}
                  disabled={!selectedRegion}
                >
                  <option value="">Selecciona una provincia</option>
                  {availableProvinces.map((province) => (
                    <option key={province.id} value={province.id.toString()}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {errors.provinceId && <p className="text-red-600 text-sm">{errors.provinceId.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="districtId">Distrito</Label>
                <select
                  id="districtId"
                  className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  {...register('districtId', { required: 'Distrito es requerido' })}
                  disabled={!selectedProvince}
                >
                  <option value="">Selecciona un distrito</option>
                  {availableDistricts.map((district) => (
                    <option key={district.identifier} value={district.identifier}>
                      {district.name}
                    </option>
                  ))}
                </select>
                {errors.districtId && <p className="text-red-600 text-sm">{errors.districtId.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="street">Calle</Label>
                <Input
                  id="street"
                  type="text"
                  placeholder="Calle"
                  className="w-full text-base py-2"
                  {...register('street', { required: 'Calle es requerida' })}
                />
                {errors.street && <p className="text-red-600 text-sm">{errors.street.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  type="text"
                  placeholder="Número"
                  className="w-full text-base py-2"
                  {...register('number')}
                />
                {errors.number && <p className="text-red-600 text-sm">{errors.number.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="apartment">Apartamento</Label>
                <Input
                  id="apartment"
                  type="text"
                  placeholder="Apartamento"
                  className="w-full text-base py-2"
                  {...register('apartment')}
                />
                {errors.apartment && <p className="text-red-600 text-sm">{errors.apartment.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="zipCode">Código Postal</Label>
                <Input
                  id="zipCode"
                  type="text"
                  placeholder="Código Postal"
                  className="w-full text-base py-2"
                  {...register('zipCode')}
                />
                {errors.zipCode && <p className="text-red-600 text-sm">{errors.zipCode.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="reference">Referencia</Label>
                <Input
                  id="reference"
                  type="text"
                  placeholder="Referencia"
                  className="w-full text-base py-2"
                  {...register('reference')}
                />
                {errors.reference && <p className="text-red-600 text-sm">{errors.reference.message}</p>}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-base py-2 px-6"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-base py-2 px-6"
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
        </form>
      )}
    </div>
  );
}