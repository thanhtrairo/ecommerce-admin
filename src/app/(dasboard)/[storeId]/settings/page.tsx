import { redirect } from 'next/navigation'

import { SettingsForm } from './components/settings-form'
import withRequiredLogin from '~/hocs/with-required-login'
import prismaDb from '~/lib/prisma-db'

type SettingPageProps = {
  userId: string
  params: {
    storeId: string
  }
}

const SettingsPage = async ({ userId, params }: SettingPageProps) => {
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
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}

export default withRequiredLogin(SettingsPage)
