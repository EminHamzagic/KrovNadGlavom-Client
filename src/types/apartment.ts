import type { OrientationEnum } from "../utils/orientation";
import type { Agency } from "./agency";
import type { Building } from "./building";
import type { DiscountRequest } from "./discountRequest";

export interface Apartment {
  id: string;
  buildingId: string;
  apartmentNumber: string;
  area: number;
  roomCount: number;
  balconyCount: number;
  orientation: string;
  floor: number;
  isAvailable: boolean;
  isDeleted?: boolean;
  isReserved?: boolean;
  canRequestDiscount: boolean;
  building: Building;
  agency?: Agency;
  discountRequest?: DiscountRequest;
}

export interface ApartmentToAdd {
  id: string;
  buildingId: string;
  apartmentNumber: string;
  area: number;
  roomCount: number;
  balconyCount: number;
  orientation: OrientationEnum;
  floor: number;
  isAvailable: boolean;
}

export interface MultipleApartmentsToAdd {
  apartments: ApartmentToAdd[];
}

export interface QueryParameters {
  pageNumber: number;
  pageSize: number;
  searchText: string;
  sortProperty?: string;
  sortType: "asc" | "desc";
  city?: string;
  address?: string;
  area?: number;
  roomCount?: number;
  balconyCount?: number;
  floor?: number;
  orientation?: string;
}

export interface PaginationParams {
  TotalCount: number;
  PageNumber: number;
  PageSize: number;
  TotalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationParams;
}
