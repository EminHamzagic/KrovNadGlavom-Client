import type { Apartment, ApartmentToAdd } from "./apartment";
import type { Company } from "./company";
import type { Garage, GarageToAdd } from "./garage";
import type { PriceList, PriceListToAdd } from "./pricelist";

export interface Building {
  id: string;
  companyId: string;
  parcelNumber: string;
  area: number;
  floorCount: number;
  elevatorCount: number;
  garageSpotCount: number;
  startDate: string;
  endDate: string;
  extendedUntil?: string;
  isCompleted: boolean;
  isDeleted?: boolean;
  city: string;
  address: string;
  longitude: number;
  latitude: number;
  description: string;
  apartments?: Apartment[];
  garages?: Garage[];
  priceList?: PriceList;
  company?: Company;
}

export interface BuildingToAdd {
  id: string;
  companyId: string;
  parcelNumber: string;
  area: number;
  floorCount: number;
  elevatorCount: number;
  garageSpotCount: number;
  startDate: string;
  endDate: string;
  city: string;
  address: string;
  longitude: number;
  latitude: number;
  description: string;
  apartments: ApartmentToAdd[];
  garages: GarageToAdd[];
  priceList: PriceListToAdd;
}
