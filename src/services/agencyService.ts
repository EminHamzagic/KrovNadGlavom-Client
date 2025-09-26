import { API_URL } from "../config";
import type { Agency, AgencyToAdd } from "../types/agency";
import type { PaginatedResult, QueryParameters } from "../types/apartment";
import type { LogoUpload } from "../types/company";
import apiClient from "../utils/apiClient";

export async function createAgency(
  createData: AgencyToAdd,
): Promise<string> {
  const { data } = await apiClient.post<string>(`${API_URL}/Agencies`, createData);
  return data;
}

export async function getAgency(id: string): Promise<Agency> {
  const { data } = await apiClient.get<Agency>(`${API_URL}/Agencies/${id}`);
  return data;
}

export async function updateAgency(id: string, updateData: AgencyToAdd): Promise<void> {
  await apiClient.put(`${API_URL}/Agencies/${id}`, updateData);
}

export async function getAllAgencies(
  parameters: QueryParameters,
): Promise<PaginatedResult<Agency>> {
  const searchParams = new URLSearchParams();

  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== 0) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const url = `${API_URL}/Agencies${queryString ? `?${queryString}` : ""}`;

  const { data, headers } = await apiClient.get<Agency[]>(url);

  const pagination = JSON.parse(headers["x-pagination"]);
  return { data, pagination };
}

export async function uploadAgencyLogo(
  logoData: LogoUpload,
): Promise<string> {
  const formData = new FormData();
  formData.append("Id", logoData.id);
  formData.append("File", logoData.file);

  const { data } = await apiClient.put<string>(
    `${API_URL}/Agencies/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
}
