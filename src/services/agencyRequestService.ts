import { API_URL } from "../config";
import type { AgencyRequest, AgencyRequestToAdd, AgencyRequestToUpdate, StatusEnum } from "../types/agencyRequest";
import apiClient from "../utils/apiClient";

export async function createAgencyRequest(
  createData: AgencyRequestToAdd,
): Promise<AgencyRequest> {
  const { data } = await apiClient.post<AgencyRequest>(`${API_URL}/AgencyRequests`, createData);
  return data;
}

export async function getAgencyBuildingRequests(
  agencyId: string,
  status: StatusEnum,
): Promise<AgencyRequest[]> {
  const { data } = await apiClient.get<AgencyRequest[]>(`${API_URL}/AgencyRequests/agency/${agencyId}?status=${status}`);
  return data;
}

export async function getCompanyBuildingRequests(
  companyId: string,
  status: StatusEnum,
): Promise<AgencyRequest[]> {
  const { data } = await apiClient.get<AgencyRequest[]>(`${API_URL}/AgencyRequests/company/${companyId}?status=${status}`);
  return data;
}

export async function updateBuildingRequest(
  requestId: string,
  updateData: AgencyRequestToUpdate,
): Promise<AgencyRequest> {
  const { data } = await apiClient.put<AgencyRequest>(`${API_URL}/AgencyRequests/${requestId}`, updateData);
  return data;
}

export async function deleteBuildingRequest(
  requestId: string,
): Promise<AgencyRequest> {
  const { data } = await apiClient.delete<AgencyRequest>(`${API_URL}/AgencyRequests/${requestId}`);
  return data;
}
