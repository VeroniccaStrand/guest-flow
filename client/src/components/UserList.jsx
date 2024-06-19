import { useState } from 'react';
import PropTypes from 'prop-types';
import User from './User';
import { api } from '../services/api';
import Notification from './Notification';
import Modal from './Modal';

const UserList = ({ users }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);



  const handleDelete = async (username) => {
    try {
      const response = await api.delete('/users', {
        data: { username }
      });
      if (response.status === 200) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      }
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleRequestDelete = (username) => {
    setUserToDelete(username);
    setShowModal(true);
  };

  const handleCloseModal = (confirmation) => {
    setShowModal(false);
    if (confirmation && userToDelete) {
      handleDelete(userToDelete);
    }
  };

  return (
    <div className='container '>
      {showNotification && (
        <Notification message="User deleted" onClose={() => setShowNotification(false)} />
      )}
      <div className='max-h-96 overflow-y-auto shadow-lg'>
        <table className='min-w-full divide-y divide-gray-100 '>
          <thead className='bg-secondary-bg'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'>Username</th>
              <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'>Fullname</th>
              <th className='px-6 py-3 text-xs font-bold uppercase tracking-wider'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                </svg>
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {users.map((user) => (
              <User key={user.id} user={user} handleRequestDelete={handleRequestDelete} />
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal show={showModal} onClose={handleCloseModal}>
          <p>Are you sure you want to delete this user?</p>
          <div className="flex justify-end space-x-4">
            <button onClick={() => handleCloseModal(false)} className="px-4 py-2 bg-gray-200 rounded">
              Cancel
            </button>
            <button onClick={() => handleCloseModal(true)} className="px-4 py-2 bg-red-500 text-white rounded">
              Confirm
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    username: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
  })).isRequired,
};

export default UserList;