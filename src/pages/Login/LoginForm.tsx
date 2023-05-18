import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    });

    if (response.ok) {
      const { user, token } = await response.json();

      // Save the token to local storage
      localStorage.setItem('token', token);
      updateUser(user);

      // Redirect the user to the home page
      navigate('/');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <img src={Logo} alt="Logo" className="w-40 mb-4" />
        <h1 className="text-3xl font-bold mb-6">{t('login.title')}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-bold mb-2"
            >
              {t('login.username')}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              {t('login.password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {t('login.submit')}
          </button>
          <div className="mt-4">
            {t('login.noAccount')}{' '}
            <Link to="/signup" className="text-blue-500 hover:text-blue-700">
              {t('login.signup')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
