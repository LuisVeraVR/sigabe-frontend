import { Book } from "./book";
import { Fine } from "./fine";
import { User } from "./user";

export enum LoanStatus {
  ACTIVE = "active",
  RETURNED = "returned",
  OVERDUE = "overdue"
}

export interface Loan {
  id: string;
  bookId: string;
  userId: string;
  loanDate: string; 
  dueDate: string;  
  returnDate?: string | null;
  status: LoanStatus | string;
  notes?: string;
  book?: Book; 
  user?: User;
  fine?: Fine; 
}