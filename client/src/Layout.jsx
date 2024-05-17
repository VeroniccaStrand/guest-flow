import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import FrontPage from './pages/FrontPage';
import Dashboard from './pages/Dashboard';
import EditPage from './pages/EditPage';
import WelcomePage from './pages/WelcomePage';

const Layout = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/welcome'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path='/' element={<FrontPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/visit/:id' element={<EditPage />} />
        <Route path='/welcome' element={<WelcomePage />} />
      </Routes>
    </>
  );
};

export default Layout;
