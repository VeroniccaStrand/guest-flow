import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import FrontPage from './pages/FrontPage';
import EditPage from './pages/EditPage';
import { VisitProvider } from './contexts/VisitContext';
import WelcomePage from './pages/WelcomePage';

const Router = () => {
  return (


    <BrowserRouter>
      <UserProvider>
        <VisitProvider>
          <Navbar />
          <Routes>
            <Route path='/' element={<FrontPage />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path="/visit/:id" element={<EditPage />} />
            <Route path="/welcome" element={<WelcomePage />} />

          </Routes>
        </VisitProvider>
      </UserProvider>
    </BrowserRouter>


  )
}

export default Router