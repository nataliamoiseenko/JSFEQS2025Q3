type MenuItemSize = {
  size: string;
  'add-price': string;
};

type MenuItemAssitive = {
  name: string;
  'add-price': string;
};

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  imgSrc: string;
  sizes: {
    s: MenuItemSize;
    m: MenuItemSize;
    l: MenuItemSize;
  };
  additives: MenuItemAssitive[];
};

export type FavoriteRaw = {
  id: number;
  imgSrc: string;
};

export type FavoriteRes = {
  id: number;
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  category: string;
};

export type Favorite = FavoriteRaw & FavoriteRes;
