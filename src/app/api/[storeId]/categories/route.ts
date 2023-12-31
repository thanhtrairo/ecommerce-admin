import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismaDb from '~/lib/prisma-db'
import { ICategory } from '~/lib/types'

const POST = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { userId } = auth()
    const { name, billboardId }: ICategory = await req.json()

    const { storeId } = params

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 })
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

    const category = await prismaDb.category.create({
      data: {
        name,
        billboardId,
        storeId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    return new NextResponse('Internal server', { status: 500 })
  }
}

const GET = async (_req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { storeId } = params
    if (!storeId) {
      return new NextResponse('Store id id is required', { status: 400 })
    }

    const categories = await prismaDb.category.findMany({
      where: {
        storeId,
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    return new NextResponse('Internal server', { status: 500 })
  }
}

export { POST, GET }
