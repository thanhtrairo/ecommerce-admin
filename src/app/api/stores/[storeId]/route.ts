import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismaDb from '~/lib/prisma-db'

const PATCH = async (req: Request, { params }: { params: { storeId: string } }) => {
  const { userId } = auth()
  const body = await req.json()

  const { storeId } = params
  const { name } = body

  if (!userId) {
    return new NextResponse('Unauthenticated', { status: 401 })
  }

  if (!name) {
    return new NextResponse('Name is required', { status: 400 })
  }

  if (!storeId) {
    return new NextResponse('Store id is required', { status: 400 })
  }

  const storeExist = await prismaDb.store.findFirst({
    where: {
      NOT: {
        id: storeId,
      },
      name,
      userId,
    },
  })

  if (storeExist?.id) {
    return NextResponse.json({ message: 'Store already exist' }, { status: 400 })
  }

  const store = await prismaDb.store.update({
    where: {
      id: storeId,
      userId,
    },
    data: {
      name,
    },
  })

  return NextResponse.json(store)
}

const DELETE = async (_req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { userId } = auth()
    const { storeId } = params

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    const store = await prismaDb.store.delete({
      where: {
        id: storeId,
        userId,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

export { PATCH, DELETE }
