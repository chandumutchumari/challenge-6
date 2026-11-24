import React from 'react';
import { HeroSection } from './landing/HeroSection';
import { WorkflowSection } from './landing/WorkflowSection';
import { TransparencySection } from './landing/TransparencySection';
import { FAQSection } from './landing/FAQSection';

interface LandingPageProps {
  onCheckMyArea: () => void;
  onExplore: () => void;
}

/**
 * LandingPage component
 * Decision-grade landing page explaining BreatheWise AI value proposition,
 * three-step decision workflow, transparency framework, and FAQ.
 */
export const LandingPage: React.FC<LandingPageProps> = ({ onCheckMyArea, onExplore }) => {
  return (
    <div className="space-y-20 pb-16">
      <HeroSection onCheckMyArea={onCheckMyArea} onExplore={onExplore} />
      <WorkflowSection />
      <TransparencySection />
      <FAQSection />
    </div>
  );
};
