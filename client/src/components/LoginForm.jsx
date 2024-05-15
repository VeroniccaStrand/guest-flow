import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import PropTypes from 'prop-types'

const LoginForm = ({ onClose }) => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Fill out username and password for validation');
      return;
    }
    const success = await login(username, password);

    if (!success) {
      setError('Invalid username or password');
    } else {
      setError('');
      setUsername('');
      setPassword('');
      onClose();
      navigate('/dashboard'); // Redirect to home page
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='container text-white '>
      <label className="input input-bordered flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <input
          type="text"
          name="username"
          className="grow "
          placeholder="Username"
          value={username}
          onChange={handleChange}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
          <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
        </svg>
        <input
          type="password"
          name="password"
          className="grow"
          placeholder="Password"
          value={password}
          onChange={handleChange}
        />
      </label>
      {error && <p className='text-red-500  lowercase text-sm'>{error}</p>}
      <button
        type='submit'
        className='text-zinc-200 uppercase mt-4 font-bold btn-ghost btn bg-gray-800 hover:bg-brand-red w-36'
      >
        Log in
      </button>
    </form>
  );
};

LoginForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LoginForm;
