import PropTypes from 'prop-types';

const User = ({ user, handleRequestDelete }) => {
  const handleDeleteClick = () => {
    handleRequestDelete(user.username);
  };

  return (
    <tr className="hover:bg-gray-100">
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.username}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.fullname}</td>
      <td className="px-6 py-4 whitespace-nowrap font-bold cursor-pointer text-gray-700">
        <p onClick={handleDeleteClick}>Delete</p>
      </td>
    </tr>
  );
};

User.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    username: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  handleRequestDelete: PropTypes.func.isRequired,
};

export default User;