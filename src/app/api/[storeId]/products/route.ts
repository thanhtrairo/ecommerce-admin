import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismaDb from '~/lib/prisma-db'
import { IProduct } from '~/lib/types'

const POST = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { userId } = auth()
    const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived }: IProduct = await req.json()

    const { storeId } = params

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!price) {
      return new NextResponse('Price is required', { status: 400 })
    }

    if (!images || !images.length) {
      return new NextResponse('Images are required', { status: 400 })
    }

    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 })
    }

    if (!colorId) {
      return new NextResponse('Color id is required', { status: 400 })
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

    const product = await prismaDb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { storeId } = params
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined
    const colorId = searchParams.get('colorId') || undefined
    const sizeId = searchParams.get('sizeId') || undefined
    const isFeatured = searchParams.get('isFeatured')

    if (!storeId) {
      return new NextResponse('Store id id is required', { status: 400 })
    }

    const products = await prismaDb.product.findMany({
      where: {
        storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    return new NextResponse('Internal server', { status: 500 })
  }
}

export { POST, GET }
