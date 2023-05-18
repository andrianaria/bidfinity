export type BidHistory = {
  id: number;
  user_id: number;
  bid_price: number;
  item_id: number;
  User: {
    name: string;
  };
  created_at: string;
  updated_at: string;
};
