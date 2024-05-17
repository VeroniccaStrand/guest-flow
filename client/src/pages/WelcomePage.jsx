import { useContext } from 'react';
import VisitContext from '../contexts/VisitContext';
import nolato from '../assets/nolato-logo-redblack-jpg.jpg'; // Replace with your logo

const WelcomePage = () => {
  const { visits, isLoading } = useContext(VisitContext);
  const today = new Date().toISOString().split('T')[0];

  const todaysVisits = visits.filter(visit => {
    const scheduledArrival = new Date(visit.scheduled_arrival).toISOString().split('T')[0];
    return scheduledArrival === today;
  });
  console.log(todaysVisits)
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-4xl">Loading visits...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-custom-bg">
      <header className="flex items-center p-8 bg-white">
        <img src={nolato} alt="Company Logo" className="h-52 w-auto mr-8" />
      </header>
      <div className="text-center mt-[-50px] relative">
        <h1 className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-red via-black to-black inline ">
          Welcome!
          <span className="absolute bottom-[75px] left-1/2 transform -translate-x-1/2 h-0.5 w-2/4 bg-gradient-to-r from-transparent via-brand-red to-transparent"></span>
        </h1>
        <p className="text-6xl italic text-nyans-text font-light mt-4">
          We&apos;re glad you are here
        </p>
      </div>
      <main className="flex-grow flex flex-col items-center justify-center mt-8">
        {todaysVisits.length > 0 ? (
          <div className="w-full flex justify-center space-x-20">
            {todaysVisits.map(visit => (
              <div key={visit.id} className="text-center">
                <div className="text-6xl font-semibold text-primary-text">
                  {visit.company}
                </div>
                <div className="text-4xl text-secondary-text mt-2">
                  {visit.company_info}
                </div>

                <div className="text-4xl text-secondary-text mt-2">
                  {visit.company_logo && (
                    <img src={`data:image/png;base64,${visit.company_logo}`} alt={`${visit.company} logo`} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-4xl font-semibold text-primary-text">No visits today.</div>
        )}
      </main>
    </div>
  );
};

export default WelcomePage;
