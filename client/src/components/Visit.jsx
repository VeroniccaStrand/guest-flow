
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';

const Visit = ({ visit }) => {
  
  return (
    <tr className="hover:bg-gray-100">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-text">
        {visit.company}

      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-primary-text">
        {visit.factoryTour ? 'Yes' : 'No'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-text">
        {visit.hosting_company}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-text">
        {formatDate(visit.scheduled_arrival)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
        <Link
          to={`/visit/${visit.id}`}
          className="text-brand-red hover:text-red-700"
        >
          Edit
        </Link>
      </td>
    </tr>
  );
};

Visit.propTypes = {
  visit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    factoryTour: PropTypes.bool,
    hosting_company: PropTypes.string,
    scheduled_arrival: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
  }).isRequired,
};

export default Visit;