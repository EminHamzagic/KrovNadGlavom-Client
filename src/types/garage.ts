export interface Garage {
  id: string;
  buildingId: string;
  apartmentId?: string;
  spotNumber: string;
  isAvailable: boolean;
  isDeleted: boolean;
}

export interface GarageToAdd {
  buildingId?: string;
  apartmentId?: string;
  spotNumber: string;
  isAvailable: boolean;
}
