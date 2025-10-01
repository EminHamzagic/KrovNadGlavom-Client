import { API_URL } from "../config";
import type { Garage, GarageToAdd } from "../types/garage";
import apiClient from "../utils/apiClient";

export async function updateGarage(
  updateData: GarageToAdd,
  id: string,
): Promise<Garage> {
  const { data } = await apiClient.put<Garage>(`${API_URL}/Garages/${id}`, updateData);
  return data;
}
