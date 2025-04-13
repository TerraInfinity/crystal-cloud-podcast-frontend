import React from 'react';

// Define interface for achievement
interface Achievement {
  id: string;
  iconUrl: string;
  name: string;
}

// Define interface for component props
interface AchievementsGridProps {
  achievements?: Achievement[];
}

/**
 * AchievementsGrid component
 * 
 * This component displays a grid of user achievements, including icons and titles.
 * If no achievements are available, it shows a message indicating that.
 * 
 * @param {AchievementsGridProps} props - Component properties.
 * @param {Achievement[]} [props.achievements] - An array of achievement objects to display.
 * @returns {JSX.Element} A grid layout of achievement icons and titles, or a message if none are available.
 */
const AchievementsGrid: React.FC<AchievementsGridProps> = ({ achievements = [] }) => {
  // Check if there are no achievements to display
  if (!achievements || achievements.length === 0) {
    return <div className="text-white">No achievements yet.</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-4" id="achievements-grid">
      {achievements.map((achievement) => (
        <div key={achievement.id} className="flex justify-center" id={`achievement-${achievement.id}`}>
          <img
            src={achievement.iconUrl}
            alt={achievement.name}
            className="w-16 h-16 hover:scale-105 transition"
            title={achievement.name}
            id={`achievement-icon-${achievement.id}`}
          />
        </div>
      ))}
    </div>
  );
};

export default AchievementsGrid;