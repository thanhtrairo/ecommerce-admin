import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismaDb from '~/lib/prisma-db'
import { IProduct } from '~/lib/types'

const DELETE = async (_req: Request, { params }: { params: { storeId: string; productId: string } }) => {
  try {
    const { userId } = auth()
    const { storeId, productId } = params

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!productId) {
      return new NextResponse('Product id is required', { status: 400 })
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

    const product = await prismaDb.product.delete({
      where: {
        id: productId,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

const PATCH = async (req: Request, { params }: { params: { storeId: string; productId: string } }) => {
  try {
    const { userId } = auth()
    const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived }: IProduct = await req.json()

    const { productId, storeId } = params

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!productId) {
      return new NextResponse('Product id is required', { status: 401 })
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

    const product = prismaDb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    })

    const image = prismaDb.image.createMany({
      data: images.map((image) => ({ ...image, productId })),
    })

    const productImage = await prismaDb.$transaction([product, image])

    return NextResponse.json(productImage)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

export { DELETE, PATCH }
