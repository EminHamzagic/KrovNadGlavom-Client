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
  buildingId: string;
  apartmentNumber: string;
  area: number;
  roomCount: number;
  balconyCount: number;
  orientation: OrientationEnum;
  floor: number;
  isAvailable: boolean;
  isDeleted: boolean;
  isReserved: boolean;
  building?: Building;
}

export enum OrientationEnum {
  North = "north",
  South = "south",
  East = "east",
  West = "west",
  Northeast = "northeast",
  Northwest = "northwest",
  Southeast = "southeast",
  Southwest = "southwest",
}
