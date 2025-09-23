import axios from "axios";
import type { LoginData, User, UserToAdd } from "../types/user";
import { API_URL } from "../config";
import type { LogoUpload } from "../types/company";

export async function loginUser(
  loginData: LoginData,
): Promise<User> {
  const { data } = await axios.post<User>(`${API_URL}/Users/login`, loginData);
  return data;
}

export async function loginUserGoogle(
  idToken: string,
): Promise<User> {
  const { data } = await axios.post<User>(`${API_URL}/Users/google`, { idToken });
  return data;
}

export async function registerUser(
  registerData: UserToAdd,
): Promise<string> {
  const { data } = await axios.post<string>(`${API_URL}/Users/register`, registerData);
  return data;
}

export async function uploadUserPfp(
  logoData: LogoUpload,
): Promise<string> {
  const formData = new FormData();
  formData.append("Id", logoData.id);
  formData.append("File", logoData.file);

  const { data } = await axios.put<string>(
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
