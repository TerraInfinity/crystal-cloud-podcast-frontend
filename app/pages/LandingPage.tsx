/**
 * LandingPage.tsx
 * The landing page component.
 * This component serves as the entry point for users, providing navigation to the main application.
 * It includes buttons and disclaimers for user interaction.
 * 
 * @component
 * @returns {JSX.Element} The rendered landing page component.
 * 
 * @state {boolean} isDisclaimerOpen - Indicates whether the disclaimer modal is open or closed.
 * 
 * @method handleAccept - Handles the acceptance of the disclaimer and navigates to the homepage.
 * @method handleDeny - Handles the denial of the disclaimer, sets a restriction in local storage, and navigates to the homepage.
 */
import { useState, useEffect } from "react";
import type { JSX } from "react";

import { useNavigate } from "react-router-dom";

import Button from './components/LandingPage/LandingButton';
import Heading from './components/LandingPage/LandingHeading';
import Paragraph from './components/LandingPage/LandingParagraph';
import LandingDisclaimer from './components/LandingPage/LandingDisclaimer';

export const LandingPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [isDisclaimerOpen, setDisclaimerOpen] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAccept = (): void => {
    console.log("Disclaimer accepted. Navigating to homepage...");
    // Navigate to the homepage after accepting the disclaimer
    navigate('/home');
  };

  const handleDeny = (): void => {
    console.log("Disclaimer denied. Setting restriction in local storage...");
    // Save restriction status in local storage
    localStorage.setItem('restricted', 'true');
    // Navigate to the homepage without restrictions
    navigate('/home');
  };

  return (
    <div className="flex overflow-hidden flex-col justify-center items-center px-20 py-60 text-4xl text-center bg-stone-900 max-md:px-5 max-md:py-24">
      <div className="flex flex-col items-center max-w-full w-[941px]">
        <Heading />
        <Paragraph />
        <Button
          id="landing-page-button"
          onClick={() => {
            console.log("Button clicked. Checking disclaimer approval...");
            if (sessionStorage.getItem('disclaimerApproved') === 'true') {
              console.log("Disclaimer approved. Navigating to homepage...");
              navigate('/home');
            } else {
              console.log("Disclaimer not approved. Opening disclaimer modal...");
              setDisclaimerOpen(true);
            }
          }}
        />
        <p id="landing-paragraph-small" className="self-stretch mt-7 text-stone-500 text-xs max-md:max-w-full">
          Healing/Solving <a href="https://www.youtube.com/shorts/TuVGKbsfOjA" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-400">anxiety</a>, <a href="https://www.youtube.com/watch?v=FnveZCPyJRQ" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-400">porn addiction</a>, <a href="https://www.youtube.com/watch?v=t2JqFQeQBgA" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-400">addictions</a>, <a href="https://www.youtube.com/watch?v=XhF_jz8-VCA" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-400">consent</a>, <a href="https://www.youtube.com/watch?v=TK-MbNj83NM" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-400">attachment issues</a>, <a href="https://www.youtube.com/watch?v=n3Xv_g3g-mA" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-400">loneliness</a>, and <a href="https://www.youtube.com/watch?v=wxyIruYbBtw" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-400">depopulation</a>. Together we spread the light of <a href="https://www.youtube.com/watch?v=G9NTE-c0y5w" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-400">consciousness</a> upon an <a href="http://edging.urbanup.com/3949430" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-400">edgy</a> <a href="https://en.wikipedia.org/wiki/Event_horizon" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-400">event horizon</a>.
        </p>
        <br />
        <p className="text-xs text-white">On a more serious note... <a href="https://youtu.be/UfBso0Y4ETI" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-400">Click</a>.</p>
        {isClient && (
          <LandingDisclaimer 
            isOpen={isDisclaimerOpen} 
            onAccept={handleAccept} 
            onDeny={handleDeny} 
            onClose={() => {
              console.log("Closing disclaimer modal...");
              setDisclaimerOpen(false);
            }} 
          />
        )}
      </div>
    </div>
  );
};