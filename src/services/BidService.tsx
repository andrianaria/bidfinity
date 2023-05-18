import { getApi } from './AxiosApi';

const api = getApi();

export async function createBid(bid: any) {
  const response = await api.post('/bid', bid);
  return response.data;
}
