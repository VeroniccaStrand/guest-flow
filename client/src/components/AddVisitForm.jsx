import { useState } from 'react';
import { api } from '../services/api';
import Notification from './Notification';


const AddVisitForm = () => {
  const [formData, setFormData] = useState({
    company: '',
    company_info: '',
    company_logo: null,
    visitor_count: '',
    visiting_departments: [],
    scheduled_arrival: '',
    host: '',
  });
  const [visitors, setVisitors] = useState([{ name: '' }]);
  const [showNotification, setShowNotification] = useState(false);


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
        company_logo: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id || name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleVisitorChange = (index, e) => {
    const newVisitors = [...visitors];
    newVisitors[index][e.target.name] = e.target.value;
    setVisitors(newVisitors);
  };

  const addVisitor = () => {
    setVisitors([...visitors, { name: '' }]);
  };

  const removeVisitor = (index) => {
    const newVisitors = visitors.filter((_, i) => i !== index);
    setVisitors(newVisitors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const isActive = formData.scheduled_arrival.split('T')[0] === today;

    const submissionData = new FormData();
    for (const key in formData) {
      if (key === 'company_logo' && formData[key]) {
        submissionData.append(key, formData[key], formData[key].name);
      } else {
        submissionData.append(key, formData[key]);
      }
    }
    submissionData.append('isActive', isActive);

    visitors.forEach((visitor, index) => {
      submissionData.append(`visitors[${index}].name`, visitor.name);
    });

    try {
      const response = await api.post('/visits', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setShowNotification(true);
        setFormData({
          company: '',
          company_info: '',
          company_logo: null,
          visitor_count: '',
          visiting_departments: [],
          scheduled_arrival: '',
          host: ''
        });
        setVisitors([{ name: '' }]);

        setTimeout(() => setShowNotification(false), 3000);
      }
    } catch (error) {
      console.error('Error adding visit:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  };

  return (
    <div className="p-4">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit} encType="multipart/form-data">
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
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block uppercase tracking-wide text-primary-text text-xs font-bold mb-2">
            Visiting Departments
          </label>
          <div className="flex flex-wrap">
            {['Polymer', 'MediTor', 'Nolato AB'].map((department) => (
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
            className="appearance-none block w-full bg-custom-bg text-primary-text border border-secondary-bg rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-brand-red placeholder-primary-text custom-calendar-icon"
            id="scheduled_arrival"
            type="datetime-local"
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
        <div className="col-span-1 md:col-span-2">
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
              <button
                type="button"
                onClick={() => removeVisitor(index)}
                className="ml-2 p-2 btn-ghost text-black rounded border-solid border-1 border-black"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVisitor}
            className="mt-2 p-2 btn-ghost border-solid border-1 border-black text-black rounded"
          >
            + Add Visitor
          </button>
        </div>
        <div className="col-span-1 md:col-span-2 flex justify-end">
          <button
            className="shadow bg-brand-red hover:bg-red-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Add Visit
          </button>
        </div>
      </form>
      {showNotification && (
        <Notification message="New visit has been saved!" onClose={() => setShowNotification(false)} />
      )}
    </div>
  );
};

export default AddVisitForm;
