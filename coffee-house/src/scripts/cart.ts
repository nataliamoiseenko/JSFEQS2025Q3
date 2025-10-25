import { CART_KEY } from '../resources/consts';
import type { ItemToCart } from '../types';

let cartTotalNumber = 0;
const btnListenets: [HTMLButtonElement, () => void][] = [];

const cartList = document.getElementById('cart-list')!;
const cartTotal = document.getElementById('cart-total')!;

const populateCart = (): void => {
  const saved = localStorage.getItem(CART_KEY);
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
    subTitle.innerText = `${item.selectedSize}, ${item.selectedAdditives?.join(', ')}`;
    subTitle.classList.add('cart__text-description');
    const headingDiv = document.createElement('div');
    headingDiv.classList.add('cart__item-text');
    headingDiv.appendChild(title);
    headingDiv.appendChild(subTitle);

    const productDiv = document.createElement('div');
    productDiv.classList.add('cart__item-product-description');
    productDiv.appendChild(imgDiv);
    productDiv.appendChild(headingDiv);

    const price = document.createElement('h3');
    price.innerText = `$${calculateTotalItemPrice(item).toFixed(2)}`;
    price.classList.add('cart__price', 'heading-3');

    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('cart__item-content');
    wrapperDiv.appendChild(productDiv);
    wrapperDiv.appendChild(price);

    const itemId = `${item.id}-${idx}`;
    const trashImg = document.createElement('img');
    trashImg.src = 'src/assets/svg/trash.svg';
    trashImg.alt = 'delete';
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('cart__trash-button');
    deleteBtn.appendChild(trashImg);
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

const calculateTotalItemPrice = (item: ItemToCart): number => {
  let totalPrice = 0;
  const base = Object.values(item.sizes).find((o) => o.size === item.selectedSize);
  if (base) totalPrice += Number(base.price);

  item.selectedAdditives?.forEach((a) => {
    const additive = item.additives.find((i) => i.name === a);
    if (additive) totalPrice += Number(additive.price);
  });

  cartTotalNumber += totalPrice;

  return totalPrice;
};

const removeItem = (itemId: string) => {
  const allLi = document.querySelectorAll('.cart__item');
  allLi.forEach((el) => {
    const elId = el.getAttribute('data-id');
    if (elId === itemId) {
      const price = Number(el.querySelector('.cart__price')?.innerHTML.substring(1));
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        const parsed: ItemToCart[] = JSON.parse(saved);
        const filtered = parsed.filter((i, idx) => `${i.id}-${idx}` !== itemId);
        localStorage.setItem(CART_KEY, JSON.stringify(filtered));
      }

      btnListenets.forEach(([el, handler]: [HTMLButtonElement, () => void]) => {
        const dataId = el.getAttribute('data-id');
        if (dataId === itemId) el.removeEventListener('click', handler);
      });

      el.remove();

      cartTotalNumber -= price;
      cartTotal.innerText = `$${cartTotalNumber.toFixed(2)}`;
    }
  });
};

populateCart();
