import type { Activity, ActivityPayload } from "@/interfaces/activity.interface";
import api from "@/lib/api";

export async function getActivities(): Promise<Activity[]> {
  try {
    const response = await api.get("/actividades");
    return response.data as Activity[];
  } catch (error: any) {
    console.error("Error fetching activities:", error);
    return [];
  }
}

export async function getActivityById(id: string): Promise<Activity | null> {
  try {
    const response = await api.get(`/actividades/${id}`);
    return response.data as Activity;
  } catch (error: any) {
    console.error("Error fetching activity:", error);
    return null;
  }
}

export async function createActivity(payload: ActivityPayload) {
  try {
    const formData = new FormData();
    formData.append("titulo", payload.titulo);
    formData.append("descripcion", payload.descripcion);
    
    if (payload.imagen) {
      formData.append("imagen", payload.imagen);
    }

    const response = await api.post("/actividades", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      message: "Actividad creada correctamente",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al crear actividad",
    };
  }
}

export async function updateActivity(id: string, payload: ActivityPayload) {
  try {
    const formData = new FormData();
    formData.append("titulo", payload.titulo);
    formData.append("descripcion", payload.descripcion);
    
    if (payload.imagen) {
      formData.append("imagen", payload.imagen);
    }

    const response = await api.patch(`/actividades/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      message: "Actividad actualizada correctamente",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al actualizar actividad",
    };
  }
}

export async function deleteActivity(id: string) {
  try {
    await api.delete(`/actividades/${id}`);

    return {
      success: true,
      message: "Actividad eliminada correctamente",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al eliminar actividad",
    };
  }
}