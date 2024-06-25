import { useContext, useState, useEffect } from 'react';
import VisitContext from '../contexts/VisitContext';
import nolato from '../assets/nolato-logo-redblack.png';

const PolymerPage = () => {
  const { visits, isLoading } = useContext(VisitContext);
  const [todaysVisits, setTodaysVisits] = useState([]);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const filteredVisits = visits.filter(visit => {
      const scheduledArrival = new Date(visit.scheduled_arrival).toISOString().split('T')[0];
      return (
        scheduledArrival === today &&
        (visit.factoryTour === true || visit.hosting_company === 'Nolato Polymer AB')
      );
    });
    console.log('visits updated');
    setTodaysVisits(filteredVisits);
  }, [visits, today]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-4xl">Loading visits...</div>;
  }



  return (
    <div className="grid grid-cols-[1fr_1.1fr] h-screen bg-bg-image bg-center bg-cover  ">
      <div className="flex items-start p-10">
        <img src={nolato} alt="Company Logo" className="h-28" />
      </div>
      <div className="flex flex-col p-10 ">
        <header className="mr-4 ">
          <h1 className=" flex justify-end desktop:text-5xl tv:text-7xl text-primary-text font-bold text-shadow-lg  ">
            Welcome to Torekov
          </h1>
          <div className="flex space-x-2  laptop:text-lg desktop:text-3xl tv:text-4xl items-center justify-end  text-nyans-text font-light mt-[-10px]">
            <p>Nolato AB</p>
            <div className="divider w-[.5px] h-10 bg-neutral mx-2"></div>
            <p>Nolato MediTor AB</p>
            <div className="divider w-[.5px] h-10 bg-neutral mx-2"></div>
            <p>Nolato Polymer AB</p>
          </div>
        </header>
        <div className='container grid  h-full  items-center'>

          <div className="container  h-full flex flex-col desktop:p-5 tv:py-20  justify-center gap-6">
            {todaysVisits.length > 0 ? (
              todaysVisits.map((visit) => {
                const visitorNames = visit.visitors.map(visitor => visitor.name);

                return (

                  <div key={visit.id} className='flex flex-col shadow-md  rounded-xl laptop:p-4 desktop:p-6 tv: flex-grow max-h-[25rem] bg-gray-gradient   justify-between'>
                    <h2 className=' laptop:text-2xl desktop:text-3xl tv:text-5xl rounded bg-opacity-25      text-[#444] '>{visit.company}</h2>

                    <div className='text-nyans-text flex  font-medium justify-center  laptop:text-2xl desktop:text-3xl tv:text-4xl '>
                      <div className='flex-col flex gap-2 text-center justify-center '>
                        {visitorNames.map((name, index) => (

                          <p key={index} className={`text-shadow-md  font-bold  capitalize `}>{name}</p>

                        ))}
                      </div>
                    </div>

                    <div className='flex justify-between items-end' >
                      <p className='text-nyans-text desktop:text-xl tv:text-2xl  '>Your host today is <br /><span className='font-bold text-brand-red'>{visit.host}</span> </p>
                      <p className='text-black  desktop:text-xl tv:text-2xl font-light '>   {visit.hosting_company}</p>
                    </div>

                  </div>

                );






              })
            ) : (
              <div className="flex flex-col items-center justify-center text-center rounded-lg p-6 w-full bg-white bg-opacity-70">
                <div className="text-xl sm:text-xl text-primary-text font-semibold mb-2">
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

export default PolymerPage;