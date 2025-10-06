// Tipos relacionados ao módulo Armazém

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stock {
  productId: string;
  quantity: number;
  minQuantity: number;
  location: string;
}