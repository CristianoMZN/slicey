export default {
  failed: 'Action failed',
  success: 'Action was successful',
  settings: {
    title: 'Settings',
    subtitle: 'Manage your account and preferences',
    sections: {
      account: 'Account',
      appearance: 'Appearance',
      language: 'Language',
      content: 'Content preferences',
      session: 'Session',
    },
    account: {
      email: 'E-mail',
      accountType: 'Account type',
      creatorStatus: 'Creator status',
      types: {
        anonymous: 'Visitor',
        registered: 'Registered',
        creator: 'Creator',
      },
      creatorStatuses: {
        'not-applicable': 'N/A',
        'pending-review': 'Under review',
        approved: 'Approved',
      },
    },
    appearance: {
      darkMode: 'Dark mode',
      darkModeCaption: 'Switch between light and dark interface',
    },
    language: {
      label: 'Interface language',
      caption: 'Saved in your browser for next visits',
    },
    content: {
      interestedIn: 'Interested in',
      interestedInCaption: 'Filter profiles by gender',
      interestedSexuality: 'Profile type',
      interestedSexualityCaption: 'Filter by profile type',
      options: {
        interestedIn: {
          Mulheres: 'Women',
          Homens: 'Men',
          Ambos: 'Both',
        },
        interestedSexuality: {
          Cis: 'Cis',
          Trans: 'Trans',
          Ambos: 'Both',
        },
      },
    },
    session: {
      logout: 'Sign out',
      logoutCaption: 'End your current session',
    },
  },
  notFound: {
    title: 'Lost in Space!',
    subtitle: "The page you're looking for has drifted into the void.",
    hint: "Don't worry — even the best explorers get lost sometimes.",
    goHome: 'Beam me home',
  },
};

