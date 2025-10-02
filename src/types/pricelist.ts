export interface PriceList {
  id: string;
  buildingId: string;
  pricePerM2: number;
  penaltyPerM2: number;
  garagePrice: number;
}

export interface PriceListToAdd {
  pricePerM2: number;
  penaltyPerM2: number;
  garagePrice: number;
}
