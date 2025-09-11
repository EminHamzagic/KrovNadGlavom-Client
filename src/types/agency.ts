export interface Agency {
  id: string;
  name: string;
  pIB: string;
  address: string;
  email: string;
  phone: string;
  city: string;
  description: string;
  numberOfBuildings?: number;
  numberOfApartments?: number;
}

export interface AgencyToAdd {
  name: string;
  pIB: string;
  address: string;
  email: string;
  phone: string;
  city: string;
  description: string;
}
