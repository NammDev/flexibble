import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
})

export async function POST(request: Request) {
  const { path } = await request.json()
  if (!path) return NextResponse.json({ messsage: 'Image path is required' }, { status: 400 })
  try {
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      transformation: [{ width: 1000, height: 752, crop: 'scale' }],
    }
    const result = await cloudinary.uploader.upload(path, options)
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 })
  }
}
