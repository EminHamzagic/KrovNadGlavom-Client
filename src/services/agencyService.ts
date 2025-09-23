import axios from "axios";
import { API_URL } from "../config";
import type { AgencyToAdd } from "../types/agency";
import type { LogoUpload } from "../types/company";

export async function createAgency(
  createData: AgencyToAdd,
): Promise<string> {
  const { data } = await axios.post<string>(`${API_URL}/Agencies`, createData);
  return data;
}

export async function uploadAgencyLogo(
  logoData: LogoUpload,
): Promise<string> {
  const formData = new FormData();
  formData.append("Id", logoData.id);
  formData.append("File", logoData.file);

  const { data } = await axios.put<string>(
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
