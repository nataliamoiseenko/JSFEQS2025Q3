import { BASE_API_URL } from '../resources/consts';

export const fetchData = async <T>(
  url: string,
  options?: Partial<RequestInit>,
  payload?: BodyInit | null
): Promise<T> => {
  const res = await fetch(`${BASE_API_URL}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json' },
    ...(payload && { body: payload }),
  });

  if (!res.ok) {
    const { error } = (await res.json()) || {};
    throw new Error(error);
  }

  const { data } = await res.json();

  return data;
};
