export interface ProductImage {
  id: number;
  imageUrl: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  currency: string;
  quantity: number;
  active: boolean;
  category: Category;
  images: ProductImage[];
}
