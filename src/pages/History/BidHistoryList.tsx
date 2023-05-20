import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Table from '../../components/Table';
import { BidHistory } from '../../model/BidHistory';
import { Item } from '../../model/Item';
import { getItemHistory } from '../../services/ItemsService';
import { formatCurrency, formatDateTime } from '../../utils/formatter';
import Header from '../Header';
import BidModal from '../Home/BidModal';

const BidHistoryList = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const itemId = searchParams.get('itemId');
  const [bidItem, setBidItem] = useState<Item | null>(null);
  const [bidHistoryItems, setBidHistoryItems] = useState<[BidHistory] | []>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item>();

  const fetchHistory = async () => {
    if (itemId) {
      const data = await getItemHistory(itemId);
      const { item, bidHistory } = data;
      setBidItem(item);
      setBidHistoryItems(bidHistory);
    }
  };

  const handleBid = (item: any) => {
    setIsModalOpen(true);
    setSelectedItem(item);
  };

  function getStatus() {
    let status = 'completed';
    if (bidItem && bidItem?.time_window > 0 && bidItem?.is_published) {
      status = 'ongoing';
    }
    return status;
  }

  useEffect(() => {
    fetchHistory();
  }, [itemId]);

  return (
    <div className="container mx-auto my-8 w-full">
      <Header />
      <div className="flex justify-center items-center mt-10">
        <div className="w-full border border-gray-300 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-6">
            {t('bidHistoryPage.title')}
          </h2>
          {bidItem && (
            <div className="flex justify-between px-4 py-2 mb-4">
              <div className="flex flex-col">
                <div className="font-bold text-gray-600 mb-2">
                  {t('bidHistoryPage.itemName', { item: bidItem!.name || '' })}
                </div>
                <div className="font-bold text-gray-600 mb-2">
                  {t('bidHistoryPage.lastPrice', {
                    price: formatCurrency(
                      Math.max(bidItem.last_bid, bidItem.start_price),
                      'USD',
                    ),
                  })}
                </div>
                {getStatus() === 'completed' && bidHistoryItems.length > 0 && (
                  <div className="font-bold text-gray-600 mb-2">
                    {t('bidHistoryPage.winningBid', {
                      winner: bidHistoryItems[0]?.User?.name,
                      amount: formatCurrency(bidItem.last_bid, 'USD'),
                    })}
                  </div>
                )}
                {getStatus() === 'ongoing' && (
                  <div>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleBid(bidItem)}
                    >
                      {t('common.bidButton')}
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end mb-20">
                <div
                  className={`bg-${
                    getStatus() === 'ongoing' ? 'orange-800' : 'green-800'
                  } rounded-lg inline-block px-4`}
                >
                  <span className="text-white">
                    {t(`bidHistoryPage.status.${getStatus()}`)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div>
            <Table
              columns={[
                {
                  Header: t('bidHistoryPage.date'),
                  accessor: 'created_at',
                  Cell: ({ value }: { value: string }) => (
                    <span>{formatDateTime(value)}</span>
                  ),
                },
                {
                  Header: t('bidHistoryPage.user'),
                  accessor: 'user_id',
                  Cell: ({ row }: { row: any }) => (
                    <span>{row.original.User.name}</span>
                  ),
                },
                {
                  Header: t('bidHistoryPage.bidAmount'),
                  accessor: 'bid_price',
                  Cell: ({ value }: { value: number }) => (
                    <span>{formatCurrency(value, 'USD')}</span>
                  ),
                },
              ]}
              data={bidHistoryItems}
            />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <BidModal
          item={selectedItem}
          lastBid={Math.max(
            selectedItem?.last_bid || 0,
            selectedItem?.start_price || 0,
          )}
          showModal={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          fetchItems={fetchHistory}
        />
      )}
    </div>
  );
};

export default BidHistoryList;
