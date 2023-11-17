import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismaDb from '~/lib/prisma-db'

const DELETE = async (_req: Request, { params }: { params: { storeId: string; sizeId: string } }) => {
  try {
    const { userId } = auth()
    const { sizeId, storeId } = params

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!sizeId) {
      return new NextResponse('Size id is required', { status: 400 })
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

    const size = await prismaDb.size.delete({
      where: {
        id: sizeId,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

const PATCH = async (req: Request, { params }: { params: { storeId: string; sizeId: string } }) => {
  try {
    const { userId } = auth()
    const { name, value } = await req.json()

    const { sizeId, storeId } = params

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!value) {
      return new NextResponse('Value is required', { status: 400 })
    }

    if (!sizeId) {
      return new NextResponse('Size id is required', { status: 400 })
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

    const size = await prismaDb.size.update({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

const GET = async (_req: Request, { params }: { params: { sizeId: string } }) => {
  try {
    const { sizeId } = params
    if (!sizeId) {
      return new NextResponse('Size id is required', { status: 400 })
    }

    const size = await prismaDb.size.findUnique({
      where: {
        id: sizeId,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    return new NextResponse('Internal server', { status: 500 })
  }
}

export { DELETE, PATCH, GET }
