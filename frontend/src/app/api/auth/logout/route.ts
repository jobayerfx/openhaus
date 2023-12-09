import { getSession } from 'next-auth/react';
export default async function handler(req, res) {
    const session = await getSession({ req });

    if (session) {
      // Destroy the session
      await res.clearPreviewData(); // Optional, if you use preview mode
      await res.raw.end();
  
      // Redirect to the home page or a specific URL after logout
      return res.redirect('/');
    }
  
    // Redirect to a specific URL
    res.redirect('/');
  }