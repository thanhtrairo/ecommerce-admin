import { redirect } from 'next/navigation'

import Navbar from '~/components/navbar'
import withRequiredLogin from '~/hocs/with-required-login'
import prismaDb from '~/lib/prisma-db'

type DashboardLayoutProps = {
  userId: string
  params: {
    storeId: string
  }
  children: React.ReactNode
}

const DashboardLayout = async ({ userId, params, children }: DashboardLayoutProps) => {
  const store = await prismaDb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  })

  if (!store) {
    redirect('/')
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default withRequiredLogin(DashboardLayout)
