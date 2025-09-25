import type { Agency } from "./agency";
import type { StatusEnum } from "./agencyRequest";
import type { Apartment } from "./apartment";
import type { Company } from "./company";
import type { User } from "./user";

export interface DiscountRequest {
  id: string;
  userId: string;
  agencyId: string;
  apartmentId: string;
  constructionCompanyId: string;
  percentage: number;
  status: string;
  reason?: string;
  user: User;
  agency: Agency;
  apartment: Apartment;
  constructionCompany: Company;
}

export interface DiscountRequestToAdd {
  userId: string;
  agencyId: string;
  apartmentId?: string;
  constructionCompanyId?: string;
  percentage: number;
}

export interface DiscountRequestToUpdate {
  status: StatusEnum;
  reason?: string;
}
