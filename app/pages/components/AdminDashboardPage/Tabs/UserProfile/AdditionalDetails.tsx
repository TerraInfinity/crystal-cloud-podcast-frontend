import React from 'react';

// Define interface for user details
interface UserDetails {
  age?: number;
  gender?: string;
  orientation?: string;
  pronouns?: string;
}

// Define interface for component props
interface AdditionalDetailsProps {
  details?: UserDetails;
}

/**
 * AdditionalDetails component displays user profile details.
 *
 * @param {AdditionalDetailsProps} props - The component props.
 * @param {UserDetails} [props.details] - The user details object.
 * @returns {JSX.Element} The rendered component.
 */
const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({ details = {} }) => {
  const { age, gender, orientation, pronouns } = details;

  return (
    <div className="space-y-2">
      {/* Display age with a fallback if not specified */}
      <p id="user-age">
        <span className="font-bold text-white">Age: </span>
        <span className="text-gray-300">{age || 'Not specified'}</span>
      </p>
      {/* Display gender with a fallback if not specified */}
      <p id="user-gender">
        <span className="font-bold text-white">Gender: </span>
        <span className="text-gray-300">{gender || 'Not specified'}</span>
      </p>
      {/* Display orientation with a fallback if not specified */}
      <p id="user-orientation">
        <span className="font-bold text-white">Orientation: </span>
        <span className="text-gray-300">{orientation || 'Not specified'}</span>
      </p>
      {/* Display pronouns with a fallback if not specified */}
      <p id="user-pronouns">
        <span className="font-bold text-white">Pronouns: </span>
        <span className="text-gray-300">{pronouns || 'Not specified'}</span>
      </p>
    </div>
  );
};

export default AdditionalDetails;