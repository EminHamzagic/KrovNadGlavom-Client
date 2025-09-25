export interface Company {
  id: string;
  name: string;
  pib: string;
  address: string;
  email: string;
  phone: string;
  city: string;
  logoUrl: string;
  description: string;
  bankAccountNumber: string;
}
export interface CompanyToUpdate {
  name: string;
  pib: string;
  address: string;
  email: string;
  phone: string;
  city: string;
  description: string;
  bankAccountNumber: string;
}

export interface CompanyToAdd {
  name: string;
  pib: string;
  address: string;
  email: string;
  phone: string;
  city: string;
  description: string;
  bankAccountNumber: string;
}

export interface LogoUpload {
  id: string;
  file: File;
}
