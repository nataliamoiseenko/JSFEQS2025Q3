type MenuItemSize = {
  size: string;
  price: string;
  discountPrice?: string;
};

type MenuItemAdditive = {
  name: string;
  price: string;
  discountPrice?: string;
  // 'add-price': string;
};

export type MenuItemRaw = {
  id: number;
  imgSrc: string;
};

export type FavoriteRaw = {
  id: number;
  imgSrc: string;
};

export type ItemRes = {
  id: number;
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  category: string;
};

export type MenuItemDetails = ItemRes & {
  imgSrc: string;
  sizes: {
    s: MenuItemSize;
    m: MenuItemSize;
    l: MenuItemSize;
    xl: MenuItemSize;
    xxl?: MenuItemSize;
  };
  additives: MenuItemAdditive[];
};

export type Favorite = FavoriteRaw & ItemRes;

export type MenuItem = MenuItemRaw & ItemRes;

export type ItemToCart = MenuItemDetails & {
  selectedSize?: string | null;
  selectedAdditives?: string[];
};

export type PaymentMethod = 'cash' | 'card';

export type User = {
  city: string;
  createdAt: string;
  houseNumber: number;
  id: number;
  login: string;
  paymentMethod: PaymentMethod;
  street: string;
};

export type UserRes = {
  access_token: string;
  user: User;
  message: string;
};
