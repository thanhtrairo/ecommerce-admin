import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'

import prismaDb from '~/lib/prismaDb'

export default async function SetupLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await prismaDb.store.findFirst({
    where: {
      userId,
    },
  })

  if (store) {
    redirect(`/${store.id}`)
  }

  return <>{children}</>
}
