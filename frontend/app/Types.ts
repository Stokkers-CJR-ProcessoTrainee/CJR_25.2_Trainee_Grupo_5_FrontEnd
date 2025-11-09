export type Category = {
  id: number;
  name: string;
  parent_category_id?: number | null;
};
export type Products = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  category_id: number;
  store_id: number;
};

export type Store = {
  id: number;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  sticker_url?: string | null;
};
export type ProductImage = {
  id: number;
  product_id: number;
  image_url: string;
  order: number;
};
