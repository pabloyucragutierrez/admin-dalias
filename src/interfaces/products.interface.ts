export interface ProductCategory {
  id: string;
  productId: string;
  categoryId: string;
  createAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  typeImage: "THUMBNAIL" | "GALLERY";
  status: boolean;
  createAt: string;
  updatedAt: string;
}

export interface ProductSucursal {
  id: string;
  productId: string;
  sucursalId: string;
  numberStand: number;
  flatNumber: number;
  createAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  codigoOrigen: string;
  description: string;
  shortDescription: string;
  marcaId: string;
  unidadId: string;
  price: number;
  purchasePrice: number;
  offer: boolean;
  discountedPrice: number;
  priceDateFrom: string | null;
  priceDateTo: string | null;
  stock: number;
  stockMin: number;
  categoriesId: string[];
  sucursalesId: SucursalesProductDTO[];
  status: boolean;
  createAt: string;
  updatedAt: string;
  mainImage?: string;
  galleryImages?: string[];
  ProductCategories: ProductCategory[];
  ProductImages: ProductImage[];
  ProductSucursales: ProductSucursal[];
}

export interface SucursalesProductDTO {
  sucursalId: string;
  numberStand: number;
  flatNumber: number;
}

export interface ProductDto {
  sku: string;
  name: string;
  codigoOrigen: string;
  description: string;
  shortDescription: string;
  marcaId: string;
  unidadId: string;
  price: number;
  purchasePrice: number;
  offer: boolean;
  discountedPrice: number;
  priceDateFrom: string;
  priceDateTo: string;
  stock: number;
  stockMin: number;
  categoriesId: string[];
  sucursalesId: SucursalesProductDTO[];
  file?: File;
  imageGalery?: File[];
}

export interface Category {
  id: string;
  name: string;
  status: boolean;
  createAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  name: string;
  status: boolean;
  createAt: string;
  updatedAt: string;
  Almacen: {
    quantityStands: number;
    flatsByStand: number;
  }[];
}

export interface Brand {
  id: string;
  code: string;
  name: string;
  status: boolean;
  createAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  code: string;
  name: string;
  status: boolean;
  createAt: string;
  updatedAt: string;
}

export interface FilterOptionsProducts {
  name?: string;
  sku?: string;
  marca?: string;
  status?: string;
}