// Layout.js
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import FrontPage from './pages/FrontPage';
import Dashboard from './pages/Dashboard';
import EditPage from './pages/EditPage';
import WelcomePage from './pages/WelcomePage';
import PolymerPage from './pages/PolymerPage';
import ProtectedRoute from './components/ProtectedRoute';
import MeditorPage from './pages/MeditorPage';

const Layout = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/welcome', '/', '/polymer', '/meditor'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/visit/:id" element={<EditPage />} />
        </Route>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/polymer" element={<PolymerPage />} />
        <Route path="/meditor" element={<MeditorPage />} />
      </Routes>
    </>
  );
};

export default Layout;