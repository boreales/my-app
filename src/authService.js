// authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5001';

export const createToken = async (uid) => {
  try {
    const response = await axios.post(`${API_URL}/createToken`, { uid });
    return response.data.customToken;
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
};

export const verifyToken = async (idToken) => {
  try {
    const response = await axios.post(`${API_URL}/verifyToken`, { idToken });
    return response.data.decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
};
