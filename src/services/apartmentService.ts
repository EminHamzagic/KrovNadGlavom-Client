import type { Apartment, ApartmentToAdd, MultipleApartmentsToAdd, PaginatedResult, QueryParameters } from "../types/apartment";
import { API_URL } from "../config";
import apiClient from "../utils/apiClient";

export async function getApartmentById(
  apartmentId: string,
): Promise<Apartment> {
  const { data } = await apiClient.get<Apartment>(`${API_URL}/Apartments/${apartmentId}`);
  return data;
}

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

export async function getAvailableApartments(
  parameters: QueryParameters,
): Promise<PaginatedResult<Apartment>> {
  const searchParams = new URLSearchParams();

  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== 0) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const url = `${API_URL}/Apartments${queryString ? `?${queryString}` : ""}`;

  const { data, headers } = await apiClient.get<Apartment[]>(url);

  const pagination = JSON.parse(headers["x-pagination"]);
  return { data, pagination };
}
