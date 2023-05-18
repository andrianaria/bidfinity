import { getApi } from './AxiosApi';

const api = getApi();

export async function createDeposit(deposit: any) {
  try {
    const response = await api.post('/deposit', deposit);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create deposit');
  }
}
