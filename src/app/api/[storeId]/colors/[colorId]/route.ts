import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismaDb from '~/lib/prisma-db'
import { IColor } from '~/lib/types'

const DELETE = async (_req: Request, { params }: { params: { storeId: string; colorId: string } }) => {
  try {
    const { userId } = auth()
    const { colorId, storeId } = params

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!colorId) {
      return new NextResponse('Color id is required', { status: 400 })
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

    const color = await prismaDb.color.delete({
      where: {
        id: colorId,
      },
    })

    return NextResponse.json(color)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

const PATCH = async (req: Request, { params }: { params: { storeId: string; colorId: string } }) => {
  try {
    const { userId } = auth()
    const { name, value }: IColor = await req.json()

    const { colorId, storeId } = params

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!value) {
      return new NextResponse('Value is required', { status: 400 })
    }

    if (!colorId) {
      return new NextResponse('Color id is required', { status: 400 })
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

    const color = await prismaDb.color.update({
      where: {
        id: colorId,
      },
      data: {
        name,
        value,
      },
    })

    return NextResponse.json(color)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

const GET = async (_req: Request, { params }: { params: { colorId: string } }) => {
  try {
    const { colorId } = params
    if (!colorId) {
      return new NextResponse('Color id is required', { status: 400 })
    }

    const color = await prismaDb.color.findUnique({
      where: {
        id: colorId,
      },
    })

    return NextResponse.json(color)
  } catch (error) {
    return new NextResponse('Internal server', { status: 500 })
  }
}

export { DELETE, PATCH, GET }
