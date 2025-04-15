"use client"

import useConversation from "@/app/hooks/useConversation"
import axios from "axios"
import { type FieldValues, type SubmitHandler, useForm } from "react-hook-form"
import { useEffect, useState } from "react"

import MessageInput from "./MessageInput"
import DownloadAppModal from "./DownloadAppModal"

import { TiAttachmentOutline } from "react-icons/ti"
import { IoSend } from "react-icons/io5"
import { FiLock } from "react-icons/fi"

import { CldUploadButton } from "next-cloudinary"

const SendMessage = () => {
  const { conversationId } = useConversation()
  const [uploadCount, setUploadCount] = useState(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      const storedCount = localStorage.getItem(`uploadCount`)
      return storedCount ? Number.parseInt(storedCount, 10) : 0
    }
    return 0
  })
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Load upload count from localStorage on component mount
  useEffect(() => {
    const storedCount = localStorage.getItem(`uploadCount`)
    if (storedCount) {
      setUploadCount(Number.parseInt(storedCount, 10))
    if(storedCount >= 2){
setIsUploading(false)
    }
    }
  }, [conversationId])

  // Update localStorage when upload count changes
  // useEffect(() => {
  //   localStorage.setItem(`uploadCount`, uploadCount.toString())
  // }, [uploadCount, conversationId])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true })
    axios.post("/api/messages", {
      ...data,
      conversationId,
    })
  }

  const handleUpload = (result: any) => {
    setIsUploading(true)
     const newCount = uploadCount + 1
     //    setUploadCount(newCount)

    localStorage.setItem(`uploadCount`, newCount.toString())
if(uploadCount < 2){
    // Post the image to the API
    axios
      .post("/api/messages", {
        image: result.info.secure_url,
        conversationId,
      })
      .then(() => {
        // Increment upload count only after successful upload
       

        // Show download modal after 2 uploads
        if (newCount >= 2) {
          setShowDownloadModal(true)
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error)
      })
      .finally(() => {
        
      })
}else{
setShowDownloadModal(true)
}
  }

  // Check if uploads are disabled (2 or more successful uploads)
  const isUploadDisabled = uploadCount >= 2
  console.log(uploadCount)
  return (
    <>
      <DownloadAppModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} />

      <div className="lg:py-[19.3px] px-4 py-4 bg-[#202c33] flex items-center gap-2 lg:gap-4 w-full lg:mb-[-80px]">
        {uploadCount >= 2 ? (
          <div
            className="relative cursor-not-allowed"
            title="Upload limit reached. Download our app for unlimited uploads."
            
          >
            <TiAttachmentOutline size={30} className="text-[#8696a0] opacity-50" />
            <FiLock size={14} className="absolute -top-1 -right-1 text-[#d1d3d7] bg-[#662121] rounded-full p-1" />
          </div>
        ) : (
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUpload={handleUpload}
            uploadPreset="upload"
           
          >
            <TiAttachmentOutline
              size={30}
              className={`${isUploading ? "text-[#8696a0] opacity-50" : "text-[#8696a0] hover:text-[#d1d3d7]"} cursor-pointer`}
            />
          </CldUploadButton>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 lg:gap-4 w-full">
          <MessageInput id="message" register={register} errors={errors} required placeholder="Type a message" />
          <button type="submit" className="rounded-full p-2 cursor-pointer transition">
            <IoSend size={25} />
          </button>
        </form>
      </div>
    </>
  )
}

export default SendMessage

