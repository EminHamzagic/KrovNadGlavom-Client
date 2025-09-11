export interface Reservation {
  id: string;
  userId: string;
  apartmentId: string;
  fromDate: string;
  toDate: string;
}

export interface ReservationToAdd {
  userId: string;
  apartmentId: string;
}
