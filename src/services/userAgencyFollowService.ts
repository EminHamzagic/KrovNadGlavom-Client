import { API_URL } from "../config";
import type { UserAgencyFollow, UserAgencyFollowToAdd } from "../types/user";
import apiClient from "../utils/apiClient";

export async function subscribeToAgency(
  createData: UserAgencyFollowToAdd,
): Promise<UserAgencyFollow> {
  const { data } = await apiClient.post<UserAgencyFollow>(`${API_URL}/UserAgencyFollows`, createData);
  return data;
}

export async function deleteSubscription(
  id: string,
): Promise<UserAgencyFollowToAdd> {
  const { data } = await apiClient.delete<UserAgencyFollowToAdd>(`${API_URL}/UserAgencyFollows/${id}`);
  return data;
}
