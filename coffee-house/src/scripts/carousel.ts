import { Endpoints } from '../resources/consts';
import { FAVORITES } from '../resources/products';
import type { Favorite, FavoriteRes } from '../types';
import { fetchData } from './api';

// const SLIDES: Slides[] = [
//   {
//     imgSrc: 'src/assets/images/coffee-slider-1.png',
//     title: "S'mores Frappuccino",
//     subtitle:
//       'This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.',
//     price: '5.50',
//   },
//   {
//     imgSrc: 'src/assets/images/coffee-slider-2.png',
//     title: 'Caramel Macchiato',
//     subtitle:
//       'Fragrant and unique classic espresso with rich caramel-peanut syrup, with cream under whipped thick foam.',
//     price: '5.00',
//   },
//   {
//     imgSrc: 'src/assets/images/coffee-slider-3.png',
//     title: 'Ice coffee',
//     subtitle: 'A popular summer drink that tones and invigorates. Prepared from coffee, milk and ice.',
//     price: '4.50',
//   },
// ];

let currentIdx = 0;
const carousel = document.getElementById('carousel')!;
const controls = document.getElementById('controls')!;
const loader = document.getElementById('carousel-loading')!;
const error = document.getElementById('carousel-error')!;
const btnPrev = document.getElementById('carousel-prev')!;
const btnNext = document.getElementById('carousel-next')!;
const carouselContent = document.getElementById('carousel-content')!;

const createSlide = (item: Favorite, idx: number): void => {
  const img = document.createElement('img');

  img.src = item.imgSrc;
  img.alt = item.name;
  img.classList.add('favourites__img');

  const heading = document.createElement('h3');
  heading.innerText = item.name;
  heading.classList.add('heading-3');

  const subtitle = document.createElement('p');
  subtitle.innerText = item.description;
  subtitle.classList.add('favourites__carousel-subtitle', 'body-medium');

  const price = document.createElement('h3');
  price.innerText = `$${item.price}`;
  price.classList.add('favourites__carousel-price', 'heading-3');

  const captionDiv = document.createElement('div');
  captionDiv.classList.add('favourites__carousel-caption');
  captionDiv.appendChild(heading);
  captionDiv.appendChild(subtitle);
  captionDiv.appendChild(price);

  const carouselItem = document.createElement('div');
  carouselItem.classList.add('favourites__carousel-item');

  carouselItem.appendChild(img);
  carouselItem.appendChild(captionDiv);
  if (idx === currentIdx) carouselItem.classList.add('_active');

  carousel.appendChild(carouselItem);

  const control = document.createElement('button');
  control.classList.add('favourites__carousel-control');
  control.addEventListener('click', changeCurent.bind(null, idx));
  if (idx === currentIdx) control.classList.add('_active');

  controls.appendChild(control);
};

const changeCurent = (idx: number): void => {
  const slides = document.getElementsByClassName('favourites__carousel-item');
  const controls = document.getElementsByClassName('favourites__carousel-control');
  if (idx >= slides.length) {
    idx = idx % slides.length;
  } else if (idx < 0) {
    idx = slides.length + idx;
  }

  for (let i = 0; i < slides.length; i++) {
    if (idx === i) {
      slides[i]!.classList.add('_active');
      controls[i]!.classList.add('_active');
    } else {
      slides[i]!.classList.remove('_active');
      controls[i]!.classList.remove('_active');
    }
  }

  currentIdx = idx;
};

const initFavourites = async (): Promise<void> => {
  try {
    const favs = await fetchData<FavoriteRes[]>(Endpoints.FAVOURITES);
    const favsWithImg: Favorite[] = favs.map((i) => {
      const img = FAVORITES.find((k) => k.id === i.id)?.imgSrc ?? '';
      return { ...i, imgSrc: img };
    });

    favsWithImg.forEach((item, idx) => createSlide(item, idx));
    carouselContent.style.display = 'flex';
  } catch {
    error.style.display = 'flex';
  } finally {
    loader.style.display = 'none';
  }
};

initFavourites();

let autoNext = setInterval(() => changeCurent(currentIdx + 1), 3000);

btnPrev.addEventListener('click', () => changeCurent(currentIdx - 1));
btnNext.addEventListener('click', () => changeCurent(currentIdx + 1));
carouselContent.addEventListener('mouseenter', () => {
  clearInterval(autoNext);
  autoNext = null!;
});
carouselContent.addEventListener('mouseleave', () => {
  autoNext ??= setInterval(() => changeCurent(currentIdx + 1), 3000);
});
