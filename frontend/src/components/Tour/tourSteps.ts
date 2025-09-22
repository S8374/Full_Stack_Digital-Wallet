// src/utils/tourSteps.ts
export const getTourSteps = (isAuthenticated: boolean, userRole?: string) => {
  const baseSteps = [
    {
      element: '',
      popover: {
        title: '🚀 Welcome to DigitalWallet',
        description: 'This is your main navigation. Explore different sections of our platform.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '.theme-toggle',
      popover: {
        title: '🌓 Theme Customization',
        description: 'Switch between light and dark mode based on your preference for comfortable browsing.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '',
      popover: {
        title: '✨ Discover Features',
        description: 'Discover our features and learn how DigitalWallet can simplify your financial life.',
        side: 'top',
        align: 'center',
      },
    }
  ];

  if (isAuthenticated) {
    const authSteps = [
      {
        element: '.user-profile',
        popover: {
          title: '👤 Your Profile',
          description: 'Access your profile, settings, and account management options here.',
          side: 'bottom',
          align: 'start',
        },
      }
    ];

    if (userRole === 'admin' || userRole === 'agent') {
      authSteps.push(
        {
          element: '.dashboard-stats',
          popover: {
            title: '📊 Dashboard Overview',
            description: 'Monitor key metrics and performance indicators at a glance.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '.data-table',
          popover: {
            title: '🔍 Smart Filtering',
            description: 'Easily search, filter, and manage records with our intuitive table interface.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '.charts-section',
          popover: {
            title: '📈 Data Visualization',
            description: 'Visualize trends and patterns with interactive charts and graphs.',
            side: 'top',
            align: 'center',
          },
        }
      );
    }

    return [...baseSteps, ...authSteps];
  }

  return baseSteps;
};