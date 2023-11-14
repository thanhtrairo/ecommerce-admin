import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismaDb from '~/lib/prisma-db'

const POST = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { userId } = auth()
    const { name, value } = await req.json()

    const { storeId } = params

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!value) {
      return new NextResponse('Value is required', { status: 400 })
    }

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('store id invalid', { status: 400 })
    }

    const color = await prismaDb.color.create({
      data: {
        name,
        value,
        storeId,
      },
    })

    return NextResponse.json(color)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

export { POST }
