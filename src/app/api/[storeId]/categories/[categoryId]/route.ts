import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismaDb from '~/lib/prisma-db'

const DELETE = async (_req: Request, { params }: { params: { storeId: string; categoryId: string } }) => {
  try {
    const { userId } = auth()

    const { storeId, categoryId } = params

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 })
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

    const category = await prismaDb.category.delete({
      where: {
        id: categoryId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

const PATCH = async (req: Request, { params }: { params: { storeId: string; categoryId: string } }) => {
  try {
    const { userId } = auth()
    const { name, billboardId } = await req.json()

    const { storeId, categoryId } = params

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 })
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

    const category = await prismaDb.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        billboardId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

export { DELETE, PATCH }
