import { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { api } from '../services/api'
import io from 'socket.io-client'


export const VisitContext = createContext()

export const VisitProvider = ({ children }) => {
  const [visits, setVisit] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    const fetchVisits = async () => {
      try {
        const response = await api.get('/visits')
        const data = await response
        console.log(data.data)
        setVisit(data.data)
        console.log()
      } catch (error) {
        console.error('Error fetching Visits', error)
      }
      setIsLoading(false)
    }
    fetchVisits()

  }, [])

  useEffect(() => {
    const socket = io('http://localhost:3000') // Sätt rätt URL för din backend

    socket.on('connect', () => {
      console.log('Socket connected')
    })

    socket.on('newVisit', (newVisit) => {
      setVisit((prevVisits) => [...prevVisits, newVisit])

    })

    socket.on('updateVisit', (updatedVisit) => {
      console.log('socket update')
      setVisit((prevVisits) =>
        prevVisits.map((visit) =>
          visit.id === updatedVisit.id ? updatedVisit : visit
        )
      )
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <VisitContext.Provider
      value={{ visits, isLoading }} >
      {children}
    </VisitContext.Provider >
  )
}



VisitProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default VisitContext