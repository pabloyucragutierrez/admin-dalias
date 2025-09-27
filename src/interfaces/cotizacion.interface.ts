import type { Cliente } from "./client.interface";
import type { Empresa } from "./empresas.interface";

export interface CotizacionPayload {
    clientId: string;
    businessId: string;
    dateEnd: Date;
    details: SelectedProduct[];
}

export interface SelectedProduct {
    productId: string;
    quantity: number;
    price: number;
}

export interface Cotizacion {
  id: string
  code: string
  clientId: string
  businessId: string
  dateEnd: string
  status: boolean
  createAt: string
  updatedAt: string
  client: Cliente
  business: Empresa
  CotizacionDetail: CotizacionDetail[]
}

export interface CotizacionDetail {
  id: string
  cotizacionId: string
  productId: string
  quantity: number
  price: number
}
