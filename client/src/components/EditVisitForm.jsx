import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import VisitContext from '../contexts/VisitContext';
import Notification from './Notification';

const EditVisitForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { visits } = useContext(VisitContext);
  const [formData, setFormData] = useState({
    company: '',
    factoryTour: false,
    hosting_company: '',
    scheduled_arrival: '',
    host: ''
  });
  const [visitors, setVisitors] = useState([{ id: '', name: '' }]);
  const [deletedVisitors, setDeletedVisitors] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const visit = visits.find((visit) => visit.id === id);
    if (visit) {
      const formattedDate = new Date(visit.scheduled_arrival).toISOString().split('T')[0];
      setFormData({
        company: visit.company,
        factoryTour: visit.factoryTour,
        hosting_company: visit.hosting_company,
        scheduled_arrival: formattedDate,
        host: visit.host
      });
      setVisitors(visit.visitors && visit.visitors.length > 0 ? visit.visitors.map(visitor => ({ id: visitor.id, name: visitor.name })) : [{ id: '', name: '' }]);
    }
  }, [id, visits]);

  const handleChange = (e) => {
    const { id, value, type, checked, name, files } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [id || name]: checked,
      }));
    } else if (type === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        company_logo: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id || name]: value,
      }));
    }
  };

  const handleVisitorChange = (index, e) => {
    const newVisitors = [...visitors];
    newVisitors[index][e.target.name] = e.target.value;
    setVisitors(newVisitors);
  };

  const addVisitor = () => {
    setVisitors([...visitors, { id: '', name: '' }]);
  };

  const removeVisitor = (index) => {
    const visitorToRemove = visitors[index];
    if (visitorToRemove.id) {
      setDeletedVisitors([...deletedVisitors, visitorToRemove.id]);
    }
    setVisitors(visitors.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const isActive = formData.scheduled_arrival === today;

    const submissionData = new FormData();
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }
    submissionData.append('isActive', isActive);

    const existingVisitors = visitors.filter(visitor => visitor.id);
    const newVisitors = visitors.filter(visitor => !visitor.id);

    submissionData.append('existingVisitors', JSON.stringify(existingVisitors));
    submissionData.append('newVisitors', JSON.stringify(newVisitors));
    if (deletedVisitors.length > 0) {
      submissionData.append('deletedVisitors', JSON.stringify(deletedVisitors));
    }

    try {
      const response = await api.put(`/visits/${id}`, submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error updating visit', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/visits/${id}`);
      if (response.status === 200) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Error deleting visit', error);
    }
  };

  return (
    <div className="p-4 bg-custom-bg rounded shadow-md">
      <form className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block uppercase tracking-wide text-primary-text text-xs font-bold mb-2" htmlFor="company">
              Company
            </label>
            <input
              className="appearance-none block w-full bg-custom-bg text-primary-text border border-secondary-bg rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-brand-red placeholder-primary-text"
              id="company"
              type="text"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block uppercase tracking-wide text-primary-text text-xs font-bold mb-2" htmlFor="factoryTour">
              Factory Tour
            </label>
            <input
              className="mr-2 leading-tight"
              id="factoryTour"
              name="factoryTour"
              type="checkbox"
              checked={formData.factoryTour}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block uppercase tracking-wide text-primary-text text-xs font-bold mb-2" htmlFor="scheduled_arrival">
              Scheduled Arrival
            </label>
            <input
              className="appearance-none block w-full bg-custom-bg text-primary-text border border-secondary-bg rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-brand-red placeholder-primary-text"
              id="scheduled_arrival"
              type="date"
              value={formData.scheduled_arrival}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block uppercase tracking-wide text-primary-text text-xs font-bold mb-2" htmlFor="host">
              Host
            </label>
            <input
              className="appearance-none block w-full bg-custom-bg text-primary-text border border-secondary-bg rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-brand-red placeholder-primary-text"
              id="host"
              type="text"
              placeholder="Host"
              value={formData.host}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block uppercase tracking-wide text-primary-text text-xs font-bold mb-2">
              Visitors
            </label>
            {visitors.map((visitor, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  className="appearance-none block w-full bg-custom-bg text-primary-text border border-secondary-bg rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-brand-red placeholder-primary-text"
                  type="text"
                  name="name"
                  placeholder={`Visitor ${index + 1} Name`}
                  value={visitor.name}
                  onChange={(e) => handleVisitorChange(index, e)}
                  required
                />
                {visitors.length > 1 && (
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => removeVisitor(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="mt-2 bg-brand-red text-white py-1 px-3 rounded"
              onClick={addVisitor}
            >
              Add Visitor
            </button>
          </div>
          <div className="col-span-2 flex justify-end">
            <button
              className="shadow bg-brand-red hover:bg-red-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Update Visit
            </button>
          </div>
        </div>
        <div className="col-span-1 md:col-span-1 flex items-start justify-end">
          <button
            className="focus:shadow-outline focus:outline-none underline py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete Visit
          </button>
        </div>
      </form>
      {showNotification && (
        <Notification message="Visit deleted" onClose={() => setShowNotification(false)} />
      )}
    </div>
  );
};

export default EditVisitForm;