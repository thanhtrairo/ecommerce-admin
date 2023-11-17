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

    const size = await prismaDb.size.create({
      data: {
        name,
        value,
        storeId,
      },
    })

    return NextResponse.json(size)
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

    const sizes = await prismaDb.size.findMany({
      where: {
        storeId,
      },
    })

    return NextResponse.json(sizes)
  } catch (error) {
    return new NextResponse('Internal server', { status: 500 })
  }
}

export { POST, GET }
