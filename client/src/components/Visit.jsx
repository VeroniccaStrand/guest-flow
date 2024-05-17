
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate'; // Assuming you have a utility function to format dates

const Visit = ({ visit }) => {

  return (
    <tr className="hover:bg-gray-100">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-text">
        {visit.company}
        <div className="text-sm text-secondary-text">{visit.company_info}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-text">
        {visit.visitor_count}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-text">
        {visit.visiting_departments}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-text">
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
    company_info: PropTypes.string,
    visiting_departments: PropTypes.string,
    visitor_count: PropTypes.string.isRequired,
    scheduled_arrival: PropTypes.string.isRequired,
  }).isRequired,
};

export default Visit;
