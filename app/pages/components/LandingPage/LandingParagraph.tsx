import type { JSX } from "react";

/**
 * LandingParagraph.tsx
 * LandingParagraph component displays a paragraph of text
 * that reflects on the relationship between technology, magic, and art.
 *
 * @component
 * @returns {JSX.Element} A paragraph element containing the text.
 */
const LandingParagraph = (): JSX.Element => {
  return (
    <div>
      <p
        id="landing-paragraph"
        className="self-stretch mt-10 text-stone-500 max-md:max-w-full"
      >
        Any sufficiently advanced{' '}
        <span className="text-blue-600">Technology</span> is indistinguishable
        from <span className="text-yellow-600">Magic</span>.
        <br />
        Any sufficiently advanced <span className="text-yellow-600">Magic</span>{' '}
        is indistinguishable from <span className="text-green-600">Art</span>.
        <br />
        Any sufficiently advanced <span className="text-green-600">Art</span> is
        indistinguishable from <span className="text-blue-600">Technology</span>.
        <br />
        <span className="text-red-900">
          <a
            href="https://ourladyofperpetualchaos.substack.com/p/chaos-manual-v1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Do you pray at the <span className="underline">altar of Chaos</span>?
          </a>
        </span>
      </p>
    </div>
  );
};

export default LandingParagraph;