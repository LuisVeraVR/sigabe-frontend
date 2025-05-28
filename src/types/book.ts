export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  publisher: string;
  type: string;
  photo?: string;
  available: boolean;
}

export interface BookFormData {
  title: string;
  author: string;
  year: number;
  publisher: string;
  type: string;
  photo?: string;
  available: boolean;
}