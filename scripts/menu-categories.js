import { MENU } from '../resources/products.js';

const ulGrid = document.getElementsByClassName('menu__grid')[0];
const radioBtns = document.querySelectorAll('input[name="menu-tab-btn"]');
const refreshBtn = document.getElementById('refresh-btn');

const createCardLi = (params) => {
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
  btn.appendChild(imgContainer);
  btn.appendChild(descContainer);

  const li = document.createElement('li');
  li.classList.add('menu__preview-item');
  li.appendChild(btn);

  return li;
};

const doFilter = () => {
  ulGrid.replaceChildren();

  for (let i = 0; i < radioBtns.length; i++) {
    const isChecked = radioBtns[i].checked;

    if (isChecked) {
      const value = radioBtns[i].value;

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
    li.style.display = 'block';
    refreshBtn.classList.remove('_active');
  });
});
