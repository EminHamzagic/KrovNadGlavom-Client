export interface Installment {
  id: string;
  contractId: string;
  sequenceNumber: number;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  paymentProof?: string;
  isConfirmed: boolean;
}

export interface InstallmentToAdd {
  contractId: string;
  sequenceNumber: number;
  amount: number;
  dueDate: string;
}
