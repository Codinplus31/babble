import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new Promise((resolve, reject) => {
  let uploadStream =    cloudinary.uploader.upload_stream(
        { resource_type: 'video', format:"mp4" },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            resolve(NextResponse.json({ error: 'Upload failed' }, { status: 500 }))
          } else {
            resolve(NextResponse.json({ url: result?.secure_url }))
          }
        }
      )
      streamifier.createReadStream(buffer).pipe(uploadStream);
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
    }
