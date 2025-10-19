import { MENU } from '../resources/products.js';
import type { MenuItem } from '../types';

const ulGrid = document.getElementsByClassName('menu__grid')[0]!;
const radioBtns = document.querySelectorAll('input[name="menu-tab-btn"]')!;
const refreshBtn = document.getElementById('refresh-btn')!;

const modal = document.getElementById('modal')!;
const modalBg = document.getElementById('modal-bg')!;
const modalImg = document.getElementById('modal-img')!;
const modalTitle = document.getElementById('modal-title')!;
const modalDesc = document.getElementById('modal-desc')!;
const modalSizes = document.getElementById('modal-sizes')!;
const modalAdds = document.getElementById('modal-adds')!;
const modalPrice = document.getElementById('modal-price')!;
const modalCloseBtn = document.getElementById('modal-close')!;

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

const toggleModal = (params: MenuItem | null, isOpen = true): void => {
  if (params) {
    (modalImg as HTMLImageElement).src = params.imgSrc;
    (modalImg as HTMLImageElement).alt = `${params.name} image`;

    modalTitle.innerText = params.name;
    modalDesc.innerText = params.description;

    modalSizes.replaceChildren();
    Object.entries(params.sizes).forEach(([key, value], i) => {
      const label = document.createElement('label');
      label.classList.add('modal__option-container', 'button-link');
      label.htmlFor = value.size;

      const input = document.createElement('input');
      input.type = 'radio';
      input.id = value.size;
      input.name = 'size';
      input.value = value['add-price'];
      if (i === 0) input.checked = true;
      input.addEventListener('change', calculatePrice.bind(null, params.price));

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
    params.additives.forEach((a, i) => {
      const label = document.createElement('label');
      label.classList.add('modal__option-container', 'button-link');
      label.htmlFor = a.name;

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = a.name;
      input.name = 'additives';
      input.value = a['add-price'];
      input.addEventListener('change', calculatePrice.bind(null, params.price));

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

    calculatePrice(params.price);
  }

  isOpen ? modal.classList.add('_active') : modal.classList.remove('_active');
  isOpen ? document.body.classList.add('no-scroll') : document.body.classList.remove('no-scroll');
};

const calculatePrice = (basePrice: string): void => {
  let totalPrice = Number(basePrice);
  modalSizes.querySelectorAll('input[name="size"]').forEach((i) => {
    if ((i as HTMLInputElement).checked) totalPrice += Number((i as HTMLInputElement).value);
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

      const filtered = MENU.filter((i) => value === i.category).map((i) => createCardLi(i));
      filtered.forEach((li) => ulGrid.appendChild(li));

      if (window.screen.width < 1440) {
        filtered.length > 4 ? refreshBtn.classList.add('_active') : refreshBtn.classList.remove('_active');
      }

      break;
    }
  }
};

doFilter();

radioBtns.forEach((btn) => btn.addEventListener('change', doFilter));
refreshBtn.addEventListener('click', () => {
  const gridLi = document.querySelectorAll('.menu__preview-item');
  gridLi.forEach((li) => {
    (li as HTMLElement).style.display = 'block';
    refreshBtn.classList.remove('_active');
  });
});

modalBg.addEventListener('click', toggleModal.bind(null, null, false));
modalCloseBtn.addEventListener('click', toggleModal.bind(null, null, false));
