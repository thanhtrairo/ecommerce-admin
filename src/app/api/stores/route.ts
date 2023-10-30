import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismaDb from '~/lib/prismaDb'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    if (!name) {
      return new NextResponse('Name is Required', { status: 400 })
    }

    const store = await prismaDb.store.create({
      data: {
        name,
        userId,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}
