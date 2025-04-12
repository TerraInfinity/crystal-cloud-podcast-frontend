/**
 * LandingDisclaimer.tsx
 * LandingDisclaimer component displays a modal with a disclaimer message.
 *
 * @component
 * @param {LandingDisclaimerProps} props - The component props.
 * @returns {JSX.Element} The rendered modal component.
 */

import type { JSX } from 'react';
import LandingDisclaimerModal from './LandingDisclaimerModal';

interface LandingDisclaimerProps {
  isOpen: boolean;
  onAccept: () => void;
  onDeny: () => void;
  onClose: () => void;
}

const LandingDisclaimer = ({
  isOpen,
  onAccept,
  onDeny,
  onClose,
}: LandingDisclaimerProps): JSX.Element => {
  console.log("LandingDisclaimer isOpen:", isOpen); // Log the open state of the modal

  return (
    <LandingDisclaimerModal
      isOpen={isOpen}
      onClose={onClose}
      disclaimerText={
        <>
          <span id="disclaimer-heading" style={{ fontSize: 'small', textShadow: '2px 2px 4px green' }}>
            <em>"To believe in something, it must be true..."</em>
          </span>
          <p id="disclaimer-text">
            Please Read Carefully Before Proceeding
            {/* Disclaimer content explaining the nature of the platform */}
            By accessing this platform, you acknowledge that the content contains
            mature, controversial, and morally complex themes, including
            adult-oriented hypnotic material, esoteric spiritual technologies, and
            potentially suggestive or explicit content (which may include
            pornographic material). This includes discussions and depictions of
            sexuality, dissociation, near-death experiences, trauma, and
            psychological states that some may find triggering, disrespectful, or
            unsettling. Viewer discretion is strongly advised.
            {/* Additional disclaimer content */}
            This platform is an experimental space dedicated to exploring the raw,
            authentic human condition through radical transparency, personal
            growth, and scientific curiosity. The creator offers an unfiltered
            account of their psychological evolution—from trauma and psychosis to
            recovery—as a means to elevate awareness, consciousness, and
            well-being. The content provides a scientifically honest account of
            human experiences, blending mental health experimentation with topics
            like dissociation, sexuality, near-death experiences, and how these
            tie into societal shadows and unconscious projections we both receive
            from and impose on others. This exploration seeks to illuminate the
            complex interplay between individual psyches and collective cultural
            dynamics.
            We emphasize that this content is not intended to cause harm or
            promote toxic, abusive, or non-consensual behaviors. Consent, mental
            health, and personal responsibility are paramount. Given the subtle
            bridge between experimental psychology, spirituality, and ethical
            principles, we take consent very seriously and prioritize it in all
            aspects of this platform. We urge users to engage with maturity and
            self-awareness, recognizing that this is not a substitute for
            professional medical or psychological advice and is not clinically
            validated—approach with caution and critical thinking.
            Freedom of expression is a cornerstone here. We assert that society's
            suppression of these topics, rather than their open exploration,
            perpetuates misunderstanding and harm. Healing and growth come from
            acknowledging and examining challenging truths, not silencing them. We
            respectfully request that any criticisms of the content consider the
            evolutionary pattern of growth and maturity and approach this
            sensitive topic through the lens of academia, with curiosity and
            critical analysis.
            The core essence of this platform is to provide an environment and
            imaginative psychological system for the purpose of elevating one's
            awareness, consciousness, and health. Our pure intention is to create
            a safe space for self-discovery, fostering the light of consciousness
            and grappling with the elusive nature of truth. If you believe this
            platform could better promote ethical, consensual, or healthy
            practices, we welcome constructive feedback. Our aim is to contribute
            to a more compassionate, aware society. If you're not prepared to
            engage responsibly, please exit now.
            By proceeding, you confirm:
          </p>
          <p>You are of legal age in your jurisdiction.</p>
          <p>You consent to viewing this content.</p>
          <p>You assume full responsibility for your experience.</p>
        </>
      }
      onAccept={onAccept}
      onDecline={onDeny}
      onLearnMore={() => {
        console.log('Learn more clicked');
        // Optionally, implement additional logic here, such as navigating to a page with more information
      }}
    />
  );
};

export default LandingDisclaimer;