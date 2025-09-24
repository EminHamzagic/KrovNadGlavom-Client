import type { Agency } from "./agency";
import type { Building } from "./building";
import type { Company } from "./company";

export interface AgencyRequest {
  id: string;
  agencyId: string;
  buildingId: string;
  commissionPercentage: number;
  status: string;
  rejectionReason: string;
  agency: Agency;
  company: Company;
  building: Building;
}

export enum StatusEnum {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export interface AgencyRequestToAdd {
  agencyId: string;
  buildingId: string;
  commissionPercentage: number;
}

export interface AgencyRequestToUpdate {
  status: StatusEnum;
  rejectionReason: string;
}
