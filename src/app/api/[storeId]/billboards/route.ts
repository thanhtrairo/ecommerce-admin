import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismaDb from '~/lib/prisma-db'
import { IBillboard } from '~/lib/types'

const POST = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { userId } = auth()
    const { label, imageUrl }: IBillboard = await req.json()

    const { storeId } = params

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!label) {
      return new NextResponse('label is required', { status: 400 })
    }

    if (!imageUrl) {
      return new NextResponse('image url is required', { status: 400 })
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

    const billboard = await prismaDb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

export { POST }
