import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

const POST = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { label, imageUrl } = body
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

export { POST }
