import type {
  ApiResponse,
  CategorySelect,
  PaginatedResponse,
  StatusDto,
} from "@/interfaces";
import type {
  Product,
  ProductDto,
  Branch,
  Brand,
  Unit,
  FilterOptionsProducts,
} from "@/interfaces/products.interface";
import api from "@/lib/api";

export const fetchProducts = async (
  page: number = 1,
  limit: number = 10,
  filterOptions?: FilterOptionsProducts
): Promise<PaginatedResponse<Product>> => {
  const response = await api.get<PaginatedResponse<Product>>("/products", {
    params: { page, limit, ...filterOptions },
  });
  return response.data;
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (payload: ProductDto) => {
  try {
    const formData = new FormData();
    formData.append("sku", payload.sku);
    formData.append("name", payload.name);
    formData.append("codigoOrigen", payload.codigoOrigen);
    formData.append("description", payload.description);
    formData.append("shortDescription", payload.shortDescription);
    formData.append("unidadId", payload.unidadId);
    formData.append("price", payload.price.toString());
    formData.append("purchasePrice", payload.purchasePrice.toString());
    formData.append("offer", payload.offer.toString());
    formData.append("discountedPrice", payload.discountedPrice.toString());
    formData.append("priceDateFrom", payload.priceDateFrom);
    formData.append("priceDateTo", payload.priceDateTo);
    formData.append("stock", payload.stock.toString());
    formData.append("stockMin", payload.stockMin.toString());
    formData.append(`categoryId`, payload.categoria);
    payload.sucursalesId.forEach((sucursal, index) => {
      formData.append(
        `sucursalesId[${index}][sucursalId]`,
        sucursal.sucursalId
      );
      formData.append(
        `sucursalesId[${index}][numberStand]`,
        sucursal.numberStand.toString()
      );
      formData.append(
        `sucursalesId[${index}][flatNumber]`,
        sucursal.flatNumber.toString()
      );
    });
    if (payload.file) {
      formData.append("file", payload.file);
    }
    if (payload.imageGalery && payload.imageGalery.length > 0) {
      payload.imageGalery.forEach((img) => {
        formData.append("imageGalery", img);
      });
    }

    const response = await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data as ApiResponse<Product>;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const updateProduct = async (id: string, payload: ProductDto) => {
  try {
    const formData = new FormData();
    formData.append("sku", payload.sku);
    formData.append("name", payload.name);
    formData.append("codigoOrigen", payload.codigoOrigen);
    formData.append("description", payload.description);
    formData.append("shortDescription", payload.shortDescription);
    formData.append("unidadId", payload.unidadId);
    formData.append("price", payload.price.toString());
    formData.append("purchasePrice", payload.purchasePrice.toString());
    formData.append("offer", payload.offer.toString());
    formData.append("discountedPrice", payload.discountedPrice.toString());
    formData.append("priceDateFrom", payload.priceDateFrom);
    formData.append("priceDateTo", payload.priceDateTo);
    formData.append("stock", payload.stock.toString());
    formData.append("stockMin", payload.stockMin.toString());
    formData.append(`categoryId`, payload.categoria);
    payload.sucursalesId.forEach((sucursal, index) => {
      formData.append(
        `sucursalesId[${index}][sucursalId]`,
        sucursal.sucursalId
      );
      formData.append(
        `sucursalesId[${index}][numberStand]`,
        sucursal.numberStand.toString()
      );
      formData.append(
        `sucursalesId[${index}][flatNumber]`,
        sucursal.flatNumber.toString()
      );
    });
    if (payload.file) {
      formData.append("file", payload.file);
    }
    if (payload.imageGalery && payload.imageGalery.length > 0) {
      payload.imageGalery.forEach((img) => {
        formData.append("imageGalery", img);
      });
    }

    const response = await api.patch(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data as ApiResponse<Product>;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data as ApiResponse<null>;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const activeOrInactiveProduct = async (
  id: string,
  payload: StatusDto
) => {
  try {
    const response = await api.patch(
      `/products/inactivoOrActivo/${id}`,
      payload
    );
    return response.data as ApiResponse<Product>;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const fetchActiveCategories = async (): Promise<CategorySelect[]> => {
  const response = await api.get<CategorySelect[]>("/categorias/actives");
  return response.data;
};

export const fetchActiveBranches = async (): Promise<Branch[]> => {
  const response = await api.get<Branch[]>("/sucursales/actives");
  return response.data;
};

export const fetchActiveBrands = async (): Promise<Brand[]> => {
  const response = await api.get<Brand[]>("/marcas/actives");
  return response.data;
};

export const fetchActiveUnits = async (): Promise<Unit[]> => {
  const response = await api.get<Unit[]>("/unidades/actives");
  return response.data;
};
