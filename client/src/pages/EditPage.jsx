
import EditVisitForm from '../components/EditVisitForm';

const EditPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-secondary-text p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Visit</h1>
        <div className="bg-white shadow-md rounded p-4">
          <EditVisitForm />
        </div>
      </div>
    </div>
  );
};

export default EditPage;
