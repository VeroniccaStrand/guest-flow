import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/userContext';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import FrontPage from './pages/FrontPage';
const Router = () => {
  return (


    <BrowserRouter>
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path='/' element={<FrontPage />} />
          <Route path='/dashboard' element={<Dashboard />} />


        </Routes>
      </UserProvider>
    </BrowserRouter>


  )
}

export default Router