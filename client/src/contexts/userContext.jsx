// src/contexts/userContext.js
import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { api } from '../services/api';

const UserContext = createContext();

const UserProvider = ({ children }) => {

  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([])
  const [isLoadingUsers, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const response = await api.get('/users')
        const data = await response.data

        setUsers(data)
        console.log(data);
      } catch (error) {
        console.error('Error fetching Users', error)
      }
      setIsLoading(false);
    }
    fetchUsers()
  }, [])
  console.log(users)
  const getTokenFromCookies = () => {
    const cookieString = document.cookie;
    console.log(cookieString)
    const cookies = cookieString.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'jwt') {
        return value;
      }
    }
    return null;
  };

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('deletedUser', ({ username }) => {
      console.log('User deleted:', username); // Lägg till loggning för felsökning
      setUsers((prevUsers) => prevUsers.filter((users) => users.username !== username));
    });
    socket.on('addedUser', (newUser) => {
      console.log('New user received:', newUser);
      setUsers((prevUsers) => [...prevUsers, newUser]);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const token = getTokenFromCookies();
    if (token) {
      setLoggedIn(true);

    } else {
      setLoggedIn(false);
    }
  }, []);


  const login = async (username, password) => {

    try {
      const success = await api.post('/users/login', {
        username,
        password,
      });
      if (success !== false) {
        setLoggedIn(true);
        return true;
      } else {
        return false
      }

    } catch (error) {
      console.error(error);
    }
  };





  const logout = async () => {
    try {
      await api.post('/users/logout'); // Gör en POST-förfrågan till backend för att logga ut


      setLoggedIn(false);

    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <UserContext.Provider value={{ login, loggedIn, logout, users, isLoadingUsers }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
