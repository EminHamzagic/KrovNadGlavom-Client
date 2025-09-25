import { API_URL } from "../config";
import type { Contract, ContractToAdd } from "../types/contract";
import apiClient from "../utils/apiClient";

export async function createContract(
  createData: ContractToAdd,
): Promise<Contract> {
  const { data } = await apiClient.post<Contract>(`${API_URL}/Contracts`, createData);
  return data;
}
