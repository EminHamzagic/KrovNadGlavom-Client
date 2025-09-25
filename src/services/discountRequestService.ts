import { API_URL } from "../config";
import type { StatusEnum } from "../types/agencyRequest";
import type { DiscountRequest, DiscountRequestToAdd, DiscountRequestToUpdate } from "../types/discountRequest";
import apiClient from "../utils/apiClient";

export async function createDiscountRequest(
  createData: DiscountRequestToAdd,
): Promise<DiscountRequest> {
  const { data } = await apiClient.post<DiscountRequest>(`${API_URL}/DiscountRequests`, createData);
  return data;
}

export async function getAgencyDiscountRequests(
  agencyId: string,
  status: StatusEnum,
): Promise<DiscountRequest[]> {
  const { data } = await apiClient.get<DiscountRequest[]>(`${API_URL}/DiscountRequests/agency/${agencyId}?status=${status}`);
  return data;
}

export async function getUserDiscountRequests(
  userId: string,
  status: StatusEnum,
): Promise<DiscountRequest[]> {
  const { data } = await apiClient.get<DiscountRequest[]>(`${API_URL}/DiscountRequests/user/${userId}?status=${status}`);
  return data;
}

export async function getCompanyDiscountRequests(
  companyId: string,
  status: StatusEnum,
): Promise<DiscountRequest[]> {
  const { data } = await apiClient.get<DiscountRequest[]>(`${API_URL}/DiscountRequests/company/${companyId}?status=${status}`);
  return data;
}

export async function updateDiscountRequest(
  requestId: string,
  updateData: DiscountRequestToUpdate,
): Promise<DiscountRequest> {
  const { data } = await apiClient.put<DiscountRequest>(`${API_URL}/DiscountRequests/${requestId}`, updateData);
  return data;
}

export async function deleteDiscountRequest(
  requestId: string,
): Promise<boolean> {
  const { data } = await apiClient.delete<boolean>(`${API_URL}/DiscountRequests/${requestId}`);
  return data;
}
