import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import FrontPage from './pages/FrontPage';
import Dashboard from './pages/Dashboard';
import EditPage from './pages/EditPage';
import WelcomePage from './pages/WelcomePage';
import PolymerPage from './pages/PolymerPage'
const Layout = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/welcome', '/','/polymer'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path='/' element={<FrontPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/visit/:id' element={<EditPage />} />
        <Route path='/welcome' element={<WelcomePage />} />
        <Route path='/polymer' element={<PolymerPage/>}/>
      </Routes>
    </>
  );
};

export default Layout;
