import axios from "axios";
import { API_URL } from "../config";
import type { AgencyToAdd } from "../types/agency";

export async function createAgency(
  createData: AgencyToAdd,
): Promise<string> {
  const { data } = await axios.post<string>(`${API_URL}/Agencies`, createData);
  return data;
}
