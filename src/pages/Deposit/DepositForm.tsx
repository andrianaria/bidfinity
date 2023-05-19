import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import { createDeposit } from '../../services/DepositService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../contexts/UserContext';
import { formatCurrency } from '../../utils/formatter';

const DepositForm = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Create user object
      const deposit = {
        user_id: user!.id,
        amount: amount,
      };
      const updatedUser = await createDeposit(deposit);
      if (updatedUser) {
        updateUser(updatedUser);
        // Deposit created successfully, refresh the user balance
        // by navigating back to home page
        toast.success(
          `${t('deposit.message.success', {
            amount: formatCurrency(parseFloat(amount), 'USD'),
          })}`,
          {
            position: toast.POSITION.TOP_RIGHT,
          },
        );
        navigate('/home');
      }
    } catch (error) {
      toast.success(`${t('deposit.message.error')}: ${error}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error('Failed to create deposit:', error);
    }
  };

  const handleCancel = () => {
    // handle cancel logic here
    navigate('/home');
  };

  return (
    <div className="container mx-auto my-8">
      <Header />
      <div className="flex justify-center items-center mt-10">
        <div className="w-full border border-gray-300 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-6">{t('deposit.title')}</h2>
          <form onSubmit={handleSave}>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="amount"
              >
                {t('deposit.amountLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  ref={inputRef}
                  className="shadow appearance-none border rounded-l w-full py-2 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="amount"
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={t('deposit.amountPlaceholder') || ''}
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
                type="button"
                onClick={handleCancel}
              >
                {t('common.cancelButton')}
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {t('common.saveButton')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepositForm;
