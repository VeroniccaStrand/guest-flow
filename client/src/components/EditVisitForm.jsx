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
    company_info: '',
    company_logo: null,
    visitor_count: '',
    visiting_departments: [],
    scheduled_arrival: '',
    welcome_message: '',
    host: ''
  });
  const [showNotification, setShowNotification] = useState(false);
  useEffect(() => {
    const visit = visits.find((visit) => visit.id === id);
    if (visit) {
      const formattedDateTime = new Date(visit.scheduled_arrival).toISOString().slice(0, 16);
      setFormData({
        company: visit.company,
        company_info: visit.company_info || '',
        company_logo: visit.company_logo || '',
        visitor_count: visit.visitor_count || '',
        visiting_departments: visit.visiting_departments ? visit.visiting_departments.split(', ') : [],
        scheduled_arrival: formattedDateTime,
        welcome_message: visit.welcome_message || '',
        host: visit.host || ''
      });
    }
  }, [id, visits]);

  const handleChange = (e) => {
    const { id, value, type, checked, name, files } = e.target;
    if (type === 'checkbox' && name === 'visiting_departments') {
      setFormData((prevData) => {
        if (checked) {
          return {
            ...prevData,
            visiting_departments: [...prevData.visiting_departments, value]
          };
        } else {
          return {
            ...prevData,
            visiting_departments: prevData.visiting_departments.filter(
              (department) => department !== value
            )
          };
        }
      });
    } else if (type === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        company_logo: files[0],  // Set the file directly in formData
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id || name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const isActive = formData.scheduled_arrival.split('T')[0] === today;

    const submissionData = new FormData();
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }
    submissionData.append('isActive', isActive);

    console.log('Submission data:', submissionData);

    try {
      const response = await api.put(`/visits/${id}`, submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
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
            <label className="block uppercase tracking-wide text-primary-text text-xs font-bold mb-2" htmlFor="company_info">
              Company Info
            </label>
            <input
              className="appearance-none block w-full bg-custom-bg text-primary-text border border-secondary-bg rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-brand-red placeholder-primary-text"
              id="company_info"
              type="text"
              placeholder="Company Info"
              value={formData.company_info}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block uppercase tracking-wide text-primary-text text-xs font-bold mb-2" htmlFor="company_logo">
              Company Logo
            </label>
            <input
              className="appearance-none block w-full bg-custom-bg text-primary-text border border-secondary-bg rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-brand-red placeholder-primary-text"
              id="company_logo"
              type="file"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block uppercase tracking-wide text-primary-text text-xs font-bold mb-2" htmlFor="visitor_count">
              Visitor Count
            </label>
            <input
              className="appearance-none block w-full bg-custom-bg text-primary-text border border-secondary-bg rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-brand-red placeholder-primary-text"
              id="visitor_count"
              type="text"
              placeholder="Number of Visitors"
              value={formData.visitor_count}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block uppercase tracking-wide text-primary-text text-xs font-bold mb-2">
              Visiting Departments
            </label>
            <div className="flex flex-wrap">
              {['Polymer', 'Meditor', 'Nolato AB'].map((department) => (
                <label key={department} className="mr-4">
                  <input
                    className="mr-2 leading-tight"
                    type="checkbox"
                    name="visiting_departments"
                    value={department}
                    checked={formData.visiting_departments.includes(department)}
                    onChange={handleChange}
                  />
                  <span className="text-primary-text">{department}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block uppercase tracking-wide text-primary-text text-xs font-bold mb-2" htmlFor="scheduled_arrival">
              Scheduled Arrival
            </label>
            <input
              className="appearance-none block w-full bg-custom-bg text-primary-text border border-secondary-bg rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-brand-red placeholder-primary-text"
              id="scheduled_arrival"
              type="datetime-local"
              value={formData.scheduled_arrival}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block uppercase tracking-wide text-primary-text text-xs font-bold mb-2" htmlFor="welcome_message">
              Welcome Message
            </label>
            <input
              className="appearance-none block w-full bg-custom-bg text-primary-text border border-secondary-bg rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-brand-red placeholder-primary-text"
              id="welcome_message"
              type="text"
              placeholder="Welcome Message"
              value={formData.welcome_message}
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
            className=" focus:shadow-outline focus:outline-none  underline py-2 px-4 rounded"
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
