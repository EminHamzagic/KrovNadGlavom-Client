import { API_URL } from "../config";
import type { Notification } from "../types/user";
import apiClient from "../utils/apiClient";

export async function getUserNotifications(
  userId: string,
): Promise<Notification[]> {
  const { data } = await apiClient.get<Notification[]>(`${API_URL}/Notifications/${userId}`);
  return data;
}

export async function getUserNotificationCount(
  userId: string,
): Promise<number> {
  const { data } = await apiClient.get<number>(`${API_URL}/Notifications/${userId}/count`);
  return data;
}

export async function deleteUserNotification(
  notificationId: string,
): Promise<boolean> {
  const { data } = await apiClient.delete<boolean>(`${API_URL}/Notifications/${notificationId}`);
  return data;
}
