export interface Company {
  id: string;
  name: string;
  pIB: string;
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
  pIB: string;
  address: string;
  email: string;
  phone: string;
  city: string;
  description: string;
}

export interface CompanyToAdd {
  name: string;
  pIB: string;
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
