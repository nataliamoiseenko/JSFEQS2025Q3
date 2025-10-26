export const BASE_API_URL = 'http://coffee-shop-be.eu-central-1.elasticbeanstalk.com';

export enum Endpoints {
  FAVOURITES = '/products/favorites',
  PRODUCTS = '/products',
  REGISTER = '/auth/register',
}

export enum StorageKeys {
  CART = 'coffe-house-cart',
  ACCESS_TOKEN = 'access-token',
}
