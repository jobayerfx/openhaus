import { NextResponse } from "next/server";
import { callApiWithToken } from '@/utils/api';
import { getToken } from 'next-auth/jwt'

export const POST = async (request: any) => {

    const session = await getToken({ req: request })
    // console.log(session.apiToken);
    const responseData = await callApiWithToken('/auth/me', 'GET', null, session.apiToken);

  // Send a response
  return new NextResponse(JSON.stringify(responseData.data), { status: 200 });
// } else {
//   // If there's no session, the user is not authenticated
//   return new NextResponse('err', {
//     status: 500,
//   });
// }
};
