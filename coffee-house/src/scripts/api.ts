import { BASE_API_URL } from '../resources/consts';

export const fetchData = async <T>(url: string): Promise<T> => {
  const res = await fetch(`${BASE_API_URL}${url}`);

  if (!res.ok) {
    const { isTestError, error } = await res.json();
    if (isTestError) throw new Error(error);
  }

  const { data } = await res.json();

  return data;
};
