export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: number;
  product_id: number;
  image: string;
  is_main: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  title: string;
  comment: string;
  rating: string;
  is_approved: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  brand: string;
  rating: string;
  num_reviews: number;
  category_id: number;
  user_id: number;
  status: number;
  created_at: string;
  updated_at: string;
  category: Category;
  user: User;
  images: Image[];
  reviews: Review[];
}

export type ProductApiResponse = {
  current_page: number;
  data: Product[];
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};
