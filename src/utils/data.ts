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