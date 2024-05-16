import AddVisitForm from '../components/AddVisitForm'
import VisitList from '../components/VisitList';
import VisitContext from '../contexts/VisitContext'
import { useContext } from 'react';

const Dashboard = () => {
  const { visits, isLoading } = useContext(VisitContext);
  console.log(isLoading)
  console.log(visits)
  return (
    <div className="min-h-screen bg-gray-100 text-secondary-text p-4">
      <div className="container mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Scheduled Visits</h2>
            <div className="bg-white shadow-md rounded p-4">
              {isLoading ? (
                <div>
                  <span className="loading loading-ring loading-lg"></span>
                </div>
              ) : (
                <VisitList visits={visits} />
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Add Visit</h2>
            <div className="bg-white shadow-md rounded p-4">
              <AddVisitForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard