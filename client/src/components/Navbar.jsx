import { Link, useLocation } from 'react-router-dom';


import LogOut from './LogOut';


const Navbar = () => {


  const location = useLocation();



  const getLinkClass = (path) => (
    location.pathname === path ? 'text-brand-red' : 'hover:text-brand-red'
  );

  return (

    <nav className='bg-custom-bg p-4 navbar '>
      <div className='h-32 w-32 mx-10 '>
        <img src="./src/assets/nolato-logo-redblack.png" alt="Nolato-logo" />
      </div>
      <div className='container mx-auto flex justify-between items-center'>

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
              <Link to='/welcome' className={getLinkClass('/welcome')}>Display Entré</Link>
            </li>
          </ul>
          <div className='ml-auto'>
            <LogOut />
          </div>
        </>


      </div>
    </nav>
  );
};

export default Navbar;
