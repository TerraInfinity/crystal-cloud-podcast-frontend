import React from 'react';

interface Stats {
  experiencePoints: number;
  level: number;
}

// Define interface for component props
interface StatsCardProps {
  stats?: Stats; // Use local Stats type
}

/**
 * StatsCard component displays statistics such as experience points and level.
 *
 * @param {StatsCardProps} props - The props for the component.
 * @param {UserProfile} [props.stats] - An object containing user profile statistics.
 * @param {number} [props.stats.experiencePoints=0] - Total experience points accumulated by the user.
 * @param {number} [props.stats.level=0] - User's level.
 *
 * @returns {JSX.Element} The rendered StatsCard component.
 */
const StatsCard: React.FC<StatsCardProps> = ({ stats = { experiencePoints: 0, level: 0 } }) => {
  const { experiencePoints, level } = stats; // Destructure experiencePoints and level

  return (
    <div className="grid grid-cols-3 gap-4 bg-gray-800 text-white p-4 rounded-lg shadow-md">
      <div className="text-center" id="stats-experience">
        <span className="font-bold">Experience Points: </span>
        <span id="stats-experience-count">{experiencePoints}</span>
      </div>
      <div className="text-center" id="stats-level">
        <span className="font-bold">Level: </span>
        <span id="stats-level-count">{level}</span>
      </div>
      {/* ... existing code for posts, friends, and badges ... */}
    </div>
  );
};

export default StatsCard;