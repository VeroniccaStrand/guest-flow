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
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decodedToken.role);
      setLoggedIn(true);
    } else {
      setUserRole(null);
      setLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!loggedIn || userRole !== 'ADMIN') return;
      setIsLoading(true);
      try {
        const response = await api.get(`/users`);
        const data = await response.data;
        console.log(data)
        if (Array.isArray(data)) {
          setUsers(data);
        } else {

          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]); // Sätt en tom array vid fel
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [loggedIn, userRole]);

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('deletedUser', ({ username }) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
    });

    socket.on('addedUser', (newUser) => {
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
      const response = await api.post(`users/login`, { username, password });
      if (response.status === 200) {
        setLoggedIn(true);
        const token = getTokenFromCookies();
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decodedToken.role);
        return true;
      } else {
        console.error('Login failed', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const response = await api.post(`users/logout`);
      if (response.status === 200) {
        setLoggedIn(false);
        setUserRole(null);
      } else {
        console.error('Logout failed', response.statusText);
      }
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
