export interface Banco {
  id: string;
  typeBank: string;
  namePerson: string;
  ahorroSoles: string;
  cciSoles: string;
  ahorroDolares: string;
  cciDolares: string;
  phone: string;
  imageURL?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}