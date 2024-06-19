import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
const LogOut = () => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate()
  const handleLogout = () => {
    logout();
    navigate('/')
  };

  return (
    <button className='uppercase btn btn-ghost bg-red-50 text-gray-500' onClick={handleLogout}>Log out</button>
  );
};

export default LogOut;