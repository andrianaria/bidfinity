import { User } from '../model/User';
import { getApi } from './AxiosApi';

const api = getApi();
export const getOngoingItems = async () => {
  const response = await api.get('/items/ongoing');
  return response.data;
};

export const getCompletedItems = async () => {
  const response = await api.get('/items/completed');
  return response.data;
};

export const getDraftItems = async (user: User | null) => {
  try {
    if (!user) throw new Error('User is null');
    const response = await api.get('/items/draft', {
      params: {
        userId: user.id,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    // Handle error
  }
};

export const getItemHistory = async (itemId: string) => {
  const response = await api.get(`/items/${itemId}/history`);
  return response.data;
};

export async function createItem(item: any) {
  try {
    const response = await api.post('/items', item);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create item');
  }
}

export async function publishItem(itemId: number) {
  try {
    const response = await api.post(`/items/${itemId}/publish`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create item');
  }
}
