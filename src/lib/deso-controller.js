import { identity } from 'deso-protocol'

const desoConfigure = {
  appName: process.env.REACT_APP_NAME,
  spendingLimitOptions: {
    GlobalDESOLimit: 0.1 * 1e9 // 0.1 Deso
  }
}

export const getDeSoConfig = () => {
  return desoConfigure
}

export const desoLogin = async () => {
  try {
    return await identity.login()
  } catch (e) {
    return e
  }
}

export const desoLogout = async () => {
  try {
    await identity.logout()
    return
  } catch (e) {
    // Most likely the user cancelled the logout. We can leave it be
    return e
  }
}