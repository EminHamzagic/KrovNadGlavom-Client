import type { Agency } from "./agency";
import type { Apartment } from "./apartment";
import type { Installment } from "./installment";
import type { User } from "./user";

export interface Contract {
  id: string;
  userId: string;
  agencyId: string;
  apartmentId: string;
  price: number;
  installmentAmount: number;
  installmentCount: number;
  status: string;
  installments: Installment[];
  user: User;
  agency: Agency;
  apartment: Apartment;
}

export interface ContractToAdd {
  userId: string;
  agencyId: string;
  apartmentId: string;
  price: number;
  installmentAmount: number;
  installmentCount: number;
}
