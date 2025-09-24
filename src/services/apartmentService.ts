import type { ApartmentToAdd, MultipleApartmentsToAdd } from "../types/apartment";
import { API_URL } from "../config";
import apiClient from "../utils/apiClient";

export async function createApartment(
  createData: ApartmentToAdd,
): Promise<string> {
  const { data } = await apiClient.post<string>(`${API_URL}/Apartments`, createData);
  return data;
}

export async function createMultipleApartment(
  createData: MultipleApartmentsToAdd,
): Promise<boolean> {
  const { data } = await apiClient.post<boolean>(`${API_URL}/Apartments/multiple`, createData);
  return data;
}

export async function editApartment(
  editData: ApartmentToAdd,
): Promise<string> {
  const { data } = await apiClient.put<string>(`${API_URL}/Apartments/${editData.id}`, editData);
  return data;
}

export async function deleteApartment(
  id: string,
): Promise<string> {
  const { data } = await apiClient.delete<string>(`${API_URL}/Apartments/${id}`);
  return data;
}
