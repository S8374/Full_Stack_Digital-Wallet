/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Tour/TourGuide.tsx
import { useState, useEffect } from 'react';
import Joyride, { type Step, type CallBackProps, STATUS, EVENTS, ACTIONS } from 'react-joyride';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/components/Providers/Theme/theme-provider';

interface TourGuideProps {
  isAuthenticated: boolean;
  userRole?: string;
}

export default function TourGuide({ isAuthenticated, userRole }: TourGuideProps) {
  const [runTour, setRunTour] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const { theme } = useTheme();
  const location = useLocation();

  console.log('tour role', userRole);

  // Check if user has seen the tour before
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      // Wait for page to load completely
      const timer = setTimeout(() => {
        setRunTour(true);
        localStorage.setItem('hasSeenTour', 'true');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Reset tour when route changes
  useEffect(() => {
    setTourStepIndex(0);
  }, [location.pathname]);

  const getTourSteps = (): Step[] => {
    const baseSteps: Step[] = [
      {
        target: 'nav[role="navigation"]',
        content: 'Welcome to DigitalWallet! This is your main navigation. Explore different sections of our platform.',
        title: '🚀 Welcome to DigitalWallet',
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: '.theme-toggle',
        content: 'Switch between light and dark mode based on your preference for comfortable browsing.',
        title: '🌓 Theme Customization',
        placement: 'bottom',
      },
      {
        target: '.login',
        content: 'Discover our features and learn how DigitalWallet you can login now if you have a account.',
        title: '✨ Login Features',
        placement: 'bottom',
        disableScrolling: true,
      },
      {
        target: '.reg',
        content: 'Lets Join us a member you need create a user',
        title: '✨ Registration Features',
        placement: 'bottom',
        disableScrolling: true,
      }
    ];

    if (isAuthenticated) {
      const authSteps: Step[] = [
        {
          target: '.user-profile',
          content: 'Access your profile, settings, and account management options here.',
          title: '👤 Your Profile',
          placement: 'bottom',
        },
        {
          target: '.goDashboard',
          content: 'Access a dashboard and find all important features.',
          title: '👤 Your Profile',
          placement: 'bottom',
        }
      ];

      console.log('tour role', userRole);

      if (userRole === 'admin' || userRole === 'agent') {
        authSteps.push(
          {
            target: '.dashboard-stats',
            content: 'Monitor key metrics and performance indicators at a glance.',
            title: '📊 Dashboard Overview',
            placement: 'bottom',
          },
          {
            target: '.data-table',
            content: 'Easily search, filter, and manage records with our intuitive table interface.',
            title: '🔍 Smart Filtering',
            placement: 'top',
          },
          {
            target: '.charts-section',
            content: 'Visualize trends and patterns with interactive charts and graphs.',
            title: '📈 Data Visualization',
            placement: 'top',
          }
        );
      }

      return [...baseSteps, ...authSteps];
    }

    return baseSteps;
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, index, type } = data;

    // Handle tour completion or skipping
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      setRunTour(false);
      setTourStepIndex(0);
      return;
    }

    // Handle close button click
    if (action === ACTIONS.CLOSE) {
      setRunTour(false);
      setTourStepIndex(0);
      return;
    }

    // Handle next/back navigation
    if (type === EVENTS.STEP_AFTER) {
      setTourStepIndex(index + (action === ACTIONS.NEXT ? 1 : -1));
    }

    // Handle target not found
    if (type === EVENTS.TARGET_NOT_FOUND) {
      // Skip to next step if target not found
      setTourStepIndex(index + 1);
    }
  };

  const restartTour = () => {
    setTourStepIndex(0);
    setRunTour(true);
  };

  const themeColors = {
    primary: theme === 'dark' ? '#3b82f6' : '#2563eb',
    text: theme === 'dark' ? '#ffffff' : '#1f2937',
    background: theme === 'dark' ? '#1f2937' : '#ffffff',
    overlay: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
  };

  return (
    <>
      <Joyride
        steps={getTourSteps()}
        run={runTour}
        stepIndex={tourStepIndex}
        callback={handleJoyrideCallback}
        continuous={true}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        disableOverlayClose={false}
        hideCloseButton={false}
        styles={{
          options: {
            arrowColor: themeColors.background,
            backgroundColor: themeColors.background,
            overlayColor: themeColors.overlay,
            primaryColor: themeColors.primary,
            textColor: themeColors.text,
            zIndex: 10000,
          },
          tooltip: {
            borderRadius: 12,
            padding: 20,
            fontSize: '16px',
            lineHeight: '1.5',
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          buttonNext: {
            backgroundColor: themeColors.primary,
            color: '#ffffff',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: '14px',
          },
          buttonBack: {
            color: themeColors.primary,
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: '14px',
            marginRight: '8px',
          },
          buttonSkip: {
            color: themeColors.text,
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: '14px',
          },
          buttonClose: {
            color: themeColors.text,
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '16px',
          }
        }}
        locale={{
          back: 'Back',
          close: 'Close',
          last: 'Finish',
          next: 'Next',
          skip: 'Skip',
        }}
      />

      {/* Tour Control Button - Only show when tour is not running */}
      {!runTour && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={restartTour}
            className="rounded-full w-12 h-12 p-0 shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
            title="Restart Tour"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      )}
    </>
  );
}