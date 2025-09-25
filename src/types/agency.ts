export interface Agency {
  id: string;
  name: string;
  pib: string;
  address: string;
  email: string;
  phone: string;
  city: string;
  description: string;
  bankAccountNumber: string;
  logoUrl: string;
  numberOfBuildings?: number;
  numberOfApartments?: number;
}

export interface AgencyToAdd {
  name: string;
  pib: string;
  address: string;
  email: string;
  phone: string;
  city: string;
  description: string;
  bankAccountNumber: string;
}
