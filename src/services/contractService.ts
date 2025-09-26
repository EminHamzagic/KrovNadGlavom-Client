import { API_URL } from "../config";
import type { PaginatedResult, QueryParameters } from "../types/apartment";
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
  parameters: QueryParameters,
): Promise<PaginatedResult<Contract>> {
  const searchParams = new URLSearchParams();

  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== 0) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const url = `${API_URL}/Contracts/user/${userId}${queryString ? `?${queryString}` : ""}`;

  const { data, headers } = await apiClient.get<Contract[]>(url);

  const pagination = JSON.parse(headers["x-pagination"]);
  return { data, pagination };
}

export async function getAgencyContracts(
  agencyId: string,
  parameters: QueryParameters,
): Promise<PaginatedResult<Contract>> {
  const searchParams = new URLSearchParams();

  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== 0) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const url = `${API_URL}/Contracts/agency/${agencyId}${queryString ? `?${queryString}` : ""}`;

  const { data, headers } = await apiClient.get<Contract[]>(url);

  const pagination = JSON.parse(headers["x-pagination"]);
  return { data, pagination };
}
