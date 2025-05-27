export interface Person {
  id: string;
  name: string;
  lastName: string;
  email: string;
  gender: string;
  documentType: string;
  documentNumber: string;
  maritalStatus: string;
  birthday: string;
  status: boolean;
  createAt: string;
  updatedAt: string;
  PhonesPersons: Array<{
    id: string;
    personId: string;
    phone: string;
    status: boolean;
    createAt: string;
    updatedAt: string;
  }>;
  AddressPersons: Array<{
    id: string;
    personId: string;
    street: string;
    number: string;
    apartment: string;
    reference: string;
    district: string;
    zipCode: string;
    isDefault: boolean;
    status: boolean;
    createAt: string;
    updatedAt: string;
  }>;
}

export interface User {
  id: string;
  personId: string;
  roleId: string;
  username: string;
  password: string;
  verificationCode: string | null;
  verifiedAt: string | null;
  status: boolean;
  createAt: string;
  updatedAt: string;
  person: Person;
  roleName?: string;
}

export interface UserDto {
  name: string;
  lastName?: string;
  email: string;
  gender?: string;
  documentType: string;
  documentNumber: string;
  maritalStatus: string;
  birthday?: string;
  street?: string;
  number?: string;
  apartment?: string;
  reference?: string;
  district?: string;
  zipCode?: string;
  phone?: string;
  username: string;
  password?: string;
  roleId: string;
}

export interface Role {
  id: string;
  name: string;
  status: boolean;
  createAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  name?: string;
  email?: string;
  documentType?: string;
  status?: boolean;
}