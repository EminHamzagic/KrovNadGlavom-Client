import type { OrientationEnum } from "../utils/orientation";
import type { Agency } from "./agency";
import type { Building } from "./building";
import type { PaymentStatusEnum } from "./contract";
import type { DiscountRequest } from "./discountRequest";
import type { Garage } from "./garage";
import type { Reservation } from "./reservation";

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
  canRequestDiscount: boolean;
  reservation?: Reservation;
  building: Building;
  agency?: Agency;
  discountRequest?: DiscountRequest;
  garages?: Garage[];
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
  status?: PaymentStatusEnum;
  orientation?: string;
  withGarage?: boolean | null;
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
