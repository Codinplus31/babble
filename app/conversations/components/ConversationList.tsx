'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { find } from 'lodash'
import { AiFillFolderAdd } from 'react-icons/ai'
import { X } from 'lucide-react'
import clsx from 'clsx'

import useConversation from '@/app/hooks/useConversation'
import { pusherClient } from '@/app/libs/pusher'
import { FullConversationType } from '@/app/types'
import { User } from '@prisma/client'

import ConversationBox from './ConversationBox'
import GroupChatModal from '../../components/Modals/GroupChatModal'

interface ConversationListProps {
  initialItems: FullConversationType[]
  users: User[]
}

const TERMS_ACCEPTED_KEY = 'termsAccepted'
const ConversationList: React.FC<ConversationListProps> = ({
    initialItems,
    users,
}) => {
    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
const [isTermsPopupOpen, setIsTermsPopupOpen] = useState(false)
    const router = useRouter();
    const session = useSession();

    const { conversationId, isOpen } = useConversation();

    const pusherKey = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email]);
useEffect(() => {
    const termsAccepted = localStorage.getItem(TERMS_ACCEPTED_KEY)
    if (!termsAccepted) {
      setIsTermsPopupOpen(true)
    }
  }, [])
    useEffect(() => {
        if (!pusherKey) {
            return;
        }

        pusherClient.subscribe(pusherKey);

        // append new conversation
        const newHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                if (find(current, { id: conversation.id })) {
                    return current;
                }
                return [conversation, ...current];
            });
        };

        // for updating unread items
        const updateHandler = (conversation: FullConversationType) => {
            setItems((current) =>
                current.map((currentConversation) => {
                    if (currentConversation.id === conversation.id) {
                        return {
                            ...currentConversation,
                            messages: conversation.messages,
                        };
                    }
                    return currentConversation;
                })
            );
        };

        const removeHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                return [
                    ...current.filter((convo) => convo.id !== conversation.id),
                ];
            });
        };
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
};

export default ConversationList;
