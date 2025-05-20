import { Loan } from "./loan";

export enum FineStatus {
  PENDING = "pending",
  PAID = "paid"
}

export interface Fine {
  id: number;
  loanId: number;
  amount: number;
  createdAt: string;
  paidAt?: string | null;
  status: FineStatus | string;
  paymentMethod?: string;
  loan?: Loan;
}