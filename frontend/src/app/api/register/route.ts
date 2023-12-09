import { NextResponse } from "next/server";
import axios from 'axios';

export const POST = async (request: any) => {
  const { email, username, password } = await request.json();


  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`, {
      email, username, password
    });
    const user = response.data.data;
    return new NextResponse("User is registered", { status: 200 });
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const errorMessage = error.response.data.message || "An error occurred";
      return new NextResponse(errorMessage, { status });
    } else if (error.request) {
      // The request was made but no response was received
      return new NextResponse("No response received", { status: 500 });
    } else {
      // Something happened in setting up the request that triggered an Error
      return new NextResponse("Error setting up the request", { status: 500 });
    }
  }
};
