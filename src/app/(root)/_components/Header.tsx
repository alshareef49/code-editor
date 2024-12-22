import { currentUser } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser'
import React from 'react'

async function Header() {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const user = await currentUser();
  return (
    <div>Header</div>
  )
}

export default Header