import axios from 'axios'

/**
 * Initializes the portal by making a GET request to the Node-RED endpoint
 * @returns {Promise} A promise that resolves with the response data
 * @throws {Error} If the request fails
 */
export const initPortal = async (publicKey) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_NODERED_URL}/capatin/initPortal`, {
      headers: {
        'api-key': process.env.REACT_APP_AGILITE_API_KEY,
        'deso-public-key': publicKey
      }
    })

    return response.data
  } catch (error) {
    console.error('Error initializing portal:', error)
    throw error
  }
}
