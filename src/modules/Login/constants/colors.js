// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Centralized color constants for the Login module
 * Provides consistent theming across all Login components
 */
export const LOGIN_COLORS = {
  // Brand Colors - Career Match AI palette
  logoNavy: '#1E3A52',
  logoNavyLight: '#2A3D4F',
  logoTeal: '#4A90A4',
  emeraldPrimary: '#059669',
  emeraldLight: '#10B981',
  emeraldAccent: '#047857',
  
  // Accent Colors
  forestGreen: '#065F46',
  seaGreen: '#16A085',
  mintGreen: '#00D8A3',
  tealGreen: '#14B8A6',
  emeraldBright: '#34D399',
  shakespeare: '#4A90A4',
  pictonBlue: '#5BA3D4',
  viking: '#4A90A4',
  diSerria: '#059669',
  
  // Theme Colors
  navyDark: '#0F1419',
  darkBlue: '#1E3A52',
  darkTeal: '#1E3A52',
  blueAccent: '#3D6B99',
  blueHighlight: '#4A7BA7',
  botticelli: '#B8D4E3',
  lightGreen: '#A7F3D0'
}

/**
 * Dark mode color variants for dynamic theming
 */
export const DARK_MODE_VARIANTS = {
  [LOGIN_COLORS.logoNavy]: [LOGIN_COLORS.logoNavy, LOGIN_COLORS.darkBlue],
  [LOGIN_COLORS.logoTeal]: [LOGIN_COLORS.darkTeal, LOGIN_COLORS.logoTeal],
  [LOGIN_COLORS.emeraldPrimary]: [LOGIN_COLORS.emeraldAccent, LOGIN_COLORS.emeraldLight],
  [LOGIN_COLORS.forestGreen]: [LOGIN_COLORS.forestGreen, LOGIN_COLORS.emeraldPrimary],
  [LOGIN_COLORS.shakespeare]: [LOGIN_COLORS.blueAccent, LOGIN_COLORS.shakespeare]
}

/**
 * Featured projects data configuration
 */
export const FEATURED_PROJECTS_CONFIG = [
  {
    name: 'Bounty Coin of course 😎',
    icon: 'faCoins',
    color: LOGIN_COLORS.logoNavy,
    link: 'https://focus.xyz/BountyCoin',
    description: 'The Coin That Pays You to HODL.',
    gradientColors: [LOGIN_COLORS.logoNavy, LOGIN_COLORS.logoTeal]
  },
  {
    name: 'John Jardin Club',
    icon: 'faUsers',
    color: LOGIN_COLORS.logoTeal,
    link: 'https://focus.xyz/JohnJardin',
    description: 'Earn with John Jardin on his journey to Web3 awesomeness.',
    gradientColors: [LOGIN_COLORS.logoTeal, LOGIN_COLORS.viking]
  },
  {
    name: '$DESO Staking',
    icon: 'faMoneyBillWave',
    color: LOGIN_COLORS.logoGold,
    link: 'https://explorer.deso.com/validators',
    description: 'Stake $DESO on Validators to earn rewards.',
    gradientColors: [LOGIN_COLORS.logoGold, LOGIN_COLORS.diSerria]
  },
  {
    name: 'DeSoOps',
    icon: 'faCode',
    color: LOGIN_COLORS.orange,
    link: 'https://desoops.com',
    description: 'Join the community who help fund and earn by growing the DeSoOps Portal.',
    gradientColors: [LOGIN_COLORS.orange, LOGIN_COLORS.diSerria]
  },
  {
    name: 'More Coming Soon',
    icon: 'faStar',
    color: LOGIN_COLORS.shakespeare,
    link: '',
    description: 'Stay tuned for more exciting projects joining the ecosystem',
    gradientColors: [LOGIN_COLORS.shakespeare, LOGIN_COLORS.pictonBlue]
  }
] 