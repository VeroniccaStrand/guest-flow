import { useContext } from 'react'
import VisitContext from '../contexts/VisitContext'

const EntrePrew = () => {
  const { visits } = useContext(VisitContext)

  const date = new Date()
  const today = date.getDate()
  const entreVisits = visits.filter((visit) => visit.scheduled_arrival.getDate() === today)
  console.log(today)

  console.log(entreVisits)
  return (
    <div>entrePrew</div>
  )
}

export default EntrePrew