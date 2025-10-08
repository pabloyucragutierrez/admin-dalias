export interface ClientManagementPayload {
  email: string;
  documentType: string;
  documentNumber: string;
  name: string;
  lastName: string;
  razonSocial: string;
  phone: string;
  departmentId: string;
  provinceId: string;
  districtId: string;
  address: string;
  password: string;
  plataforma: string;
  typeEcommerce: string;
}

export interface Cliente {
  id: string
  email: string
  typeDocument: string
  document: string
  name: string
  lastName: string
  razonSocial: string
  phone: string
  address: string
  department: string
  province: string
  district: string
  profile: any
  password: string
  codeVerify: any
  verifiedAt: any
  status: boolean
  statusPrivate: boolean
  typeEcommerce: string;
  createAt: string
  updatedAt: string
}