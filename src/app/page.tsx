'use client';

import { LandingDesktop } from './landing-desktop';
import { LandingMobile } from './landing-mobile';

// Wrapper: CSS-only responsive switch — no JS flash, no layout shift.
// Mobile (<= 1024px) renders LandingMobile, Desktop (> 1024px) renders LandingDesktop.
// Both are rendered in the DOM; CSS hides the irrelevant one immediately.

export default function LandingPage() {
  return (
    <>
      {/* Mobile landing — hidden on lg+ */}
      <div className="lg:hidden">
        <LandingMobile />
      </div>

      {/* Desktop landing — hidden below lg */}
      <div className="hidden lg:block">
        <LandingDesktop />
      </div>
    </>
  );
}
