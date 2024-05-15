import { useContext } from 'react';
import { UserContext } from '../contexts/userContext';

const LogOut = () => {
  const { logout } = useContext(UserContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <button className='uppercase text-gray-500' onClick={handleLogout}>Log out</button>
  );
};

export default LogOut;
