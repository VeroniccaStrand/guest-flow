import { useState } from 'react';
import Modal from '../components/Modal';
import LoginForm from '../components/LoginForm';
import nolato from '../assets/nolato-logo-redblack.png'

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
      <div className='p-2'>
        <img src={nolato} alt="Nolato Logo" className="h-20 mb-6 m-10" />
        <div className="flex-grow flex h-full  justify-center   rounded-xl p-10 ">

          <div className='flex h-full justify-center items-center flex-col max-w-[800px]'>
            <h1 className="text-6xl font-bold tracking-tighter text-shadow-lg   text-nyans-text">
              Welcome to a Smoother Visitor Experience!
            </h1>
            <div className='flex gap-20'>
              <p className="py-6 text-nyans-text max-w-lg text-lg tracking-wide leading-7">
                Our platform efficiently manages your company&apos;s  visitors and displays the right information on your monitors. With our system, visitor management is easy, and your guests feel welcomed from the moment they arrive.
              </p>
              <button
                className='font-bold self-center  btn btn-ghost bg-brand-red  hover:bg-red-800 text-white'
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


      </div>
    </>
  );
};

export default Hero;