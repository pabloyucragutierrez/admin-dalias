import type { Blog, BlogPayload } from "@/interfaces/blog.interface";
import api from "@/lib/api";

export async function getBlogs(): Promise<Blog[]> {
  try {
    const response = await api.get("/blogs");
    return response.data as Blog[];
  } catch (error: any) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function getBlogById(id: string): Promise<Blog | null> {
  try {
    const response = await api.get(`/blogs/${id}`);
    return response.data as Blog;
  } catch (error: any) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export async function createBlog(payload: BlogPayload) {
  try {
    const formData = new FormData();
    formData.append("titulo", payload.titulo);
    formData.append("descripcionCorta", payload.descripcionCorta);
    formData.append("descripcion", payload.descripcion);
    
    if (payload.imagen) {
      formData.append("imagen", payload.imagen);
    }

    const response = await api.post("/blogs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      message: "Blog creado correctamente",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al crear blog",
    };
  }
}

export async function updateBlog(id: string, payload: BlogPayload) {
  try {
    const formData = new FormData();
    formData.append("titulo", payload.titulo);
    formData.append("descripcionCorta", payload.descripcionCorta);
    formData.append("descripcion", payload.descripcion);
    
    if (payload.imagen) {
      formData.append("imagen", payload.imagen);
    }

    const response = await api.patch(`/blogs/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      message: "Blog actualizado correctamente",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al actualizar blog",
    };
  }
}

export async function deleteBlog(id: string) {
  try {
    await api.delete(`/blogs/${id}`);

    return {
      success: true,
      message: "Blog eliminado correctamente",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al eliminar blog",
    };
  }
}