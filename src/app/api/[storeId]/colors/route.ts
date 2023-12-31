import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

import prismaDb from '~/lib/prisma-db'
import { IColor } from '~/lib/types'

const POST = async (req: NextRequest, { params }: { params: { storeId: string } }) => {
  try {
    const { userId } = auth()

    const { name, value }: IColor = await req.json()

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

const GET = async (_req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { storeId } = params
    if (!storeId) {
      return new NextResponse('Store id id is required', { status: 400 })
    }

    const colors = await prismaDb.color.findMany({
      where: {
        storeId,
      },
    })

    return NextResponse.json(colors)
  } catch (error) {
    return new NextResponse('Internal server', { status: 500 })
  }
}

export { POST, GET }
