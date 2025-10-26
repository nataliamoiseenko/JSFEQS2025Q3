import { Endpoints, StorageKeys } from '../resources/consts';
import type { UserRes } from '../types/index.js';
import { fetchData } from './api.js';

const form = document.getElementById('register-form')!;
const login = document.getElementById('login')!;
const password = document.getElementById('password')!;
const passwordConfirm = document.getElementById('password-confirm')!;
const house = document.getElementById('house')!;
const submitError = document.getElementById('register-error')!;

const validateLogin = (): void => {
  const regex = /^[a-zA-Z]{3,}$/;
  const input = (login as HTMLInputElement).value;
  if (regex.test(input)) {
    login.classList.remove('_error');
  } else {
    login.classList.add('_error');
  }
};

const validatePassword = (): void => {
  const regex = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;
  const input = (password as HTMLInputElement).value;
  if (regex.test(input)) {
    password.classList.remove('_error');
  } else {
    password.classList.add('_error');
  }
};

const validatePasswordConfirm = (): void => {
  const input = (password as HTMLInputElement).value;
  const inputConfirm = (passwordConfirm as HTMLInputElement).value;
  if (input === inputConfirm) {
    passwordConfirm.classList.remove('_error');
  } else {
    passwordConfirm.classList.add('_error');
  }
};

const validateHouse = (): void => {
  const input = (house as HTMLInputElement).value;
  if (Number(input) >= 1) {
    house.classList.remove('_error');
  } else {
    house.classList.add('_error');
  }
};

const handleSubmit = async (e: SubmitEvent): Promise<void> => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  const houseNumberInt = Number(formData.get('houseNumber'));
  const payload = { ...Object.fromEntries(formData), houseNumber: houseNumberInt };

  try {
    submitError.style.display = 'none';
    const { access_token } = await fetchData<UserRes>(Endpoints.REGISTER, { method: 'POST' }, JSON.stringify(payload));
    localStorage.setItem(StorageKeys.ACCESS_TOKEN, access_token);
    window.location.replace('/menu');
  } catch (err) {
    submitError.innerText = err as string;
    submitError.style.display = 'block';
  }
};

login.addEventListener('blur', validateLogin);
login.addEventListener('focus', () => login.classList.remove('_error'));
password.addEventListener('blur', validatePassword);
password.addEventListener('focus', () => password.classList.remove('_error'));
passwordConfirm.addEventListener('blur', validatePasswordConfirm);
passwordConfirm.addEventListener('focus', () => passwordConfirm.classList.remove('_error'));
house.addEventListener('blur', validateHouse);
house.addEventListener('focus', () => house.classList.remove('_error'));
form.addEventListener('submit', handleSubmit);
