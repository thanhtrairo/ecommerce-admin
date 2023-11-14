import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismaDb from '~/lib/prisma-db'

const POST = async (req: Request) => {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name }: { name: string } = body

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is Required', { status: 400 })
    }

    const storeExist = await prismaDb.store.findFirst({
      where: {
        name,
        userId,
      },
    })

    if (storeExist?.id) {
      return new NextResponse('Store already exist', { status: 400 })
    }

    const store = await prismaDb.store.create({
      data: {
        userId,
        name,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

export { POST }
