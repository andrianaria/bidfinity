import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { User } from '../model/User';

type UserContextValue = {
  user: User | null;
  updateUser: (updatedUser: User | null) => void;
};

export const UserContext = createContext<UserContextValue>({
  user: null,
  updateUser: () => {},
});

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (updatedUser: any) => {
    console.dir(updatedUser);
    setUser(updatedUser);
  };

  useEffect(() => {
    // Save the user data in local storage whenever it changes
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
