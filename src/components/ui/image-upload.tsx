'use client'

import { CldUploadWidget, CldUploadWidgetResults } from 'next-cloudinary'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ImagePlus, Trash } from 'lucide-react'

import { Button } from '~/components/ui/button'

type ImageUploadProps = {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
}

const ImageUpload: React.FC<ImageUploadProps> = ({ disabled, onChange, onRemove, value }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onUpload = (result: CldUploadWidgetResults & { info?: { secure_url?: string } }) => {
    onChange(result.info?.secure_url || '')
  }

  if (!isMounted) {
    return null
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative h-[200px] w-[200px] overflow-hidden rounded-md">
            <div className="absolute right-2 top-2 z-10">
              <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="sm">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill={true} className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET_NAME}>
        {({ open }) => {
          const onClick = () => {
            open()
          }

          return (
            <Button type="button" disabled={disabled} variant="secondary" onClick={onClick}>
              <ImagePlus className="mr-2 h-4 w-4" />
              Upload an Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

export default ImageUpload
