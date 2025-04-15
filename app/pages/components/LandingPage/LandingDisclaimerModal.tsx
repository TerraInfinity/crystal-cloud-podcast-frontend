/**
 * LandingDisclaimerModal.tsx
 * LandingDisclaimerModal component displays a modal with a disclaimer message
 * and options for the user to accept or decline the terms.
 *
 * @component
 * @param {LandingDisclaimerModalProps} props - The props for the component.
 * @returns {JSX.Element} The rendered modal component.
 */

import React from 'react';
import type { JSX } from 'react';
import Modal from '../common/Modal'; // Assume this is a typed component elsewhere

interface LandingDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  disclaimerText: React.ReactNode;
  onAccept: () => void;
  onDecline: () => void;
  onLearnMore: () => void;
}

const LandingDisclaimerModal = ({
  isOpen,
  onClose,
  disclaimerText,
  onAccept,
  onDecline,
  onLearnMore,
}: LandingDisclaimerModalProps): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full flex flex-col h-full max-h-[80vh]">
        <header className="w-full mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
            Disclaimer
          </h1>
        </header>

        <div className="flex-grow overflow-y-auto max-h-[50vh]">
          <section className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-sm md:text-base text-gray-700 text-center whitespace-normal break-words">
              {React.Children.map(disclaimerText, (child) => {
                if (typeof child === 'string') {
                  return (
                    <span className="whitespace-normal break-words">
                      {child}
                    </span>
                  );
                }
                return React.cloneElement(child as React.ReactElement<any, any>, {
                  className: `${
                    (child as React.ReactElement<any, any>).props.className || ''
                  } whitespace-normal break-words max-w-full`,
                });
              })}
            </div>
          </section>
        </div>

        <ul className="bg-white p-4 rounded-lg shadow-md space-y-2">
          <li className="text-sm md:text-base text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
            This content may include explicit language or imagery
          </li>
          <li className="text-sm md:text-base text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
            Viewer discretion is advised
          </li>
          <li className="text-sm md:text-base text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
            You must be 18+ to view unrestricted content
          </li>
        </ul>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-3 gap-3">
            <button
              id="exit-disclaimer-button"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={onClose}
              aria-label="Exit disclaimer"
              style={{ fontSize: '1rem' }}
            >
              Exit
            </button>
            <button
              id="continue-restricted-button"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              onClick={() => {
                sessionStorage.setItem("NSFW-Disclaimer-Accepted", "false");
                onDecline();
              }}
              aria-label="Continue with restrictions (SFW)"
              style={{ fontSize: '1rem' }}
            >
              Continue (SFW)
            </button>
            <button
              id="accept-disclaimer-button"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={() => {
                sessionStorage.setItem("NSFW-Disclaimer-Accepted", "true");
                onAccept();
              }}
              aria-label="Accept disclaimer (NSFW)"
              style={{ fontSize: '1rem' }}
            >
              Accept (NSFW)
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Optional: Default props (TypeScript doesn't use PropTypes)
LandingDisclaimerModal.defaultProps = {
  disclaimerText: 'Please review the terms and conditions.',
} as Partial<LandingDisclaimerModalProps>;

export default LandingDisclaimerModal;