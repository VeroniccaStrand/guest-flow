
import Footer from '../components/Footer';
import Hero from '../components/Hero';
const FrontPage = () => {

  return (

    <div className='min-h-screen flex flex-col'>
      <div className='flex-grow'>
        <Hero />
      </div>
      <Footer />
    </div>
  )
}

export default FrontPage