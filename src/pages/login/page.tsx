import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAPI } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

interface FormInputs {
  username: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuthStore((state) => state);

  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormInputs) => {
    const response = await loginAPI({
      username: values.username,
      password: values.password,
    });

    if (!response?.success) {
      toast.warning(response?.message, { position: "top-center" });
      return;
    }

    if (response?.data) {
      login(response?.data?.user, response?.data?.token);
    }

    navigate("/");
  };

  return (
    <div className="grid h-screen grid-cols-2 gap-8 p-8 max-lg:grid-cols-1 ">
      <div className="flex flex-col justify-between">
        <div className="flex w-full items-center justify-start">
          <img
            src="/logo.png"
            alt="Dinsides Logo"
            loading="lazy"
            decoding="async"
            className="w-20 object-contain"
          />
        </div>
        <main className="flex size-full flex-col justify-center space-y-6">
          <div className="w-full sm:w-[350px] mx-auto">
            <h2 className="text-4xl font-bold text-center text-[#0667ff]">
              LOGIN
            </h2>
            <div className="bg-[#0667ff] rounded-lg h-2 w-20 mt-2 mb-10 mx-auto"></div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    {...register("username", {
                      required: "El nombre de usuario es requerido",
                    })}
                    type="username"
                    id="username"
                    placeholder="Ingrese su nombre de usuario"
                  />
                  {errors.username && (
                    <p className="msg-error">{errors.username.message}</p>
                  )}
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      {...register("password", {
                        required: "La contraseña es requerida",
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
                      {showPassword ? <Eye /> : <EyeOff />}
                    </button>

                    {errors.password && (
                      <p className="msg-error">{errors.password.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-1">
                <Link
                  className="text-sm font-semibold text-[#0667ff] hover:underline"
                  to="/auth"
                >
                  ¿Olvidó su contraseña?
                </Link>
              </div>

              <Button
                className="w-full mt-4"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
          </div>
        </main>
        <footer className="text-center text-sm text-gray-500">
          Automotiv © 2025. Todos los derechos reservados.
        </footer>
      </div>
      <div className="relative flex select-none flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-t from-blue-700 to-blue-400 p-10 pb-0 max-lg:hidden">
        <div className="mb-4 flex flex-col h-[55vh] w-full items-center justify-center">
          <img
            src="/image/auth.webp"
            alt="auth"
            width={1080}
            height={500}
            loading="lazy"
            decoding="async"
            className="mx-auto w-full max-w-xl"
          />

          <div className="flex select-none flex-col gap-2">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold w-fit uppercase text-white">
              Automatización
            </div>
            <h1 className="text-4xl font-bold leading-10 text-white">
              Automatizar la gestión de empresas
            </h1>
            <h4 className="text-lg font-normal leading-6 text-white">
              Automatizar la gestión de empresas con un análisis de criterios
              avanzado, garantizando que su equipo de ventas se centre en las
              oportunidades más prometedoras.
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
