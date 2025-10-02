import type { LoginData, User, UserChangePassword, UserToAdd, UserToUpdate } from "../types/user";
import { API_URL } from "../config";
import type { LogoUpload } from "../types/company";
import apiClient from "../utils/apiClient";

// LOGIN
export async function loginUser(loginData: LoginData): Promise<User> {
  const { data } = await apiClient.post<User>(`${API_URL}/Users/login`, loginData);
  return data;
}

export async function loginUserGoogle(idToken: string): Promise<User> {
  const { data } = await apiClient.post<User>(`${API_URL}/Users/google`, { idToken });
  return data;
}

// REGISTER
export async function registerUser(registerData: UserToAdd): Promise<string> {
  const { data } = await apiClient.post<string>(`${API_URL}/Users/register`, registerData);
  return data;
}

// UPDATE PROFILE
export async function updateUser(userId: string, userData: UserToUpdate): Promise<User> {
  const { data } = await apiClient.put<User>(`${API_URL}/Users/${userId}`, userData);
  return data;
}

// UPLOAD PROFILE PICTURE
export async function uploadUserPfp(logoData: LogoUpload): Promise<string> {
  const formData = new FormData();
  formData.append("Id", logoData.id);
  formData.append("File", logoData.file);

  const { data } = await apiClient.put<string>(
    `${API_URL}/Users/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
}

// CHANGE PASSWORD
export async function changePassword(userId: string, passwordData: UserChangePassword): Promise<boolean> {
  const { data } = await apiClient.put<{ success: boolean }>(
    `${API_URL}/Users/change-password`,
    {
      OldPassword: passwordData.currentPassword,
      NewPassword: passwordData.newPassword,
    },
  );
  return data.success;
}

// VERIFY EMAIL
export async function verifyUserEmail(token: string): Promise<boolean> {
  const { data } = await apiClient.post<boolean>(`${API_URL}/Users/verify-email`, { token });
  return data;
}

// PASSWORD RESET
export async function sendPasswordResetRequest(email: string): Promise<boolean> {
  const { data } = await apiClient.post<boolean>(`${API_URL}/Users/request-password-reset`, { email });
  return data;
}

export async function resetUserPassword(newPassword: string, token: string): Promise<boolean> {
  const { data } = await apiClient.post<boolean>(`${API_URL}/Users/password-reset`, { token, newPassword });
  return data;
}
