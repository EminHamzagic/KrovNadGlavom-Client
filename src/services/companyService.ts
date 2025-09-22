import axios from "axios";
import type { CompanyToAdd, LogoUpload } from "../types/company";
import { API_URL } from "../config";

export async function createCompany(
  createData: CompanyToAdd,
): Promise<string> {
  const { data } = await axios.post<string>(`${API_URL}/ConstructionCompanies`, createData);
  return data;
}

export async function uploadCompanyLogo(
  logoData: LogoUpload,
): Promise<string> {
  const formData = new FormData();
  formData.append("Id", logoData.id);
  formData.append("File", logoData.file);

  const { data } = await axios.put<string>(
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
