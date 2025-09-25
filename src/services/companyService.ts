import type { Company, CompanyToAdd, CompanyToUpdate, LogoUpload } from "../types/company";
import { API_URL } from "../config";
import apiClient from "../utils/apiClient";

export async function createCompany(
  createData: CompanyToAdd,
): Promise<string> {
  const { data } = await apiClient.post<string>(`${API_URL}/ConstructionCompanies`, createData);
  return data;
}
export async function getCompany(id: string): Promise<Company> {
  const { data } = await apiClient.get<Company>(`${API_URL}/ConstructionCompanies/${id}`);
  return data;
}
export async function updateCompany(id: string, updateData: CompanyToUpdate): Promise<void> {
  await apiClient.put(`${API_URL}/ConstructionCompanies/${id}`, updateData);
}
export async function uploadCompanyLogo(
  logoData: LogoUpload,
): Promise<string> {
  const formData = new FormData();
  formData.append("Id", logoData.id);
  formData.append("File", logoData.file);

  const { data } = await apiClient.put<string>(
    `${API_URL}/ConstructionCompanies/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
}
