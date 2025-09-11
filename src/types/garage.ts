export interface Garage {
  id: string;
  buildingId: string;
  spotNumber: string;
  isAvailable: boolean;
  isDeleted: boolean;
}

export interface GarageToAdd {
  buildingId?: string;
  spotNumber: string;
}
