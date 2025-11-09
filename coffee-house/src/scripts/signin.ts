import { Endpoints, StorageKeys } from '../resources/consts';
import type { UserRes } from '../types';
import { fetchData } from './api';

const form = document.getElementById('signin-form')!;
const login = document.getElementById('login')!;
const password = document.getElementById('password')!;
const submitError = document.getElementById('signin-error')!;

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

const handleSubmit = async (e: SubmitEvent): Promise<void> => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);

  try {
    submitError.style.display = 'none';
    const { access_token, user } = await fetchData<UserRes>(
      Endpoints.LOGIN,
      { method: 'POST' },
      JSON.stringify(Object.fromEntries(formData))
    );
    localStorage.setItem(StorageKeys.ACCESS_TOKEN, access_token);
    localStorage.setItem(StorageKeys.USER, JSON.stringify(user));
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
form.addEventListener('submit', handleSubmit);
