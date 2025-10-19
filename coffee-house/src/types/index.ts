type MenuItemSize = {
  size: string;
  'add-price': string;
};

type MenuItemAssitive = {
  name: string;
  'add-price': string;
};

export type MenuItem = {
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

export type Slides = {
  imgSrc: string;
  title: string;
  subtitle: string;
  price: string;
};
