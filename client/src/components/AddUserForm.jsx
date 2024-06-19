import { useState } from 'react';
import { api } from '../services/api';
import Notification from './Notification';

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    password: '',
    role: '', // Changed to handle the role as a string
  });
  const [showNotification, setShowNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === 'checkbox' ? (checked ? 'ADMIN' : '') : value, // Handle checkbox as a string value
    }));
    setErrorMessage(''); // Clear error message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users', formData);
      if (response.status === 201) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        setFormData({
          username: '',
          fullname: '',
          password: '',
          role: '',
        });
      }
    } catch (error) {
      console.error('Error adding user:', error);
      if (error.response && error.response.status === 400) {
        setErrorMessage('Username already exists.');
        setTimeout(() => setErrorMessage(''), 2000);
      } else {
        console.error('Error adding user:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block uppercase tracking-wide text-primary-text text-xs font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="appearance-none block w-full bg-custom-bg text-primary-text border border-secondary-bg rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-brand-red placeholder-primary-text"
            id="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block uppercase tracking-wide text-primary-text text-xs font-bold mb-2" htmlFor="fullname">
            Fullname
          </label>
          <input
            className="appearance-none block w-full bg-custom-bg text-primary-text border border-secondary-bg rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-brand-red placeholder-primary-text"
            id="fullname"
            type="text"
            placeholder="Fullname"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block uppercase tracking-wide text-primary-text text-xs font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="appearance-none block w-full bg-custom-bg text-primary-text border border-secondary-bg rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-brand-red placeholder-primary-text"
            id="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center">
          <input
            className="mr-2 leading-tight"
            id="role"
            type="checkbox"
            checked={formData.role === 'ADMIN'}
            onChange={handleChange}
          />
          <label className="block uppercase tracking-wide text-primary-text text-xs font-bold" htmlFor="role">
            Admin
          </label>
        </div>
        <div className="col-span-1 md:col-span-2 flex justify-end">
          <button
            className="shadow bg-brand-red hover:bg-red-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Add User
          </button>
        </div>
        {errorMessage && (
          <div className="col-span-1 md:col-span-2 text-red-500 text-sm mt-2">
            {errorMessage}
          </div>
        )}
      </form>
      {showNotification && (
        <Notification message="User added successfully!" onClose={() => setShowNotification(false)} />
      )}
    </div>
  );
};

export default AddUserForm;