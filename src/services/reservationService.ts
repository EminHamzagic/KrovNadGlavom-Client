import { API_URL } from "../config";
import type { Reservation, ReservationToAdd } from "../types/reservation";
import apiClient from "../utils/apiClient";

export async function createReservation(
  createData: ReservationToAdd,
): Promise<Reservation> {
  const { data } = await apiClient.post<Reservation>(`${API_URL}/Reservations`, createData);
  return data;
}

export async function deleteReservation(
  reservationId: string,
): Promise<boolean> {
  const { data } = await apiClient.delete<boolean>(`${API_URL}/Reservations/${reservationId}`);
  return data;
}

export async function getReservation(): Promise<Reservation> {
  const { data } = await apiClient.get<Reservation>(`${API_URL}/Reservations`);
  return data;
}
