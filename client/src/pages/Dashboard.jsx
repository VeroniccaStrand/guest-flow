import AddVisitForm from '../components/AddVisitForm';
import VisitList from '../components/VisitList';
import VisitContext from '../contexts/VisitContext';
import { UserContext } from '../contexts/UserContext';
import { useContext } from 'react';
import UserList from '../components/UserList';
import AddUserForm from '../components/AddUserForm';

const Dashboard = () => {
  const { visits, isLoading } = useContext(VisitContext);
  const { users, isLoadingUsers } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-gray-100 text-primary-text p-10">
      <div className="container mx-auto">
        <header className="flex justify-between items-center py-4 border-b border-gray-300">
          <h1 className="text-5xl font-bold text-gray-700">Dashboard</h1>
        </header>
        <main className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-8">
          <section className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-3">
            <h2 className="text-3xl font-semibold mb-4 text-gray-700">Add Visit</h2>
            <AddVisitForm />
          </section>
          <section className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-5">
            <h2 className="text-3xl font-semibold mb-4 text-gray-700">Visits</h2>
            {isLoading ? <p>Loading...</p> : <VisitList visits={visits} />}
          </section>
          <section className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-5 lg:mt-6">
            <h2 className="text-3xl font-semibold mb-4 text-gray-700">Users</h2>
            {isLoadingUsers ? <p>Loading Users..</p> : <UserList users={users} />}
          </section>
          <section className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-3 lg:mt-6">
            <h2 className="text-3xl font-semibold mb-4 text-gray-700">Add User</h2>
            <AddUserForm />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
