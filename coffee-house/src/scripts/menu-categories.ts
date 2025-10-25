import { Endpoints } from '../resources/consts.js';
import { MOCKED_MENU } from '../resources/products.js';
import type { ItemRes, MenuItem, MenuItemDetails } from '../types/index.js';
import { fetchData } from './api.js';

const menuTotal: MenuItem[] = [];

const menuContent = document.getElementById('menu-content')!;
const ulGrid = document.getElementsByClassName('menu__grid')[0]!;
const radioBtns = document.querySelectorAll('input[name="menu-tab-btn"]')!;
const refreshBtn = document.getElementById('refresh-btn')!;
const loader = document.getElementById('carousel-loading')!;
const error = document.getElementById('carousel-error')!;

const modal = document.getElementById('modal')!;
const modalBg = document.getElementById('modal-bg')!;
const modalContent = document.getElementById('modal-content')!;
const modalLoader = document.getElementById('modal-loader')!;
const modalImg = document.getElementById('modal-img')!;
const modalTitle = document.getElementById('modal-title')!;
const modalDesc = document.getElementById('modal-desc')!;
const modalSizes = document.getElementById('modal-sizes')!;
const modalAdds = document.getElementById('modal-adds')!;
const modalPrice = document.getElementById('modal-price')!;
const modalCloseBtn = document.getElementById('modal-close')!;
const modalError = document.getElementById('modal-error')!;

const addToCartBtn = document.getElementById('add-to-cart')!;

const createCardLi = (params: MenuItem): HTMLLIElement => {
  const img = document.createElement('img');
  img.classList.add('menu__img');
  img.src = params.imgSrc;
  img.alt = `${params.name} image`;

  const imgContainer = document.createElement('div');
  imgContainer.classList.add('menu__img-container');
  imgContainer.appendChild(img);

  const heading = document.createElement('h3');
  heading.classList.add('menu__preview-item-heading', 'heading-3');
  heading.innerText = params.name;
  const desc = document.createElement('p');
  desc.classList.add('menu__preview-item-subtitle', 'body-medium');
  desc.innerText = params.description;
  const price = document.createElement('h3');
  price.classList.add('menu__preview-item-price', 'heading-3');
  price.innerText = `$${params.price}`;

  const descContainer = document.createElement('div');
  descContainer.classList.add('menu__preview-item-description');
  descContainer.appendChild(heading);
  descContainer.appendChild(desc);
  descContainer.appendChild(price);

  const btn = document.createElement('button');
  btn.classList.add('menu__preview-item-link');
  btn.addEventListener('click', toggleModal.bind(null, params, true));
  btn.appendChild(imgContainer);
  btn.appendChild(descContainer);

  const li = document.createElement('li');
  li.classList.add('menu__preview-item');
  li.appendChild(btn);

  return li;
};

