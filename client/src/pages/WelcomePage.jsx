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



  return (
    <div className="grid grid-cols-[2fr_3fr] h-screen bg-bg-image bg-center bg-cover p-10">
      <div className="flex items-start ">
        <img src={nolato} alt="Company Logo" className="h-24 sm:h-28" />
      </div>
      <div className="flex flex-col overflow-hidden">
        <header className="mb-6 flex flex-col mr-10 self-end">
          <h1 className="text-7xl 3xl:text-8xl text-primary-text font-bold text-shadow-lg">
            Welcome to Torekov
          </h1>
          <div className="flex space-x-4 text-lg sm:text-2xl items-center justify-end text-nyans-text font-light mt-[-10px]">
            <p>Nolato AB</p>
            <div className="divider  w-[0.8px] h-6 bg-neutral "></div>
            <p>Nolato MediTor AB</p>
            <div className="divider w-[0.8px] h-6 bg-neutral "></div>
            <p>Nolato Polymer AB</p>
          </div>
        </header>
        <div className=" flex flex-col  items-center justify-center 3xl:mt-10  h-screen">
          {todaysVisits.length > 0 ? (
            <div
              className={`${todaysVisits.length <= 3 ? 'flex flex-col gap-5 p-6 w-4/5 3xl:mt-20' : 'grid grid-cols-2 p-6 gap-4'} h-full`}
            >
              {todaysVisits.map((visit) => {
                const visitorNames = visit.visitors.map(visitor => visitor.name);

                return (
                  <div key={visit.id} className="shadow-lg rounded-3xl p-4  relative flex flex-col  bg-stone-100 bg-opacity-50 justify-between">
                    <div className="rounded-lg">
                      <h2 className=" text-lg 2xl:text-4xl text-primary-text font-semibold">{visit.company}</h2>
                      <p className="text-nyans-text text-ms mt-[-5px]">{visit.company_info}</p>
                    </div>
                    <div className="text-nyans-text flex justify-center font-bold mt-2">
                      <div className="gap-1 4xl:gap-4 flex justify-center    w-10/12 flex-wrap">
                        {visitorNames.map((name, index) => (
                          <div key={index} className="flex items-center ">
                            <p className={`text-shadow mx-4 mb-2 text-lg 2xl:text-[1.5rem]`}>{name}</p>

                          </div>
                        ))}
                      </div>
                    </div>
                    <div className='flex justify-between mt-4'>
                      <p className="text-brand-red ">Your host today is <span className="font-bold">{visit.host}</span></p>
                      <p className="  text-black font-extrabold">{visit.visiting_departments}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col  items-center justify-center text-center  p-10 w-3/4">
              <div className=" tracking-wide leading-10 text-2xl  font-medium   text-nyans-text">
                <p className='flex flex-col'> We are a Swedish, publicly listed group with a well-established global position on three continents:<br /> <span className='font-bold'>Europe, Asia, and North America. </span><br />We develop and manufacture products in polymer

                  materials such as plastic, silicone and thermoplastic elastomers (TPE) for leading customers. Our offering spans the entire value chain - from solutions-oriented development focused on

                  sustainability to product delivery</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default WelcomePage;
