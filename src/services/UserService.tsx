import { getApi } from './AxiosApi';

const api = getApi();

export async function createUser(user: any) {
  const response = await api.post('/signup', user);
  return response.data;
}
