

import PropTypes from 'prop-types';

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-custom-bg p-5 rounded-lg shadow-xl w-1/3">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-primary-text hover:text-secondary-text transition duration-300 ease-in-out">
            &times;
          </button>
        </div>
        <div className="text-primary-text">
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default Modal;
