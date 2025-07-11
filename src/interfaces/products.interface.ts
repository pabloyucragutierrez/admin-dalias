import type { Categorias } from "./categorias.interface";

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
  codigoOriginal: string;
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
  typeProduct?: string;
  createAt: string;
  updatedAt: string;
  fatherId?: Product;
  father?: Product;
  mainImage?: string;
  galleryImages?: string[];
  categoria: Categorias;
  ProductImages: ProductImage[];
  stockProducts?: StockProduct[];
  terminoProducts?: TerminoProduct[];

  ProductSucursales: ProductSucursal[];
}

export interface TerminoProduct {
  id: string;
  terminoId: string;
  productId: string;
  visible: boolean;
  variation: boolean;
  order: number;
  termino: TerminoPrduct;
}
export interface TerminoPrduct {
  id: string;
  name: string;
  attributeId: string;
  sampleType: string;
  sampleImage: string;
  sampleColor: string;
  sampleText: boolean;
  createAt: string;
  attribute: Attribute;
}
export interface Attribute {
  id: string;
  name: string;
  status: boolean;
  createAt: string;
}

export interface StockProduct {
  id: string;
  productId: string;
  stock: number;
  manageStock: boolean;
  lowStock: number;
  status: string;
  createAt: string;
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
  unidadId: string;
  price: number;
  purchasePrice: number;
  offer: boolean;
  discountedPrice: number;
  priceDateFrom: string;
  priceDateTo: string;
  stock: number;
  stockMin: number;
  categoria: string;
  sucursalesId: SucursalesProductDTO[];
  file?: File;
  imageGalery?: File[];
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
