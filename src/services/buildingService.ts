import { API_URL } from "../config";
import type { PaginatedResult, QueryParameters } from "../types/apartment";
import type { Building, BuildingEndDateToExtend, BuildingToAdd } from "../types/building";
import apiClient from "../utils/apiClient";

export async function getCompanyBuildings(
  companyId: string,
  parameters: QueryParameters,
): Promise<PaginatedResult<Building>> {
  const searchParams = new URLSearchParams();

  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== 0) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const url = `${API_URL}/Buildings/company/${companyId}${queryString ? `?${queryString}` : ""}`;

  const { data, headers } = await apiClient.get<Building[]>(url);

  const pagination = JSON.parse(headers["x-pagination"]);
  return { data, pagination };
}

export async function getBuildings(
  agencyId: string,
  parameters: QueryParameters,
): Promise<PaginatedResult<Building>> {
  const searchParams = new URLSearchParams();

  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== 0) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const url = `${API_URL}/Buildings/agency/${agencyId}${queryString ? `?${queryString}` : ""}`;

  const { data, headers } = await apiClient.get<Building[]>(url);

  const pagination = JSON.parse(headers["x-pagination"]);
  return { data, pagination };
}

export async function getBuildingById(
  buildingId: string,
): Promise<Building> {
  const { data } = await apiClient.get<Building>(`${API_URL}/Buildings/${buildingId}`);
  return data;
}

export async function createBuiding(
  buildingData: BuildingToAdd,
): Promise<string> {
  const { data } = await apiClient.post<string>(`${API_URL}/Buildings`, buildingData);
  return data;
}

export async function editBuilding(
  buildingData: BuildingToAdd,
  id: string,
): Promise<Building> {
  const { data } = await apiClient.put<Building>(`${API_URL}/Buildings/${id}`, buildingData);
  return data;
}

export async function extendBuildingEndDate(
  buildingData: BuildingEndDateToExtend,
  id: string,
): Promise<Building> {
  const { data } = await apiClient.put<Building>(`${API_URL}/Buildings/${id}/extend`, buildingData);
  return data;
}

export async function deleteBuilding(
  buildingId: string,
): Promise<Building> {
  const { data } = await apiClient.delete<Building>(`${API_URL}/Buildings/${buildingId}`);
  return data;
}
