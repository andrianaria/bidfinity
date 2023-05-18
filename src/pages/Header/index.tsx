import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Logo from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatter';
import { UserContext } from '../../contexts/UserContext';

function LogoHeader() {
  return (
    <div className="flex items-center">
      <Link to="/">
        <img src={Logo} alt="Bidfinity" className="w-40 mr-2" />
      </Link>
    </div>
  );
}

function Balance() {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const [balance, setBalance] = useState(user?.balance || 0);

  useEffect(() => {
    setBalance(user?.balance || 0);
  }, [user]);

  const formattedBalance = formatCurrency(balance, 'USD');
  return (
    <div>
      {user && (
        <div className="text-lg pr-8">
          {t('home.balance', { balance: formattedBalance })}
        </div>
      )}
    </div>
  );
}

function Profile() {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleBlur = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Clear the user data from local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    navigate('/');
  };

  return (
    <div className="flex items-center">
      <div className="relative">
        <FaUserCircle
          className="text-gray-500 cursor-pointer"
          onClick={handleClick}
          onBlur={handleBlur}
        />
        {isOpen && (
          <div className="absolute right-0 w-48 mt-2 bg-white border rounded-lg shadow-lg">
            <button className="block w-full px-4 py-2 text-right font-bold">
              {t('home.header.welcome', { name: user?.name })}
            </button>
            <Link to="/item/new">
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                {t('home.header.createItem')}
              </button>
            </Link>
            <Link to="/deposit/new">
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                {t('home.header.deposit')}
              </button>
            </Link>
            <button
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={handleLogout}
            >
              {t('home.header.logout')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Header() {
  const navigate = useNavigate();

  // Check if there's a token in local storage, if not, navigate back to login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <header className="px-4 py-2 flex justify-between">
      <LogoHeader />
      <div className="flex items-center">
        <Balance />
        <Profile />
      </div>
    </header>
  );
}
