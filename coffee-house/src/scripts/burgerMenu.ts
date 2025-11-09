import { StorageKeys } from '../resources/consts';
import type { ItemToCart } from '../types';
import { isTokenSaved } from './utils';

const bmToggle = document.getElementById('burger-menu-toggle')!;
const bmLinks = document.getElementsByClassName('header__burger-menu-list-link burger-link');
const cartIcon = document.getElementById('cart-icon')!;
const cartSum = document.getElementById('cart-sum')!;
const themeToggle = document.getElementById('theme-toggle')!;

const isLoggedIn = isTokenSaved();
const savedCart = localStorage.getItem(StorageKeys.CART);
if (savedCart) {
  const items: ItemToCart[] = JSON.parse(savedCart);
  cartSum.innerText = `${items.length}`;
  cartIcon.style.display = 'flex';
} else if (isLoggedIn) {
  cartSum.innerText = '0';
  cartIcon.style.display = 'flex';
}

const savedTheme = localStorage.getItem(StorageKeys.THEME);
if (savedTheme === 'dark') {
  (themeToggle as HTMLInputElement).checked = true;
  document.body.classList.add('dark');
}

bmToggle.addEventListener('change', (e) => {
  if ((e.currentTarget as HTMLInputElement).checked) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
});

for (const link of bmLinks) {
  link.addEventListener('click', () => {
    (bmToggle as HTMLInputElement).checked = false;
    document.body.classList.remove('no-scroll');
  });
}

themeToggle.addEventListener('change', () => {
  if ((themeToggle as HTMLInputElement).checked) {
    document.body.classList.add('dark');
    localStorage.setItem(StorageKeys.THEME, 'dark');
  } else {
    document.body.classList.remove('dark');
    localStorage.setItem(StorageKeys.THEME, 'default');
  }
});
