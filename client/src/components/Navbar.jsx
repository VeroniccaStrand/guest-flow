import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { useContext, useState } from 'react';
import LogOut from './LogOut';
import Modal from './Modal';
import LoginForm from './LoginForm';

const Navbar = () => {
  const { loggedIn } = useContext(UserContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const getLinkClass = (path) => (
    location.pathname === path ? 'text-brand-red' : 'hover:text-brand-red'
  );

  return (
    <nav className='bg-custom-bg p-4 navbar '>
      <div className='h-24 w-24 mr-10'>
        <img src="./src/assets/nolato-logo-redblack-jpg.jpg" alt="" />
      </div>
      <div className='container mx-auto flex justify-between items-center'>
        {loggedIn ? (
          <>
            <ul className='flex space-x-4 uppercase font-bold text-secondary-text text-lg'>
              <li>
                <Link to='/dashboard' className={getLinkClass('/dashboard')}>Dashboard</Link>
              </li>
              <li>
                <Link to='/polymer' className={getLinkClass('/polymer')}>Display Polymer</Link>
              </li>
              <li>
                <Link to='/meditor' className={getLinkClass('/meditor')}>Display Meditor</Link>
              </li>
              <li>
                <Link to='/entre' className={getLinkClass('/entre')}>Display Entré</Link>
              </li>
            </ul>
            <div className='ml-auto'>
              <LogOut />
            </div>
          </>
        ) : (
          <div className='flex justify-center w-full'>
            <button
              onClick={handleLoginClick}
              className='flex items-center justify-center gap-3 text-lg font-semibold rounded-full bg-gradient-to-r from-brand-red to-red-700 px-6 py-3 text-primary-text hover:from-red-700 hover:to-brand-red transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl'
            >
              <span className='uppercase'>Login to guestflow</span>
            </button>
            <Modal show={showLoginModal} onClose={handleCloseModal}>
              <LoginForm onClose={handleCloseModal} />
            </Modal>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
