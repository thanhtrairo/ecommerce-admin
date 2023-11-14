import { redirect } from 'next/navigation'

import prismaDb from '~/lib/prisma-db'
import withRequiredLogin from '~/hocs/with-required-login'

type SetupLayoutProps = {
  userId: string
  children: React.ReactNode
}

const SetupLayout = async ({ userId, children }: SetupLayoutProps) => {
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

export default withRequiredLogin(SetupLayout)
