'use client'

import useConversation from "@/app/hooks/useConversation"
import { FullMessageType } from "@/app/types"
import { useEffect, useRef, useState } from "react"
import MessageBox from "./MessageBox"
import axios from "axios"
import { pusherClient } from "@/app/libs/pusher"
import { find } from "lodash"
import getCurrentUser from "@/app/actions/getCurrentUser"

interface BodyProps {
  initialMessages: FullMessageType[]
}

export default function Body({ initialMessages = [] }: BodyProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [currentUser, setCurrentUser] = useState(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { conversationId } = useConversation()

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.post(`/api/conversations/${conversationId}/seen`)
        const user = await getCurrentUser()
        setCurrentUser(user)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [conversationId])

  useEffect(() => {
    pusherClient.subscribe(conversationId)
    bottomRef?.current?.scrollIntoView()

    const messageHandler = async (message: FullMessageType) => {
      try {
        await axios.post(`/api/conversations/${conversationId}/seen`)
        setMessages((current) => {
          if (find(current, { id: message.id })) {
            return current
          }
          return [...current, message]
        })
        bottomRef?.current?.scrollIntoView()
      } catch (error) {
        console.error("Error handling new message:", error)
      }
    }

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage
          }
          return currentMessage
        })
      )
    }

    pusherClient.bind("messages:new", messageHandler)
    pusherClient.bind("message:update", updateMessageHandler)

    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind("messages:new", messageHandler)
      pusherClient.unbind("message:update", updateMessageHandler)
    }
  }, [conversationId])

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, index) => (
        <MessageBox
          isLast={index === messages.length - 1}
          key={message.id}
          data={message}
          currentUser={currentUser}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  )
}
