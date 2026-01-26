import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User, UserPayload, UpdateUserPayload } from "@/interfaces/user.interface";
import { createUser, getUserById, updateUser } from "@/services/user.service";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

interface FormInputs {
  username: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
}

export default function ManagementUser() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      nombre: "",
      apellido: "",
    },
  });

  const handleGetUserById = useCallback(async () => {
    if (id && id !== "nuevo") {
      setLoading(true);
      const response = await getUserById(id);

      if (!response) {
        toast.warning("Usuario no encontrado", { position: "top-center" });
        navigate("/usuarios");
        return;
      }

      setUserData(response);
      setValue("username", response.username || "");
      setValue("email", response.email || "");
      setValue("nombre", response.nombre || "");
      setValue("apellido", response.apellido || "");

      setLoading(false);
    }
  }, [id, navigate, setValue]);

  useEffect(() => {
    handleGetUserById();
  }, [handleGetUserById]);

  const onSubmit = async (values: FormInputs) => {
    try {
      if (id && id !== "nuevo") {
        // Actualizar usuario
        const payload: UpdateUserPayload = {
          username: values.username,
          email: values.email,
          nombre: values.nombre,
          apellido: values.apellido,
        };

        // Solo incluir password si se ingresó uno nuevo
        if (values.password && values.password.trim() !== "") {
          payload.password = values.password;
        }

        const response = await updateUser(id, payload);

        if (!response?.success) {
          toast.warning(response?.message, { position: "top-center" });
          return;
        }

        toast.success("Usuario actualizado correctamente", {
          position: "top-center",
        });
      } else {
        // Crear nuevo usuario
        const payload: UserPayload = {
          username: values.username,
          email: values.email,
          password: values.password,
          nombre: values.nombre,
          apellido: values.apellido,
        };

        const response = await createUser(payload);

        if (!response?.success) {
          toast.warning(response?.message, { position: "top-center" });
          return;
        }

        toast.success("Usuario creado correctamente", {
          position: "top-center",
        });
      }

      navigate("/usuarios");
    } catch (error) {
      console.log(error);
      toast.error("Error al guardar el usuario", { position: "top-center" });
    }
  };

  const handleCancel = () => {
    navigate("/usuarios");
  };

  return (
    <div className="w-full mx-auto">
      <h1 className="text-3xl text-[#003e5c] font-bold mb-6">
        {id && id !== "nuevo" ? "Editar Usuario" : "Nuevo Usuario"}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 border rounded-lg p-6 bg-white shadow-lg"
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-[#003e5c]" />
          </div>
        ) : (
          <>
            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Nombre de usuario"
                disabled={isSubmitting}
                className="w-full text-base py-2"
                {...register("username", {
                  required: "El nombre de usuario es requerido",
                })}
              />
              {errors.username && (
                <p className="text-red-600 text-sm ml-2">{errors.username.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                disabled={isSubmitting}
                className="w-full text-base py-2"
                {...register("email", {
                  required: "El correo electrónico es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo electrónico inválido",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-600 text-sm ml-2">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="password">
                Contraseña {id && id !== "nuevo" && "(dejar en blanco para mantener la actual)"}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={
                  id && id !== "nuevo"
                    ? "Dejar en blanco para no cambiar"
                    : "Contraseña"
                }
                disabled={isSubmitting}
                className="w-full text-base py-2"
                {...register("password", {
                  required: id && id !== "nuevo" ? false : "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-600 text-sm ml-2">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Nombre"
                disabled={isSubmitting}
                className="w-full text-base py-2"
                {...register("nombre", {
                  required: "El nombre es requerido",
                })}
              />
              {errors.nombre && (
                <p className="text-red-600 text-sm ml-2">{errors.nombre.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                type="text"
                placeholder="Apellido"
                disabled={isSubmitting}
                className="w-full text-base py-2"
                {...register("apellido", {
                  required: "El apellido es requerido",
                })}
              />
              {errors.apellido && (
                <p className="text-red-600 text-sm ml-2">{errors.apellido.message}</p>
              )}
            </div>

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
                  "Guardar"
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}