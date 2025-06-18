// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!

/**
 * Centralized color constants for the Login module
 * Provides consistent theming across all Login components
 */
export const LOGIN_COLORS = {
  // Brand Colors
  logoNavy: '#0D2035',
  logoNavyLight: '#1A3B5A',
  logoTeal: '#3A8B9F',
  logoGold: '#CFAB6F',
  logoGoldDark: '#B18B50',
  logoGoldAccent: '#DCAC55',
  
  // Accent Colors
  orange: '#FF7F50',
  shakespeare: '#3FB1D4',
  pictonBlue: '#1EC9EA',
  viking: '#4DC7DC',
  diSerria: '#DCAA55',
  
  // Theme Colors
  navyDark: '#0A1929',
  darkBlue: '#0E4173',
  darkTeal: '#205E6B',
  blueAccent: '#2C5282',
  blueHighlight: '#3182CE',
  botticelli: '#C4D8E5',
  lightGold: '#E6C389'
}

/**
 * Dark mode color variants for dynamic theming
 */
export const DARK_MODE_VARIANTS = {
  [LOGIN_COLORS.logoNavy]: [LOGIN_COLORS.logoNavy, LOGIN_COLORS.darkBlue],
  [LOGIN_COLORS.logoTeal]: [LOGIN_COLORS.darkTeal, LOGIN_COLORS.logoTeal],
  [LOGIN_COLORS.logoGold]: [LOGIN_COLORS.logoGoldDark, LOGIN_COLORS.logoGoldAccent],
  [LOGIN_COLORS.orange]: [LOGIN_COLORS.orange, LOGIN_COLORS.diSerria],
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