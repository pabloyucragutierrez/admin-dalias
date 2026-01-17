import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAPI } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {  useNavigate } from "react-router";
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

    navigate("/blogs");
  };

  return (
    <div className="grid h-screen grid-cols-1 gap-8 p-8 max-lg:grid-cols-1 ">
      <div className="flex flex-col justify-between">
        <div className="flex w-full items-center justify-start">
          <img
            src="/logo_header2.png"
            alt="Dalias Logo"
            loading="lazy"
            decoding="async"
            className="w-[10rem] object-contain"
          />
        </div>
        <main className="flex justify-center w-full space-y-6">
          <div className="w-[25rem]">
            <h2 className="text-4xl font-bold text-center text-[#003e5c]">
              LOGIN
            </h2>
            <div className="bg-[#003e5c] rounded-lg h-2 w-20 mt-2 mb-10 mx-auto"></div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    {...register("username", {
                      required: "El nombre de usuario es requerido",
                    })}
                    type="text"
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
                {/* <Link
                  className="text-sm font-semibold text-[#003e5c] hover:underline"
                  to="/auth"
                >
                  ¿Olvidó su contraseña?
                </Link> */}
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
          Residencia las Dalias © 2026. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
}