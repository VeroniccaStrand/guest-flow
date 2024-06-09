// src/contexts/userContext.js
import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { api } from '../services/api';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const getTokenFromCookies = () => {
    const cookieString = document.cookie;
    console.log('Cookies:', cookieString);
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
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Förutsatt att token är en JWT
      setUserRole(decodedToken.role); // Anpassa detta baserat på din tokenstruktur
      setLoggedIn(true);
    } else {
      setUserRole(null);
      setLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!loggedIn || userRole !== 'ADMIN') return; // Vänta tills användaren är autentiserad och är admin
      setIsLoading(true);
      console.log("Fetching users...");
      try {
        const response = await api.get('/users');
        const data = response.data;

        setUsers(data);
        console.log('Fetched users:', data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
        console.log('Fetch users complete');
      }
    };

    fetchUsers();
  }, [loggedIn, userRole]); // Körs när loggedIn eller userRole ändras

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('deletedUser', ({ username }) => {
      console.log('User deleted:', username);
      setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
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

  const login = async (username, password) => {
    try {
      const success = await api.post('/users/login', {
        username,
        password,
      });
      if (success !== false) {
        setLoggedIn(true);
        // Få användarroll efter inloggning
        const token = getTokenFromCookies();
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Förutsatt att token är en JWT
        setUserRole(decodedToken.role); // Anpassa detta baserat på din tokenstruktur
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/users/logout');
      setLoggedIn(false);
      setUserRole(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <UserContext.Provider value={{ login, loggedIn, logout, users, isLoadingUsers, userRole }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
