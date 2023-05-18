import { t } from 'i18next';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from '../../assets/logo.svg';
import { createUser } from '../../services/UserService';
import validate from './validate';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  function resetForm() {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Create user object
      const user = {
        name: name,
        email: email,
        password: password,
      };
      const newUser = await createUser(user);
      console.dir(newUser);
      toast.success(`${t('signup.message.success')}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      resetForm();
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
        toast.error(`${(t('signup.message.error'), { error })}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error('Failed to create user:', error);
      }
    }
  };

  const handleBlur = () => {
    const validationErrors = validate({
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    });
    setErrors(validationErrors);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <img src={Logo} alt="Logo" className="w-40 mb-4" />
        <h1 className="text-3xl font-bold mb-6">{t('signup.title')}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6"></div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="name"
            >
              {t('signup.name')}
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              required
              placeholder={t('signup.nameDescription') || ''}
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={handleBlur}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="email"
            >
              {t('signup.email')}
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              required
              placeholder={t('signup.emailDescription') || ''}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={handleBlur}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="password"
            >
              {t('signup.password')}
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              required
              placeholder={t('signup.passwordDescription') || ''}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={handleBlur}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="password"
            >
              {t('signup.reenterPassword')}
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              required
              placeholder={t('signup.reenterPasswordDescription') || ''}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              onBlur={handleBlur}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {t('signup.submit')}
            </button>
          </div>
          <div className="mt-4">
            {t('signup.haveAccount')}{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-700">
              {t('signup.login')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
