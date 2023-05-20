import React, { useContext, useEffect, useRef, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { UserContext } from '../../contexts/UserContext';
import { createBid } from '../../services/BidService';
import { formatCurrency } from '../../utils/formatter';

interface BidModalProps {
  item: any;
  lastBid: number;
  showModal: boolean;
  closeModal: () => void;
  fetchItems: () => void;
}

export default function BidModal({
  item,
  lastBid,
  showModal,
  closeModal,
  fetchItems,
}: BidModalProps) {
  const { t } = useTranslation();
  const [bidAmount, setBidAmount] = useState('');
  const [currentPrice, setCurrentPrice] = useState(lastBid || 0);

  const { user, updateUser } = useContext(UserContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal]);

  const handleBid = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!parseFloat(bidAmount) || parseFloat(bidAmount) <= lastBid) {
      toast.error(
        `${t('bid.message.mustBeGreaterThan', {
          lastBid: formatCurrency(lastBid, 'USD'),
        })}`,
        {
          position: toast.POSITION.TOP_RIGHT,
        },
      );
    } else {
      const confirmationMessage = `${t('bid.confirmationMessage', {
        amount: formatCurrency(parseFloat(bidAmount), 'USD'),
      })}`;

      confirmAlert({
        title: '',
        message: confirmationMessage,
        buttons: [
          {
            label: t('common.yesButton'),
            onClick: async () => {
              try {
                // Create bid object
                const bid = {
                  user_id: user!.id,
                  bid_price: bidAmount,
                  item_id: item.id,
                };
                const updatedUserBalance = await createBid(bid);
                if (updatedUserBalance) {
                  updateUser(updatedUserBalance);
                  toast.success(
                    `${t('bid.message.success', {
                      item: item.name,
                      amount: formatCurrency(parseFloat(bidAmount), 'USD'),
                    })}`,
                    {
                      position: toast.POSITION.TOP_RIGHT,
                    },
                  );
                  fetchItems();
                  setCurrentPrice(parseFloat(bidAmount));
                }
              } catch (error: any) {
                if (
                  error.response &&
                  error.response.data &&
                  error.response.data.message
                ) {
                  // Error response with a message from the server
                  toast.error(error.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                  });
                } else {
                  // Other error occurred
                  toast.error(`${t('bid.message.error', { error })}`, {
                    position: toast.POSITION.TOP_RIGHT,
                  });
                }
                console.error('Failed to create bid:', error);
              }
            },
          },
          {
            label: t('common.noButton'),
            onClick: () => {
              // Handle cancellation or display a message
            },
          },
        ],
      });
    }
  };

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setBidAmount(event.target.value);
  }

  return (
    <div
      className={`${
        showModal
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } fixed inset-0 z-50 flex items-center justify-center`}
    >
      <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
      <div className="bg-white rounded-lg p-6 z-10">
        <h2 className="text-lg font-semibold mb-4">
          {t('bid.bidForItem', { item: item.name })}
        </h2>
        <p className="mb-4">
          {t('bid.bidAmountMustBeGreater', {
            lastBid: formatCurrency(currentPrice, 'USD'),
          })}
        </p>
        <form onSubmit={handleBid}>
          <div className="mb-4">
            <input
              ref={inputRef}
              type="number"
              required
              placeholder={t('bid.enterBidAmount') || ''}
              value={bidAmount}
              onChange={handleChange}
              className="border border-gray-400 rounded-lg py-2 px-4 w-full"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  closeModal();
                } else if (e.key === 'Enter') {
                  handleBid(e);
                }
              }}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="bg-gray-300 rounded-lg py-2 px-4 mr-2"
              onClick={closeModal}
            >
              {t('common.cancelButton')}
            </button>
            <button
              className="bg-blue-600 text-white rounded-lg py-2 px-4"
              type="submit"
            >
              {t('common.bidButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
