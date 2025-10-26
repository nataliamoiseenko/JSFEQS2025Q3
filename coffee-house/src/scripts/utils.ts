import { StorageKeys } from '../resources/consts';

export const validateLogin = (inputEl: HTMLInputElement): void => {
  const regex = /^[a-zA-Z]{3,}$/;
  const input = inputEl.value;
  if (regex.test(input)) {
    inputEl.classList.remove('_error');
  } else {
    inputEl.classList.add('_error');
  }
};

export const validatePassword = (inputEl: HTMLInputElement): void => {
  const regex = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;
  const input = inputEl.value;
  if (regex.test(input)) {
    inputEl.classList.remove('_error');
  } else {
    inputEl.classList.add('_error');
  }
};

export const isTokenSaved = (): boolean => {
  const token = localStorage.getItem(StorageKeys.ACCESS_TOKEN);

  return Boolean(token);
};
