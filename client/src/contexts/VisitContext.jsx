import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { api } from '../services/api';
import io from 'socket.io-client';


export const VisitContext = createContext();

export const VisitProvider = ({ children }) => {
  const [visits, setVisit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchVisits = async () => {
      try {
        const response = await api.get('/visits');
        const data = await response.data;
        setVisit(data);
        console.log('Fetched visits:', data); // Debugging line
      } catch (error) {
        console.error('Error fetching Visits', error);
      }
      setIsLoading(false);
    };
    fetchVisits();
  }, []);

  useEffect(() => {
    const socket = io('http://172.20.78.49:3000');

    socket.on('connect', () => {
      console.log('Socket connected visit');
    });

    socket.on('connect_error', (error) => {
      console.error('socket connection error', error)
    })

    socket.on('newVisit', (newVisit) => {
      console.log('New visit received:', newVisit);
      setVisit((prevVisits) => [...prevVisits, newVisit]);
    });

    socket.on('updateVisit', (updatedVisit) => {
      console.log('Updated visit received:', updatedVisit);
      setVisit((prevVisits) =>
        prevVisits.map((visit) =>
          visit.id === updatedVisit.id ? updatedVisit : visit
        )
      );
    });
    socket.on('deleteVisit', ({ id }) => {
      setVisit((prevVisits) => prevVisits.filter((visit) => visit.id !== id));

    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <VisitContext.Provider value={{ visits, isLoading }}>
      {children}
    </VisitContext.Provider>
  );
};

VisitProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default VisitContext;