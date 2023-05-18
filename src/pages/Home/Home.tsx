import React, { useState, useEffect, useContext } from 'react';
import Header from '../Header';

import Table from '../../components/Table';
import { useTranslation } from 'react-i18next';

import BidModal from './BidModal';
import {
  getCompletedItems,
  getDraftItems,
  getOngoingItems,
  publishItem,
} from '../../services/ItemsService';
import { formatCurrency, formatTime } from '../../utils/formatter';
import { UserContext } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function Home() {
  type Item = {
    name: string;
    start_price: number;
    time_window: number;
    last_bid: number;
  };
  const { t } = useTranslation();
  const [tab, setTab] = useState('ongoing');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [items, setItems] = useState([]);

  const { user } = useContext(UserContext);

  const handleBid = (item: any) => {
    setIsModalOpen(true);
    setSelectedItem(item);
  };

  const handlePublish = async (itemId: number) => {
    const data = await publishItem(itemId);
    if (data) {
      fetchItems();
      toast.success(`${t('home.message.publishSuccess')}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.success(`${t('home.message.publishError')}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const fetchItems = async () => {
    let data;
    if (tab === 'draft') {
      data = await getDraftItems(user);
    } else if (tab === 'ongoing') {
      data = await getOngoingItems();
    } else if (tab === 'completed') {
      data = await getCompletedItems();
    }

    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, [tab]);

  return (
    <div className="container mx-auto my-8">
      <Header />
      <div className="my-4">
        <button
          className={`py-2 px-6 mr-4 rounded-lg focus:outline-none ${
            tab === 'draft'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-300 text-gray-800'
          }`}
          onClick={() => setTab('draft')}
        >
          {t('home.tabs.draft')}
        </button>
        <button
          className={`py-2 px-6 mr-4 rounded-lg focus:outline-none ${
            tab === 'ongoing'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-300 text-gray-800'
          }`}
          onClick={() => setTab('ongoing')}
        >
          {t('home.tabs.ongoing')}
        </button>
        <button
          className={`py-2 px-6 rounded-lg focus:outline-none ${
            tab === 'completed'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-300 text-gray-800'
          }`}
          onClick={() => setTab('completed')}
        >
          {t('home.tabs.completed')}
        </button>
      </div>
      <Table
        columns={[
          {
            Header: t('home.table.name'),
            accessor: 'name',
            Cell: ({ row, value }: { row: any; value: any }) => {
              if (tab === 'draft') {
                return <span>{value}</span>;
              } else {
                return (
                  <Link
                    to={`/bid-history?itemId=${row.original.id}`}
                    className="text-blue-600"
                  >
                    {value}
                  </Link>
                );
              }
            },
          },
          {
            Header: t('home.table.currentPrice'),
            accessor: 'currentPrice',
            Cell: ({ row }: { row: any }) => (
              <span>
                {formatCurrency(
                  Math.max(row.original.last_bid, row.original.start_price),
                  'USD',
                )}
              </span>
            ),
          },
          {
            Header: t('home.table.duration'),
            accessor: 'time_window',
            Cell: ({ value }: { value: number }) => (
              <span>{formatTime(value)}</span>
            ),
          },
          {
            Header: t('home.table.bid'),
            accessor: 'bid',
            Cell: ({ row }: { row: any }) => {
              if (tab === 'draft') {
                return (
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={() => handlePublish(row.original.id)}
                  >
                    {t('home.table.publish')}
                  </button>
                );
              } else if (tab === 'ongoing') {
                return (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={() => handleBid(row.original)}
                  >
                    {t('home.table.bid')}
                  </button>
                );
              } else if (tab === 'completed') {
                return (
                  <div className="bg-green-800 rounded-lg inline-block px-4">
                    <span className="text-white">
                      {t('home.table.completed')}
                    </span>
                  </div>
                );
              }
              return null;
            },
          },
        ]}
        data={items}
      />

      {isModalOpen && (
        <BidModal
          item={selectedItem}
          lastBid={Math.max(
            selectedItem?.last_bid || 0,
            selectedItem?.start_price || 0,
          )}
          showModal={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          fetchItems={fetchItems}
        />
      )}
    </div>
  );
}
