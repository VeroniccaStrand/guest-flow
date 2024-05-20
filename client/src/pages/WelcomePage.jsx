import { useContext, useState, useEffect } from 'react';
import VisitContext from '../contexts/VisitContext';
import nolato from '../assets/nolato-logo-redblack-jpg.jpg'; // Replace with your logo

const WelcomePage = () => {
  const { visits, isLoading } = useContext(VisitContext);
  const [todaysVisits, setTodaysVisits] = useState([]);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const filteredVisits = visits.filter(visit => {
      const scheduledArrival = new Date(visit.scheduled_arrival).toISOString().split('T')[0];
      return scheduledArrival === today;
    });
    setTodaysVisits(filteredVisits);
  }, [visits, today]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-4xl">Loading visits...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-custom-bg">
      <header className="flex items-center p-8 bg-white">
        <img src={nolato} alt="Company Logo" className="h-40 w-auto mr-8" />
      </header>
      <div className="text-center mt-[-50px] relative">
        <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-red via-black to-black inline">
          Welcome!
          <span className="absolute bottom-[75px] left-1/2 transform -translate-x-1/2 h-0.5 w-2/4 bg-gradient-to-r from-transparent via-brand-red to-transparent"></span>
        </h1>
        <p className="text-6xl italic text-nyans-text font-light mt-4">
          We&apos;re glad you are here
        </p>
      </div>
      <main className="flex-grow w-full px-8 overflow-hidden flex items-center justify-center">
        {todaysVisits.length > 0 ? (
          <div className="grid gap-4 p-8 w-full" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))` }}>
            {todaysVisits.map(visit => (
              <div key={visit.id} className="text-center bg-white rounded-lg p-8">
                {visit.company_logo && (
                  <div className="mb-4">
                    <img
                      src={`data:image/png;base64,${visit.company_logo}`}
                      alt={`${visit.company} logo`}
                      className="mx-auto h-40 w-40 object-contain"
                    />
                  </div>
                )}
                <div className="text-5xl font-semibold text-primary-text mb-4">
                  {visit.company}
                </div>
                <div className="text-3xl text-secondary-text mt-2">
                  {visit.company_info}
                </div>
                <div className="text-4xl font-light text-primary-text mt-2">
                  {visit.welcome_message}
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
