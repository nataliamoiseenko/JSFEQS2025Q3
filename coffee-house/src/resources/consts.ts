export const BASE_API_URL = 'http://coffee-shop-be.eu-central-1.elasticbeanstalk.com';

export enum Endpoints {
  FAVOURITES = '/products/favorites',
  PRODUCTS = '/products',
  REGISTER = '/auth/register',
  LOGIN = '/auth/login',
  PLACE_ORDER = '/orders/confirm',
}

export enum StorageKeys {
  CART = 'coffe-house-cart',
  ACCESS_TOKEN = 'access-token',
  USER = 'coffe-house-user',
}
