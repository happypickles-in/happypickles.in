export type Product = {
  id: string;
  name: string;
  teluguName: string;
  price: number;
  weight: string;
  image: string;
  category: 'veg' | 'non-veg' | 'powder' | 'snack' | 'sweet';
  rating: number;
  ratingCount: number;
  popularity?: number;
  orders: number;
  trendingScore?: number;
};
