import { useContext, useState, useEffect } from 'react';
import VisitContext from '../contexts/VisitContext';
import nolato from '../assets/nolato-logo-redblack.png';

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

  const getFontSize = (length) => {
    if (length <= 1) return 'text-2xl';
    if (length <= 2) return 'text-xl';
    if (length <= 3) return 'text-lg';
    return 'text-base';
  };

  return (
    <div className="grid grid-cols-[2fr_3fr] h-screen bg-bg-image bg-center bg-cover">
      <div className="flex items-start  m-10">
        <img src={nolato} alt="Company Logo" className="h-24 sm:h-36" />
      </div>
      <div className="flex flex-col  overflow-hidden">
        <header className="mb-6 flex flex-col m-10 self-end ">
          <h1 className="text-5xl   5xl:text-9xl text-primary-text font-bold text-shadow-lg">
            Welcome to Torekov
          </h1>
          <div className="flex space-x-2 text-lg sm:text-2xl items-center justify-end  text-nyans-text font-light mt-[-10px]">
            <p>Nolato AB</p>
            <div className="divider w-1 h-6 bg-neutral mx-2"></div>
            <p>Nolato MediTor</p>
            <div className="divider w-1 h-6 bg-neutral mx-2"></div>
            <p>Nolato Polymer</p>
          </div>
        </header>
        <div className='container grid  h-full  items-center pr-10'>

          <div className="grid grid-cols-auto-fill-sm 5xl:grid-cols-auto-fill-100 gap-10 mb-4 mt-10   relative">
            {todaysVisits.length > 0 ? (
              todaysVisits.map((visit) => {
                const visitorNames = visit.visitors.map(visitor => visitor.name);
                const fontSizeClass = getFontSize(visitorNames.length);
                return (

                  <div key={visit.id} className=' shadow-lg  rounded p-4 relative'>
                    <div className='absolute top-[-1rem] left-[10px]    rounded-lg px-2'>
                      <h2 className='text-xl 5xl:text-4xl text-primary-text font-semibold '>{visit.company}</h2>
                    </div>
                    <div className=''>
                      <p className='text-nyans-text text-ms mt-[-10px]'>{visit.company_info}</p>
                    </div>

                    <div className='text-nyans-text -space-y-0.5 font-bold mt-5 '>
                      <div className='  gap-2'>
                        {visitorNames.map((name, index) => (

                          <p key={index} className={`text-shadow  ${fontSizeClass}`}>{name}</p>

                        ))}
                      </div>

                    </div>
                    <p className='text-brand-red text-sm mb-5'>Your host today will be <span className='font-bold'>{visit.host}</span> </p>
                    <div >
                      <p className=' absolute bottom-0 right-0 p-4 text-black  font-extrabold '>   {visit.visiting_departments}</p>

                    </div>
                  </div>


                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center text-center rounded-lg p-6 w-full bg-white bg-opacity-70">
                <div className="text-xl sm:text-2xl text-primary-text font-semibold mb-2">
                  No visits today
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>

  );
};

export default WelcomePage;
