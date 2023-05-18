import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../../services/ItemsService';
import { toast } from 'react-toastify';
import { UserContext } from '../../contexts/UserContext';

const ItemForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [itemName, setItemName] = useState('');
  const [startPrice, setStartPrice] = useState('');
  const [timeWindowHours, setTimeWindowHours] = useState('');
  const [timeWindowMinutes, setTimeWindowMinutes] = useState('');
  const [timeWindowSeconds, setTimeWindowSeconds] = useState('');

  const { user } = useContext(UserContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCancel = () => {
    // handle cancel logic here
    navigate('/home');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert time window to seconds
    const timeWindow =
      Number(timeWindowHours) * 3600 +
      Number(timeWindowMinutes) * 60 +
      Number(timeWindowSeconds);

    // Create item object
    const newItem = {
      name: itemName,
      start_price: startPrice,
      time_window: timeWindow,
      created_by: user!.id,
    };

    try {
      // Call the createItem function from your backend service
      const item = await createItem(newItem);

      if (item) {
        toast.success(
          `${t('createNewItem.message.createSuccess', { name: item.name })}`,
          {
            position: toast.POSITION.TOP_RIGHT,
          },
        );
        // Redirect to home page or show success message
        navigate('/home');
      } else {
        toast.error(`${t('createNewItem.message.createError')}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error(`${t('createNewItem.message.createError')}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto my-8 w-full">
      <Header />
      <div className="flex justify-center items-center mt-10">
        <div className="w-full border border-gray-300 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-6">{t('createNewItem.title')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="itemName"
              >
                {t('createNewItem.itemNameLabel')}
              </label>
              <input
                ref={inputRef}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="itemName"
                type="text"
                required
                placeholder={t('createNewItem.itemNamePlaceholder') || ''}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="startPrice"
              >
                {t('createNewItem.startPriceLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  className="shadow appearance-none border rounded-l w-full py-2 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="startPrice"
                  type="number"
                  required
                  placeholder={t('createNewItem.startPricePlaceholder') || ''}
                  value={startPrice}
                  onChange={(e) => setStartPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="timeWindow"
              >
                {t('createNewItem.timeWindowLabel')}
              </label>
              <div className="flex">
                <input
                  className="shadow appearance-none border rounded-l w-1/3 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="timeWindowHours"
                  type="number"
                  required
                  min="1"
                  placeholder={
                    t('createNewItem.timeWindowHoursPlaceholder') || ''
                  }
                  value={timeWindowHours}
                  onChange={(e) => setTimeWindowHours(e.target.value)}
                />
                <input
                  className="shadow appearance-none border w-1/3 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="timeWindowMinutes"
                  type="number"
                  min="0"
                  placeholder={
                    t('createNewItem.timeWindowMinutesPlaceholder') || ''
                  }
                  value={timeWindowMinutes}
                  onChange={(e) => setTimeWindowMinutes(e.target.value)}
                />
                <input
                  className="shadow appearance-none border rounded-r w-1/3 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="timeWindowSeconds"
                  type="number"
                  min="0"
                  placeholder={
                    t('createNewItem.timeWindowSecondsPlaceholder') || ''
                  }
                  value={timeWindowSeconds}
                  onChange={(e) => setTimeWindowSeconds(e.target.value)}
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

export default ItemForm;
