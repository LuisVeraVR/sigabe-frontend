export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  publisher: string;
  type: string;
  photo?: string;
  avaliable: boolean;
}

export interface BookFormData {
  title: string;
  author: string;
  year: number;
  publisher: string;
  type: string;
  photo?: string;
  avaliable: boolean;
}