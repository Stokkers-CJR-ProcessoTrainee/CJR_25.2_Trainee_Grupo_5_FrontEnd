export type Category = {
  id: number;
  name: string;
  parent_category_id?: number | null;
};
export type Products = {
  id: number;
  name: string;
  price: number;
  stock: number;
  product_images: { id: number; image_url: string; order: number }[];
  store: { id: number; name: string; sticker_url: string };
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
