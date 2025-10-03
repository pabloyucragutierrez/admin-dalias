import type { OptionSelect } from "@/interfaces/select.interface";


export const documentTypes: OptionSelect[] = [
  { value: "DNI", label: "DNI" },
  { value: "RUC", label: "RUC" },
  { value: "Carnet de Extranjería", label: "Carnet de Extranjería" },
  { value: "Pasaporte", label: "Pasaporte" },
  { value: "Cédula de Identidad", label: "Cédula de Identidad" },
  { value: "Otros", label: "Otros" },
];

export const maritalStatuses: OptionSelect[] = [
  { value: "Soltero", label: "Soltero" },
  { value: "Casado", label: "Casado" },
  { value: "Viudo", label: "Viudo" },
  { value: "Divorciado", label: "Divorciado" },
];

export const genderTypes: OptionSelect[] = [
  { value: "Hombre", label: "Hombre" },
  { value: "Mujer", label: "Mujer" },
];

export const typeEcommerce: OptionSelect[] = [
  { value: "PUBLIC", label: "Ecommerce Publico" },
  { value: "PRIVATE", label: "Ecommerce Privado" },
  { value: 'PUBLIC,PRIVATE', label: 'Ecommerce Publico y Privado' }
];

export const typeMoney: OptionSelect[] = [
  { value: "soles", label: "Soles" },
  { value: "dolares", label: "Dólares" },
];

export const entidades_financieras = [
  "Banco de Crédito del Perú (BCP)",
  "Yape",
  "BBVA Perú",
  "Plin",
  "Lukita",
  "Interbank",
  "Tunki",
  "Scotiabank Perú",
  "Banco de la Nación",
  "Banco Pichincha",
  "Banco GNB Perú",
  "Banco Falabella",
  "Banco Ripley",
  "Banco Santander Perú",
  "Citibank del Perú",
  "Mibanco",
  "BanBif",
  "ICBC PERU BANK",
  "Caja Arequipa",
  "Wayki App",
  "Caja Cusco",
  "Caja Huancayo",
  "Caja Piura",
  "Caja Trujillo",
  "Financiera Compartamos",
  "Financiera Confianza",
  "Financiera Credinka",
  "Financiera Efectiva",
  "Caja Metropolitana",
];

export const billeteras = ["Yape", "Plin", "Lukita", "Tunki", "Wayki App"];
