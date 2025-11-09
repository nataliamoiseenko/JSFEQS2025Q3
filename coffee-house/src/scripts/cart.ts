import { Endpoints, StorageKeys } from '../resources/consts';
import type { ItemToCart, User } from '../types';
import { fetchData } from './api';
import { isTokenSaved } from './utils';

const isLoggedIn = isTokenSaved();

let cartTotalNumber = 0;
const btnListenets: [HTMLButtonElement, () => void][] = [];

const cartContent = document.getElementById('cart-content')!;
const cartSuccess = document.getElementById('cart-success')!;
const cartList = document.getElementById('cart-list')!;
const cartTotal = document.getElementById('cart-total')!;
const shipping = document.getElementById('cart-shipping')!;
const shippingAddress = document.getElementById('shipping-address')!;
const shippingPay = document.getElementById('shipping-pay')!;
const confirm = document.getElementById('cart-confirm')!;
const actionBtns = document.getElementById('cart-actions')!;
const cartSum = document.getElementById('cart-sum')!;

const loader = document.getElementById('confirm-loader')!;
const error = document.getElementById('confirm-error')!;

if (isLoggedIn) {
  const saved = localStorage.getItem(StorageKeys.USER);
  if (saved) {
    const user: User = JSON.parse(saved);
    shippingAddress.innerText = `${user.city}, ${user.street}, ${user.houseNumber}`;
    shippingPay.innerText = user.paymentMethod;
    shipping.style.display = 'block';
    actionBtns.style.display = 'none';
  }
} else {
  actionBtns.style.display = 'flex';
}

const populateCart = (): void => {
  const saved = localStorage.getItem(StorageKeys.CART);
  if (!saved) return;

  const savedItems: ItemToCart[] = JSON.parse(saved);
  savedItems.forEach((item, idx) => {
    const img = document.createElement('img');
    img.src = item.imgSrc;
    img.alt = item.name;
    img.classList.add('cart__img');
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('cart__img-container');
    imgDiv.appendChild(img);

    const title = document.createElement('h3');
    title.innerText = item.name;
    title.classList.add('cart__text-heading', 'heading-3');
    const subTitle = document.createElement('span');
    subTitle.innerText = `${item.selectedSize}${
      !item.selectedAdditives?.length ? '' : `, ${item.selectedAdditives?.join(', ')}`
    }`;
    subTitle.classList.add('cart__text-description');
    const headingDiv = document.createElement('div');
    headingDiv.classList.add('cart__item-text');
    headingDiv.appendChild(title);
    headingDiv.appendChild(subTitle);

    const productDiv = document.createElement('div');
    productDiv.classList.add('cart__item-product-description');
    productDiv.appendChild(imgDiv);
    productDiv.appendChild(headingDiv);

    const priceWrapper = document.createElement('div');
    priceWrapper.classList.add('cart__prices');
    const price = document.createElement('h3');
    const { totalPrice, totalPriceGuest } = calculateTotalItemPrice(item);
    price.innerText = `$${totalPrice.toFixed(2)}`;
    price.classList.add('cart__price', 'heading-3');
    priceWrapper.appendChild(price);
    if (isLoggedIn) {
      const priceSec = document.createElement('h3');
      priceSec.classList.add('cart__price-sec', 'heading-3');
      priceSec.innerText = `$${totalPriceGuest.toFixed(2)}`;
      priceWrapper.prepend(priceSec);
    }

    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('cart__item-content');
    wrapperDiv.appendChild(productDiv);
    wrapperDiv.appendChild(priceWrapper);

    const itemId = `${item.id}-${idx}`;
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = `
      <svg class="fillCurrent" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9" stroke="#403F3D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21 6H15.375M3 6H8.625M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6H15.375" stroke="#403F3D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    deleteBtn.classList.add('cart__trash-button');
    const deleteHandler = removeItem.bind(null, itemId);
    deleteBtn.addEventListener('click', deleteHandler);
    btnListenets.push([deleteBtn, deleteHandler]);

    const li = document.createElement('li');
    li.classList.add('cart__item');
    li.setAttribute('data-id', itemId);
    li.appendChild(deleteBtn);
    li.appendChild(wrapperDiv);

    cartList.appendChild(li);
  });

  cartTotal.innerText = `$${cartTotalNumber.toFixed(2)}`;
};

const calculateTotalItemPrice = (item: ItemToCart): { totalPrice: number; totalPriceGuest: number } => {
  let totalPrice = 0;
  let totalPriceGuest = 0;
  const base = Object.values(item.sizes).find((o) => o.size === item.selectedSize);
  if (base) {
    totalPrice += Number(isLoggedIn ? base.discountPrice ?? base.price : base.price);
    totalPriceGuest += Number(base.price);
  }

  item.selectedAdditives?.forEach((a) => {
    const additive = item.additives.find((i) => i.name === a);
    if (additive) {
      totalPrice += Number(isLoggedIn ? additive.discountPrice ?? additive.price : additive.price);
      totalPriceGuest += Number(additive.price);
    }
  });

  cartTotalNumber += totalPrice;

  return { totalPrice, totalPriceGuest };
};

const removeItem = (itemId: string) => {
  const allLi = document.querySelectorAll('.cart__item');
  allLi.forEach((el) => {
    const elId = el.getAttribute('data-id');
    if (elId === itemId) {
      const price = Number(el.querySelector('.cart__price')?.innerHTML.substring(1));
      const saved = localStorage.getItem(StorageKeys.CART);
      if (saved) {
        const parsed: ItemToCart[] = JSON.parse(saved);
        const filtered = parsed.filter((i, idx) => `${i.id}-${idx}` !== itemId);
        localStorage.setItem(StorageKeys.CART, JSON.stringify(filtered));
      }

      btnListenets.forEach(([el, handler]: [HTMLButtonElement, () => void]) => {
        const dataId = el.getAttribute('data-id');
        if (dataId === itemId) el.removeEventListener('click', handler);
      });

      el.remove();

      const prevCartSum = cartSum.innerText;
      cartSum.innerText = `${Number(prevCartSum) - 1}`;

      cartTotalNumber -= price;
      cartTotal.innerText = `$${cartTotalNumber.toFixed(2)}`;
    }
  });
};

populateCart();

const placeOrder = async () => {
  loader.style.display = 'flex';
  try {
    const saved = localStorage.getItem(StorageKeys.CART);
    if (!saved) return;

    const savedItems: ItemToCart[] = JSON.parse(saved);
    const payload = {
      items: savedItems.map((i) => ({
        productId: i.id,
        size: i.selectedSize,
        additives: i.selectedAdditives,
        quantity: 1,
      })),
      totalPrice: cartTotalNumber,
    };
    await fetchData(Endpoints.PLACE_ORDER, { method: 'POST' }, JSON.stringify(payload));

    localStorage.setItem(StorageKeys.CART, JSON.stringify([]));
    cartTotalNumber = 0;
    cartSum.innerText = '0';
    cartContent.style.display = 'none';
    cartSuccess.style.display = 'block';
  } catch (err) {
    error.innerText = err as string;
    error.style.display = 'block';
  } finally {
    loader.style.display = 'none';
  }
};

confirm.addEventListener('click', placeOrder);
