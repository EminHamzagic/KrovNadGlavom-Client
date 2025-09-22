import axios from "axios";
import type { LoginData, User, UserToAdd } from "../types/user";
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

export async function registerUser(
  registerData: UserToAdd,
): Promise<string> {
  const { data } = await axios.post<string>(`${API_URL}/Users/register`, registerData);
  return data;
}
