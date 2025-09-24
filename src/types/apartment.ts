import type { OrientationEnum } from "../utils/orientation";
import type { Agency } from "./agency";
import type { Building } from "./building";

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
  building: Building;
  agency?: Agency;
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
