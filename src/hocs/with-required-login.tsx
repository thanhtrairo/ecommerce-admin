import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

type WrapComponentProps = {
  userId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any
  children: React.ReactNode
}

const withRequiredLogin = (WrapComponent: React.FC<WrapComponentProps>) => {
  const RequiredLogin = async (props: WrapComponentProps) => {
    const { userId } = auth()

    if (!userId) {
      redirect('/sign-in')
    }

    return <WrapComponent {...props} userId={userId} />
  }
  return RequiredLogin
}

export default withRequiredLogin
