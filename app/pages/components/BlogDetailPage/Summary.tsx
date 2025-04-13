/**
 * Summary component
 *
 * This component displays a brief summary of the blog post content.
 *
 * @component
 * @param {SummaryProps} props - The component props.
 * @returns {JSX.Element} The rendered summary component.
 *
 * @prop {string} summary - The summary text to display. If not provided, a default message will be shown.
 *
 * @example
 * <Summary summary="Your summary text here" />
 *
 * @file Summary.tsx
 */
import React, { type JSX } from 'react';

// Define interface for type safety
interface SummaryProps {
  summary: string;
}

function Summary({ summary }: SummaryProps): JSX.Element {
  return (
    <section className="mb-8" id="summary-section">
      <h2 className="mb-4 text-2xl font-semibold" id="summary-title">
        Summary
      </h2>
      <div
        className="overflow-hidden transition-all duration-300 max-h-full"
        id="summary-content"
      >
        <p className="leading-relaxed text-white text-opacity-80">
          {summary || 'AI summary goes here'}
        </p>
      </div>
    </section>
  );
}

export default Summary;