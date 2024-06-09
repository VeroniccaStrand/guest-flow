import { useState } from 'react';
import Modal from '../components/Modal';
import LoginForm from '../components/LoginForm';

const Hero = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <div className="flex-grow flex items-center justify-around shadow-2xl rounded-xl p-32 m-10">
        <div className='flex  flex-col '>
          <h1 className="text-6xl font-bold tracking-tighter text-shadow-lg max-w-5xl  text-nyans-text">
            Welcome to a Smoother Visitor Experience!
          </h1>
          <div className='flex gap-20'>
            <p className="py-6 text-nyans-text max-w-lg text-lg tracking-wide leading-7">
              Our platform efficiently manages your company&apos;s  visitors and displays the right information on your monitors. With our system, visitor management is easy, and your guests feel welcomed from the moment they arrive.
            </p>
            <button
              className='font-bold mt-2  btn btn-ghost bg-brand-red  hover:bg-red-800 text-white'
              onClick={handleLoginClick}
            >
              <span className='uppercase'>Login to guestflow</span>
            </button>
            <Modal show={showLoginModal} onClose={handleCloseModal}>
              <LoginForm onClose={handleCloseModal} />
            </Modal>
          </div>
        </div>


      </div>
    </>
  );
};

export default Hero;
