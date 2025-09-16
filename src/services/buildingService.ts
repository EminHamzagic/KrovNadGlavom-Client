import { API_URL } from "../config";
import type { Building, BuildingToAdd } from "../types/building";
import apiClient from "../utils/apiClient";

export async function getBuildings(
  companyId: string,
): Promise<Building[]> {
  const { data } = await apiClient.get<Building[]>(`${API_URL}/Buildings/company/${companyId}`);
  return data;
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