const toggleModal = async (params: MenuItem | null, isOpen = true): Promise<void> => {
  if (isOpen) {
    document.body.classList.add('no-scroll');
    modal.classList.add('_active');
    modalLoader.style.display = 'flex';
    modalError.style.display = 'none';
  } else {
    document.body.classList.remove('no-scroll');
    modal.classList.remove('_active');
    modalContent.style.display = 'none';
  }

  if (params) {
    try {
      const response = await fetchData<Omit<MenuItemDetails, 'imgSrc'>>(`${Endpoints.PRODUCTS}/${params.id}`);
      const found = menuTotal.find(({ id }) => id === params.id);
      if (!found) throw new Error();

      const itemDetails: MenuItemDetails = {
        ...response,
        imgSrc: found.imgSrc,
      };

      (modalImg as HTMLImageElement).src = itemDetails.imgSrc;
      (modalImg as HTMLImageElement).alt = `${itemDetails.name} image`;

      modalTitle.innerText = itemDetails.name;
      modalDesc.innerText = itemDetails.description;

      modalSizes.replaceChildren();
      Object.entries(itemDetails.sizes).forEach(([key, value], i) => {
        const label = document.createElement('label');
        label.classList.add('modal__option-container', 'button-link');
        label.title = value.size;
        label.htmlFor = value.size;

        const input = document.createElement('input');
        input.type = 'radio';
        input.id = value.size;
        input.name = 'size';
        input.value = value.price;
        if (i === 0) input.checked = true;
        input.addEventListener('change', calculatePrice.bind(null, itemDetails.price));

        const span1 = document.createElement('span');
        span1.classList.add('modal__option-label');
        span1.innerText = `${key}`.toUpperCase();

        const span2 = document.createElement('span');
        span2.innerText = value.size;

        label.appendChild(input);
        label.appendChild(span1);
        label.appendChild(span2);

        modalSizes.appendChild(label);
      });

      modalAdds.replaceChildren();
      itemDetails.additives.forEach((a, i) => {
        const label = document.createElement('label');
        label.classList.add('modal__option-container', 'button-link');
        label.title = a.price;
        label.htmlFor = a.name;

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = a.name;
        input.name = 'additives';
        input.value = a.price;
        input.addEventListener('change', calculatePrice.bind(null, itemDetails.price));

        const span1 = document.createElement('span');
        span1.classList.add('modal__option-label');
        span1.innerText = `${i + 1}`;

        const span2 = document.createElement('span');
        span2.innerText = a.name;

        label.appendChild(input);
        label.appendChild(span1);
        label.appendChild(span2);

        modalAdds.appendChild(label);
      });

      calculatePrice(itemDetails.price);
      modalContent.style.display = 'block';
    } catch {
      modalError.style.display = 'flex';
      document.body.classList.remove('no-scroll');
      modal.classList.remove('_active');
      modalContent.style.display = 'none';
    } finally {
      modalLoader.style.display = 'none';
    }
  }
};

const calculatePrice = (basePrice: string): void => {
  let totalPrice = Number(basePrice);
  modalSizes.querySelectorAll('input[name="size"]').forEach((i) => {
    if ((i as HTMLInputElement).checked) totalPrice = Number((i as HTMLInputElement).value);
  });
  modalAdds.querySelectorAll('input[name="additives"]').forEach((i) => {
    if ((i as HTMLInputElement).checked) totalPrice += Number((i as HTMLInputElement).value);
  });

  modalPrice.innerText = `$${totalPrice.toFixed(2)}`;
};

const doFilter = (): void => {
  ulGrid.replaceChildren();

  for (let i = 0; i < radioBtns.length; i++) {
    const isChecked = (radioBtns[i] as HTMLInputElement).checked;

    if (isChecked) {
      const value = (radioBtns[i] as HTMLInputElement).value;

      const filtered = menuTotal.filter((i) => value === i.category).map((i) => createCardLi(i));
      filtered.forEach((li) => ulGrid.appendChild(li));

      if (window.screen.width < 1440) {
        if (filtered.length > 4) {
          refreshBtn.classList.add('_active');
        } else {
          refreshBtn.classList.remove('_active');
        }
      }

      break;
    }
  }
};

const initMenu = async (): Promise<void> => {
  try {
    const products = await fetchData<ItemRes[]>(Endpoints.PRODUCTS);
    products.forEach((i) => {
      const found = MOCKED_MENU.find((k) => k.id === i.id)!;
      menuTotal.push({ ...i, ...found });
    });

    doFilter();
    menuContent.style.display = 'flex';
  } catch {
    error.style.display = 'flex';
  } finally {
    loader.style.display = 'none';
  }
};

// doFilter();
initMenu();

radioBtns.forEach((btn) => btn.addEventListener('change', doFilter));
refreshBtn.addEventListener('click', () => {
  const gridLi = document.querySelectorAll('.menu__preview-item');
  gridLi.forEach((li) => {
    (li as HTMLElement).style.display = 'block';
    refreshBtn.classList.remove('_active');
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  toggleModal(null, false);
});

modalBg.addEventListener('click', toggleModal.bind(null, null, false));
modalCloseBtn.addEventListener('click', toggleModal.bind(null, null, false));

addToCartBtn.addEventListener('click', toggleModal.bind(null, null, false));
