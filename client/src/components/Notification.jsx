
import PropTypes from 'prop-types'

const Notification = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
      {message}
      <button className="ml-4" onClick={onClose}>Close</button>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};
export default Notification 