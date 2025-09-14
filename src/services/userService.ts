import axios from "axios";
import type { LoginData, User } from "../types/user";
import { API_URL } from "../config";

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
