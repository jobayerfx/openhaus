import { getSession, getServerSession } from 'next-auth/react';
import axios from 'axios';

export const callApiWithToken = async (url, method = 'GET', body = null, token=null) => {
  // Get the current session
  // const session = await getServerSession();
  // console.log(session);
  if (!token) {
    throw new Error('User not authenticated');
  }

  // Access the JWT token from the session object
  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const options = {
      method,
      headers,
      data: body,
    };

    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL + url;

    const response = await axios(apiUrl, options);
    return response.data;

  } catch (error) {
    // Handle axios error
    console.error('Error making API request:', error);
    throw new Error('Internal server error');
  }
};