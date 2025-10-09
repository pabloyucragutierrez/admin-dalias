import React, { useState, useEffect, useRef } from "react";
import { Loader2, Upload, Link, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { getBanners, updateBanner } from "@/services/banner.service";
import type { Banner } from "@/interfaces/banner.interface";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const BannersPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImages, setSelectedImages] = useState<
    Record<string, { file: File | null; movil: File | null }>
  >({});
  const [previews, setPreviews] = useState<
    Record<string, { web: string | undefined; movil: string | undefined }>
  >({});
  const [urls, setUrls] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const fileInputMovilRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [openPublic, setOpenPublic] = useState<boolean>(true);
  const [openPrivate, setOpenPrivate] = useState<boolean>(true);

  const fetchBanners = async () => {
    setLoading(true);
    const data = await getBanners();
    if (data) {
      setBanners(data.slice(0, 4)); // Limit to first two banners
      setPreviews(
        data.slice(0, 4).reduce(
          (acc, banner) => ({
            ...acc,
            [banner.id]: { web: banner.imageWeb, movil: banner.imageMovil },
          }),
          {}
        )
      );
      setUrls(
        data.slice(0, 4).reduce(
          (acc, banner) => ({
            ...acc,
            [banner.id]: banner.url,
          }),
          {}
        )
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    bannerId: string,
    type: "web" | "movil"
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setSelectedImages((prev) => ({
        ...prev,
        [bannerId]: {
          ...(prev[bannerId] || { file: null, movil: null }),
          [type === "web" ? "file" : "movil"]: file,
        },
      }));
      setPreviews((prev) => ({
        ...prev,
        [bannerId]: {
          ...(prev[bannerId] || { web: undefined, movil: undefined }),
          [type]: previewUrl,
        },
      }));
      if (type === "web" && fileInputRefs.current[bannerId]) {
        fileInputRefs.current[bannerId]!.value = "";
      } else if (type === "movil" && fileInputMovilRefs.current[bannerId]) {
        fileInputMovilRefs.current[bannerId]!.value = "";
      }
    }
  };

  const handleClicImage = (bannerId: string, type: "web" | "movil") => {
    if (type === "web") {
      fileInputRefs.current[bannerId]?.click();
    } else {
      fileInputMovilRefs.current[bannerId]?.click();
    }
  };

  const isValidURL = (url: string): boolean => {
    if (!url || url.trim() === "") {
      return false;
    }
    try {
      new URL(url);
      return true;
    } catch (error) {
      console.error("Error al validar la URL:", error);
      return false;
    }
  };

  const handleSave = async (bannerId: string, order: number, typeEcommerce: string) => {
    const url = urls[bannerId];
    if (!url || url === "") {
      toast.error("Por favor, completa todos los campos", {
        position: "top-center",
      });
      return;
    }

    if (!isValidURL(url)) {
      toast.error("La URL no es válida", { position: "top-center" });
      return;
    }

    const formData = new FormData();
    formData.append("url", url);
    formData.append("typeEcommerce", typeEcommerce);
    formData.append("order", order.toString());
    const selected = selectedImages[bannerId] || { file: null, movil: null };
    if (selected.file) {
      formData.append("file", selected.file);
    }
    if (selected.movil) {
      formData.append("movil", selected.movil);
    }

    try {
      const response = await updateBanner(bannerId, formData);
      if ("error" in response) {
        toast.error(response.message, { position: "top-center" });
      } else {
        toast.success("Banner actualizado con éxito", {
          position: "top-center",
        });
        await fetchBanners();
        setSelectedImages((prev) => ({
          ...prev,
          [bannerId]: { file: null, movil: null },
        }));
      }
    } catch (error) {
      console.error("Error al actualizar el banner:", error);
      toast.error("Error al actualizar el banner", { position: "top-center" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Banners</h1>
      {(() => {
        const publicBanners = banners.filter((b) => (b.typeEcommerce || "").toUpperCase().includes("PUBLIC"));
        const privateBanners = banners.filter((b) => (b.typeEcommerce || "").toUpperCase().includes("PRIVATE"));

        const renderCard = (banner: Banner, index: number) => (
          <div
            key={banner.id}
            className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Banner {index + 1}</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Link className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">URL del enlace</span>
                </div>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="https://example.com"
                  value={urls[banner.id] || ""}
                  onChange={(e) =>
                    setUrls((prev) => ({
                      ...prev,
                      [banner.id]: e.target.value,
                    }))
                  }
                />
              </div>
 
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="font-medium text-gray-700">Imagen Web</span>
                  <div
                    onClick={() => handleClicImage(banner.id, "web")}
                    className="relative border-2 border-dashed border-gray-300 rounded-lg cursor-pointer overflow-hidden flex items-center justify-center w-full h-48 bg-gray-50 hover:border-blue-500 transition-colors"
                  >
                    {previews[banner.id]?.web ? (
                      <img src={previews[banner.id].web} alt={`Banner ${index + 1} Web`} className="w-full h-full object-contain" />
                    ) : (
                      <div className="flex flex-col justify-center gap-2 items-center px-4 text-center">
                        <span className="text-gray-500 text-sm">Seleccionar imagen web</span>
                        <Upload className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Dimensiones: 1920x600px</p>
                  <input
                    type="file"
                    ref={(el) => {
                      fileInputRefs.current[banner.id] = el;
                    }}
                    onChange={(e) => handleImageChange(e, banner.id, "web")}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="space-y-2">
                  <span className="font-medium text-gray-700">Imagen Móvil</span>
                  <div
                    onClick={() => handleClicImage(banner.id, "movil")}
                    className="relative border-2 border-dashed border-gray-300 rounded-lg cursor-pointer overflow-hidden flex items-center justify-center w-fit h-48 bg-gray-50 hover:border-blue-500 transition-colors"
                  >
                    {previews[banner.id]?.movil ? (
                      <img src={previews[banner.id].movil} alt={`Banner ${index + 1} Móvil`} className="w-full h-full object-contain" />
                    ) : (
                      <div className="flex flex-col justify-center gap-2 items-center px-4 text-center">
                        <span className="text-gray-500 text-sm">Seleccionar imagen móvil</span>
                        <Upload className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Dimensiones: 600x800px</p>
                  <input
                    type="file"
                    ref={(el) => {
                      fileInputMovilRefs.current[banner.id] = el;
                    }}
                    onChange={(e) => handleImageChange(e, banner.id, "movil")}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <button
                className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition-colors"
                onClick={() => handleSave(banner.id, banner.order, banner.typeEcommerce)}
              >
                Guardar
              </button>
            </div>
          </div>
        );

        return (
          <div className="space-y-8">
            <div className="border rounded-lg bg-white shadow">
              <Collapsible open={openPublic} onOpenChange={setOpenPublic}>
                <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 border-b">
                  <span className="text-xl font-semibold text-blue-700">
                    Ecommerce Público ({publicBanners.length})
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-700 transition-transform ${openPublic ? "rotate-180" : "rotate-0"}`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 grid grid-cols-1 gap-6">
                    {publicBanners.map((banner, index) => renderCard(banner, index))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="border rounded-lg bg-white shadow">
              <Collapsible open={openPrivate} onOpenChange={setOpenPrivate}>
                <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 border-b">
                  <span className="text-xl font-semibold text-blue-700">
                    Ecommerce Privado ({privateBanners.length})
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-700 transition-transform ${openPrivate ? "rotate-180" : "rotate-0"}`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 grid grid-cols-1 gap-6">
                    {privateBanners.map((banner, index) => renderCard(banner, index))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default BannersPage;