
import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiClient extends AxiosInstance {
  getLoans: () => Promise<any>;
  getLoansByUser: (userId: number) => Promise<any>;
  createLoan: (loanData: CreateLoanData) => Promise<any>;
  returnBook: (loanId: number, returnDate: string) => Promise<any>;
  getFines: () => Promise<any>;
  getFinesByUser: (userId: number) => Promise<any>;
  payFine: (fineId: number, paymentMethod: string) => Promise<any>;
  getUsers: () => Promise<any>;
}

export interface CreateLoanData {
  userId: number;
  bookId: number;
  borrowDate?: string;
  dueDate: string;
  notes?: string;
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

const api = axiosInstance as ApiClient;

api.getLoans = () => {
  return api.get('/loans');
};

api.getLoansByUser = (userId: number) => {
  return api.get(`/loans/user/${userId}`);
};

api.createLoan = (loanData: CreateLoanData) => {
  return api.post('/loans', loanData);
};

api.returnBook = (loanId: number, returnDate: string) => {
  return api.patch(`/loans/${loanId}/return`, { returnDate });
};

api.getFines = () => {
  return api.get('/fines');
};

api.getFinesByUser = (userId: number) => {
  return api.get(`/fines/user/${userId}`);
};

api.payFine = (fineId: number, paymentMethod: string) => {
  return api.patch(`/fines/${fineId}/pay`, {
    paymentMethod,
    paidAt: new Date().toISOString()
  });
};

api.getUsers = () => {
  return api.get('/auth/getUsers');
};

export default api;