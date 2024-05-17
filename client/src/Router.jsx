import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { VisitProvider } from './contexts/VisitContext';
import Layout from './Layout';

const Router = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <VisitProvider>
          <Layout />
        </VisitProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default Router;
