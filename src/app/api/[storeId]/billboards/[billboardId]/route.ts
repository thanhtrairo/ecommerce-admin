import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismaDb from '~/lib/prisma-db'
import { IBillboard } from '~/lib/types'

const DELETE = async (_req: Request, { params }: { params: { storeId: string; billboardId: string } }) => {
  try {
    const { userId } = auth()
    const { storeId, billboardId } = params

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
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

    const billboard = await prismaDb.billboard.delete({
      where: {
        id: billboardId,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    return new NextResponse('Internal server', { status: 500 })
  }
}

const PATCH = async (req: Request, { params }: { params: { storeId: string; billboardId: string } }) => {
  try {
    const { userId } = auth()
    const { label, imageUrl }: IBillboard = await req.json()

    const { storeId, billboardId } = params

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!label) {
      return new NextResponse('label is required', { status: 400 })
    }

    if (!imageUrl) {
      return new NextResponse('image url is required', { status: 400 })
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

    const billboard = await prismaDb.billboard.update({
      where: {
        id: billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    return new NextResponse('Internal server', { status: 500 })
  }
}

export { DELETE, PATCH }
