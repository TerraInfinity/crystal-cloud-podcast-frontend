/**
 * LandingButton.tsx
 * LandingButton component renders a button that triggers an action when clicked.
 *
 * @component
 * @param {LandingButton} props - The props for the component.
 * @returns {JSX.Element} The rendered button element.
 */

import type { JSX } from "react";

interface LandingButton {
  onClick: () => void;
  id?: string;
}

const LandingButton = ({ onClick, id = "landing-button" }: LandingButton): JSX.Element => {
  return (
    <button
      id={id}
      onClick={onClick}
      className="px-16 py-5 mt-24 max-w-full text-black bg-amber-400 rounded-[36px] w-[490px] max-md:px-5 max-md:mt-10 max-md:text-lg text-xl"
    >
      Enter the Light Ages
    </button>
  );
};

export default LandingButton;