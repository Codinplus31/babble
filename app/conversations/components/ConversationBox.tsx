"use client"

import type React from "react"

import { useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import clsx from "clsx"

import type { FullConversationType } from "@/app/types"
import useOtherUser from "@/app/hooks/useOtherUser"
import Avatar from "@/app/components/Avatar"
import MultipleAvatar from "@/app/components/MultipleAvatar"

interface ConversationBoxProps {
  data: FullConversationType
  selected?: boolean
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected }) => {
  const otherUser = useOtherUser(data)
  const session = useSession()

  const router = useRouter()

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`)
    router.refresh()
  }, [router, data])

  const lastMessage = useMemo(() => {
    const messages = data.messages || []

    return messages[messages.length - 1]
  }, [data.messages])

  const userEmail = useMemo(() => session.data?.user?.email, [session.data?.user?.email])

  const hasSeen = useMemo(() => {
    if (!lastMessage) return false

    const seenArray = lastMessage.seen || []

    if (!userEmail) return false

    return seenArray.filter((user) => user.email === userEmail).length !== 0
  }, [lastMessage, userEmail])

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) return "Sent an image"

    if (lastMessage?.body) {
      return lastMessage?.body
    }

    return "Start a conversation"
  }, [lastMessage])

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `w-full relative flex items-center space-x-3 hover:bg-[#202c33] rounded-lg transition cursor-pointer p-3`,
        selected ? "bg-[#202c33]" : "bg-[#0c1317]",
      )}
    >
      {data.isGroup ? <MultipleAvatar users={data.users} /> : <Avatar user={otherUser} />}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1 text-[#d1d3d7] font-medium text-lg">
            <p>{data?.name || otherUser?.name}</p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-[#8696a0] font-light">{format(new Date(lastMessage.createdAt), "p")}</p>
            )}
          </div>
          <p className={clsx(`truncate text-base`, hasSeen ? "text-[#8696a0] font-light" : "text-[#d1d3d7] font-bold")}>
            {lastMessageText}
          </p>
        </div>
        {/* <div className="text-[#fff] mt-3 border-b border-[#202c33]" /> */}
      </div>
    </div>
  )
}

export default ConversationBox

