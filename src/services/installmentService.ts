import { API_URL } from "../config";
import type { LogoUpload } from "../types/company";
import type { Installment } from "../types/installment";
import apiClient from "../utils/apiClient";

export async function uploadInstallmentProof(
  uploadData: LogoUpload,
): Promise<string> {
  const formData = new FormData();
  formData.append("Id", uploadData.id);
  formData.append("File", uploadData.file);

  const { data } = await apiClient.post<string>(
    `${API_URL}/Installments/proof`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
}

export async function confirmInstallment(
  installmentId: string,
): Promise<Installment> {
  const { data } = await apiClient.put<Installment>(`${API_URL}/Installments/${installmentId}`);
  return data;
}
