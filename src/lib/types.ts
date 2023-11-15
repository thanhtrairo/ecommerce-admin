export type IStore = {
  id: string
  name: string
  userId: string
  billboards: IBillboard[]
  categories: ICategory[]
  sizes: ISize[]
  colors: IColor[]
  products: IProduct[]
  createdAt: Date
  updatedAt: Date
}

export type IBillboard = {
  id: string
  label: string
  imageUrl: string
  storeId: string
  categories: ICategory[]
  createdAt: Date
  updatedAt: Date
}

export type ICategory = {
  id: string
  name: string
  storeId: string
  billboardId: string
  products: IProduct[]
  createdAt: Date
  updatedAt: Date
}

export type ISize = {
  id: string
  name: string
  value: string
  storeId: string
  products: IProduct[]
  createdAt: Date
  updatedAt: Date
}

export type IColor = {
  id: string
  name: string
  value: string
  storeId: string
  products: IProduct[]
  createdAt: Date
  updatedAt: Date
}

export type IProduct = {
  id: string
  name: string
  price: number
  isFeatured: boolean
  isArchived: boolean
  storeId: string
  categoryId: string
  sizeId: string
  colorId: string
  images: IImage[]
  createdAt: Date
  updatedAt: Date
}

export type IImage = {
  id: string
  url: string
  price: number
  productId: string
  createdAt: Date
  updatedAt: Date
}
