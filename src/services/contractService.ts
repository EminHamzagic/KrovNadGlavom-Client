import { API_URL } from "../config";
import type { Contract, ContractToAdd } from "../types/contract";
import apiClient from "../utils/apiClient";

export async function createContract(
  createData: ContractToAdd,
): Promise<Contract> {
  const { data } = await apiClient.post<Contract>(`${API_URL}/Contracts`, createData);
  return data;
}

export async function getContractById(
  contractId: string,
): Promise<Contract> {
  const { data } = await apiClient.get<Contract>(`${API_URL}/Contracts/${contractId}`);
  return data;
}

export async function getUserContracts(
  userId: string,
): Promise<Contract[]> {
  const { data } = await apiClient.get<Contract[]>(`${API_URL}/Contracts/user/${userId}`);
  return data;
}

export async function getAgencyContracts(
  agencyId: string,
): Promise<Contract[]> {
  const { data } = await apiClient.get<Contract[]>(`${API_URL}/Contracts/agency/${agencyId}`);
  return data;
}
