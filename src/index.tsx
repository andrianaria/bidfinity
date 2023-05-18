import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import React from 'react';
import ReactDOM from 'react-dom';
import LoginForm from './pages/Login/LoginForm';
import SignupForm from './pages/Signup/SignupForm';
import Home from './pages/Home/Home';
import ItemForm from './pages/Item/ItemForm';
import './index.css';
import DepositForm from './pages/Deposit/DepositForm';
import { UserProvider } from './contexts/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BidHistoryList from './pages/History/BidHistoryList';

function App() {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/item/new" element={<ItemForm />} />
          <Route path="/deposit/new" element={<DepositForm />} />
          <Route path="/bid-history" element={<BidHistoryList />} />
        </Routes>
        <ToastContainer />
      </I18nextProvider>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <UserProvider>
    <App />
  </UserProvider>,
  document.getElementById('root'),
);
