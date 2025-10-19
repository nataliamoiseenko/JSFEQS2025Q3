import type { Slides } from '../types';

const SLIDES: Slides[] = [
  {
    imgSrc: 'assets/images/coffee-slider-1.png',
    title: "S'mores Frappuccino",
    subtitle:
      'This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.',
    price: '5.50',
  },
  {
    imgSrc: 'assets/images/coffee-slider-2.png',
    title: 'Caramel Macchiato',
    subtitle:
      'Fragrant and unique classic espresso with rich caramel-peanut syrup, with cream under whipped thick foam.',
    price: '5.00',
  },
  {
    imgSrc: 'assets/images/coffee-slider-3.png',
    title: 'Ice coffee',
    subtitle: 'A popular summer drink that tones and invigorates. Prepared from coffee, milk and ice.',
    price: '4.50',
  },
];

let currentIdx = 0;
const carousel = document.getElementById('carousel')!;
const controls = document.getElementById('controls')!;
const btnPrev = document.getElementById('carousel-prev')!;
const btnNext = document.getElementById('carousel-next')!;
const carouselContent = document.getElementById('favourites__carousel-content')!;

const createSlide = (idx: number): void => {
  const img = document.createElement('img');
  const currentSlide = SLIDES[idx];
  if (!currentSlide) return;

  img.src = currentSlide.imgSrc;
  img.alt = currentSlide.title;
  img.classList.add('favourites__img');

  const heading = document.createElement('h3');
  heading.innerText = currentSlide.title;
  heading.classList.add('heading-3');

  const subtitle = document.createElement('p');
  subtitle.innerText = currentSlide.subtitle;
  subtitle.classList.add('favourites__carousel-subtitle', 'body-medium');

  const price = document.createElement('h3');
  price.innerText = `$${currentSlide.price}`;
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

SLIDES.forEach((_, i) => createSlide(i));

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
