// src/contexts/userContext.js
import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { api } from '../services/api';

const UserContext = createContext();

const UserProvider = ({ children }) => {

  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([])


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users')
        const data = await response.data

        setUsers(data)
        console.log(data);
      } catch (error) {
        console.error('Error fetching Users', error)
      }
    }
    fetchUsers()
  }, [])

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
    <UserContext.Provider value={{ login, loggedIn, logout, users }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
