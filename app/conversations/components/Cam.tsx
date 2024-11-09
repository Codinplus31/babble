'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Loader2, Video, Upload, AlertCircle } from "lucide-react"
//import { X } from 'lucide-react'
export default function VideoRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [duration, setDuration] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const parseDuration = (input: string): number | null => {
    const match = input.match(/^(\d+)\s*(seconds?|minutes?)$/)
    if (!match) return null
    const value = parseInt(match[1], 10)
    const unit = match[2]
    return unit.startsWith('minute') ? value * 60 : value
  }

  const startRecording = useCallback(async () => {
    const durationInSeconds = parseDuration(duration)
    if (!durationInSeconds) {
      setError('Invalid duration format. Please use "X seconds" or "X minutes".')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        setVideoBlob(blob)
        chunksRef.current = []
        uploadToCloudinary(blob)
      }
      mediaRecorder.start()
      setIsRecording(true)
      setError(null)
      setTimeLeft(durationInSeconds)

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === null || prevTime <= 1) {
            clearInterval(timerRef.current!)
            mediaRecorder.stop()
            setIsRecording(false)
            return null
          }
          return prevTime - 1
        })
      }, 1000)
    } catch (error) {
      console.error('Error accessing media devices:', error)
      setError('Failed to access camera and microphone. Please ensure you have granted the necessary permissions.')
    }
  }, [duration])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setTimeLeft(null)
    }
  }, [])

  const uploadToCloudinary = useCallback(async (blob: Blob) => {
    setIsUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', blob, 'recorded-video.webm')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setUploadedUrl(data.url)
      console.log('Video uploaded successfully:', data.url)
    } catch (error) {
      console.error('Error uploading video:', error)
      setError('Failed to upload video. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-6 w-6" />
          Video Recorder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-video bg-gray-200 rounded-md flex items-center justify-center">
          <div className="text-center">
            {isRecording ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm font-medium">Recording in progress...</p>
                {timeLeft !== null && (
                  <p className="text-sm font-medium mt-2">Time left: {timeLeft} seconds</p>
                )}
              </>
            ) : (
              <p className="text-sm font-medium">Ready to record</p>
            )}
          </div>
        </div>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {uploadedUrl && (
          <Alert className="mt-4">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Video uploaded successfully!{' '}
              <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="font-medium underline hover:text-primary">
                View uploaded video
              </a>
            </AlertDescription>
          </Alert>
        )}
        <div className="mt-4">
          <Input
            type="text"
            placeholder="Enter duration (e.g., 2 seconds, 1 minute)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            disabled={isRecording}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isRecording && !isUploading && (
          <Button onClick={startRecording} disabled={!duration}>Start Recording</Button>
        )}
        {isRecording && (
          <Button onClick={stopRecording} variant="destructive">Stop Recording</Button>
        )}
        {isUploading && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </Button>
        )}
      </CardFooter>
    </Card>
  )
    }


// api


        import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
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
      cloudinary.uploader.upload_stream(
        { resource_type: 'video' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            resolve(NextResponse.json({ error: 'Upload failed' }, { status: 500 }))
          } else {
            resolve(NextResponse.json({ url: result?.secure_url }))
          }
        }
      ).end(buffer)
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
    }




            
